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

export function getSession(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _id: string
): AuditSession | null {
  return null;
}
