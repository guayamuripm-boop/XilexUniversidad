'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass'
import { useAuthStore } from '@/lib/store'
import { 
  Brain, 
  Target, 
  Trophy, 
  BarChart2, 
  Clock, 
  Play, 
  Plus,
  ArrowRight,
  Settings,
  User,
  Award,
  TrendingUp,
  BookOpen,
  ChevronRight,
  Sparkles,
  CheckCircle2
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
    area: {
      id: string
      name: string
      code: string
    }
  }
  university: {
    id: string
    name: string
    code: string
  }
  area: {
    id: string
    name: string
    code: string
  }
}

export default function DashboardPage() {
  const { user, setUser, clearUser } = useAuthStore()
  const [simulacrums, setSimulacrums] = useState<Simulacrum[]>([])
  const [progress, setProgress] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    avgScore: 0,
    totalQuestions: 0,
    studyTime: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: sims } = await supabase
        .from('simulacrums')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (sims) {
        setSimulacrums(sims)
        const completed = sims.filter(s => s.status === 'completed')
        if (completed.length > 0) {
          const avgScore = completed.reduce((sum, s) => sum + (s.score || 0), 0) / completed.length
          const totalQ = completed.reduce((sum, s) => sum + s.total_questions, 0)
          const totalTime = completed.reduce((sum, s) => sum + s.time_limit_minutes, 0)
          setStats({ avgScore, totalQuestions: totalQ, studyTime: totalTime })
        }
      }

      const { data: prog } = await supabase
        .from('user_progress')
        .select(`
          *,
          subtopic:subtopics (id, name, area:areas (id, name, code)),
          university:universities (id, name, code),
          area:areas (id, name, code)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (prog) setProgress(prog)
      setLoading(false)
    }

    loadData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        clearUser()
      } else if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata.full_name || null,
          target_universities: [],
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, clearUser])

  const getRecentActivity = () => {
    return simulacrums.slice(0, 5).map(s => ({
      id: s.id,
      type: s.status === 'completed' ? 'completed' : 'in_progress',
      title: s.name,
      description: `${s.total_questions} preguntas · ${s.time_limit_minutes} min`,
      time: new Date(s.created_at).toLocaleDateString('es-VE', { 
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
      }),
      score: s.score,
    }))
  }

  const getWeakAreas = () => {
    return progress
      .filter(p => p.total_attempts >= 3 && p.mastery_level === 'novice')
      .sort((a, b) => a.accuracy_rate - b.accuracy_rate)
      .slice(0, 4)
  }

  const getStrongAreas = () => {
    return progress
      .filter(p => p.total_attempts >= 3 && (p.mastery_level === 'proficient' || p.mastery_level === 'mastered'))
      .sort((a, b) => b.accuracy_rate - a.accuracy_rate)
      .slice(0, 3)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-2xl text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-graphite-400">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="p-8 max-w-md w-full text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold text-white mb-2">Inicia sesión para continuar</h1>
          <p className="text-graphite-400 mb-6">Accede a tu dashboard personalizado</p>
          <Link href="/auth/login" className="btn-primary inline-flex items-center gap-2">
            Iniciar sesión
            <ArrowRight className="w-4 h-4" />
          </Link>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-[0_0_12px_rgba(0,180,216,0.3)]">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">XILEX</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/practice" className="hidden sm:flex btn-primary text-sm">
                <Plus className="w-4 h-4" />
                Nuevo simulacro
              </Link>

              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass-subtle">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-medium text-graphite-300 hidden sm:inline">
                  {user.full_name || user.email.split('@')[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome & Stats */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-white">
                Bienvenido, <span className="text-primary">{user.full_name || user.email.split('@')[0]}</span>
              </h1>
              <p className="text-sm sm:text-base text-graphite-400 mt-1">
                Tu panel de práctica para admisión universitaria
              </p>
            </div>
            <Link href="/practice" className="btn-primary text-sm sm:text-base">
              <Plus className="w-4 h-4" />
              Nuevo simulacro
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <GlassCard className="p-4 sm:p-5 glass-glow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-graphite-500 mb-1">Completados</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {simulacrums.filter(s => s.status === 'completed').length}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4 sm:p-5 glass-glow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-graphite-500 mb-1">Promedio</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {stats.avgScore.toFixed(1)}%
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent-emerald/10 flex items-center justify-center">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-accent-emerald" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4 sm:p-5 glass-glow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-graphite-500 mb-1">Preguntas</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {stats.totalQuestions}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4 sm:p-5 glass-glow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-graphite-500 mb-1">Tiempo</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {formatTime(stats.studyTime * 60)}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent-amber/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-accent-amber" />
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <GlassCard className="p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Acciones rápidas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Link href="/practice" className="glass glass-glow p-4 sm:p-5 text-center group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">Nuevo simulacro</h3>
                  <p className="text-xs text-graphite-500">Configura y empieza a practicar</p>
                </Link>
                <Link href="/progress" className="glass glass-glow p-4 sm:p-5 text-center group">
                  <div className="w-12 h-12 rounded-xl bg-accent-emerald/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-accent-emerald" />
                  </div>
                  <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">Ver mi progreso</h3>
                  <p className="text-xs text-graphite-500">Análisis detallado por subtema</p>
                </Link>
              </div>
            </GlassCard>

            {/* Recent Activity */}
            <GlassCard className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Actividad reciente
                </h2>
                <Link href="/simulacrums" className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1">
                  Ver todo <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {simulacrums.length === 0 ? (
                <div className="text-center py-8 sm:py-10">
                  <Trophy className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 text-graphite-700" />
                  <p className="text-graphite-500 mb-4 text-sm sm:text-base">No has completado ningún simulacro aún</p>
                  <Link href="/practice" className="btn-primary text-sm inline-flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Crear mi primer simulacro
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {getRecentActivity().map((activity) => (
                    <Link 
                      key={activity.id} 
                      href={`/simulacrum/${activity.id}`}
                      className="flex items-center gap-3 sm:gap-4 p-3 glass glass-glow group"
                    >
                      <div className={cn(
                        'w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                        activity.type === 'completed' 
                          ? 'bg-accent-emerald/10 text-accent-emerald'
                          : 'bg-accent-amber/10 text-accent-amber'
                      )}>
                        {activity.type === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{activity.title}</p>
                        <p className="text-xs text-graphite-500">{activity.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-graphite-500">{activity.time}</p>
                        {activity.score !== null && (
                          <p className="text-xs sm:text-sm font-semibold text-primary">{activity.score.toFixed(1)}%</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Weak Areas */}
            <GlassCard className="p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-accent-rose" />
                Áreas a reforzar
              </h2>
              {getWeakAreas().length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-accent-emerald/60" />
                  <p className="text-graphite-500 text-xs sm:text-sm">¡Todo en orden! Sigue practicando</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {getWeakAreas().map((p) => (
                    <div key={p.id} className="glass p-3 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white truncate pr-2">
                          {p.subtopic.name}
                        </span>
                        <span className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0',
                          getMasteryColor(p.mastery_level)
                        )}>
                          {p.mastery_level}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-graphite-500 mb-2 flex-wrap">
                        <span className="px-1.5 py-0.5 bg-white/[0.04] rounded">{p.university.name}</span>
                        <span className="px-1.5 py-0.5 bg-white/[0.04] rounded">{p.area.name}</span>
                      </div>
                      <div className="h-1.5 bg-graphite-800 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-rose rounded-full transition-all" style={{ width: `${p.accuracy_rate}%` }} />
                      </div>
                      <p className="text-xs text-graphite-500 mt-1">
                        {p.accuracy_rate.toFixed(1)}% · {p.total_attempts} intentos
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Strong Areas */}
            <GlassCard className="p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-accent-emerald" />
                Tus fortalezas
              </h2>
              {getStrongAreas().length === 0 ? (
                <p className="text-graphite-500 text-xs sm:text-sm text-center py-4">
                  Completa más simulacros para ver tus áreas fuertes
                </p>
              ) : (
                <div className="space-y-2.5">
                  {getStrongAreas().map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 glass rounded-xl">
                      <div className="w-9 h-9 rounded-xl bg-accent-emerald/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{p.subtopic.name}</p>
                        <p className="text-xs text-graphite-500">
                          {p.accuracy_rate.toFixed(1)}% · {p.mastery_level}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Next Steps */}
            <GlassCard className="p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent-amber" />
                Próximos pasos
              </h2>
              <div className="space-y-2.5">
                <Link href="/practice" className="flex items-center gap-3 p-3 glass glass-glow group">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <Play className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm">Crear simulacro mixto</p>
                    <p className="text-xs text-graphite-500">Combina SIMADI + UNIMET</p>
                  </div>
                </Link>
                <Link href="/progress" className="flex items-center gap-3 p-3 glass glass-glow group">
                  <div className="w-9 h-9 rounded-xl bg-accent-emerald/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <BarChart2 className="w-4 h-4 text-accent-emerald" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm">Ver análisis detallado</p>
                    <p className="text-xs text-graphite-500">Progreso por universidad y subtema</p>
                  </div>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 p-3 glass glass-glow group">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <Settings className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm">Ajustar preferencias</p>
                    <p className="text-xs text-graphite-500">Universidades objetivo</p>
                  </div>
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  )
}
