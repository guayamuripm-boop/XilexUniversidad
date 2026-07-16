'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { GlassCard, GlassButton } from '@/components/ui/glass'
import { useAuthStore } from '@/lib/store'
import { Brain, Mail, Shield, Bell, Moon, Save, Loader2, CheckCircle2, AlertCircle, User, Target, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const universities = [
  { code: 'simadi', name: 'SIMADI (UCV)' },
  { code: 'unimet', name: 'UNIMET' },
  { code: 'usb', name: 'USB (próximamente)' },
  { code: 'ucab', name: 'UCAB (próximamente)' },
]

export default function SettingsPage() {
  const { user, setUser, clearUser } = useAuthStore()
  const [fullName, setFullName] = useState('')
  const [targetUnis, setTargetUnis] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '')
      setTargetUnis(user.target_universities || [])
    }
    const dm = localStorage.getItem('darkMode')
    if (dm === 'true' || (dm === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [user])

  const handleToggleUni = (code: string) => {
    setTargetUnis(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code])
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ full_name: fullName, target_universities: targetUnis })
        .eq('id', user.id)
      if (error) throw error

      // Update local auth store
      setUser({ ...user, full_name: fullName, target_universities: targetUnis })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      console.error('Error guardando:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDarkMode = () => {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('darkMode', String(next))
    if (next) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    clearUser()
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">XILEX</span>
            </Link>
            <span className="text-sm text-graphite-500">Configuración</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Configuración de <span className="text-primary">cuenta</span>
          </h1>
          <p className="text-graphite-500">Gestiona tu perfil, preferencias y universidades objetivo</p>
        </div>

        {/* Profile */}
        <GlassCard className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Perfil
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-graphite-300 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-graphite-500 cursor-not-allowed"
              />
            </div>
            <GlassButton onClick={handleSaveProfile} disabled={saving} className="w-full sm:w-auto" size="lg">
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar cambios
                </>
              )}
            </GlassButton>
            {saved && <p className="mt-3 text-sm text-accent-emerald flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Perfil actualizado</p>}
          </div>
        </GlassCard>

        {/* Target Universities */}
        <GlassCard className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Universidades objetivo
          </h2>
          <p className="text-sm text-graphite-500 mb-4">
            Selecciona las universidades para las que te preparas. Esto personaliza tu dashboard y sugerencias.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {universities.map(uni => (
              <label
                key={uni.code}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer',
                  targetUnis.includes(uni.code)
                    ? 'border-primary bg-primary/5'
                    : 'border-white/[0.08] hover:border-primary/50'
                )}
              >
                <input
                  type="checkbox"
                  checked={targetUnis.includes(uni.code)}
                  onChange={() => handleToggleUni(uni.code)}
                  className="w-5 h-5 text-primary border-primary rounded focus:ring-primary/50"
                />
                <span className="font-medium text-white">{uni.name}</span>
              </label>
            ))}
          </div>
        </GlassCard>

        {/* Appearance */}
        <GlassCard className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" />
            Apariencia
          </h2>
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.08]">
            <div>
              <p className="font-medium text-white">Modo oscuro</p>
              <p className="text-sm text-graphite-500">Cambia entre tema claro y oscuro</p>
            </div>
            <button
              onClick={handleDarkMode}
              className={cn(
                'relative w-12 h-7 rounded-full transition-colors',
                darkMode ? 'bg-primary' : 'bg-graphite-500'
              )}
            >
              <div
                className={cn(
                  'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform',
                  darkMode ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </button>
          </div>
        </GlassCard>

        {/* Danger Zone */}
        <GlassCard className="p-6 border border-red-500/20">
          <h2 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Zona de peligro
          </h2>
          <p className="text-sm text-graphite-500 mb-4">
            Estas acciones son irreversibles. Ten cuidado.
          </p>
          <GlassButton
            variant="ghost"
            onClick={handleSignOut}
            className="w-full sm:w-auto border-red-500/20 text-red-400 hover:bg-red-500/10"
            size="lg"
          >
            Cerrar sesión
          </GlassButton>
        </GlassCard>
      </main>
    </div>
  )
}
