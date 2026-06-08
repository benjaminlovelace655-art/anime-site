'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, AVATARS } from '@/lib/auth-context';

interface Comment {
  id: string;
  username: string;
  text: string;
  createdAt: number;
  avatar: number;
}

const COMMENTS_KEY = 'anibyte_comments';

function getComments(animeId: number, episode: number): Comment[] {
  try {
    const key = `${COMMENTS_KEY}_${animeId}_${episode}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function saveComments(animeId: number, episode: number, comments: Comment[]) {
  const key = `${COMMENTS_KEY}_${animeId}_${episode}`;
  localStorage.setItem(key, JSON.stringify(comments));
}

export default function CommentSection({ animeId, episode }: { animeId: number; episode: number }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setComments(getComments(animeId, episode));
  }, [animeId, episode]);

  const handlePost = () => {
    if (!text.trim() || !user) return;
    setPosting(true);
    const newComment: Comment = {
      id: Date.now().toString(),
      username: user.username,
      text: text.trim(),
      createdAt: Date.now(),
      avatar: user.avatar,
    };
    const updated = [newComment, ...comments];
    saveComments(animeId, episode, updated);
    setComments(updated);
    setText('');
    setPosting(false);
  };

  return (
    <div className="border-t border-[var(--border)] pt-6 mt-8">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        Comments ({comments.length})
      </h3>

      {user ? (
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${AVATARS[user.avatar]?.gradient || 'from-emerald-500 to-green-600'} flex items-center justify-center text-xs font-bold text-white`}>
              {user.username[0].toUpperCase()}
            </div>
            Posting as <span className="text-[var(--accent-light)]">{user.username}</span>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What do you think of this episode?"
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--accent)] transition-all resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handlePost}
              disabled={!text.trim() || posting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {posting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-center mb-8">
          <svg className="w-10 h-10 mx-auto text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <p className="text-sm text-gray-400 mb-1">Sign in to join the discussion</p>
          <p className="text-xs text-gray-600 mb-4">Share your thoughts on this episode</p>
          <Link
            href="/login"
            className="inline-flex px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all"
          >
            Sign In
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-sm text-gray-600 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
        )}
        {comments.map(c => (
          <div key={c.id} className="flex gap-3 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${AVATARS[c.avatar]?.gradient || 'from-emerald-500 to-green-600'} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
              {c.username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-[var(--accent-light)]">{c.username}</span>
                <span className="text-[10px] text-gray-600">
                  {formatTime(c.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-300 break-words">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}
