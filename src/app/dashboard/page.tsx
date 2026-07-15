'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass'
import { useAuthStore, useUIStore } from '@/lib/store'
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
  LogOut,
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

      // Load simulacrums
      const { data: sims } = await supabase
        .from('simulacrums')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (sims) {
        setSimulacrums(sims)
        
        // Calculate stats
        const completed = sims.filter(s => s.status === 'completed')
        if (completed.length > 0) {
          const avgScore = completed.reduce((sum, s) => sum + (s.score || 0), 0) / completed.length
          const totalQ = completed.reduce((sum, s) => sum + s.total_questions, 0)
          const totalTime = completed.reduce((sum, s) => sum + s.time_limit_minutes, 0)
          setStats({
            avgScore,
            totalQuestions: totalQ,
            studyTime: totalTime,
          })
        }
      }

      // Load progress
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

      if (prog) {
        setProgress(prog)
      }

      setLoading(false)
    }

    loadData()

    // Listen for auth changes
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
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-[#051817] dark:via-[#0B1F1E] dark:to-[#052826]">
        <div className="glass p-8 rounded-2xl text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-[#051817] dark:via-[#0B1F1E] dark:to-[#052826]">
        <GlassCard className="p-8 max-w-md w-full text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Inicia sesión para continuar</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Accede a tu dashboard personalizado</p>
          <Link href="/auth/login" className="btn-primary inline-flex items-center gap-2">
            Iniciar sesión
            <ArrowRight className="w-4 h-4" />
          </Link>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-[#051817] dark:via-[#0B1F1E] dark:to-[#052826]">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">XILEX</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/practice" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors">
                <Plus className="w-4 h-4" />
                Nuevo simulacro
              </Link>

              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/50 dark:bg-dark-surface/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.full_name || user.email.split('@')[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Stats */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Bienvenido de vuelta, <span className="text-primary">{user.full_name || user.email.split('@')[0]}</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Tu panel de práctica para admisión universitaria
              </p>
            </div>
            <Link href="/practice" className="btn-primary">
              <Plus className="w-4 h-4" />
              Nuevo simulacro
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard className="p-5 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Simulacros completados</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {simulacrums.filter(s => s.status === 'completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-light dark:bg-primary-dark/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Puntaje promedio</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.avgScore.toFixed(1)}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Preguntas respondidas</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalQuestions}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tiempo de estudio</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatTime(stats.studyTime * 60)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions & Recent */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                Acciones rápidas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/practice" className="glass card-hover p-5 text-center group">
                  <div className="w-14 h-14 rounded-xl bg-primary-light dark:bg-primary-dark/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Nuevo simulacro</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Configura y empieza a practicar</p>
                </Link>
                <Link href="/progress" className="glass card-hover p-5 text-center group">
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Ver mi progreso</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Análisis detallado por subtema</p>
                </Link>
              </div>
            </GlassCard>

            {/* Recent Activity */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Actividad reciente
                </h2>
                <Link href="/simulacrums" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Ver todo <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {simulacrums.length === 0 ? (
                <div className="text-center py-10">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">No has completado ningún simulacro aún</p>
                  <Link href="/practice" className="btn-primary inline-flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Crear mi primer simulacro
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {getRecentActivity().map((activity) => (
                    <Link 
                      key={activity.id} 
                      href={`/simulacrum/${activity.id}`}
                      className="flex items-center gap-4 p-3 glass rounded-xl card-hover group"
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                        activity.type === 'completed' 
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      )}>
                        {activity.type === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{activity.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                        {activity.score !== null && (
                          <p className="text-sm font-semibold text-primary">{activity.score.toFixed(1)}%</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Right Column - Progress Insights */}
          <div className="space-y-6">
            {/* Weak Areas */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-red-500" />
                Áreas a reforzar
              </h2>
              {getWeakAreas().length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">¡Todo en orden! Sigue practicando para mantener el nivel</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getWeakAreas().map((p) => (
                    <div key={p.id} className="glass p-3 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate pr-2">
                          {p.subtopic.name}
                        </span>
                        <span className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0',
                          getMasteryColor(p.mastery_level)
                        )}>
                          {p.mastery_level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-dark-border rounded">
                          {p.university.name}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-dark-border rounded">
                          {p.area.name}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 rounded-full transition-all" 
                          style={{ width: `${p.accuracy_rate}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {p.accuracy_rate.toFixed(1)}% precisión · {p.total_attempts} intentos
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Strong Areas */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-emerald-500" />
                Tus fortalezas
              </h2>
              {getStrongAreas().length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                  Completa más simulacros para ver tus áreas fuertes
                </p>
              ) : (
                <div className="space-y-3">
                  {getStrongAreas().map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 glass rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{p.subtopic.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {p.accuracy_rate.toFixed(1)}% · {p.mastery_level}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Next Steps */}
            <GlassCard className="p-6">
<h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Próximos pasos
                </h2>
              <div className="space-y-3">
                <Link href="/practice" className="flex items-center gap-3 p-3 glass rounded-xl card-hover group">
                  <div className="w-10 h-10 rounded-xl bg-primary-light dark:bg-primary-dark/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Crear simulacro mixto</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Combina SIMADI + UNIMET</p>
                  </div>
                </Link>
                <Link href="/progress" className="flex items-center gap-3 p-3 glass rounded-xl card-hover group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Ver análisis detallado</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Progreso por universidad y subtema</p>
                  </div>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 p-3 glass rounded-xl card-hover group">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Ajustar preferencias</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Universidades objetivo, notificaciones</p>
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