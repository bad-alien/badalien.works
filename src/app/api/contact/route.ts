import { Resend } from 'resend';
import { NextResponse } from 'next/server';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
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
  try {
    const body = await request.json();
    const { name, email, company, serviceInterest, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Escape user input to prevent XSS
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = company ? escapeHtml(company) : '';
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    // Build email content
    let emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
    `;

    if (safeCompany) {
      emailContent += `<p><strong>Company:</strong> ${safeCompany}</p>`;
    }

    if (serviceInterest) {
      const serviceLabels: { [key: string]: string } = {
        'ai-adoption': 'AI Adoption & Enablement',
        'custom-software': 'Custom Software & Automation',
        'design-growth': 'Design & Growth',
        'infrastructure': 'Infrastructure',
        'other': 'Other / Not Sure'
      };
      const serviceLabel = serviceLabels[serviceInterest] || serviceInterest;
      emailContent += `<p><strong>Service Interest:</strong> ${escapeHtml(serviceLabel)}</p>`;
    }

    emailContent += `
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `;

    // Send email via Resend
    const { data, error } = await getResend().emails.send({
      from: 'Contact Form <r@badalien.works>',
      to: 'bad.alien.biz@gmail.com',
      replyTo: email,
      subject: `New Contact: ${name}${company ? ` (${company})` : ''}`,
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
