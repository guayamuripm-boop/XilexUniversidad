'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { GlassCard, GlassButton } from '@/components/ui/glass'
import {
  Brain, TrendingUp, Filter, Target, Trophy, Flame, AlertTriangle,
  Sparkles, Clock, BarChart2, LineChart, PieChart
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend,
  LineChart as RechartsLineChart, Line, AreaChart, Area,
} from 'recharts'
import { cn, getMasteryColor, getDifficultyColor, getUniversityColor } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface ProgressRow {
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
  university: { id: string; name: string; code: string }
  area: { id: string; name: string; code: string }
  subtopic: { id: string; name: string }
}

interface StreakData {
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [streak, setStreak] = useState<StreakData>({ current_streak: 0, longest_streak: 0, last_activity_date: null })
  const [loading, setLoading] = useState(true)
  const [filterUni, setFilterUni] = useState('all')
  const [filterArea, setFilterArea] = useState('all')
  const [filterMastery, setFilterMastery] = useState('all')

  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const [{ data: progData, error: progError }, { data: streakData, error: streakError }] = await Promise.all([
          supabase
            .from('user_progress')
            .select(`*, university:universities(id, name, code), area:areas(id, name, code), subtopic:subtopics(id, name)`)
            .eq('user_id', user.id)
            .order('last_attempted_at', { ascending: false }),
          supabase.rpc('get_user_streak', { p_user_id: user.id })
        ])

        if (progError) throw progError
        if (streakError) console.warn('Streak error:', streakError)
        else if (streakData?.[0]) setStreak(streakData[0])

        setProgress(progData ?? [])
      } catch (err) {
        console.error('Error loading progress:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [supabase])

  const stats = useMemo(() => {
    const mastered = progress.filter(p => p.mastery_level === 'mastered').length
    const proficient = progress.filter(p => p.mastery_level === 'proficient').length
    const learning = progress.filter(p => p.mastery_level === 'learning').length
    const novice = progress.filter(p => p.mastery_level === 'novice').length
    const totalAttempts = progress.reduce((sum, p) => sum + p.total_attempts, 0)
    const totalCorrect = progress.reduce((sum, p) => sum + p.correct_attempts, 0)
    const avgAccuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0
    return { mastered, proficient, learning, novice, totalAttempts, avgAccuracy }
  }, [progress])

  const filteredProgress = useMemo(() => {
    return progress.filter(p => {
      if (filterUni !== 'all' && p.university.code !== filterUni) return false
      if (filterArea !== 'all' && p.area.code !== filterArea) return false
      if (filterMastery !== 'all' && p.mastery_level !== filterMastery) return false
      return true
    })
  }, [progress, filterUni, filterArea, filterMastery])

  const masteryDistribution = useMemo(() => [
    { name: 'Dominado', value: stats.mastered, color: '#a855f7' },
    { name: 'Competente', value: stats.proficient, color: '#22c55e' },
    { name: 'Aprendiendo', value: stats.learning, color: '#3b82f6' },
    { name: 'Principiante', value: stats.novice, color: '#64748b' },
  ].filter(d => d.value > 0), [stats])

  const weakSpots = useMemo(() => {
    return progress
      .filter(p => p.total_attempts >= 5)
      .sort((a, b) => a.accuracy_rate - b.accuracy_rate)
      .slice(0, 5)
  }, [progress])

  const accuracyTrend = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().split('T')[0]
    })

    return last7Days.map(date => {
      const dayProgress = progress.filter(p => p.last_attempted_at?.startsWith(date))
      const attempts = dayProgress.reduce((sum, p) => sum + p.total_attempts, 0)
      const correct = dayProgress.reduce((sum, p) => sum + p.correct_attempts, 0)
      return {
        date: new Date(date).toLocaleDateString('es-VE', { weekday: 'short', day: '2-digit', month: '2-digit' }),
        accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
        attempts,
      }
    })
  }, [progress])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-xl border border-white/[0.08]">
          <p className="font-medium text-white">{label}</p>
          {payload.map((entry: any, i: number) => (
            <p key={i} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}% {entry.payload?.attempts ? `(${entry.payload.attempts} intentos)` : ''}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass p-8 rounded-3xl text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-200/60">Cargando progreso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12">
      <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
        <div className="px-4 h-14 flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
          </Link>
        </div>
      </header>

      <main className="px-4 py-6 max-w-4xl mx-auto space-y-6">
        {/* Header con streak */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">Tu progreso</h1>
            <p className="text-sm text-blue-300/50 mt-0.5">Rastrea tu evolución por subtema y universidad</p>
          </div>
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-300">{streak.current_streak} días</p>
              <p className="text-xs text-amber-400/70">Racha actual · Máx: {streak.longest_streak}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <GlassCard className="p-4 rounded-3xl" hover={false}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.mastered}</p>
                <p className="text-xs text-blue-300/50">Dominados</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-4 rounded-3xl" hover={false}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.proficient}</p>
                <p className="text-xs text-blue-300/50">Competentes</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-4 rounded-3xl" hover={false}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.learning}</p>
                <p className="text-xs text-blue-300/50">Aprendiendo</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-4 rounded-3xl" hover={false}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.avgAccuracy.toFixed(1)}%</p>
                <p className="text-xs text-blue-300/50">Precisión global</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Mastery Distribution Pie */}
          <GlassCard className="p-5 rounded-3xl" hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" /> Distribución de maestría
              </h3>
            </div>
            {masteryDistribution.length > 0 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={masteryDistribution}
                      cx="50%" cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {masteryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} subtemas`, '']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-blue-300/40 text-sm">Practica para ver distribución</p>
              </div>
            )}
          </GlassCard>

          {/* Accuracy Trend Line */}
          <GlassCard className="p-5 rounded-3xl" hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-primary" /> Precisión última semana
              </h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={accuracyTrend}>
                  <defs>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff30" fontSize={10} tickLine={false} />
                  <YAxis
                    domain={[0, 100]}
                    stroke="#ffffff30"
                    fontSize={10}
                    tickLine={false}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAccuracy)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-blue-300/40 mt-2 text-center">
              {accuracyTrend.filter(d => d.attempts > 0).length} días con actividad
            </p>
          </GlassCard>
        </div>

        {/* Weak Spots */}
        {weakSpots.length > 0 && (
          <GlassCard className="p-5 rounded-3xl border-l-4 border-red-500/30" hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="font-semibold text-white">Puntos débiles (mín. 5 intentos)</h3>
            </div>
            <div className="space-y-2">
              {weakSpots.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-2xl border border-white/[0.04]">
                  <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{p.subtopic.name}</p>
                    <p className="text-xs text-blue-300/50">{p.university.name} · {p.area.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-400">{p.accuracy_rate.toFixed(1)}%</p>
                    <p className="text-xs text-blue-300/50">{p.total_attempts} intentos</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Filters */}
        <GlassCard className="p-5 rounded-3xl" hover={false}>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-200/60" />
              <select
                value={filterUni}
                onChange={(e) => setFilterUni(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Todas las universidades</option>
                <option value="simadi">SIMADI (UCV)</option>
                <option value="unimet">UNIMET</option>
                <option value="usb">USB</option>
                <option value="ucab">UCAB</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Todas las áreas</option>
                <option value="logico">Razonamiento Lógico</option>
                <option value="verbal">Razonamiento Verbal</option>
                <option value="cuantitativo">Aptitud Cuantitativa</option>
                <option value="habilidades">Habilidades</option>
                <option value="conocimientos">Conocimientos</option>
                <option value="numerica">Prueba Numérica</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterMastery}
                onChange={(e) => setFilterMastery(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
        <GlassCard className="rounded-3xl overflow-hidden" hover={false}>
          {filteredProgress.length === 0 ? (
            <div className="p-12 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-blue-200/60" />
              <p className="text-blue-300/40 text-lg mb-4">
                {progress.length === 0
                  ? 'Aún no has practicado ningún subtema'
                  : 'No hay subtemas con los filtros seleccionados'}
              </p>
              <Link href="/practice" className="btn-primary inline-flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Empezar a practicar
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-300/40 uppercase tracking-wider">Subtema</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-300/40 uppercase tracking-wider">Universidad / Área</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-blue-300/40 uppercase tracking-wider">Intentos</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-blue-300/40 uppercase tracking-wider">Precisión</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-blue-300/40 uppercase tracking-wider">Nivel</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-blue-300/40 uppercase tracking-wider">Última práctica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.08]">
                  {filteredProgress.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.04]">
                      <td className="px-4 py-4">
                        <p className="font-medium text-white">{p.subtopic.name}</p>
                        <p className="text-xs text-blue-300/50">{p.area.name}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('px-2 py-0.5 text-xs rounded-full', getUniversityColor(p.university.code))}>
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
                          <p className="text-xs text-blue-300/50 mt-1">{p.accuracy_rate.toFixed(1)}%</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getMasteryColor(p.mastery_level))}>
                          {p.mastery_level}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-blue-300/50">
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