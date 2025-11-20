import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types';

/**
 * Creates a Supabase client for Client Components.
 * Uses browser cookies for session management.
 *
 * Docs: https://supabase.com/docs/guides/auth/server-side/nextjs
 *
 * @returns {SupabaseClient} A configured Supabase client for client-side use.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
