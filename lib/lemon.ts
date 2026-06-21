import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

lemonSqueezySetup({
  apiKey: process.env.LEMON_SQUEEZY_API_KEY || '',
});

export const LEMON_SIGNING_SECRET = process.env.LEMON_SQUEEZY_SIGNING_SECRET || '';

export const LEMON_STORE_ID = process.env.NEXT_PUBLIC_LEMON_STORE_ID || '';

export const LEMON_VARIANT_MONTHLY = process.env.NEXT_PUBLIC_LEMON_VARIANT_MONTHLY || '';

export const LEMON_VARIANT_ANNUAL = process.env.NEXT_PUBLIC_LEMON_VARIANT_ANNUAL || '';

export function getCheckoutUrl(plan: 'monthly' | 'annual'): string {
  const variantId = plan === 'monthly' ? LEMON_VARIANT_MONTHLY : LEMON_VARIANT_ANNUAL;
  if (!variantId || !LEMON_STORE_ID) return '';
  return `https://batchimage.lemonsqueezy.com/buy/${variantId}?checkout[custom][plan]=${plan}`;
}

export function hasLemonConfig(): boolean {
  return Boolean(LEMON_STORE_ID && LEMON_VARIANT_MONTHLY && LEMON_VARIANT_ANNUAL);
}
