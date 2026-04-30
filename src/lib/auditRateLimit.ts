// Per-IP audit rate limit: 3 audits per 24h (separate from chat rate limit)
const auditRateMap = new Map<string, { count: number; resetTime: number }>();
const AUDIT_RATE_LIMIT = 3;
const AUDIT_RATE_WINDOW_MS = 24 * 60 * 60 * 1000;

export function checkAuditRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = auditRateMap.get(ip);
  if (!record || now > record.resetTime) {
    auditRateMap.set(ip, { count: 1, resetTime: now + AUDIT_RATE_WINDOW_MS });
    return true;
  }
  if (record.count >= AUDIT_RATE_LIMIT) return false;
  record.count++;
  return true;
}

// Daily budget kill switch — resets at UTC midnight
let dailySpendUSD = 0;
let budgetResetAt = nextMidnightUTC();

function nextMidnightUTC(): number {
  const now = new Date();
  const midnight = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
  return midnight.getTime();
}

function maybResetBudget(): void {
  if (Date.now() > budgetResetAt) {
    dailySpendUSD = 0;
    budgetResetAt = nextMidnightUTC();
  }
}

function getBudgetLimit(): number {
  return parseFloat(process.env.AUDIT_DAILY_BUDGET_USD || '10');
}

export function isBudgetExceeded(): boolean {
  maybResetBudget();
  return dailySpendUSD >= getBudgetLimit();
}

export function recordAuditCost(costUSD: number): boolean {
  maybResetBudget();
  if (dailySpendUSD >= getBudgetLimit()) return false;
  dailySpendUSD += costUSD;
  return true;
}

// Exposed for testing — allows resetting state between tests
export function _resetForTesting(): void {
  auditRateMap.clear();
  dailySpendUSD = 0;
  budgetResetAt = nextMidnightUTC();
}
