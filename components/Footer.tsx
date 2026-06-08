import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-20 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src="/founder-icon.png" alt="AniLove" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-lg">
                <span className="gradient-text">AniLove</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-sm">
              Your ultimate anime streaming platform. Watch, track, and discover new anime series all in one place. Powered by MyAnimeList.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-11 h-11 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-light)] hover:border-[var(--accent)] transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="w-11 h-11 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-light)] hover:border-[var(--accent)] transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
              </a>
              <a href="https://reddit.com" target="_blank" rel="noopener noreferrer" aria-label="Reddit" className="w-11 h-11 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-light)] hover:border-[var(--accent)] transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597.547-.8 3.747c1.825.07 3.48.633 4.674 1.596a1.06 1.06 0 0 1 .677-.256c.585 0 1.06.475 1.06 1.06 0 .585-.475 1.06-1.06 1.06-.248 0-.476-.085-.656-.228a5.57 5.57 0 0 1-.016 3.083c.575.215.996.77.996 1.426 0 .84-.679 1.52-1.52 1.52-.422 0-.812-.172-1.089-.452a7.03 7.03 0 0 1-4.854 0c-.277.28-.667.452-1.089.452-.84 0-1.52-.68-1.52-1.52 0-.656.42-1.21.996-1.426a5.57 5.57 0 0 1-.016-3.083 1.06 1.06 0 0 1-.656.228c-.585 0-1.06-.475-1.06-1.06 0-.585.475-1.06 1.06-1.06.257 0 .495.099.677.256 1.194-.963 2.85-1.525 4.675-1.596l.84-3.88a.29.29 0 0 1 .24-.236l3.442-.732a1.26 1.26 0 0 1 1.181-.912zM16.21 9.926a.92.92 0 0 0-.92.92.92.92 0 0 0 .92.92.92.92 0 0 0 .92-.92.92.92 0 0 0-.92-.92zm-4.209 4.4a.79.79 0 0 0-.081.062c-.337.315-.885.498-1.43.498-.544 0-1.092-.183-1.429-.498a.79.79 0 0 0-.081-.062.726.726 0 0 0-.069.124.745.745 0 0 0 .668 1.04c.207 0 .402-.07.565-.16.422.22.886.34 1.346.34.46 0 .924-.12 1.346-.34.163.09.358.16.565.16a.745.745 0 0 0 .668-1.04.726.726 0 0 0-.069-.124.79.79 0 0 0-.081-.06zm-2.861-.865a.92.92 0 0 0-.92-.92.92.92 0 0 0-.92.92.92.92 0 0 0 .92.92.92.92 0 0 0 .92-.92z" /></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Browse</h4>
            <div className="space-y-3 text-sm text-[var(--text-muted)]">
              <Link href="/search" className="block hover:text-white transition-colors">Trending</Link>
              <Link href="/search?status=complete&sort=score" className="block hover:text-white transition-colors">Top Rated</Link>
              <Link href="/search?status=upcoming" className="block hover:text-white transition-colors">Upcoming</Link>
              <Link href="/search" className="block hover:text-white transition-colors">Genres</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Support</h4>
            <div className="space-y-3 text-sm text-[var(--text-muted)]">
              <Link href="/about" className="block hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
              <Link href="/faq" className="block hover:text-white transition-colors">FAQ</Link>
              <Link href="/status" className="block hover:text-white transition-colors">Status</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Legal</h4>
            <div className="space-y-3 text-sm text-[var(--text-muted)]">
              <Link href="/tos" className="block hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="block hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/dmca" className="block hover:text-white transition-colors">DMCA</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-[var(--border)] pt-8 text-center">
           <p className="text-xs text-[var(--text-muted)]">AniLove does not host any videos. All anime data is provided by MyAnimeList (Jikan API).</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">For testing and educational purposes only. Not affiliated with any anime studio or distributor.</p>
          <p className="text-xs text-[var(--text-muted)] mt-4">Made with <span className="text-red-500">❤</span> by Benjamin Lovelace</p>
        </div>
      </div>
    </footer>
  );
}
