'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export const AVATARS = [
  { gradient: 'from-emerald-500 to-green-600', label: 'Emerald' },
  { gradient: 'from-blue-500 to-cyan-600', label: 'Ocean' },
  { gradient: 'from-purple-500 to-pink-600', label: 'Sunset' },
  { gradient: 'from-orange-500 to-red-600', label: 'Fire' },
  { gradient: 'from-pink-500 to-rose-600', label: 'Rose' },
  { gradient: 'from-yellow-500 to-amber-600', label: 'Gold' },
  { gradient: 'from-teal-500 to-emerald-600', label: 'Teal' },
  { gradient: 'from-indigo-500 to-purple-600', label: 'Indigo' },
  { gradient: 'from-red-500 to-pink-600', label: 'Crimson' },
  { gradient: 'from-cyan-500 to-blue-600', label: 'Sky' },
  { gradient: 'from-lime-500 to-green-600', label: 'Lime' },
  { gradient: 'from-violet-500 to-indigo-600', label: 'Violet' },
];

interface User {
  username: string;
  email: string;
  avatar: number;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => string | null;
  register: (username: string, email: string, password: string, avatar: number) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = 'anibyte_users';
const SESSION_KEY = 'anibyte_session';

interface StoredUser {
  email: string;
  password: string;
  avatar: number;
  avatarUrl?: string;
}

function getUsers(): Record<string, StoredUser> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const users = getUsers();
    const devKey = 'benjamin.lovelace';
    if (!users[devKey]) {
      users[devKey] = { email: 'benjaminlovelace655@gmail.com', password: 'Benji2014!', avatar: 2, avatarUrl: '/dev-avatar.png' };
      saveUsers(users);
    }
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): string | null => {
    const users = getUsers();
    const record = users[username.toLowerCase()];
    if (!record) return 'User not found';
    if (record.password !== password) return 'Incorrect password';
    const u = { username: username, email: record.email, avatar: record.avatar ?? 0, avatarUrl: record.avatarUrl };
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    return null;
  }, []);

  const register = useCallback((username: string, email: string, password: string, avatar: number): string | null => {
    const users = getUsers();
    const key = username.toLowerCase();
    if (users[key]) return 'Username already taken';
    if (password.length < 4) return 'Password must be at least 4 characters';
    users[key] = { email, password, avatar };
    saveUsers(users);
    const u = { username, email, avatar };
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
