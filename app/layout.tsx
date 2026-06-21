import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BatchImage - Bulk Image Compress, Resize & Convert in Browser',
  description:
    'Process hundreds of images in your browser. Batch compress, resize, convert formats, and add watermarks. No upload required.',
  keywords: [
    'batch image compressor',
    'bulk image resize',
    'image converter',
    'watermark images',
    'online image tool',
  ],
  openGraph: {
    title: 'BatchImage - Bulk Image Processing Tool',
    description: 'Compress, resize, convert and watermark images privately in your browser.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
