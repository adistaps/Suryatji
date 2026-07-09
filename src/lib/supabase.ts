import { createClient } from '@supabase/supabase-js';

// Try NEXT_PUBLIC_ prefixed vars first (from Supabase integration), then fall back to VITE_ vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diisi di file .env. ' +
    'Lihat .env.example untuk referensi.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
