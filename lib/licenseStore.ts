import { generateLicenseKey, validateLicenseKey } from '@/lib/pro';

// Simple file-based license store using Vercel's ephemeral filesystem.
// For production with multiple instances, replace this with Vercel Postgres, Upstash Redis, or a database.

export interface LicenseRecord {
  key: string;
  email: string;
  plan: 'monthly' | 'annual';
  orderId: string;
  createdAt: string;
}

const licenses: LicenseRecord[] = [];

export function createLicense(email: string, plan: 'monthly' | 'annual', orderId: string): LicenseRecord {
  const key = generateLicenseKey();
  const record: LicenseRecord = {
    key,
    email,
    plan,
    orderId,
    createdAt: new Date().toISOString(),
  };
  licenses.push(record);
  return record;
}

export function findLicense(key: string): LicenseRecord | undefined {
  return licenses.find((l) => l.key === key);
}

export { validateLicenseKey };
