import Link from 'next/link';

export const metadata = { title: 'Privacy Policy — AniLove' };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 pt-28">
      <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
        <span className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-600 to-green-500" />
        Privacy Policy
      </h1>
      <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
        <p>Your privacy is important to us. This policy outlines what information AniLove collects and how it is used.</p>
        <h2 className="text-lg font-bold text-white pt-4">Information We Collect</h2>
        <p>AniLove does not collect any personal information. We do not require registration, email addresses, or any form of account creation.</p>
        <h2 className="text-lg font-bold text-white pt-4">Local Storage</h2>
        <p>We use your browser&apos;s local storage to save preferences such as:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Player settings (auto-play, auto-skip, auto-next)</li>
          <li>Continue watching progress</li>
          <li>Watchlist status</li>
        </ul>
        <p>This data stays on your device and is never sent to our servers.</p>
        <h2 className="text-lg font-bold text-white pt-4">Third-Party Services</h2>
        <p>Video streams are embedded from third-party services. These services may set their own cookies or collect data according to their own privacy policies. AniLove has no control over this.</p>
        <h2 className="text-lg font-bold text-white pt-4">No Tracking</h2>
        <p>AniLove does not use analytics, tracking pixels, or any form of user tracking. We do not serve ads.</p>
        <h2 className="text-lg font-bold text-white pt-4">Contact</h2>
        <p>If you have questions about this policy, reach out via <a href="/contact" className="text-[var(--accent-light)] hover:underline">our contact page</a>.</p>
      </div>
      <Link href="/" className="inline-flex items-center gap-2 mt-8 text-sm text-[var(--accent-light)] hover:underline">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Home
      </Link>
    </div>
  );
}
