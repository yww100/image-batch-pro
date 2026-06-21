interface AdSlotProps {
  label?: string;
}

export default function AdSlot({ label = 'Advertisement' }: AdSlotProps) {
  return (
    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <div className="w-full h-24 bg-slate-100 rounded-lg flex items-center justify-center">
        <span className="text-sm text-slate-400">Ad space — upgrade to Pro to remove ads</span>
      </div>
    </div>
  );
}
