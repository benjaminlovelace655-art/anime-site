import Link from 'next/link';

export const metadata = { title: 'DMCA — AniByte' };

export default function DmcaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 pt-28">
      <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
        <span className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-600 to-green-500" />
        DMCA Notice
      </h1>
      <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
        <p>AniByte respects the intellectual property rights of others. We comply with the Digital Millennium Copyright Act (DMCA).</p>
        <h2 className="text-lg font-bold text-white pt-4">No Hosted Content</h2>
        <p>AniByte does not host, store, or upload any video content on its servers. All video streams are embedded from third-party services. We are a directory of links to publicly available content.</p>
        <h2 className="text-lg font-bold text-white pt-4">Third-Party Services</h2>
        <p>If you believe your copyrighted work has been made available through our site in a way that constitutes copyright infringement, please contact the respective third-party video hosting service directly, as we do not control their content.</p>
        <h2 className="text-lg font-bold text-white pt-4">Contact</h2>
        <p>For any DMCA-related inquiries, please reach out via <Link href="/contact" className="text-[var(--accent-light)] hover:underline">our contact page</Link>.</p>
      </div>
      <Link href="/" className="inline-flex items-center gap-2 mt-8 text-sm text-[var(--accent-light)] hover:underline">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Home
      </Link>
    </div>
  );
}
