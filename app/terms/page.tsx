import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - BatchImage',
  description: 'Terms of service for using BatchImage.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="text-xl font-bold text-slate-900 font-display">BatchImage</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 font-display">Terms of Service</h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600">
            Last updated: June 21, 2026
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">1. Acceptance of terms</h2>
          <p className="text-slate-600 mb-4">
            By using BatchImage, you agree to these terms. If you do not agree, please do not use the service.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">2. Service description</h2>
          <p className="text-slate-600 mb-4">
            BatchImage is a browser-based tool for batch image processing. All processing happens locally on your device.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">3. Pro subscription</h2>
          <p className="text-slate-600 mb-4">
            Pro features are available for $5 USD per month. You can cancel anytime. Refunds are handled on a case-by-case basis within 14 days of purchase.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">4. Limitations</h2>
          <p className="text-slate-600 mb-4">
            BatchImage is provided "as is" without warranties. We are not responsible for image quality, data loss, or processing results. Always keep backups of your original files.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">5. Contact</h2>
          <p className="text-slate-600">
            For questions, email{' '}
            <a href="mailto:945893243@qq.com" className="text-brand-600 hover:underline">
              945893243@qq.com
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
