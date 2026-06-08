import { getSupabase } from './supabase';

export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

interface UserRow extends User {
  password_hash: string;
}

export async function createUser(email: string, username: string, passwordHash: string): Promise<User | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await (supabase.from('users') as any)
    .insert({ email, username, password_hash: passwordHash })
    .select('id, email, username, created_at')
    .single();
  if (error) return null;
  return data as User | null;
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await (supabase.from('users') as any)
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single();
  return data as UserRow | null;
}

export async function getUserByUsername(username: string): Promise<UserRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await (supabase.from('users') as any)
    .select('*')
    .eq('username', username.trim())
    .single();
  return data as UserRow | null;
}

export async function getUserById(id: string): Promise<User | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await (supabase.from('users') as any)
    .select('id, email, username, created_at')
    .eq('id', id)
    .single();
  return data as User | null;
}
