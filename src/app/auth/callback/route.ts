import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Exchanges the OAuth / email-confirmation code for a session.
 *
 * The session cookies must be written onto the response that is actually
 * returned. A previous version called `NextResponse.next().cookies.set(...)`,
 * which mutates a throwaway response, so every sign-in through this route
 * silently produced no session and bounced the user back to the login page.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error_description') ?? searchParams.get('error')

  // Only same-origin relative paths, so `?redirect=` cannot be abused as an
  // open redirect to an attacker-controlled host.
  const requested = searchParams.get('redirect') ?? '/dashboard'
  const redirect = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/dashboard'

  if (error) {
    return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error)}`, origin))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=missing_code', origin))
  }

  const response = NextResponse.redirect(new URL(redirect, origin))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, origin)
    )
  }

  return response
}
