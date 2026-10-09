import { Resend } from 'resend';
import { NextResponse } from 'next/server';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// Each accepted request sends an email, so keep the per-IP budget tight.
// In-memory and per-instance: a speed bump, not a hard guarantee.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_BODY_BYTES = 32 * 1024;
const MAX_FIELD_CHARS = { name: 200, email: 254, company: 200, phone: 40, message: 5000 } as const;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

// Escape HTML entities to prevent XSS
function escapeHtml(text: string): string {
  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Try again in a few minutes.' },
      { status: 429 }
    );
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request body is too large' }, { status: 413 });
  }

  try {
    const body = await request.json();
    const { name, email, company, phone, serviceInterest, message, smsConsent, website } = body;

    // Honeypot: the form's hidden "website" field is never filled by people.
    // Answer as if it succeeded so bots don't learn they were caught.
    if (typeof website === 'string' && website.trim() !== '') {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const tooLong =
      String(name).length > MAX_FIELD_CHARS.name ||
      String(email).length > MAX_FIELD_CHARS.email ||
      (company && String(company).length > MAX_FIELD_CHARS.company) ||
      (phone && String(phone).length > MAX_FIELD_CHARS.phone) ||
      String(message).length > MAX_FIELD_CHARS.message;
    if (tooLong) {
      return NextResponse.json({ error: 'A field is too long' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // SMS consent requires a phone number
    if (smsConsent === true && (!phone || !String(phone).trim())) {
      return NextResponse.json(
        { error: 'Phone number is required when opting in to SMS' },
        { status: 400 }
      );
    }

    // Escape user input to prevent XSS
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = company ? escapeHtml(company) : '';
    const safePhone = phone ? escapeHtml(String(phone)) : '';
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
    const consentTimestamp = new Date().toISOString();

    // Build email content
    let emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
    `;

    if (safeCompany) {
      emailContent += `<p><strong>Company:</strong> ${safeCompany}</p>`;
    }

    if (safePhone) {
      emailContent += `<p><strong>Phone:</strong> ${safePhone}</p>`;
    }

    if (serviceInterest) {
      const serviceLabels: { [key: string]: string } = {
        'ai-enablement': 'AI Enablement',
        'ai-strategy': 'AI Strategy',
        'ai-deployment': 'AI Deployment',
        'other': 'Other / Not Sure'
      };
      const serviceLabel = serviceLabels[serviceInterest] || serviceInterest;
      emailContent += `<p><strong>Service Interest:</strong> ${escapeHtml(serviceLabel)}</p>`;
    }

    emailContent += `
      <p><strong>SMS opt-in:</strong> ${smsConsent === true ? `YES — recorded at ${consentTimestamp}` : 'No'}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `;

    // Send email via Resend
    const { data, error } = await getResend().emails.send({
      from: 'Contact Form <r@badalien.works>',
      to: 'bad.alien.biz@gmail.com',
      replyTo: email,
      subject: `New Contact: ${safeName}${safeCompany ? ` (${safeCompany})` : ''}`,
      html: emailContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
