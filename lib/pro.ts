const PRO_KEY = 'batchimage_pro_active';

export function isProActive(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(PRO_KEY) === 'true';
}

export function activatePro(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PRO_KEY, 'true');
}

export function deactivatePro(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PRO_KEY);
}

export const FREE_LIMIT = 5;
export const PRO_LIMIT = 500;

export function getBatchLimit(): number {
  return isProActive() ? PRO_LIMIT : FREE_LIMIT;
}

// Simple license format: BATCH-XXXX-XXXX where each X is 0-9/A-Z.
// The second and third segments must share the same checksum to be valid.
// This is NOT cryptographically secure, but it is stronger than "length > 3"
// and can be replaced with server-side validation later.
export function validateLicenseKey(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  const match = /^BATCH-([A-Z0-9]{4})-([A-Z0-9]{4})$/.exec(normalized);
  if (!match) return false;

  const part1 = match[1];
  const part2 = match[2];
  return checksum(part1) === checksum(part2);
}

function checksum(str: string): number {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i) * (i + 1);
  }
  return sum % 37;
}

export function generateLicenseKey(): string {
  const part1 = randomSegment();
  const targetChecksum = checksum(part1);
  let part2 = randomSegment();
  let attempts = 0;
  while (checksum(part2) !== targetChecksum && attempts < 10000) {
    part2 = randomSegment();
    attempts++;
  }
  return `BATCH-${part1}-${part2}`;
}

function randomSegment(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
