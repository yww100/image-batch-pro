import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { AFDIAN_WEBHOOK_TOKEN } from '@/lib/afdian';
import { createLicense } from '@/lib/licenseStore';

const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'BatchImage <noreply@batchimage.app>';

interface AfdianWebhookBody {
  data?: {
    type?: string;
    order?: {
      out_trade_no?: string;
      user_id?: string;
      user_private_id?: string;
      plan_id?: string;
      month?: number;
      total_amount?: string;
      show_amount?: string;
      status?: number;
      remark?: string;
      sku_detail?: Array<{
        sku_id?: string;
        name?: string;
        count?: number;
      }>;
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization') || '';
    if (AFDIAN_WEBHOOK_TOKEN && token !== AFDIAN_WEBHOOK_TOKEN) {
      return NextResponse.json({ ec: 400, em: 'Invalid token' }, { status: 401 });
    }

    const body: AfdianWebhookBody = await req.json();
    const order = body.data?.order;

    if (!order || order.status !== 2) {
      return NextResponse.json({ ec: 200, em: 'Ignored' });
    }

    const outTradeNo = order.out_trade_no || 'unknown';
    const planId = order.plan_id || '';
    const skuNames = (order.sku_detail || [])
      .map((s) => (s.name || '').toLowerCase())
      .join(' ');
    const plan: 'monthly' | 'annual' =
      planId.includes('annual') || skuNames.includes('annual') || skuNames.includes('年')
        ? 'annual'
        : 'monthly';

    // Try to find email from remark
    const remark = order.remark || '';
    const emailMatch = remark.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0] : '';

    const license = createLicense(email || order.user_private_id || 'unknown', plan, outTradeNo);

    if (email && resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: '你的 BatchImage Pro 激活码',
        html: `
          <p>你好，</p>
          <p>感谢升级 BatchImage Pro ${plan === 'annual' ? '年付' : '月付'}！</p>
          <p>你的激活码是：</p>
          <pre style="background:#f1f5f9;padding:12px;border-radius:8px;font-size:16px;">${license.key}</pre>
          <p>请在 BatchImage 网站粘贴此码激活 Pro 功能。</p>
          <p>订单号：${outTradeNo}</p>
          <hr/>
          <p>如未购买，请忽略此邮件。</p>
        `,
      });
    }

    return NextResponse.json({ ec: 200, em: 'ok', licenseKey: license.key });
  } catch (err) {
    console.error('Afdian webhook error:', err);
    return NextResponse.json({ ec: 500, em: 'Webhook processing failed' }, { status: 500 });
  }
}
