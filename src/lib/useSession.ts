'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore, type AuthUser } from '@/lib/store'

export type SessionStatus = 'loading' | 'authenticated' | 'anonymous'

/**
 * Resolves the Supabase session once per page and mirrors the profile row into
 * the auth store.
 *
 * The store alone cannot be trusted as the source of truth: it is persisted in
 * localStorage and used to be populated only by the SIGNED_IN event, so a user
 * returning with a valid cookie session (which emits INITIAL_SESSION, not
 * SIGNED_IN) looked logged out.
 *
 * @param redirectTo path to send anonymous visitors to; omit to render an
 *                   anonymous state instead of redirecting.
 */
export function useSession(redirectTo?: string) {
  const router = useRouter()
  const { user, setUser, setTargetUniversities, clearUser } = useAuthStore()
  const [status, setStatus] = useState<SessionStatus>('loading')

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    const syncProfile = async (authUser: { id: string; email?: string; user_metadata?: any }) => {
      const { data: profile } = await supabase
        .from('users')
        .select('full_name, target_universities, target_clusters')
        .eq('id', authUser.id)
        .maybeSingle()

      if (cancelled) return

      const next: AuthUser = {
        id: authUser.id,
        email: authUser.email ?? '',
        full_name: profile?.full_name ?? authUser.user_metadata?.full_name ?? null,
        target_universities: profile?.target_universities ?? [],
        target_clusters: profile?.target_clusters ?? [],
      }
      setUser(next)
      setTargetUniversities(next.target_universities)
      setStatus('authenticated')
    }

    const resolve = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (cancelled) return

      if (!authUser) {
        clearUser()
        setStatus('anonymous')
        if (redirectTo) router.replace(redirectTo)
        return
      }
      await syncProfile(authUser)
    }

    resolve()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return
      if (event === 'SIGNED_OUT') {
        clearUser()
        setStatus('anonymous')
        if (redirectTo) router.replace(redirectTo)
      } else if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        syncProfile(session.user)
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
    // `redirectTo` is a constant per page; store setters are stable zustand refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectTo])

  return { user, status, isLoading: status === 'loading' }
}
