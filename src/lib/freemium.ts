// Client-side freemium usage tracking.
// Keeps a running count of conversions completed today in localStorage.
// NOTE: this is a soft, per-browser courtesy limit only; hard enforcement
// should live server-side alongside a real user/plan store.

export const FREE_DAILY_LIMIT = 10;

const STORAGE_KEY = "any2pdf:usage";

type UsageRecord = {
  date: string;
  count: number;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function read(): UsageRecord {
  if (typeof window === "undefined") return { date: todayKey(), count: 0 };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as UsageRecord) : null;
    if (!parsed) return { date: todayKey(), count: 0 };
    return parsed.date === todayKey() ? parsed : { date: todayKey(), count: 0 };
  } catch {
    return { date: todayKey(), count: 0 };
  }
}

function write(record: UsageRecord): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // storage unavailable (e.g. private mode) — allow conversions
  }
}

export function getUsageCount(): number {
  return read().count;
}

export function getRemainingConversions(): number {
  return Math.max(0, FREE_DAILY_LIMIT - getUsageCount());
}

export function isUsageLimitReached(): boolean {
  return getUsageCount() >= FREE_DAILY_LIMIT;
}

/** Increments today's count and returns the new value. */
export function incrementUsage(): number {
  const record = read();
  const next = { ...record, count: record.count + 1 };
  write(next);
  return next.count;
}