import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types";

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

  return createServerClient<Database>(
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
