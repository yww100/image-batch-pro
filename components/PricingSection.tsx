import { Check, Crown } from 'lucide-react';
import { isProActive, isProAnnual } from '@/lib/pro';

interface PricingSectionProps {
  onUpgrade: () => void;
}

export default function PricingSection({ onUpgrade }: PricingSectionProps) {
  const pro = isProActive() || isProAnnual();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      { /* Free */ }
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-900">Free</h3>
        <div className="text-3xl font-bold text-slate-900 my-2 font-display">$0</div>
        <p className="text-sm text-slate-500 mb-4">Forever free for casual use</p>
        <ul className="space-y-3 mb-6 flex-1 text-sm text-slate-600">
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> 5 images per batch</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> Compress, resize, convert</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> Single-file download</li>
          <li className="flex items-start gap-2 text-slate-400"><span className="w-4 h-4 shrink-0 mt-0.5">×</span> Ads supported</li>
        </ul>
        <button
          onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl transition-colors"
        >
          Get started
        </button>
      </div>

      { /* Ad Boost */ }
      <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-900">Ad Boost</h3>
        <div className="text-3xl font-bold text-slate-900 my-2 font-display">Free</div>
        <p className="text-sm text-slate-500 mb-4">Watch ads to unlock more power</p>
        <ul className="space-y-3 mb-6 flex-1 text-sm text-slate-600">
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> +20 images per ad watch</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> Up to 5 boosts per day</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> Unlock ZIP download</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> Still ad supported</li>
        </ul>
        <button
          onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
        >
          Try Ad Boost
        </button>
      </div>

      { /* Pro Monthly */ }
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-900">Pro Monthly</h3>
        <div className="text-3xl font-bold text-slate-900 my-2 font-display">
          $5
          <span className="text-sm font-normal text-slate-500">/mo</span>
        </div>
        <p className="text-sm text-slate-500 mb-4">For active creators & teams</p>
        <ul className="space-y-3 mb-6 flex-1 text-sm text-slate-600">
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> 500 images per batch</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> No ads</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> ZIP + batch rename + presets</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> Size templates for Shopify, IG, 小红书</li>
        </ul>
        <button
          onClick={onUpgrade}
          className={`w-full py-2.5 font-semibold rounded-xl transition-colors ${
            pro ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 text-white'
          }`}
          disabled={pro}
        >
          {pro ? 'Active plan' : 'Choose Monthly'}
        </button>
      </div>

      { /* Pro Annual */ }
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-dark-800 to-dark-900 text-white shadow-elevated flex flex-col">
        <div className="absolute -top-3 right-6 px-3 py-1 bg-brand-600 text-xs font-semibold rounded-full">
          Best value
        </div>
        <h3 className="text-lg font-semibold">Pro Annual</h3>
        <div className="text-3xl font-bold my-2 font-display">
          $29
          <span className="text-sm font-normal text-slate-400">/year</span>
        </div>
        <p className="text-sm text-slate-400 mb-4">Save 52% — everything in Pro</p>
        <ul className="space-y-3 mb-6 flex-1 text-sm text-slate-300">
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> 500 images per batch</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> No ads</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> ZIP + batch rename + presets</li>
          <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> Priority support & all templates</li>
        </ul>
        <button
          onClick={onUpgrade}
          className={`w-full py-2.5 font-semibold rounded-xl transition-colors ${
            pro ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-500 text-white'
          }`}
          disabled={pro}
        >
          {pro ? 'Active plan' : 'Choose Annual'}
        </button>
      </div>
    </div>
  );
}
