import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/** Routes that require a session. Everything else is public. */
const PROTECTED_PREFIXES = ['/dashboard', '/practice', '/progress', '/settings', '/simulacrum', '/simulacrums']

/** Auth pages a signed-in user should not see. */
const AUTH_ONLY_PREFIXES = ['/auth/login', '/auth/register']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refreshes the session cookie; must run before any redirect decision.
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname, search } = request.nextUrl

  if (!user && PROTECTED_PREFIXES.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.search = `?redirect=${encodeURIComponent(pathname + search)}`
    return NextResponse.redirect(url)
  }

  if (user && AUTH_ONLY_PREFIXES.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    // Everything except static assets and the auth callback (which sets its own
    // cookies and must not be intercepted).
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
