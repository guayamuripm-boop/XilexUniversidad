'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { GlassCard, GlassButton } from '@/components/ui/glass'
import {
  Brain,
  ChevronRight,
  Play,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  ArrowRight,
  Calendar,
  Activity,
} from 'lucide-react'
import { formatTime, cn, getMasteryColor } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface Simulacrum {
  id: string
  name: string
  type: string
  status: string
  score: number | null
  correct_count: number | null
  incorrect_count: number | null
  unanswered_count: number | null
  total_questions: number
  time_limit_minutes: number
  created_at: string
  completed_at: string | null
}

export default function SimulacrumsPage() {
  const [simulacrums, setSimulacrums] = useState<Simulacrum[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress' | 'draft'>('all')

  const supabase = createClient()

  useEffect(() => {
    const loadSimulacrums = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: sims } = await supabase
        .from('simulacrums')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (sims) setSimulacrums(sims)
      setLoading(false)
    }

    loadSimulacrums()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadSimulacrums()
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const filteredSimulacrums = simulacrums.filter((s) => {
    if (filter === 'all') return true
    if (filter === 'completed') return s.status === 'completed'
    if (filter === 'in_progress') return s.status === 'in_progress'
    if (filter === 'draft') return s.status === 'draft'
    return true
  })

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completado',
          color: 'bg-accent-emerald/10 text-accent-emerald',
          icon: CheckCircle2,
        }
      case 'in_progress':
        return {
          label: 'En progreso',
          color: 'bg-accent-amber/10 text-accent-amber',
          icon: Play,
        }
      case 'draft':
        return {
          label: 'Borrador',
          color: 'bg-white/[0.04] text-blue-200',
          icon: Clock,
        }
      default:
        return {
          label: status,
          color: 'bg-white/[0.04] text-blue-200',
          icon: Clock,
        }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-3xl text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-200">Cargando simulacros...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">XILEX</span>
              </Link>
            </div>
            <Link href="/practice" className="btn-primary hidden sm:inline-flex items-center gap-2">
              <Play className="w-4 h-4" />
              Nuevo simulacro
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Mis <span className="text-primary">simulacros</span>
              </h1>
              <p className="text-blue-200 mt-1">
                Historial completo de tus pr&aacute;cticas
              </p>
            </div>
            <Link href="/practice" className="btn-primary">
              <Play className="w-4 h-4" />
              Nuevo simulacro
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {['all', 'completed', 'in_progress', 'draft'].map((f) => {
              const info = getStatusInfo(f === 'all' ? 'completed' : f)
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={cn(
                    'px-4 py-2 rounded-2xl text-sm font-medium transition-colors flex items-center gap-2',
                    filter === f
                      ? 'bg-primary text-white'
                      : 'bg-white/[0.04] border border-white/[0.08] hover:border-primary/50'
                  )}
                >
                  <info.icon className="w-4 h-4" />
                  {f === 'all' ? 'Todos' : f === 'completed' ? 'Completados' : f === 'in_progress' ? 'En progreso' : 'Borradores'}
                </button>
              )
            })}
          </div>
        </div>

        {filteredSimulacrums.length === 0 ? (
          <div className="text-center py-16">
            <GlassCard className="p-12 max-w-md mx-auto rounded-3xl">
              <Brain className="w-20 h-20 mx-auto mb-6 text-blue-200/60" />
              <h2 className="text-xl font-semibold text-white mb-3">
                {simulacrums.length === 0 ? 'No has creado simulacros a\u00fan' : 'No hay simulacros con este filtro'}
              </h2>
              <p className="text-blue-300/40 mb-6">
                {simulacrums.length === 0
                  ? 'Crea tu primer simulacro para empezar a practicar y ver tu progreso aqu\u00ed.'
                  : 'Prueba con otro filtro o crea un nuevo simulacro.'}
              </p>
              <Link href="/practice" className="btn-primary inline-flex items-center gap-2">
                <Play className="w-4 h-4" />
                {simulacrums.length === 0 ? 'Crear mi primer simulacro' : 'Nuevo simulacro'}
              </Link>
            </GlassCard>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSimulacrums.map((sim) => {
              const info = getStatusInfo(sim.status)
              const StatusIcon = info.icon
              const isCompleted = sim.status === 'completed'
              const isInProgress = sim.status === 'in_progress'

              return (
                <Link
                  key={sim.id}
                  href={`/simulacrum/${sim.id}`}
                  className="glass card-hover p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', info.color)}>
                      <StatusIcon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate">{sim.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-blue-300/40 mt-1">
                        <span className="flex items-center gap-1">
                          <Brain className="w-3.5 h-3.5" />
                          {sim.total_questions} preguntas
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {sim.time_limit_minutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(sim.created_at).toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:flex-shrink-0">
                    <span className={cn('px-3 py-1.5 rounded-full text-xs font-medium', info.color)}>
                      {info.label}
                    </span>

                    {isCompleted && sim.score !== null && (
                      <div className="text-right">
                        <p className={cn('text-lg font-bold', sim.score! >= 70 ? 'text-accent-emerald' : sim.score! >= 50 ? 'text-accent-amber' : 'text-red-400')}>
                          {sim.score!.toFixed(1)}%
                        </p>
                        <p className="text-xs text-blue-300/40">
                          {sim.correct_count}✓ {sim.incorrect_count}✗ {sim.unanswered_count}○
                        </p>
                      </div>
                    )}

                    <ArrowRight className="w-5 h-5 text-blue-200/60" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
