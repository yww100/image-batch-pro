import { useState } from 'react';
import { activatePro, isProActive } from '@/lib/pro';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProModal({ isOpen, onClose }: ProModalProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleActivate = () => {
    // Demo mode: any non-empty code activates Pro.
    // In production, replace with LemonSqueezy/Stripe license key validation.
    if (code.trim().length > 3) {
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

  const alreadyPro = isProActive();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5">
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
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Enter your license key below to activate Pro.
            </p>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setStatus('idle');
              }}
              placeholder="XXXX-XXXX-XXXX"
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
