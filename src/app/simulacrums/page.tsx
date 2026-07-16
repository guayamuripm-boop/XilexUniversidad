'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  Filter,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { formatTime, cn, getMasteryColor } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface Simulacrum {
  id: string
  name: string
  type: string
  status: 'draft' | 'in_progress' | 'completed' | 'abandoned'
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
  const router = useRouter()
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
    return s.status === filter
  })

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Completado', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 }
      case 'in_progress':
        return { label: 'En progreso', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Play }
      case 'draft':
        return { label: 'Borrador', color: 'bg-white/[0.04] text-blue-300/50 border-white/[0.08]', icon: Clock }
      default:
        return { label: status, color: 'bg-white/[0.04] text-blue-300/50 border-white/[0.08]', icon: Clock }
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) return 'Hoy'
    if (d.toDateString() === yesterday.toDateString()) return 'Ayer'
    return d.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const handleContinue = (sim: Simulacrum, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/simulacrum/${sim.id}`)
  }

  const handleReview = (sim: Simulacrum, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/simulacrum/${sim.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass p-8 rounded-3xl text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-200/60">Cargando simulacros...</p>
        </div>
      </div>
    )
  }

  const stats = {
    total: simulacrums.length,
    completed: simulacrums.filter(s => s.status === 'completed').length,
    inProgress: simulacrums.filter(s => s.status === 'in_progress').length,
    avgScore: simulacrums.filter(s => s.status === 'completed' && s.score !== null).reduce((acc, s, _, arr) => acc + (s.score || 0) / arr.length, 0),
  }

  return (
    <div className="min-h-screen pb-8">
      <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
        <div className="px-4 h-14 flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
          </Link>
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Header con stats */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Mis <span className="text-primary">simulacros</span></h1>
              <p className="text-sm text-blue-300/50 mt-0.5">Historial completo de tus prácticas</p>
            </div>
            <Link href="/practice" className="btn-primary text-sm">
              <Play className="w-4 h-4" />
              Nuevo
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <GlassCard className="p-3 text-center rounded-2xl" hover={false}>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-[10px] text-blue-300/50 uppercase tracking-wide">Total</p>
            </GlassCard>
            <GlassCard className="p-3 text-center rounded-2xl" hover={false}>
              <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
              <p className="text-[10px] text-blue-300/50 uppercase tracking-wide">Completados</p>
            </GlassCard>
            <GlassCard className="p-3 text-center rounded-2xl" hover={false}>
              <p className="text-2xl font-bold text-amber-400">{stats.inProgress}</p>
              <p className="text-[10px] text-blue-300/50 uppercase tracking-wide">En curso</p>
            </GlassCard>
            <GlassCard className="p-3 text-center rounded-2xl" hover={false}>
              <p className="text-2xl font-bold text-primary">{stats.avgScore > 0 ? stats.avgScore.toFixed(0) : '—'}%</p>
              <p className="text-[10px] text-blue-300/50 uppercase tracking-wide">Promedio</p>
            </GlassCard>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(['all', 'completed', 'in_progress', 'draft'] as const).map((f) => {
              const info = getStatusInfo(f === 'all' ? 'completed' : f)
              const Icon = info.icon
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1.5',
                    filter === f
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'bg-white/[0.04] text-blue-300/50 border border-white/[0.06] hover:bg-white/[0.06]'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {f === 'all' ? 'Todos' : f === 'completed' ? 'Completados' : f === 'in_progress' ? 'En curso' : 'Borradores'}
                </button>
              )
            })}
          </div>
        </div>

        {/* Lista de simulacros */}
        {filteredSimulacrums.length === 0 ? (
          <div className="text-center py-12">
            <GlassCard className="p-8 max-w-sm mx-auto rounded-3xl" hover={false}>
              <Brain className="w-16 h-16 mx-auto mb-4 text-blue-300/40" />
              <h2 className="text-lg font-semibold text-white mb-2">
                {simulacrums.length === 0 ? 'No has creado simulacros aún' : 'No hay simulacros con este filtro'}
              </h2>
              <p className="text-sm text-blue-300/40 mb-6">
                {simulacrums.length === 0
                  ? 'Crea tu primer simulacro para empezar a practicar y ver tu progreso aquí.'
                  : 'Prueba con otro filtro o crea un nuevo simulacro.'}
              </p>
              <Link href="/practice" className="btn-primary inline-flex items-center gap-2 w-full justify-center">
                <Play className="w-4 h-4" />
                {simulacrums.length === 0 ? 'Crear mi primer simulacro' : 'Nuevo simulacro'}
              </Link>
            </GlassCard>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSimulacrums.map((sim) => {
              const info = getStatusInfo(sim.status)
              const StatusIcon = info.icon
              const isCompleted = sim.status === 'completed'
              const isInProgress = sim.status === 'in_progress'

              return (
                <GlassCard
                  key={sim.id}
                  className={cn(
                    'p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3',
                    isInProgress ? 'border-l-4 border-amber-500/50' : '',
                    isCompleted ? 'border-l-4 border-emerald-500/50' : ''
                  )}
                  hover={!isInProgress}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', info.color.replace('border-', ''))}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate">{sim.name}</h3>
                      <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-blue-300/50 mt-1">
                        <span className="flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          {sim.total_questions} preg.
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {sim.time_limit_minutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(sim.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-shrink-0 w-full sm:w-auto justify-end">
                    <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-medium', info.color)}>
                      {info.label}
                    </span>

                    {isCompleted && sim.score !== null && (
                      <div className="text-right hidden sm:block">
                        <p className={cn('text-lg font-bold', sim.score! >= 70 ? 'text-emerald-400' : sim.score! >= 50 ? 'text-amber-400' : 'text-red-400')}>
                          {sim.score!.toFixed(1)}%
                        </p>
                        <p className="text-[10px] text-blue-300/50">
                          {sim.correct_count}✓ {sim.incorrect_count}✗ {sim.unanswered_count}○
                        </p>
                      </div>
                    )}

                    {isInProgress ? (
                      <GlassButton
                        size="sm"
                        onClick={(e) => handleContinue(sim, e)}
                        className="!px-4"
                      >
                        Continuar <ArrowRight className="w-3.5 h-3.5" />
                      </GlassButton>
                    ) : isCompleted ? (
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleReview(sim, e)}
                        className="!px-3"
                      >
                        Ver revisión <ArrowRight className="w-3.5 h-3.5" />
                      </GlassButton>
                    ) : (
                      <GlassButton
                        size="sm"
                        onClick={(e) => handleContinue(sim, e)}
                        className="!px-4"
                      >
                        Iniciar <ArrowRight className="w-3.5 h-3.5" />
                      </GlassButton>
                    )}
                  </div>
                </GlassCard>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}