const PRO_KEY = 'batchimage_pro_active';
const PRO_ANNUAL_KEY = 'batchimage_pro_annual';
export const AD_BOOST_KEY = 'batchimage_ad_boost_count';
const AD_BOOST_USED_KEY = 'batchimage_ad_boost_used_today';
const PRESETS_KEY = 'batchimage_presets';

export type PlanType = 'free' | 'pro-monthly' | 'pro-annual';

export function isProActive(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(PRO_KEY) === 'true';
}

export function isProAnnual(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(PRO_ANNUAL_KEY) === 'true';
}

export function getPlanType(): PlanType {
  if (isProAnnual()) return 'pro-annual';
  if (isProActive()) return 'pro-monthly';
  return 'free';
}

export function activatePro(monthly: boolean = true): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PRO_KEY, 'true');
  window.localStorage.setItem(PRO_ANNUAL_KEY, monthly ? 'false' : 'true');
}

export function deactivatePro(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PRO_KEY);
  window.localStorage.removeItem(PRO_ANNUAL_KEY);
}

export const FREE_LIMIT = 5;
export const PRO_LIMIT = 500;
export const AD_BOOST_BONUS = 20;
export const MAX_AD_BOOST_PER_DAY = 5;

export function getAdBoostCount(): number {
  if (typeof window === 'undefined') return 0;
  const today = new Date().toISOString().slice(0, 10);
  const storedDate = window.localStorage.getItem(AD_BOOST_USED_KEY + '_date');
  if (storedDate !== today) {
    window.localStorage.setItem(AD_BOOST_USED_KEY, '0');
    window.localStorage.setItem(AD_BOOST_USED_KEY + '_date', today);
    return 0;
  }
  return Number(window.localStorage.getItem(AD_BOOST_KEY) || '0');
}

export function getAdBoostUsedToday(): number {
  if (typeof window === 'undefined') return 0;
  const today = new Date().toISOString().slice(0, 10);
  const storedDate = window.localStorage.getItem(AD_BOOST_USED_KEY + '_date');
  if (storedDate !== today) {
    window.localStorage.setItem(AD_BOOST_USED_KEY, '0');
    window.localStorage.setItem(AD_BOOST_USED_KEY + '_date', today);
    return 0;
  }
  return Number(window.localStorage.getItem(AD_BOOST_USED_KEY) || '0');
}

export function canWatchAd(): boolean {
  return getAdBoostUsedToday() < MAX_AD_BOOST_PER_DAY;
}

export function watchAdForBoost(): boolean {
  if (!canWatchAd()) return false;
  if (typeof window === 'undefined') return false;

  const used = getAdBoostUsedToday() + 1;
  const count = getAdBoostCount() + AD_BOOST_BONUS;
  window.localStorage.setItem(AD_BOOST_USED_KEY, String(used));
  window.localStorage.setItem(AD_BOOST_KEY, String(count));
  return true;
}

export function consumeAdBoost(imagesCount: number): boolean {
  const count = getAdBoostCount();
  if (count >= imagesCount) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AD_BOOST_KEY, String(count - imagesCount));
    }
    return true;
  }
  return false;
}

export function getBatchLimit(): number {
  if (isProActive() || isProAnnual()) return PRO_LIMIT;
  return FREE_LIMIT + getAdBoostCount();
}

export function canDownloadZip(): boolean {
  return isProActive() || isProAnnual();
}

export interface Preset {
  id: string;
  name: string;
  options: {
    quality: number;
    format: string;
    maxWidth?: number;
    maxHeight?: number;
  };
}

export function getPresets(): Preset[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(PRESETS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function savePreset(preset: Preset): void {
  if (typeof window === 'undefined') return;
  const presets = getPresets();
  const existing = presets.findIndex((p) => p.id === preset.id);
  if (existing >= 0) {
    presets[existing] = preset;
  } else {
    presets.push(preset);
  }
  window.localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

export function deletePreset(id: string): void {
  if (typeof window === 'undefined') return;
  const presets = getPresets().filter((p) => p.id !== id);
  window.localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

// License key validation (basic checksum, will be replaced by server-side validation)
export function validateLicenseKey(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  const match = /^BATCH-([A-Z0-9]{4})-([A-Z0-9]{4})$/.exec(normalized);
  if (!match) return false;
  return checksum(match[1]) === checksum(match[2]);
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
  const target = checksum(part1);
  let part2 = randomSegment();
  let attempts = 0;
  while (checksum(part2) !== target && attempts < 10000) {
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
