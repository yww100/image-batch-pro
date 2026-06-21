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
