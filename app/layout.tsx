import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BatchImage - Bulk Image Processing for E-commerce & Creators',
  description:
    'Compress, resize, convert, watermark, rename and export image batches privately in your browser. No upload. Built for product photos, social media, and content teams.',
  keywords: [
    'bulk image compressor',
    'batch image resize',
    'product photo optimizer',
    'image converter',
    'batch watermark',
    'webp converter',
    'shopify image optimization',
    'instagram image resize',
  ],
  metadataBase: new URL('https://image-batch-pro-ivory.vercel.app'),
  openGraph: {
    title: 'BatchImage - Bulk Image Processing in Your Browser',
    description:
      'Compress, resize, convert, watermark, rename and export image batches privately. No upload required.',
    url: 'https://image-batch-pro-ivory.vercel.app',
    siteName: 'BatchImage',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'BatchImage - Bulk image processing tool',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BatchImage - Bulk Image Processing in Your Browser',
    description:
      'Compress, resize, convert, watermark, rename and export image batches privately.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
