// 爱发电 (afdian.net) integration config.
// Docs: https://guide.afdian.com/creator/developer

export const AFDIAN_WEBHOOK_TOKEN = process.env.AFDIAN_WEBHOOK_TOKEN || '';

export const AFDIAN_USER_ID = process.env.NEXT_PUBLIC_AFDIAN_USER_ID || '';

export interface AfdianPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'annual';
}

export const AFDIAN_PLANS: AfdianPlan[] = [
  {
    id: process.env.NEXT_PUBLIC_AFDIAN_MONTHLY_PLAN_ID || '',
    name: 'BatchImage Pro Monthly',
    price: 35,
    period: 'monthly',
  },
  {
    id: process.env.NEXT_PUBLIC_AFDIAN_ANNUAL_PLAN_ID || '',
    name: 'BatchImage Pro Annual',
    price: 199,
    period: 'annual',
  },
];

export function getAfdianCheckoutUrl(plan: 'monthly' | 'annual'): string {
  const planId = AFDIAN_PLANS.find((p) => p.period === plan)?.id;
  if (!planId || !AFDIAN_USER_ID) return '';
  return `https://afdian.com/a/${AFDIAN_USER_ID}?tab=shop`;
}

export function hasAfdianConfig(): boolean {
  return Boolean(AFDIAN_USER_ID && AFDIAN_PLANS[0].id && AFDIAN_PLANS[1].id);
}
