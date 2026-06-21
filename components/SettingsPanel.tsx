import { useState } from 'react';
import { Crown, Trash2, Save, FolderOpen } from 'lucide-react';
import { ProcessOptions, OutputFormat, RenameOptions } from '@/lib/imageProcessor';
import { isProActive, isProAnnual, Preset, getPresets, savePreset, deletePreset } from '@/lib/pro';
import { SIZE_PRESETS, SizePreset, getCategories } from '@/lib/sizePresets';

interface SettingsPanelProps {
  options: ProcessOptions;
  rename: RenameOptions;
  onChange: (options: ProcessOptions, rename: RenameOptions) => void;
}

export default function SettingsPanel({ options, rename, onChange }: SettingsPanelProps) {
  const pro = isProActive() || isProAnnual();
  const [presets, setPresets] = useState<Preset[]>(getPresets());
  const [presetName, setPresetName] = useState('');

  const updateOptions = <K extends keyof ProcessOptions>(key: K, value: ProcessOptions[K]) => {
    onChange({ ...options, [key]: value }, rename);
  };

  const updateRename = <K extends keyof RenameOptions>(key: K, value: RenameOptions[K]) => {
    onChange(options, { ...rename, [key]: value });
  };

  const applyPreset = (preset: SizePreset) => {
    onChange({ ...options, maxWidth: preset.width, maxHeight: preset.height }, rename);
  };

  const handleSavePreset = () => {
    const name = presetName.trim();
    if (!name) return;
    const preset: Preset = {
      id: Math.random().toString(36).slice(2, 11),
      name,
      options: {
        quality: options.quality,
        format: options.format || 'image/jpeg',
        maxWidth: options.maxWidth,
        maxHeight: options.maxHeight,
      },
    };
    savePreset(preset);
    setPresets(getPresets());
    setPresetName('');
  };

  const handleLoadPreset = (preset: Preset) => {
    onChange(
      {
        ...options,
        quality: preset.options.quality,
        format: preset.options.format as OutputFormat,
        maxWidth: preset.options.maxWidth,
        maxHeight: preset.options.maxHeight,
      },
      rename
    );
  };

  const handleDeletePreset = (id: string) => {
    deletePreset(id);
    setPresets(getPresets());
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Processing Settings</h3>
        {!pro && (
          <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded-full">
            Preview mode
          </span>
        )}
      </div>

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
          onChange={(e) => updateOptions('quality', Number(e.target.value))}
          className="w-full accent-brand-600"
        />
      </div>

      { /* Size Presets */ }
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Size Template</label>
        <select
          value=""
          onChange={(e) => {
            const preset = SIZE_PRESETS.find((p) => p.name === e.target.value);
            if (preset) applyPreset(preset);
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">Pick a preset (Shopify, IG, 小红书...)</option>
          {getCategories().map((category) => (
            <optgroup key={category} label={category}>
              {SIZE_PRESETS.filter((p) => p.category === category).map((preset) => (
                <option key={preset.name} value={preset.name}>
                  {preset.name} — {preset.width}×{preset.height}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      { /* Resize */ }
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Max Width (px)</label>
          <input
            type="number"
            min="1"
            placeholder="Keep"
            value={options.maxWidth || ''}
            onChange={(e) => updateOptions('maxWidth', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Max Height (px)</label>
          <input
            type="number"
            min="1"
            placeholder="Keep"
            value={options.maxHeight || ''}
            onChange={(e) => updateOptions('maxHeight', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      { /* Format */ }
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Output Format</label>
        <select
          value={options.format || 'image/jpeg'}
          onChange={(e) => updateOptions('format', e.target.value as OutputFormat)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="image/jpeg">JPEG (best for photos)</option>
          <option value="image/png">PNG (best for transparency)</option>
          <option value="image/webp">WebP (best compression)</option>
        </select>
      </div>

      { /* Rename */ }
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-slate-500" />
          <label className="text-sm font-medium text-slate-700">Batch Rename</label>
        </div>
        <input
          type="text"
          value={rename.pattern}
          onChange={(e) => updateRename('pattern', e.target.value)}
          placeholder="product-{n}-{date}"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-slate-600">Start number</label>
            <input
              type="number"
              min="1"
              value={rename.startIndex}
              onChange={(e) => updateRename('startIndex', Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <p className="text-xs text-slate-500 pb-2">
              Use <code className="bg-slate-100 px-1 rounded">{'{n}'}</code> and{' '}
              <code className="bg-slate-100 px-1 rounded">{'{date}'}</code>
            </p>
          </div>
        </div>
      </div>

      { /* Watermark */ }
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Watermark</label>
            {!pro && (
              <Crown className="w-3.5 h-3.5 text-amber-500" />
            )}
          </div>
          <input
            type="checkbox"
            checked={!!options.watermark}
            onChange={(e) =>
              updateOptions(
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
                updateOptions('watermark', { ...options.watermark!, text: e.target.value })
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
                  updateOptions('watermark', {
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
                updateOptions('watermark', {
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

      { /* Saved Presets */ }
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Save className="w-4 h-4 text-slate-500" />
          <label className="text-sm font-medium text-slate-700">Saved Presets</label>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Preset name"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
          <button
            onClick={handleSavePreset}
            disabled={!presetName.trim()}
            className="px-3 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
        {presets.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50"
              >
                <button
                  onClick={() => handleLoadPreset(preset)}
                  className="text-sm text-slate-700 hover:text-brand-600 text-left flex-1"
                >
                  {preset.name}
                </button>
                <button
                  onClick={() => handleDeletePreset(preset.id)}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {!pro && (
        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
          Free plan: up to 5 images per batch. Ad Boost adds +20 images per watch.
          Pro unlocks 500 images/batch, ZIP downloads, and removes ads.
        </p>
      )}
    </div>
  );
}
