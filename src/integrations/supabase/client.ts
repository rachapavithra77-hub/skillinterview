import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'] as string | undefined;
const supabaseKey = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as string | undefined;

/** True when the public Supabase credentials are configured via environment variables. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

/**
 * Browser Supabase client. Uses the PUBLIC (publishable/anon) key only —
 * never a service-role/secret key. Returns null when env vars are missing so
 * the rest of the app keeps working.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
