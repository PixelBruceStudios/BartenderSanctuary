type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function sanitizeString(value: unknown, max = 4000): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>]/g, '').slice(0, max);
}

export function requireFields(obj: Record<string, unknown>, fields: string[]): { ok: true } | { ok: false; missing: string[] } {
  const missing = fields.filter((f) => obj[f] === undefined || obj[f] === null || obj[f] === '');
  if (missing.length) return { ok: false, missing };
  return { ok: true };
}

export function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true' || value === '1' || value === 'yes';
  return fallback;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function jsonStringifySafe(value: JsonValue): string {
  return JSON.stringify(value ?? (Array.isArray(value) ? [] : {}));
}
