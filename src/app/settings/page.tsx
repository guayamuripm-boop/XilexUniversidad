'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { GlassCard, GlassButton, GlassInput } from '@/components/ui/glass'
import { useAuthStore, useUIStore } from '@/lib/store'
import {
  Brain, Save, CheckCircle2, Target, Moon, Download, Shield, Bell,
  AlertCircle, LogOut, Trash2, Lock, Sun, Monitor, ArrowRight,
  User, Eye, EyeOff, Key, GraduationCap, HeartPulse, FlaskConical, Briefcase, BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const universities = [
  { code: 'simadi', name: 'SIMADI (UCV)' },
  { code: 'unimet', name: 'UNIMET' },
  { code: 'usb', name: 'USB' },
  { code: 'ucab', name: 'UCAB' },
]

const simadiClusters = [
  { code: 'salud', name: 'Salud', careers: ['Medicina', 'Enfermería', 'Bioanálisis', 'Odontología', 'Farmacia'] },
  { code: 'agro_mar', name: 'Agro y Mar', careers: ['Agronomía', 'Veterinaria', 'Ingeniería Pesquera', 'Acuicultura'] },
  { code: 'ciencia_tecnologia', name: 'Ciencia y Tecnología', careers: ['Ingenierías', 'Física', 'Química', 'Matemáticas', 'Computación'] },
  { code: 'sociales_humanidades', name: 'Ciencias Sociales / Humanidades / Educación', careers: ['Derecho', 'Administración', 'Psicología', 'Educación', 'Comunicación Social', 'Sociología'] },
]

export default function SettingsPage() {
  const { user, setUser, clearUser } = useAuthStore()
  const { theme, setTheme } = useUIStore()

  const [fullName, setFullName] = useState('')
  const [targetUnis, setTargetUnis] = useState<string[]>([])
  const [targetClusters, setTargetClusters] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '')
      setTargetUnis(user.target_universities || [])
      setTargetClusters(user.target_clusters || [])
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
        .update({ 
          full_name: fullName, 
          target_universities: targetUnis,
          target_clusters: targetClusters
        })
        .eq('id', user.id)
      if (error) throw error

      setUser({ ...user, full_name: fullName, target_universities: targetUnis, target_clusters: targetClusters })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      console.error('Error guardando:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    clearUser()
  }

  const handleThemeChange = (t: 'light' | 'dark' | 'system') => {
    setTheme(t)
    if (t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleExportData = async () => {
    if (!user) return
    try {
      const [progressRes, simsRes] = await Promise.all([
        supabase.from('user_progress').select('*').eq('user_id', user.id),
        supabase.from('simulacrums').select('*').eq('user_id', user.id),
      ])

      const simIds = simsRes.data?.map(s => s.id) || []
      const simQuestionsRes = await supabase
        .from('simulacrum_questions')
        .select('*, question:questions(*)')
        .in('simulacrum_id', simIds)

      const exportData = {
        user: { id: user.id, email: user.email, full_name: user.full_name, target_universities: user.target_universities },
        progress: progressRes?.data || [],
        simulacrums: simsRes?.data || [],
        simulacrumQuestions: simQuestionsRes?.data || [],
        exportedAt: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `xilex-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error exportando:', err)
      alert('Error al exportar datos')
    }
  }

  const handleDeleteAccount = async () => {
    if (!currentPassword || !user) return
    setDeleting(true)
    try {
      // Verify password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })
      if (signInError) throw signInError

      // Delete user data (cascades should handle related tables)
      await supabase.auth.admin.deleteUser(user.id)
      clearUser()
    } catch (err: any) {
      console.error('Error eliminando cuenta:', err)
      alert(err.message || 'Error al eliminar la cuenta. Verifica tu contraseña.')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
      setCurrentPassword('')
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">XILEX</span>
            </Link>
            <span className="text-sm text-blue-300/40">Configuración</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Configuración de <span className="text-primary">cuenta</span>
          </h1>
          <p className="text-blue-300/40">Gestiona tu perfil, preferencias y universidades objetivo</p>
        </div>

        {/* Perfil */}
        <GlassCard className="p-6 rounded-3xl">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Perfil
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Nombre completo</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-blue-300/40"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-blue-300/40 cursor-not-allowed"
              />
            </div>
            <GlassButton onClick={handleSaveProfile} disabled={saving} className="w-full sm:w-auto rounded-2xl" size="lg">
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
            {saved && <p className="mt-3 text-sm text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Perfil actualizado</p>}
          </div>
        </GlassCard>

        {/* Universidades objetivo */}
        <GlassCard className="p-6 rounded-3xl">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Universidades objetivo
          </h2>
          <p className="text-sm text-blue-300/40 mb-4">
            Selecciona las universidades para las que te preparas. Esto personaliza tu dashboard y sugerencias.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {universities.map(uni => (
              <label
                key={uni.code}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer',
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
                <span className="text-white">{uni.name}</span>
              </label>
            ))}
          </div>
        </GlassCard>

        {/* Especialización SIMADI */}
        <GlassCard className="p-6 rounded-3xl">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Especialización SIMADI
          </h2>
          <p className="text-sm text-blue-300/40 mb-4">
            Selecciona tu área de especialización para filtrar preguntas en Práctica y Simulacros SIMADI
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {simadiClusters.map((cluster) => {
              const iconMap: Record<string, any> = {
                salud: HeartPulse,
                agro_mar: BookOpen,
                ciencia_tecnologia: FlaskConical,
                sociales_humanidades: Briefcase,
              }
              const Icon = iconMap[cluster.code] || GraduationCap
              return (
                <button
                  key={cluster.code}
                  onClick={() => setTargetClusters(prev => prev.includes(cluster.code)
                    ? prev.filter(c => c !== cluster.code)
                    : [...prev, cluster.code])}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    targetClusters.includes(cluster.code)
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                      : 'border-white/[0.08] hover:border-primary/50 bg-white/[0.02]'
                  }`}
                >
                  <Icon className="w-6 h-6 text-primary" />
                  <p className="font-medium text-white text-sm text-center">{cluster.name}</p>
                  <p className="text-xs text-gray-400 text-center">{cluster.careers.slice(0, 2).join(', ')}...</p>
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-blue-300/50 text-center">
            Selecciona tu cluster según la carrera que quieres estudiar
          </p>
        </GlassCard>

        {/* Apariencia */}
        <GlassCard className="p-6 rounded-3xl">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary" />
            Apariencia
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {(['dark', 'light', 'system'] as const).map(t => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all',
                  theme === t
                    ? 'border-primary bg-primary/10'
                    : 'border-white/[0.08] hover:border-primary/30'
                )}
              >
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  t === 'dark' && 'bg-slate-900',
                  t === 'light' && 'bg-slate-100',
                  t === 'system' && 'bg-gradient-to-br from-slate-100 to-slate-900'
                )}>
                  {t === 'dark' && <Moon className="w-6 h-6 text-amber-400" />}
                  {t === 'light' && <Sun className="w-6 h-6 text-blue-400" />}
                  {t === 'system' && <Monitor className="w-6 h-6 text-primary" />}
                </div>
                <span className={cn('text-sm font-medium', theme === t ? 'text-primary' : 'text-blue-300/50')}>
                  {t === 'dark' && 'Oscuro'}
                  {t === 'light' && 'Claro'}
                  {t === 'system' && 'Sistema'}
                </span>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Exportar datos */}
        <GlassCard className="p-6 rounded-3xl">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Datos
          </h2>
          <p className="text-sm text-blue-300/40 mb-4">
            Exporta todos tus datos de progreso, simulacros y respuestas en formato JSON.
          </p>
          <GlassButton
            variant="secondary"
            onClick={handleExportData}
            className="w-full sm:w-auto rounded-2xl"
            size="lg"
          >
            <Download className="w-5 h-5" />
            Exportar mis datos
          </GlassButton>
        </GlassCard>

        {/* Zona de peligro */}
        <GlassCard className="p-6 rounded-3xl border border-red-500/20">
          <h2 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Zona de peligro
          </h2>
          <p className="text-sm text-blue-300/40 mb-4">
            Estas acciones son irreversibles. Ten cuidado.
          </p>

          <div className="space-y-3">
            <GlassButton
              variant="ghost"
              onClick={handleSignOut}
              className="w-full sm:w-auto rounded-2xl border-blue-500/20 text-blue-300 hover:bg-blue-500/10"
              size="lg"
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </GlassButton>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="w-5 h-5" />
              Eliminar cuenta permanentemente
            </button>
          </div>

          {/* Delete confirmation modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <GlassCard className="p-6 rounded-3xl max-w-md w-full border-red-500/30" hover={false}>
                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Eliminar cuenta</h3>
                <p className="text-sm text-blue-300/50 text-center mb-6">
                  Esta acción eliminará permanentemente tu cuenta, todo tu progreso, simulacros y datos. No se puede deshacer.
                </p>
                <GlassInput
                  label="Escribe tu contraseña actual para confirmar"
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  togglePassword
                  showPassword={showCurrentPass}
                  onTogglePassword={() => setShowCurrentPass(!showCurrentPass)}
                />
                <div className="flex gap-3 mt-4">
                  <GlassButton
                    variant="ghost"
                    onClick={() => { setShowDeleteConfirm(false); setCurrentPassword('') }}
                    className="flex-1 rounded-2xl"
                    size="lg"
                  >
                    Cancelar
                  </GlassButton>
                  <GlassButton
                    onClick={handleDeleteAccount}
                    disabled={deleting || !currentPassword}
                    className="flex-1 rounded-2xl border-red-500/20 text-red-400 hover:bg-red-500/10"
                    size="lg"
                  >
                    {deleting ? 'Eliminando...' : 'Eliminar cuenta'}
                  </GlassButton>
                </div>
              </GlassCard>
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  )
}