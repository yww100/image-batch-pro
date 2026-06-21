import { ProcessOptions, OutputFormat } from '@/lib/imageProcessor';

interface SettingsPanelProps {
  options: ProcessOptions;
  onChange: (options: ProcessOptions) => void;
}

export default function SettingsPanel({ options, onChange }: SettingsPanelProps) {
  const update = <K extends keyof ProcessOptions>(key: K, value: ProcessOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-5">
      <h3 className="font-semibold text-slate-800">Processing Settings</h3>

      { /* Quality */ }
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-slate-700">Quality</label>
          <span className="text-sm text-slate-500">{options.quality}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={options.quality}
          onChange={(e) => update('quality', Number(e.target.value))}
          className="w-full accent-brand-600"
        />
      </div>

      { /* Resize */ }
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Max Width (px)</label>
          <input
            type="number"
            min="1"
            placeholder="Keep original"
            value={options.maxWidth || ''}
            onChange={(e) => update('maxWidth', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Max Height (px)</label>
          <input
            type="number"
            min="1"
            placeholder="Keep original"
            value={options.maxHeight || ''}
            onChange={(e) => update('maxHeight', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      { /* Format */ }
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Output Format</label>
        <select
          value={options.format || 'image/jpeg'}
          onChange={(e) => update('format', e.target.value as OutputFormat)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="image/jpeg">JPEG (best for photos)</option>
          <option value="image/png">PNG (best for transparency)</option>
          <option value="image/webp">WebP (best compression)</option>
        </select>
      </div>

      { /* Watermark */ }
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Watermark</label>
          <input
            type="checkbox"
            checked={!!options.watermark}
            onChange={(e) =>
              update(
                'watermark',
                e.target.checked
                  ? { text: 'Sample', opacity: 50, position: 'bottom-right' }
                  : undefined
              )
            }
            className="accent-brand-600"
          />
        </div>

        {options.watermark && (
          <div className="space-y-3">
            <input
              type="text"
              value={options.watermark.text}
              onChange={(e) =>
                update('watermark', { ...options.watermark!, text: e.target.value })
              }
              placeholder="Watermark text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Opacity</span>
                <span className="text-sm text-slate-500">{options.watermark.opacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={options.watermark.opacity}
                onChange={(e) =>
                  update('watermark', {
                    ...options.watermark!,
                    opacity: Number(e.target.value),
                  })
                }
                className="w-full accent-brand-600"
              />
            </div>
            <select
              value={options.watermark.position}
              onChange={(e) =>
                update('watermark', {
                  ...options.watermark!,
                  position: e.target.value as any,
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            >
              <option value="center">Center</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
