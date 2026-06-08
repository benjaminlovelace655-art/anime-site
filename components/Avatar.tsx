'use client';

import { AVATARS } from '@/lib/auth-context';

export default function Avatar({
  username,
  avatar,
  avatarUrl,
  size = 'md',
  className = '',
}: {
  username: string;
  avatar?: number;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeMap = { sm: 'w-6 h-6 text-[10px]', md: 'w-8 h-8 text-xs', lg: 'w-10 h-10 text-sm' };
  const s = sizeMap[size];
  const gradient = AVATARS[avatar ?? 0]?.gradient || 'from-emerald-500 to-green-600';

  if (avatarUrl) {
    return (
      <div className={`${sizeMap[size]} rounded-full shrink-0 overflow-hidden ${className}`}>
        <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${s} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white shrink-0 ${className}`}>
      {username[0].toUpperCase()}
    </div>
  );
}
