import imageCompression from 'browser-image-compression';

export type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export interface ProcessOptions {
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: OutputFormat;
  watermark?: {
    text: string;
    opacity: number;
    position: 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  };
}

export interface ProcessedImage {
  id: string;
  originalFile: File;
  processedBlob: Blob;
  url: string;
  originalSize: number;
  processedSize: number;
  fileName: string;
}

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function applyWatermark(
  dataUrl: string,
  watermark: NonNullable<ProcessOptions['watermark']>
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));

      ctx.drawImage(img, 0, 0);

      ctx.save();
      ctx.globalAlpha = watermark.opacity / 100;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = Math.max(2, img.width * 0.003);
      ctx.font = `bold ${Math.max(16, img.width * 0.03)}px sans-serif`;

      const text = watermark.text;
      const metrics = ctx.measureText(text);
      const padding = Math.max(20, img.width * 0.02);
      let x = 0;
      let y = 0;

      switch (watermark.position) {
        case 'center':
          x = (canvas.width - metrics.width) / 2;
          y = canvas.height / 2;
          break;
        case 'bottom-right':
          x = canvas.width - metrics.width - padding;
          y = canvas.height - padding;
          break;
        case 'bottom-left':
          x = padding;
          y = canvas.height - padding;
          break;
        case 'top-right':
          x = canvas.width - metrics.width - padding;
          y = padding + metrics.actualBoundingBoxAscent;
          break;
        case 'top-left':
          x = padding;
          y = padding + metrics.actualBoundingBoxAscent;
          break;
      }

      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
      ctx.restore();

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        },
        'image/png',
        1
      );
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export interface RenameOptions {
  pattern: string;
  startIndex: number;
}

export async function processImage(
  file: File,
  options: ProcessOptions,
  rename?: RenameOptions
): Promise<ProcessedImage> {
  const compressionOptions: any = {
    fileType: options.format || file.type,
    initialQuality: options.quality / 100,
    alwaysKeepResolution: !options.maxWidth && !options.maxHeight,
  };

  if (options.maxWidth) compressionOptions.maxWidthOrHeight = options.maxWidth;

  let compressedBlob: Blob = await imageCompression(file, compressionOptions);

  if (options.maxHeight && !options.maxWidth) {
    // browser-image-compression uses max dimension; for height-only we use canvas resize
    const dataUrl = await blobToDataURL(compressedBlob);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataUrl;
    });

    const ratio = Math.min(1, options.maxHeight / img.height);
    const canvas = document.createElement('canvas');
    canvas.width = img.width * ratio;
    canvas.height = img.height * ratio;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    compressedBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        },
        options.format || file.type,
        options.quality / 100
      );
    });
  }

  if (options.watermark) {
    const dataUrl = await blobToDataURL(compressedBlob);
    compressedBlob = await applyWatermark(dataUrl, options.watermark);
  }

  const url = URL.createObjectURL(compressedBlob);

  return {
    id: generateId(),
    originalFile: file,
    processedBlob: compressedBlob,
    url,
    originalSize: file.size,
    processedSize: compressedBlob.size,
    fileName: rename
      ? formatFileName(rename.pattern, rename.startIndex, options.format || file.type)
      : file.name.replace(/\.[^/.]+$/, '') + getExtension(options.format || file.type),
  };
}

function formatFileName(pattern: string, index: number, mimeType: string): string {
  const base = pattern
    .replace(/\{n\}/g, String(index).padStart(3, '0'))
    .replace(/\{date\}/g, new Date().toISOString().slice(0, 10).replace(/-/g, ''))
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
  return (base || 'image') + getExtension(mimeType);
}

function getExtension(mimeType: string): string {
  switch (mimeType) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    default:
      return '.jpg';
  }
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function calculateSavings(original: number, processed: number): { text: string; isSaving: boolean } {
  if (original === 0) return { text: '0%', isSaving: true };
  const saved = original - processed;
  const percent = (saved / original) * 100;
  const text = Math.abs(percent).toFixed(1) + '%';
  return { text, isSaving: percent >= 0 };
}

export function formatSavings(original: number, processed: number): string {
  const { text, isSaving } = calculateSavings(original, processed);
  if (isSaving) return `-${text}`;
  return `+${text} (file grew)`;
}
