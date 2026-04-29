// STUB - implemented by B1, overwritten at merge.

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

export type AuditSession = {
  session_id: string;
  url?: string;
  bottleneck?: string;
  sensitive_docs?: 'yes' | 'sometimes' | 'no';
  brief?: AuditBrief;
  branch: 'audit' | 'faq';
  created_at: number;
};

const sessions = new Map<string, AuditSession>();

export function getSession(session_id: string): AuditSession | undefined {
  return sessions.get(session_id);
}

export function setSession(session: AuditSession): void {
  sessions.set(session.session_id, session);
}
