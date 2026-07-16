'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GlassCard, GlassButton, GlassInput } from '@/components/ui/glass'
import { useAuthStore } from '@/lib/store'
import { Brain, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const { setUser, setTargetUniversities } = useAuthStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        if (!data.user.email_confirmed_at) {
          setError('Confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada (y spam).')
          return
        }
        setUser({
          id: data.user.id,
          email: data.user.email!,
          full_name: data.user.user_metadata.full_name || null,
          target_universities: [],
        })

        const { data: profile } = await supabase
          .from('users')
          .select('target_universities')
          .eq('id', data.user.id)
          .single()

        if (profile) {
          setTargetUniversities(profile.target_universities || [])
        }

        setSuccess('¡Bienvenido! Redirigiendo...')
        setTimeout(() => router.push(redirect), 1000)
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    })
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">XILEX</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Iniciar sesión</h1>
          <p className="text-blue-200/60 mt-2">
            Accede a tu práctica personalizada para SIMADI, UNIMET y más
          </p>
        </div>

        <GlassCard className="p-6 sm:p-8 rounded-3xl">
          {success && (
            <div className="mb-6 flex items-center gap-2 text-accent-emerald bg-accent-emerald/10 p-3 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-2xl">
              <span className="w-5 h-5 flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <GlassInput
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              icon={<Mail className="w-5 h-5" />}
              required
              autoComplete="email"
              disabled={loading}
            />

            <GlassInput
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              required
              autoComplete="current-password"
              disabled={loading}
              error={error}
              togglePassword
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/[0.08] text-primary focus:ring-primary/50"
                />
                <span className="text-sm text-blue-200/60">Recordarme</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <GlassButton type="submit" className="w-full rounded-2xl" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </GlassButton>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-deep-925/80 backdrop-blur-sm text-blue-300/40">
                O continuar con
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <GlassButton
              variant="outline"
              onClick={() => handleOAuth('google')}
              disabled={loading}
              className="w-full rounded-2xl"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </GlassButton>

            <GlassButton
              variant="outline"
              onClick={() => handleOAuth('github')}
              disabled={loading}
              className="w-full rounded-2xl"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </GlassButton>
          </div>

          <p className="mt-6 text-center text-sm text-blue-200/60">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/register" className="text-primary font-medium hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </GlassCard>

        <p className="mt-6 text-center text-xs text-blue-300/40">
          Al continuar, aceptas nuestros{' '}
          <Link href="/terms" className="underline hover:text-primary">Términos</Link>{' '}
          y{' '}
          <Link href="/privacy" className="underline hover:text-primary">Política de privacidad</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
