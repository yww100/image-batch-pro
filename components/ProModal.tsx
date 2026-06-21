import { useState } from 'react';
import { Copy, CheckCircle2, ExternalLink } from 'lucide-react';
import { activatePro, isProActive, isProAnnual, validateLicenseKey } from '@/lib/pro';
import { getAfdianCheckoutUrl, hasAfdianConfig } from '@/lib/afdian';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: 'monthly' | 'annual';
}

export default function ProModal({ isOpen, onClose, plan = 'annual' }: ProModalProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>(plan);

  if (!isOpen) return null;

  const handleActivate = () => {
    if (validateLicenseKey(code)) {
      activatePro(selectedPlan === 'monthly');
      setStatus('success');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1200);
    } else {
      setStatus('error');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const alreadyPro = isProActive() || isProAnnual();
  const price = selectedPlan === 'annual' ? 199 : 35;
  const period = selectedPlan === 'annual' ? '年' : '月';
  const checkoutUrl = getAfdianCheckoutUrl(selectedPlan);
  const afdianReady = hasAfdianConfig() && checkoutUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">升级 BatchImage Pro</h2>
          <p className="text-slate-600 mt-2">每批处理 500 张图、去广告、ZIP 导出、批量重命名、尺寸模板。</p>
        </div>

        { /* Plan selector */ }
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedPlan === 'monthly'
                ? 'border-brand-600 bg-brand-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-sm font-medium text-slate-700">月付</div>
            <div className="text-xl font-bold text-slate-900">¥35<span className="text-sm font-normal text-slate-500">/月</span></div>
          </button>
          <button
            onClick={() => setSelectedPlan('annual')}
            className={`relative p-3 rounded-xl border text-left transition-all ${
              selectedPlan === 'annual'
                ? 'border-brand-600 bg-brand-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="absolute -top-2 right-2 px-2 py-0.5 bg-brand-600 text-white text-[10px] font-semibold rounded-full">省 53%</div>
            <div className="text-sm font-medium text-slate-700">年付</div>
            <div className="text-xl font-bold text-slate-900">¥199<span className="text-sm font-normal text-slate-500">/年</span></div>
          </button>
        </div>

        <div className="bg-brand-50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-700">免费版</span>
            <span className="font-medium text-slate-900">5 张/批</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-700">Pro 版</span>
            <span className="font-medium text-brand-700">500 张/批</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-brand-100">
            <span className="text-slate-700">实付</span>
            <span className="font-bold text-slate-900">¥{price}/{period}</span>
          </div>
        </div>

        {alreadyPro ? (
          <div className="text-center text-green-600 font-medium py-2">
            ✅ Pro 已在此设备激活。
          </div>
        ) : (
          <div className="space-y-4">
            {afdianReady ? (
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                去爱发电支付 ¥{price}（支付宝/微信）
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                自动收款配置中，请稍后刷新或联系客服。
              </div>
            )}

            <p className="text-xs text-slate-500">
              支付时请在备注留下你的邮箱，系统会自动发送激活码。
            </p>

            { /* Activation */ }
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <p className="text-sm text-slate-600">已支付？粘贴激活码：</p>
              <div className="relative">
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
                {code && (
                  <button
                    onClick={copyCode}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
              {status === 'error' && (
                <p className="text-sm text-red-600 text-center">激活码无效。</p>
              )}
              {status === 'success' && (
                <p className="text-sm text-green-600 text-center">Pro 已激活！正在刷新...</p>
              )}
              <button
                onClick={handleActivate}
                disabled={!code}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors"
              >
                激活 Pro
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm"
        >
          稍后再说
        </button>
      </div>
    </div>
  );
}
