import { useState } from 'react';
import { Mail, Copy, CheckCircle2 } from 'lucide-react';
import { activatePro, isProActive, validateLicenseKey } from '@/lib/pro';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAYPAL_EMAIL = '945893243@qq.com';
const SUPPORT_EMAIL = '945893243@qq.com';

export default function ProModal({ isOpen, onClose }: ProModalProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleActivate = () => {
    if (validateLicenseKey(code)) {
      activatePro();
      setStatus('success');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1200);
    } else {
      setStatus('error');
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(PAYPAL_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const alreadyPro = isProActive();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Upgrade to Pro</h2>
          <p className="text-slate-600 mt-2">Process up to 500 images per batch, watermark, and priority support.</p>
        </div>

        <div className="bg-brand-50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-700">Free plan</span>
            <span className="font-medium text-slate-900">5 images/batch</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-700">Pro plan</span>
            <span className="font-medium text-brand-700">500 images/batch</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-brand-100">
            <span className="text-slate-700">Price</span>
            <span className="font-bold text-slate-900">$5 / month</span>
          </div>
        </div>

        {alreadyPro ? (
          <div className="text-center text-green-600 font-medium py-2">
            ✅ Pro is already active on this device.
          </div>
        ) : (
          <div className="space-y-4">
            { /* Payment steps */ }
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm">How to upgrade:</h3>
              <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
                <li>
                  Send <strong className="text-slate-900">$5 USD</strong> via PayPal to:
                </li>
              </ol>
              <button
                onClick={copyEmail}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>{PAYPAL_EMAIL}</span>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500">
                Note: PayPal may show "Sorry for the wait" for mainland China accounts. Try the PayPal app if the web page gets stuck.
              </p>
              <ol start={2} className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
                <li>Include note: <strong className="text-slate-900">"BatchImage Pro"</strong></li>
                <li>
                  Email your PayPal receipt to{' '}
                  <a
                    href={`mailto:${SUPPORT_EMAIL}?subject=BatchImage%20Pro%20Payment%20Proof&body=I%20have%20sent%20%245%20USD%20for%20BatchImage%20Pro.%20Here%20is%20my%20receipt:`}
                    className="text-brand-600 hover:underline font-medium"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </li>
                <li>We'll reply with your Pro activation code within 24 hours.</li>
              </ol>
            </div>

            { /* Activation */ }
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <p className="text-sm text-slate-600">Already have a code? Activate below:</p>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setStatus('idle');
                }}
                placeholder="BATCH-XXXX-XXXX"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center tracking-widest focus:border-brand-500 focus:outline-none"
              />
              {status === 'error' && (
                <p className="text-sm text-red-600 text-center">Invalid license key.</p>
              )}
              {status === 'success' && (
                <p className="text-sm text-green-600 text-center">Pro activated! Reloading...</p>
              )}
              <button
                onClick={handleActivate}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors"
              >
                Activate Pro
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
