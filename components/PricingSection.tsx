import { Check, Crown } from 'lucide-react';
import { isProActive, isProAnnual } from '@/lib/pro';

interface PricingSectionProps {
  onUpgrade: () => void;
}

export default function PricingSection({ onUpgrade }: PricingSectionProps) {
  const pro = isProActive() || isProAnnual();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      { /* 免费版 */ }
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-900">免费版</h3>
        <div className="text-3xl font-bold text-slate-900 my-2 font-display">¥0</div>
        <p className="text-sm text-slate-500 mb-4">轻度使用永久免费</p>
        <ul className="space-y-3 mb-6 flex-1 text-sm text-slate-600">
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> 每批 5 张图</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> 压缩、改尺寸、转格式</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> 单张下载</li>
          <li className="flex items-start gap-2 text-slate-400"><span className="w-4 h-4 shrink-0 mt-0.5">×</span> 含广告</li>
        </ul>
        <button
          onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl transition-colors"
        >
          免费开始
        </button>
      </div>

      { /* 广告激励 */ }
      <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-900">广告激励</h3>
        <div className="text-3xl font-bold text-slate-900 my-2 font-display">免费</div>
        <p className="text-sm text-slate-500 mb-4">看广告解锁更多额度</p>
        <ul className="space-y-3 mb-6 flex-1 text-sm text-slate-600">
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> 每次 +20 张额度</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> 每天最多 5 次</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> 解锁 ZIP 下载</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> 仍含广告</li>
        </ul>
        <button
          onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
        >
          试试广告激励
        </button>
      </div>

      { /* Pro 月付 */ }
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-900">Pro 月付</h3>
        <div className="text-3xl font-bold text-slate-900 my-2 font-display">
          ¥35
          <span className="text-sm font-normal text-slate-500">/月</span>
        </div>
        <p className="text-sm text-slate-500 mb-4">适合经常处理图片的创作者</p>
        <ul className="space-y-3 mb-6 flex-1 text-sm text-slate-600">
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> 每批 500 张</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> 去广告</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> ZIP + 批量重命名 + 预设</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> Shopify、IG、小红书尺寸模板</li>
        </ul>
        <button
          onClick={onUpgrade}
          className={`w-full py-2.5 font-semibold rounded-xl transition-colors ${
            pro ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 text-white'
          }`}
          disabled={pro}
        >
          {pro ? '当前计划' : '选择月付'}
        </button>
      </div>

      { /* Pro 年付 */ }
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-dark-800 to-dark-900 text-white shadow-elevated flex flex-col">
        <div className="absolute -top-3 right-6 px-3 py-1 bg-brand-600 text-xs font-semibold rounded-full">
          最划算
        </div>
        <h3 className="text-lg font-semibold">Pro 年付</h3>
        <div className="text-3xl font-bold my-2 font-display">
          ¥199
          <span className="text-sm font-normal text-slate-400">/年</span>
        </div>
        <p className="text-sm text-slate-400 mb-4">省 53% — 包含全部 Pro 功能</p>
        <ul className="space-y-3 mb-6 flex-1 text-sm text-slate-300">
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> 每批 500 张</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> 去广告</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> ZIP + 批量重命名 + 预设</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> 优先支持 & 全部模板</li>
        </ul>
        <button
          onClick={onUpgrade}
          className={`w-full py-2.5 font-semibold rounded-xl transition-colors ${
            pro ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-500 text-white'
          }`}
          disabled={pro}
        >
          {pro ? '当前计划' : '选择年付'}
        </button>
      </div>
    </div>
  );
}
