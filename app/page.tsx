'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Upload, Download, Zap, Crown, X, Image as ImageIcon, Shield, Lock, Gauge, Check, ArrowRight, Sparkles } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { processImage, ProcessedImage, ProcessOptions, RenameOptions } from '@/lib/imageProcessor';
import { getBatchLimit, isProActive, isProAnnual, canDownloadZip } from '@/lib/pro';
import SettingsPanel from '@/components/SettingsPanel';
import ImageList from '@/components/ImageList';
import ProModal from '@/components/ProModal';
import AdBoostModal from '@/components/AdBoostModal';
import AdSlot from '@/components/AdSlot';
import PricingSection from '@/components/PricingSection';

const FEATURES = [
  {
    icon: Gauge,
    title: 'Lightning Fast',
    desc: 'Process hundreds of images in seconds using browser-based WebAssembly acceleration.',
  },
  {
    icon: Lock,
    title: 'Private by Design',
    desc: 'Your images never leave your computer. No server upload, no data retention.',
  },
  {
    icon: Shield,
    title: 'Built for Creators',
    desc: 'E-commerce and social media size templates plus batch rename in one workflow.',
  },
];

const STATS = [
  { value: '0', label: 'Images leave your device' },
  { value: '500', label: 'Max images per Pro batch' },
  { value: '13+', label: 'E-commerce & social presets' },
];

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [processed, setProcessed] = useState<ProcessedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProModal, setShowProModal] = useState(false);
  const [proModalPlan, setProModalPlan] = useState<'monthly' | 'annual'>('annual');
  const [showAdModal, setShowAdModal] = useState(false);
  const [adModalReason, setAdModalReason] = useState<'limit' | 'zip'>('limit');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  const [options, setOptions] = useState<ProcessOptions>({
    quality: 85,
    format: 'image/jpeg',
  });

  const [rename, setRename] = useState<RenameOptions>({
    pattern: '',
    startIndex: 1,
  });

  const handleOptionsChange = useCallback((newOptions: ProcessOptions, newRename: RenameOptions) => {
    setOptions(newOptions);
    setRename(newRename);
  }, []);

  const limit = getBatchLimit();
  const pro = isProActive() || isProAnnual();

  const handleFiles = useCallback((selected: FileList | null) => {
    if (!selected) return;
    const imageFiles = Array.from(selected).filter((f) => f.type.startsWith('image/'));
    const remaining = limit - files.length;

    if (imageFiles.length > remaining) {
      if (pro) {
        // should not happen, but guard
        const toAdd = imageFiles.slice(0, remaining);
        setFiles((prev) => [...prev, ...toAdd]);
        return;
      }
      setAdModalReason('limit');
      setShowAdModal(true);
      const toAdd = imageFiles.slice(0, remaining);
      setFiles((prev) => [...prev, ...toAdd]);
      return;
    }

    setFiles((prev) => [...prev, ...imageFiles]);
  }, [files.length, limit, pro]);

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
        const result = await processImage(files[i], options, rename);
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
    if (!canDownloadZip()) {
      setAdModalReason('zip');
      setShowAdModal(true);
      return;
    }

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

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const openPro = (plan: 'monthly' | 'annual') => {
    setProModalPlan(plan);
    setShowProModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      { /* Header */ }
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-glow">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 font-display">BatchImage</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#demo" className="hover:text-slate-900 transition-colors">Try it free</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          </nav>

          <button
            onClick={() => openPro('annual')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              pro
                ? 'bg-amber-100 text-amber-700'
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-elevated'
            }`}
          >
            <Crown className="w-4 h-4" />
            {pro ? 'Pro Active' : 'Upgrade Pro'}
          </button>
        </div>
      </header>

      { /* Hero */ }
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-brand-100/60 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Now with e-commerce presets & batch rename</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 font-display leading-[1.1]">
            Resize & compress product
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
              photos in one click
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Built for Shopify sellers, Instagram creators, and Xiaohongshu bloggers.
            Process hundreds of images privately in your browser — no uploads, no waiting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={scrollToDemo}
              className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-glow hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Try it free — no signup
            </button>
            <button
              onClick={() => openPro('annual')}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all flex items-center gap-2"
            >
              See Pro features
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          { /* Trust badges */ }
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-600" />
              <span>Runs entirely in your browser</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-300" />
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-600" />
              <span>No account required</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-300" />
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-brand-600" />
              <span>Free for 5 images per batch</span>
            </div>
          </div>
        </div>
      </section>

      { /* Stats */ }
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            {STATS.map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 font-display">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      { /* Features */ }
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">
              Everything you need for batch images
            </h2>
            <p className="text-slate-600">
              A complete toolkit that respects your privacy and your time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-slate-100 shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      { /* Demo / Tool */ }
      <section id="demo" ref={demoRef} className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">
              Try it now
            </h2>
            <p className="text-slate-600">
              Free plan: process up to {limit} images per batch. No account required.
            </p>
          </div>

          {!pro && <AdSlot label="Sponsored" />}

          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start mt-6">
            <div className="space-y-6">
              <div
                onDrop={onDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all bg-white ${
                  dragOver
                    ? 'border-brand-500 bg-brand-50/50'
                    : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'
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
                <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-lg font-semibold text-slate-800">Drop images here or click to upload</p>
                <p className="text-sm text-slate-500 mt-2">
                  Free: {limit} images per batch · Pro: 500 images per batch
                </p>
              </div>

              {files.length > 0 && (
                <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800">Queue ({files.length}/{limit})</h3>
                    <button
                      onClick={clearAll}
                      className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Clear
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {files.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        className="relative group rounded-lg border border-slate-200 overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-20 object-cover"
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
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={processAll}
                    disabled={processing}
                    className="mt-5 w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <Zap className="w-5 h-5" />
                    {processing ? `Processing ${progress}%` : 'Process All Images'}
                  </button>
                </div>
              )}

              {!pro && files.length === 0 && processed.length === 0 && (
                <AdSlot />
              )}

              <ImageList
                images={processed}
                onRemove={removeProcessed}
                onDownloadOne={downloadOne}
              />

              {processed.length > 0 && (
                <button
                  onClick={downloadAll}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download All as ZIP
                </button>
              )}
            </div>

            <div className="space-y-6">
              <SettingsPanel options={options} rename={rename} onChange={handleOptionsChange} />

              <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl p-6 text-white shadow-elevated">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-lg">BatchImage Pro</h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-400" /> 500 images per batch</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-400" /> Watermark & custom formats</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-400" /> ZIP export + batch rename</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-400" /> Size templates for Shopify, IG, 小红书</li>
                </ul>
                <div className="text-4xl font-bold mb-5 font-display">
                  $29
                  <span className="text-base font-normal text-slate-400">/year</span>
                </div>
                <button
                  onClick={() => openPro('annual')}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all"
                >
                  {pro ? 'Pro Active' : 'Choose Annual'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      { /* Pricing */ }
      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-600">
              Start free. Boost with ads. Upgrade when you need more power.
            </p>
          </div>

          <PricingSection onUpgrade={() => openPro('annual')} />
        </div>
      </section>

      { /* FAQ */ }
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center font-display">Frequently asked questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Do my images get uploaded anywhere?',
                a: 'No. All processing happens locally in your browser. Your files never leave your device.',
              },
              {
                q: 'What file formats are supported?',
                a: 'You can process JPEG, PNG, and WebP images. Output formats include JPEG, PNG, and WebP.',
              },
              {
                q: 'How does Ad Boost work?',
                a: 'Free users can watch a short ad up to 5 times per day to add 20 extra images to their batch limit or unlock ZIP download for the current session.',
              },
              {
                q: 'Can I cancel my Pro subscription?',
                a: 'Yes. You can cancel anytime. Pro features remain active until the end of your billing period.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      { /* Footer CTA */ }
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-glow">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
              Ready to speed up your workflow?
            </h2>
            <p className="text-brand-100 mb-8 max-w-xl mx-auto">
              Join creators and sellers who process images faster, safer, and privately.
            </p>
            <button
              onClick={scrollToDemo}
              className="px-8 py-4 bg-white text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition-colors inline-flex items-center gap-2"
            >
              Start processing free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      { /* Footer */ }
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">BatchImage</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="/privacy" className="hover:text-slate-800">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-800">Terms</Link>
              <a href="https://github.com/yww100/image-batch-pro" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800">GitHub</a>
            </div>
            <p className="text-sm text-slate-400">© 2026 BatchImage. All processing happens in your browser.</p>
          </div>
        </div>
      </footer>

      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} plan={proModalPlan} />
      <AdBoostModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        reason={adModalReason}
        onUpgrade={() => {
          setShowAdModal(false);
          openPro('annual');
        }}
      />
    </div>
  );
}
