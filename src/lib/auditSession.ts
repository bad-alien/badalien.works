import { randomUUID } from 'crypto';

// Audit state is not stored server-side (serverless instances don't share
// memory). The session_id is only a correlation ID for logs and lead emails;
// the brief travels back to the client as a signed token (see auditToken.ts).

export type AuditSession = {
  session_id: string;
  url?: string;
  bottleneck?: string;
  sensitive_docs?: 'yes' | 'sometimes' | 'no';
  brief?: AuditBrief;
};

export type AuditBrief = {
  score: number;
  score_label: string;
  observations: string[];
  opportunities: {
    title: string;
    solves: string;
    effort: 'S' | 'M' | 'L';
    roi: 'low' | 'med' | 'high';
  }[];
  sovereignty_callout?: string;
};

export function createSessionId(): string {
  return randomUUID();
}
