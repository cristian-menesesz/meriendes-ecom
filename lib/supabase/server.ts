import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for Server Components and Server Actions.
 * Uses Next.js cookies() for session management with proper SSR support.
 *
 * Docs: https://supabase.com/docs/guides/auth/server-side/nextjs
 *
 * @returns {SupabaseClient} A configured Supabase client for server-side use.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from Server Component which doesn't allow cookie mutation
            // This is expected in some scenarios and can be safely ignored
          }
        },
      },
    }
  );
}

/**
 * Creates a Supabase client with service role privileges.
 * BYPASSES ROW LEVEL SECURITY - Use with extreme caution!
 *
 * Use cases:
 * - Guest checkout (creating orders without authenticated user)
 * - Admin operations (order fulfillment, inventory management)
 * - Webhook handlers (Stripe webhook processing)
 * - Background jobs (cleanup, notifications)
 *
 * ⚠️ WARNING: This client has full database access. Never expose to client-side.
 * Always validate and sanitize data before using this client.
 *
 * @returns {SupabaseClient} A Supabase client with service role privileges
 */
export function createServiceClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
