import { randomUUID } from 'crypto';

export type AuditSession = {
  session_id: string;
  url?: string;
  bottleneck?: string;
  sensitive_docs?: 'yes' | 'sometimes' | 'no';
  brief?: AuditBrief;
  branch: 'audit' | 'faq';
  created_at: number;
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

const TTL_MS = 30 * 60 * 1000;
const sessions = new Map<string, AuditSession>();

function pruneExpired() {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.created_at > TTL_MS) {
      sessions.delete(id);
    }
  }
}

export function createSession(branch: 'audit' | 'faq'): string {
  pruneExpired();
  const session_id = randomUUID();
  sessions.set(session_id, {
    session_id,
    branch,
    created_at: Date.now(),
  });
  return session_id;
}

export function getSession(session_id: string): AuditSession | null {
  const session = sessions.get(session_id);
  if (!session) return null;
  if (Date.now() - session.created_at > TTL_MS) {
    sessions.delete(session_id);
    return null;
  }
  return session;
}

export function setInputs(
  session_id: string,
  inputs: { url: string; bottleneck: string; sensitive_docs: 'yes' | 'sometimes' | 'no' }
): void {
  const session = sessions.get(session_id);
  if (!session) return;
  session.url = inputs.url;
  session.bottleneck = inputs.bottleneck;
  session.sensitive_docs = inputs.sensitive_docs;
}

export function setBrief(session_id: string, brief: AuditBrief): void {
  const session = sessions.get(session_id);
  if (!session) return;
  session.brief = brief;
}

// For testing only — directly inject a complete session into the store
export function setSession(session: AuditSession): void {
  sessions.set(session.session_id, session);
}
