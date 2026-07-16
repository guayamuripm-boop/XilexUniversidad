'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass'
import { useAuthStore } from '@/lib/store'
import {
  Brain, Target, Trophy, BarChart2, Clock, ArrowRight, ChevronRight,
  TrendingUp, BookOpen, CheckCircle2, ArrowLeft, Filter, Download
} from 'lucide-react'
import { formatTime, cn, getMasteryColor } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface ProgressData {
  id: string
  user_id: string
  university_id: string
  area_id: string
  subtopic_id: string
  total_attempts: number
  correct_attempts: number
  incorrect_attempts: number
  accuracy_rate: number
  avg_time_seconds: number | null
  last_attempted_at: string | null
  mastery_level: 'novice' | 'learning' | 'proficient' | 'mastered'
  updated_at: string
  subtopic: {
    id: string
    name: string
    area: { id: string; name: string; code: string }
  }
  university: { id: string; name: string; code: string }
  area: { id: string; name: string; code: string }
}

export default function ProgressPage() {
  const { user } = useAuthStore()
  const [progress, setProgress] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)
  const [filterUni, setFilterUni] = useState<string>('all')
  const [filterArea, setFilterArea] = useState<string>('all')
  const [filterMastery, setFilterMastery] = useState<string>('all')

  const supabase = createClient()

  useEffect(() => {
    const loadProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('user_progress')
        .select(`
          *,
          subtopic:subtopics (id, name, area:areas (id, name, code)),
          university:universities (id, name, code),
          area:areas (id, name, code)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (data) setProgress(data)
      setLoading(false)
    }
    loadProgress()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') loadProgress()
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  const filteredProgress = progress.filter(p => {
    if (filterUni !== 'all' && p.university.code !== filterUni) return false
    if (filterArea !== 'all' && p.area.code !== filterArea) return false
    if (filterMastery !== 'all' && p.mastery_level !== filterMastery) return false
    return true
  })

  const getStats = () => {
    const total = progress.length
    const mastered = progress.filter(p => p.mastery_level === 'mastered').length
    const proficient = progress.filter(p => p.mastery_level === 'proficient').length
    const learning = progress.filter(p => p.mastery_level === 'learning').length
    const novice = progress.filter(p => p.mastery_level === 'novice').length
    const avgAccuracy = total > 0 ? progress.reduce((s, p) => s + p.accuracy_rate, 0) / total : 0
    return { total, mastered, proficient, learning, novice, avgAccuracy }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="p-8 max-w-md w-full text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold text-white mb-2">Inicia sesión para ver tu progreso</h1>
          <Link href="/auth/login" className="btn-primary inline-flex items-center gap-2">
            Iniciar sesión
            <ArrowRight className="w-4 h-4" />
          </Link>
        </GlassCard>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-2xl text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-graphite-300">Cargando progreso...</p>
        </div>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/progress" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
              </Link>
            </div>
            <Link href="/dashboard" className="btn-ghost">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Tu progreso por subtema</h1>
          <p className="text-graphite-500">Análisis detallado de tu desempeño en cada área</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <GlassCard className="p-5">
            <p className="text-sm text-graphite-500">Subtemas practicados</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-sm text-graphite-500">Dominados</p>
            <p className="text-3xl font-bold text-accent-emerald">{stats.mastered}</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-sm text-graphite-500">Competentes</p>
            <p className="text-3xl font-bold text-blue-400">{stats.proficient}</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-sm text-graphite-500">Aprendiendo</p>
            <p className="text-3xl font-bold text-accent-amber">{stats.learning}</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-sm text-graphite-500">Principiantes</p>
            <p className="text-3xl font-bold text-graphite-500">{stats.novice}</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-sm text-graphite-500">Precisión promedio</p>
            <p className="text-3xl font-bold text-primary">{stats.avgAccuracy.toFixed(1)}%</p>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard className="p-5 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-graphite-400" />
              <select
                value={filterUni}
                onChange={(e) => setFilterUni(e.target.value)}
                className="px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Todas las universidades</option>
                <option value="simadi">SIMADI (UCV)</option>
                <option value="unimet">UNIMET</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Todas las áreas</option>
                <option value="logico">Razonamiento Lógico</option>
                <option value="verbal">Razonamiento Verbal</option>
                <option value="cuantitativo">Aptitud Cuantitativa</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterMastery}
                onChange={(e) => setFilterMastery(e.target.value)}
                className="px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Todos los niveles</option>
                <option value="mastered">Dominado</option>
                <option value="proficient">Competente</option>
                <option value="learning">Aprendiendo</option>
                <option value="novice">Principiante</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Progress Table */}
        <GlassCard className="overflow-hidden">
          {filteredProgress.length === 0 ? (
            <div className="p-12 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-graphite-400" />
              <p className="text-graphite-500 text-lg">
                {progress.length === 0
                  ? 'Aún no has practicado ningún subtema'
                  : 'No hay subtemas con los filtros seleccionados'}
              </p>
              <Link href="/practice" className="btn-primary inline-flex items-center gap-2 mt-4">
                <Brain className="w-4 h-4" />
                Empezar a practicar
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-500 uppercase tracking-wider">Subtema</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-500 uppercase tracking-wider">Universidad / Área</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-graphite-500 uppercase tracking-wider">Intentos</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-graphite-500 uppercase tracking-wider">Precisión</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-graphite-500 uppercase tracking-wider">Nivel</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-graphite-500 uppercase tracking-wider">Última práctica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.08]">
                  {filteredProgress.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.04]">
                      <td className="px-4 py-4">
                        <p className="font-medium text-white">{p.subtopic.name}</p>
                        <p className="text-xs text-graphite-500">{p.area.name}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                          {p.university.name}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-white">{p.total_attempts}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="w-24 mx-auto">
                          <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${p.accuracy_rate}%` }}
                            />
                          </div>
                          <p className="text-xs text-graphite-500 mt-1">{p.accuracy_rate.toFixed(1)}%</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getMasteryColor(p.mastery_level))}>
                          {p.mastery_level}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-graphite-500">
                        {p.last_attempted_at
                          ? new Date(p.last_attempted_at).toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  )
}
