import { auth, signOut } from '@/lib/auth';
import { getUserById } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Profile — AniLove' };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = await getUserById(session.user.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 pt-28">
      <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
        <span className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-600 to-green-500" />
        Profile
      </h1>

      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] p-6 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center text-2xl font-bold text-black">
            {(session.user.name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{session.user.name || 'User'}</h2>
            <p className="text-sm text-[var(--text-muted)]">{session.user.email}</p>
            {user?.created_at && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Joined {new Date(user.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-4 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
          >
            <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="text-sm font-medium">Browse Anime</span>
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
          >
            <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="text-sm font-medium">Search</span>
          </Link>
        </div>
      </div>

      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: '/' });
        }}
      >
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
