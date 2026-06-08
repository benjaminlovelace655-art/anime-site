import Link from 'next/link';

export const metadata = { title: 'Terms of Service — AniByte' };

export default function TosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 pt-28">
      <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
        <span className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-600 to-green-500" />
        Terms of Service
      </h1>
      <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
        <p>By using AniByte, you agree to the following terms and conditions. If you do not agree, please do not use this service.</p>
        <h2 className="text-lg font-bold text-white pt-4">Use of Service</h2>
        <p>AniByte is provided for testing and educational purposes only. You may use the site to discover and browse anime information. The site does not host any video content.</p>
        <h2 className="text-lg font-bold text-white pt-4">Intellectual Property</h2>
        <p>All anime data, images, and metadata are property of their respective owners (MyAnimeList, anime studios, and distributors). AniByte claims no ownership over any content displayed.</p>
        <h2 className="text-lg font-bold text-white pt-4">Third-Party Services</h2>
        <p>Video streams are provided by third-party services over which AniByte has no control. We are not responsible for the content, availability, or practices of these services.</p>
        <h2 className="text-lg font-bold text-white pt-4">Limitation of Liability</h2>
        <p>AniByte is provided &ldquo;as is&rdquo; without any warranty. We are not liable for any damages arising from the use of this site.</p>
        <h2 className="text-lg font-bold text-white pt-4">Changes</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of the site constitutes acceptance of any changes.</p>
      </div>
      <Link href="/" className="inline-flex items-center gap-2 mt-8 text-sm text-[var(--accent-light)] hover:underline">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Home
      </Link>
    </div>
  );
}
