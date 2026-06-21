import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - BatchImage',
  description: 'How BatchImage handles your data and images.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="text-xl font-bold text-slate-900 font-display">BatchImage</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 font-display">Privacy Policy</h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600">
            Last updated: June 21, 2026
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">1. We do not upload your images</h2>
          <p className="text-slate-600 mb-4">
            BatchImage processes all images locally in your web browser. Your files are never uploaded to our servers. You can verify this by using the site while offline after the initial page load.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">2. What we collect</h2>
          <p className="text-slate-600 mb-4">
            We do not collect personal information unless you choose to contact us by email. We may use basic analytics to understand how many people visit the site, but this does not include your images or filenames.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">3. Local storage</h2>
          <p className="text-slate-600 mb-4">
            If you upgrade to Pro, your license status is stored in your browser's local storage. This stays on your device and is not sent to us.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">4. Third-party services</h2>
          <p className="text-slate-600 mb-4">
            Payment processing is handled by our payment provider. We do not store your payment details.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">5. Contact</h2>
          <p className="text-slate-600">
            If you have questions, email us at{' '}
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
