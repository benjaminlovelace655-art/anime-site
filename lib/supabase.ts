let _supabase: ReturnType<typeof import('@supabase/supabase-js').createClient> | null = null;

export function getSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!_supabase) {
    const { createClient } = require('@supabase/supabase-js');
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}
