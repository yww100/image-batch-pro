'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Download, Zap, Crown, X, Image as ImageIcon } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { processImage, ProcessedImage, ProcessOptions } from '@/lib/imageProcessor';
import { getBatchLimit, isProActive } from '@/lib/pro';
import SettingsPanel from '@/components/SettingsPanel';
import ImageList from '@/components/ImageList';
import ProModal from '@/components/ProModal';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [processed, setProcessed] = useState<ProcessedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProModal, setShowProModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [options, setOptions] = useState<ProcessOptions>({
    quality: 85,
    format: 'image/jpeg',
  });

  const limit = getBatchLimit();
  const pro = isProActive();

  const handleFiles = useCallback((selected: FileList | null) => {
    if (!selected) return;
    const imageFiles = Array.from(selected).filter((f) => f.type.startsWith('image/'));
    const remaining = limit - files.length;
    const toAdd = imageFiles.slice(0, remaining);

    if (imageFiles.length > remaining) {
      setShowProModal(true);
    }

    setFiles((prev) => [...prev, ...toAdd]);
  }, [files.length, limit]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setProcessed([]);
  };

  const processAll = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setProcessed([]);
    setProgress(0);

    const results: ProcessedImage[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await processImage(files[i], options);
        results.push(result);
      } catch (err) {
        console.error('Failed to process', files[i].name, err);
      }
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setProcessed(results);
    setProcessing(false);
  };

  const downloadOne = (image: ProcessedImage) => {
    saveAs(image.processedBlob, image.fileName);
  };

  const downloadAll = async () => {
    if (processed.length === 0) return;
    if (processed.length === 1) {
      downloadOne(processed[0]);
      return;
    }

    const zip = new JSZip();
    processed.forEach((img) => {
      zip.file(img.fileName, img.processedBlob);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'batchimage-processed.zip');
  };

  const removeProcessed = (id: string) => {
    setProcessed((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      { /* Header */ }
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">BatchImage</span>
          </div>

          <button
            onClick={() => setShowProModal(true)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              pro
                ? 'bg-amber-100 text-amber-700'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Crown className="w-4 h-4" />
            {pro ? 'Pro Active' : 'Upgrade Pro'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        { /* Hero */ }
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Bulk Image Processing,
            <span className="text-brand-600"> Done in Browser</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Compress, resize, convert, and watermark hundreds of images privately.
            No upload to servers. Free for 5 images, Pro for 500.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          { /* Left column */ }
          <div className="space-y-6">
            { /* Upload */ }
            <div
              onDrop={onDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="w-14 h-14 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-lg font-medium text-slate-800">Drop images here or click to upload</p>
              <p className="text-sm text-slate-500 mt-2">
                Free plan: up to {limit} images per batch. {pro ? '' : 'Upgrade for 500.'}
              </p>
            </div>

            { /* File list */ }
            {files.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Queue ({files.length}/{limit})</h3>
                  <button
                    onClick={clearAll}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Clear
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {files.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="relative group rounded-lg border border-slate-200 overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(idx);
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-[10px] text-slate-600 truncate px-2 py-1">{file.name}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={processAll}
                  disabled={processing}
                  className="mt-5 w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Zap className="w-5 h-5" />
                  {processing ? `Processing ${progress}%` : 'Process All Images'}
                </button>
              </div>
            )}

            { /* Results */ }
            <ImageList
              images={processed}
              onRemove={removeProcessed}
              onDownloadOne={downloadOne}
            />

            {processed.length > 0 && (
              <button
                onClick={downloadAll}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download All as ZIP
              </button>
            )}
          </div>

          { /* Right column: settings */ }
          <div className="space-y-6">
            <SettingsPanel options={options} onChange={setOptions} />

            { /* Pricing card */ }
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold">BatchImage Pro</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300 mb-5">
                <li className="flex items-center gap-2">✓ 500 images per batch</li>
                <li className="flex items-center gap-2">✓ Watermark & custom formats</li>
                <li className="flex items-center gap-2">✓ Priority support</li>
                <li className="flex items-center gap-2">✓ No file size limits</li>
              </ul>
              <div className="text-3xl font-bold mb-4">
                $5
                <span className="text-base font-normal text-slate-400">/month</span>
              </div>
              <button
                onClick={() => setShowProModal(true)}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg transition-colors"
              >
                {pro ? 'Pro Active' : 'Upgrade Now'}
              </button>
            </div>
          </div>
        </div>
      </main>

      { /* Footer */ }
      <footer className="border-t border-slate-200 bg-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} BatchImage. All processing happens in your browser.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:text-slate-800">Privacy</a>
            <a href="#" className="hover:text-slate-800">Terms</a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-800"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  );
}
