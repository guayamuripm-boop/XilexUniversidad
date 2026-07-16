'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { GlassCard, GlassButton } from '@/components/ui/glass'
import { Mail, ArrowLeft, Lock, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Si el email existe, recibirás un enlace para restablecer tu contraseña.' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/auth/login" className="inline-flex items-center gap-2 mb-6 text-blue-200/60 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver al login
        </Link>

        <GlassCard className="p-8 rounded-3xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Restablecer contraseña</h1>
            <p className="text-blue-200/60">
              Ingresa tu email y te enviaremos un enlace para crear una nueva contraseña
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/40" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-blue-300/40"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <GlassButton type="submit" disabled={loading} className="w-full rounded-2xl" size="lg">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Enviar enlace de restablecimiento
                </>
              )}
            </GlassButton>
          </form>

          <p className="mt-6 text-center text-sm text-blue-300/40">
            ¿Recordaste tu contraseña?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Iniciar sesión
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  )
}
