import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';
import { LEMON_SIGNING_SECRET } from '@/lib/lemon';
import { createLicense } from '@/lib/licenseStore';

const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'BatchImage <noreply@batchimage.app>';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('x-signature') || '';

    // Verify webhook signature if secret is configured
    if (LEMON_SIGNING_SECRET) {
      const hmac = crypto.createHmac('sha256', LEMON_SIGNING_SECRET);
      hmac.update(payload);
      const digest = hmac.digest('hex');
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(payload);
    const eventName = event.meta?.event_name;

    if (eventName !== 'order_created' && eventName !== 'subscription_created') {
      return NextResponse.json({ received: true });
    }

    const data = event.data;
    const attributes = data?.attributes || {};
    const email = attributes.user_email || attributes.customer_email;
    const orderId = data?.id;
    const variantName = (attributes.variant_name || '').toLowerCase();
    const plan: 'monthly' | 'annual' = variantName.includes('annual') ? 'annual' : 'monthly';

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const license = createLicense(email, plan, orderId);

    if (resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Your BatchImage Pro Activation Code',
        html: `
          <p>Hi there,</p>
          <p>Thanks for upgrading to BatchImage Pro ${plan === 'annual' ? 'Annual' : 'Monthly'}!</p>
          <p>Your activation code is:</p>
          <pre style="background:#f1f5f9;padding:12px;border-radius:8px;font-size:16px;">${license.key}</pre>
          <p>Paste this code in the BatchImage app to activate Pro features.</p>
          <p>Order ID: ${orderId}</p>
          <hr/>
          <p>If you didn't make this purchase, you can ignore this email.</p>
        `,
      });
    }

    return NextResponse.json({ success: true, licenseKey: license.key });
  } catch (err) {
    console.error('LemonSqueezy webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
