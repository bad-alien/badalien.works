import { Resend } from 'resend';
import type { AuditSession, AuditBrief } from '@/lib/auditSession';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const LEAD_EMAIL_TO = 'r@badalien.works';
const LEAD_EMAIL_FROM = 'Audit Bot <r@badalien.works>';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function renderBriefHtml(brief: AuditBrief): string {
  const ops = brief.opportunities
    .map(
      (op, i) => `
    <li>
      <strong>${i + 1}. ${escapeHtml(op.title)}</strong><br>
      ${escapeHtml(op.solves)}<br>
      <small>effort: ${op.effort} &middot; ROI: ${op.roi}</small>
    </li>`
    )
    .join('');

  const sovereignty = brief.sovereignty_callout
    ? `<h3>On Data Sovereignty</h3><p>${escapeHtml(brief.sovereignty_callout)}</p>`
    : '';

  return `
<div style="font-family: monospace; background: #1e1e1e; color: #eee; padding: 16px; border-radius: 8px;">
  <h2>AI Audit Brief &mdash; Score: ${brief.score}/10</h2>
  <p><em>${escapeHtml(brief.score_label)}</em></p>
  <h3>Observed</h3>
  <ul>${brief.observations.map((o) => `<li>${escapeHtml(o)}</li>`).join('')}</ul>
  <h3>Opportunities</h3>
  <ol>${ops}</ol>
  ${sovereignty}
</div>`;
}

function renderBriefText(brief: AuditBrief): string {
  const ops = brief.opportunities
    .map(
      (op, i) =>
        `${i + 1}. ${op.title}\n   ${op.solves}\n   effort: ${op.effort} | ROI: ${op.roi}`
    )
    .join('\n\n');

  const sovereignty = brief.sovereignty_callout
    ? `\n\nOn Data Sovereignty:\n${brief.sovereignty_callout}`
    : '';

  return `Score: ${brief.score}/10 — ${brief.score_label}

Observed:
${brief.observations.map((o) => `- ${o}`).join('\n')}

Opportunities:
${ops}${sovereignty}`;
}

export type LeadDetails = {
  email: string;
  best_time: string;
  phone?: string;
};

export async function sendAuditEmail(session: AuditSession): Promise<void> {
  if (!session.brief) return;

  const hostname = session.url ? new URL(session.url).hostname : 'unknown';
  const score = session.brief.score;
  const ts = new Date().toISOString();

  const html = `
<h2>New Audit: ${escapeHtml(hostname)}</h2>
<p><strong>URL:</strong> ${escapeHtml(session.url ?? 'n/a')}</p>
<p><strong>Bottleneck:</strong> ${escapeHtml(session.bottleneck ?? 'n/a')}</p>
<p><strong>Sensitive docs:</strong> ${escapeHtml(session.sensitive_docs ?? 'n/a')}</p>
<p><strong>Timestamp:</strong> ${ts}</p>
<hr>
${renderBriefHtml(session.brief)}`;

  const text = `New Audit: ${hostname}
URL: ${session.url ?? 'n/a'}
Bottleneck: ${session.bottleneck ?? 'n/a'}
Sensitive docs: ${session.sensitive_docs ?? 'n/a'}
Timestamp: ${ts}

${renderBriefText(session.brief)}`;

  try {
    const { error } = await getResend().emails.send({
      from: LEAD_EMAIL_FROM,
      to: LEAD_EMAIL_TO,
      subject: `[Audit] ${hostname} — score ${score}/10`,
      html,
      text,
    });
    if (error) {
      console.error('[leadEmail] sendAuditEmail Resend error:', error);
    }
  } catch (err) {
    console.error('[leadEmail] sendAuditEmail failed:', err);
  }
}

export async function sendLeadEmail(
  session: AuditSession,
  lead: LeadDetails
): Promise<void> {
  const hostname = session.url ? new URL(session.url).hostname : null;
  const sessionId = session.session_id || 'n/a';
  const ts = new Date().toISOString();
  const source = session.brief ? `AI audit of ${hostname ?? 'unknown site'}` : 'Chat (no audit run)';
  const transcript = session.brief ? `audit_logs/${ts.slice(0, 10)}/${sessionId}.jsonl` : 'n/a';

  const briefSection = session.brief
    ? `<hr>${renderBriefHtml(session.brief)}`
    : '<p><em>No audit brief — this lead came from the chat without running an audit.</em></p>';

  const briefTextSection = session.brief
    ? `\n\n${renderBriefText(session.brief)}`
    : '\n\n(No audit brief — lead came from chat without running an audit)';

  const html = `
<h2>New Lead: ${escapeHtml(lead.email)}</h2>
<p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
<p><strong>Best time:</strong> ${escapeHtml(lead.best_time)}</p>
${lead.phone ? `<p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>` : ''}
<p><strong>Source:</strong> ${escapeHtml(source)}</p>
${session.bottleneck ? `<p><strong>Bottleneck:</strong> ${escapeHtml(session.bottleneck)}</p>` : ''}
<p><strong>Session ID:</strong> ${escapeHtml(sessionId)}</p>
<p><strong>Transcript path:</strong> ${escapeHtml(transcript)}</p>
<p><strong>Timestamp:</strong> ${ts}</p>
${briefSection}`;

  const text = `New Lead: ${lead.email}
Best time: ${lead.best_time}
${lead.phone ? `Phone: ${lead.phone}\n` : ''}Source: ${source}
${session.bottleneck ? `Bottleneck: ${session.bottleneck}\n` : ''}Session: ${sessionId}
Transcript: ${transcript}
Timestamp: ${ts}${briefTextSection}`;

  try {
    const { error } = await getResend().emails.send({
      from: LEAD_EMAIL_FROM,
      to: LEAD_EMAIL_TO,
      subject: `[Lead] ${lead.email} — ${lead.best_time}`,
      html,
      text,
    });
    if (error) {
      console.error('[leadEmail] sendLeadEmail Resend error:', error);
    }
  } catch (err) {
    console.error('[leadEmail] sendLeadEmail failed:', err);
  }
}
