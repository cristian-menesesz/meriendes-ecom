import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types';

/**
 * Creates a Supabase client for Middleware.
 * Uses Next.js request/response for cookie handling in middleware context.
 *
 * Docs: https://supabase.com/docs/guides/auth/server-side/nextjs
 *
 * @param {NextRequest} request - The Next.js request object.
 * @returns {Object} Supabase client and updated response object.
 */
export function createClient(request: NextRequest) {
  // Create an unmodified response
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  return { supabase, response };
}
