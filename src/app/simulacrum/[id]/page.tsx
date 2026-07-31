'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GlassCard, GlassButton } from '@/components/ui/glass'
import { useSimulacrumStore } from '@/lib/store'
import {
  Brain, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight,
  Flag, ArrowRight, Loader2, Play, Home, AlertCircle, Filter, Eye
} from 'lucide-react'
import { formatTime, cn, getDifficultyColor } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface SimulacrumQuestion {
  id: string
  simulacrum_id: string
  question_id: string
  user_answer: string | null
  is_correct: boolean | null
  answered_at: string | null
  time_spent_seconds: number | null
  order_index: number
  question: {
    id: string
    statement: string
    options: Record<string, string>
    correct_answer: string
    explanation: string
    difficulty: 'easy' | 'medium' | 'hard'
    subtopic: {
      id: string
      name: string
      area: { id: string; name: string; code: string; university?: { code: string } | null }
    }
  }
}

interface Simulacrum {
  id: string
  name: string
  total_questions: number
  time_limit_minutes: number
  status: 'draft' | 'in_progress' | 'completed' | 'abandoned'
  score: number | null
  correct_count?: number | null
  incorrect_count?: number | null
  unanswered_count?: number | null
}

export default function SimulacrumPage() {
  const router = useRouter()
  const params = useParams()
  const simulacrumId = params.id as string

  const {
    currentSimulacrum, questions, currentQuestionIndex, answers,
    timeRemaining, isActive, setSimulacrum, setAnswer,
    setCurrentQuestionIndex, setTimeRemaining, setActive,
    getProgress, reset,
  } = useSimulacrumStore()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all')
  const [expandedExplanation, setExpandedExplanation] = useState<Record<string, boolean>>({})

  const supabase = createClient()

  // Absolute end time (ms epoch). Deriving the countdown from a deadline instead
  // of decrementing a counter keeps it accurate when the tab is backgrounded and
  // the browser throttles timers.
  const deadlineRef = useRef<number | null>(null)
  // Lets the interval call the current submit function without re-creating the
  // interval on every tick.
  const submitRef = useRef<() => Promise<void>>()

  useEffect(() => {
    let cancelled = false

    const loadSimulacrum = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push(`/auth/login?redirect=/simulacrum/${simulacrumId}`)
          return
        }

        const { data: simData, error } = await supabase
          .from('simulacrums')
          .select(`*, simulacrum_questions (*, question:questions (*, subtopic:subtopics (id, name, area:areas (id, name, code, university:universities (code)))))`)
          .eq('id', simulacrumId)
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        if (!simData) throw new Error('Simulacro no encontrado')
        if (cancelled) return

        const sorted = (simData.simulacrum_questions as any[])
          .filter((sq) => sq.question)
          .sort((a, b) => a.order_index - b.order_index) as SimulacrumQuestion[]

        setSimulacrum(simData, sorted)

        if (simData.status === 'in_progress' && simData.started_at) {
          const deadline = new Date(simData.started_at).getTime() + simData.time_limit_minutes * 60_000
          deadlineRef.current = deadline
          setTimeRemaining(Math.max(0, Math.round((deadline - Date.now()) / 1000)))
          setActive(true)
        } else {
          deadlineRef.current = null
          setActive(false)
        }
      } catch (err) {
        console.error('Error loading simulacrum:', err)
        router.push('/dashboard')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadSimulacrum()
    return () => { cancelled = true }
  }, [simulacrumId, setSimulacrum, setTimeRemaining, setActive, router, supabase])

  useEffect(() => {
    if (!isActive || deadlineRef.current === null) return

    const tick = () => {
      const remaining = Math.max(0, Math.round((deadlineRef.current! - Date.now()) / 1000))
      setTimeRemaining(remaining)
      if (remaining === 0) {
        setActive(false)
        submitRef.current?.()
      }
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [isActive, setTimeRemaining, setActive])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = getProgress()
  const simQuestions = questions

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setAnswer(questionId, answer)
    // Persist immediately so a refresh, crash or device switch mid-exam does not
    // lose the answer. `is_correct` is only computed on submit.
    supabase
      .from('simulacrum_questions')
      .update({ user_answer: answer, answered_at: new Date().toISOString() })
      .eq('simulacrum_id', simulacrumId)
      .eq('question_id', questionId)
      .then(({ error }) => {
        if (error) console.error('No se pudo guardar la respuesta:', error)
      })
  }, [setAnswer, supabase, simulacrumId])

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }, [currentQuestionIndex, questions.length, setCurrentQuestionIndex])

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }, [currentQuestionIndex, setCurrentQuestionIndex])

  const startSimulacrum = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const startedAt = new Date()
      const { error } = await supabase
        .from('simulacrums')
        .update({ status: 'in_progress', started_at: startedAt.toISOString() })
        .eq('id', simulacrumId)
      if (error) throw error

      const limit = currentSimulacrum?.time_limit_minutes ?? 0
      deadlineRef.current = startedAt.getTime() + limit * 60_000
      setTimeRemaining(limit * 60)
      setActive(true)
    } catch (err) {
      console.error('Error starting:', err)
    }
  }

  const submitSimulacrum = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let correct = 0
      let incorrect = 0
      let unanswered = 0
      const now = new Date().toISOString()

      const sqUpdates = simQuestions.map((sq, index) => {
        const userAnswer = answers[sq.question_id] ?? null
        // An unanswered question is neither correct nor incorrect; writing
        // `false` there made the results screen count blanks as wrong answers.
        const isCorrect = userAnswer === null ? null : userAnswer === sq.question.correct_answer

        if (userAnswer === null) unanswered++
        else if (isCorrect) correct++
        else incorrect++

        return {
          simulacrum_id: simulacrumId,
          question_id: sq.question_id,
          user_answer: userAnswer,
          is_correct: isCorrect,
          answered_at: userAnswer ? now : null,
          time_spent_seconds: sq.time_spent_seconds ?? 0,
          order_index: index,
        }
      })

      const { error: upsertErr } = await supabase
        .from('simulacrum_questions')
        .upsert(sqUpdates, { onConflict: 'simulacrum_id,question_id', ignoreDuplicates: false })

      if (upsertErr) throw upsertErr

      const score = simQuestions.length > 0 ? (correct / simQuestions.length) * 100 : 0
      const { error: simErr } = await supabase.from('simulacrums').update({
        status: 'completed',
        score: Number(score.toFixed(2)),
        correct_count: correct,
        incorrect_count: incorrect,
        unanswered_count: unanswered,
        completed_at: now,
      }).eq('id', simulacrumId)

      if (simErr) throw simErr

      // Per-subtopic mastery. Sequential awaits here made a 90-question exam fire
      // 90 round trips before the results screen appeared.
      await Promise.all(
        simQuestions
          .filter(sq => answers[sq.question_id])
          .map(sq => supabase.rpc('update_user_progress', {
            p_user_id: user.id,
            p_question_id: sq.question_id,
            p_is_correct: answers[sq.question_id] === sq.question.correct_answer,
            p_time_spent_seconds: sq.time_spent_seconds ?? 0,
          }))
      )

      reset()
      window.location.href = `/simulacrum/${simulacrumId}`
    } catch (err) {
      console.error('Error submitting:', err)
      alert('Error al enviar el simulacro. Tus respuestas siguen guardadas — intenta de nuevo.')
      setSubmitting(false)
    }
  }, [submitting, supabase, simQuestions, answers, simulacrumId, reset])

  useEffect(() => {
    submitRef.current = submitSimulacrum
  }, [submitSimulacrum])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass p-8 rounded-3xl text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-200/60">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!currentSimulacrum) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="p-8 max-w-sm w-full text-center rounded-3xl">
          <Brain className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-xl font-bold text-white mb-4">Simulacro no encontrado</h1>
          <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
            <Home className="w-4 h-4" /> Volver
          </Link>
        </GlassCard>
      </div>
    )
  }

  // ── RESULTS VIEW ──
  if (currentSimulacrum.status === 'completed') {
    const total = currentSimulacrum.total_questions
    const correctCount = currentSimulacrum.correct_count ?? 0
    const incorrectCount = currentSimulacrum.incorrect_count ?? 0
    const unansweredCount = currentSimulacrum.unanswered_count ?? 0

    // La PDU de la UNIMET no puntúa por aciertos brutos: suma 1 punto por
    // respuesta correcta y resta 1/3 por incorrecta, dejando las no respondidas
    // en cero. Mostrar solo el porcentaje de aciertos da una idea optimista de
    // dónde queda realmente el aspirante.
    const esUnimet = simQuestions.some(
      sq => sq.question.subtopic?.area?.university?.code === 'unimet'
    )
    const puntajePdu = correctCount - incorrectCount / 3
    const porcentajePdu = total > 0 ? Math.max(0, (puntajePdu / total) * 100) : 0

    const filteredQuestions = simQuestions.filter((sq) => {
      if (reviewFilter === 'all') return true
      if (reviewFilter === 'correct') return sq.is_correct === true
      if (reviewFilter === 'incorrect') return sq.is_correct === false && sq.user_answer !== null
      if (reviewFilter === 'unanswered') return sq.user_answer === null
      return true
    })

    const getQuestionStatus = (sq: SimulacrumQuestion): 'correct' | 'incorrect' | 'unanswered' => {
      if (sq.is_correct === true) return 'correct'
      if (sq.user_answer === null) return 'unanswered'
      return 'incorrect'
    }

    const statusConfig = {
      correct: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Correcta', icon: CheckCircle2 },
      incorrect: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Incorrecta', icon: XCircle },
      unanswered: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Sin responder', icon: AlertCircle },
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
            <h1 className="ml-3 font-semibold text-white text-sm">Resultados</h1>
          </div>
        </header>

        <main className="px-4 py-6 max-w-2xl mx-auto">
          {/* Score Card */}
          <GlassCard className="p-6 text-center mb-6 rounded-3xl animate-fade-in" hover={false}>
            <span className={cn(
              'inline-block px-5 py-2 rounded-full text-2xl font-bold mb-3',
              (currentSimulacrum.score ?? 0) >= 70 ? 'bg-emerald-500/10 text-emerald-400' :
              (currentSimulacrum.score ?? 0) >= 50 ? 'bg-amber-500/10 text-amber-400' :
              'bg-red-500/10 text-red-400'
            )}>
              {currentSimulacrum.score?.toFixed(1)}%
            </span>
            <h2 className="text-xl font-bold text-white mb-5">{currentSimulacrum.name}</h2>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3">
                <div className="text-2xl font-bold text-emerald-400">{correctCount}</div>
                <div className="text-xs text-emerald-400/70 mt-0.5">Correctas</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3">
                <div className="text-2xl font-bold text-red-400">{incorrectCount}</div>
                <div className="text-xs text-red-400/70 mt-0.5">Incorrectas</div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3">
                <div className="text-2xl font-bold text-amber-400">{unansweredCount}</div>
                <div className="text-xs text-amber-400/70 mt-0.5">Sin responder</div>
              </div>
            </div>

            {esUnimet && (
              <div className="mb-6 rounded-2xl border border-primary/25 bg-primary/[0.06] p-4 text-left">
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Puntaje corregido PDU
                  </span>
                  <span className="text-lg font-bold text-white">
                    {puntajePdu.toFixed(2).replace('.', ',')} / {total}
                    <span className="ml-2 text-sm font-semibold text-blue-200/70">
                      ({porcentajePdu.toFixed(1).replace('.', ',')}%)
                    </span>
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-blue-200/60">
                  La UNIMET suma 1 punto por acierto y resta 1/3 por cada respuesta
                  incorrecta; las que dejas en blanco no restan. Por eso el manual
                  oficial recomienda no adivinar: {incorrectCount} incorrecta
                  {incorrectCount === 1 ? '' : 's'} te
                  {incorrectCount === 1 ? ' costó ' : ' costaron '}
                  {(incorrectCount / 3).toFixed(2).replace('.', ',')} puntos.
                </p>
              </div>
            )}

            {/* Progress bar */}
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-5">
              <div className="h-full flex">
                <div className="bg-emerald-500 transition-all" style={{ width: `${total > 0 ? (correctCount / total) * 100 : 0}%` }} />
                <div className="bg-red-500 transition-all" style={{ width: `${total > 0 ? (incorrectCount / total) * 100 : 0}%` }} />
                <div className="bg-amber-500 transition-all" style={{ width: `${total > 0 ? (unansweredCount / total) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Link href="/dashboard" className="btn-secondary text-sm"><Home className="w-4 h-4" /> Dashboard</Link>
              <Link href="/practice" className="btn-primary text-sm"><Play className="w-4 h-4" /> Nuevo simulacro</Link>
            </div>
          </GlassCard>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-blue-300/40 flex-shrink-0" />
            {([
              { key: 'all' as const, label: 'Todas', count: total },
              { key: 'correct' as const, label: 'Correctas', count: correctCount },
              { key: 'incorrect' as const, label: 'Incorrectas', count: incorrectCount },
              { key: 'unanswered' as const, label: 'Sin responder', count: unansweredCount },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setReviewFilter(tab.key)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex-shrink-0',
                  reviewFilter === tab.key
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'bg-white/[0.04] text-blue-300/50 border border-white/[0.06] hover:bg-white/[0.06]'
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Question Review */}
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" /> Revisión detallada
          </h3>

          <div className="space-y-4">
            {filteredQuestions.map((sq, idx) => {
              const status = getQuestionStatus(sq)
              const config = statusConfig[status]
              const StatusIcon = config.icon
              const userAnswer = sq.user_answer
              const correctAnswer = sq.question.correct_answer
              const isExpanded = expandedExplanation[sq.id] ?? false

              return (
                <div
                  key={sq.id}
                  className={cn(
                    'rounded-3xl border-2 overflow-hidden transition-all',
                    config.border, config.bg
                  )}
                >
                  {/* Status header */}
                  <div className={cn('px-4 py-2.5 flex items-center gap-2', config.bg)}>
                    <StatusIcon className={cn('w-4 h-4', config.color)} />
                    <span className={cn('text-xs font-bold uppercase tracking-wide', config.color)}>
                      {config.label}
                    </span>
                    <span className="text-xs text-blue-300/40 ml-auto">#{idx + 1}</span>
                  </div>

                  <div className="p-4">
                    {/* Tags */}
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', getDifficultyColor(sq.question.difficulty))}>
                        {sq.question.difficulty}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                        {sq.question.subtopic.area.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] text-blue-200/50">
                        {sq.question.subtopic.name}
                      </span>
                    </div>

                    {/* Statement */}
                    <p className="text-sm text-white mb-3 leading-relaxed">{sq.question.statement}</p>

                    {/* Options */}
                    <div className="space-y-1.5 mb-3">
                      {Object.entries(sq.question.options).map(([key, value]) => {
                        const isCorrectOpt = key === correctAnswer
                        const isUserOpt = key === userAnswer
                        const isWrongUser = isUserOpt && !isCorrectOpt

                        return (
                          <div key={key} className={cn(
                            'flex items-start gap-2.5 p-2.5 rounded-xl text-sm border transition-all',
                            isCorrectOpt ? 'bg-emerald-500/10 border-emerald-500/30' :
                            isWrongUser ? 'bg-red-500/10 border-red-500/30' :
                            'bg-white/[0.02] border-white/[0.04]'
                          )}>
                            <div className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5',
                              isCorrectOpt ? 'bg-emerald-500 text-white' :
                              isWrongUser ? 'bg-red-500 text-white' :
                              'bg-white/[0.06] text-blue-200/50'
                            )}>{key}</div>
                            <span className={cn(
                              'flex-1 leading-snug',
                              isCorrectOpt ? 'text-emerald-300' :
                              isWrongUser ? 'text-red-300' :
                              'text-blue-200/50'
                            )}>{value}</span>
                            <div className="flex-shrink-0 mt-0.5">
                              {isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                              {isWrongUser && <XCircle className="w-4 h-4 text-red-400" />}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Your answer label */}
                    {status === 'correct' && (
                      <div className="text-xs text-emerald-400/80 mb-2">
                        Tu respuesta: <span className="font-bold">{userAnswer}</span> — Correcta
                      </div>
                    )}
                    {status === 'incorrect' && (
                      <div className="text-xs text-red-400/80 mb-2">
                        Tu respuesta: <span className="font-bold">{userAnswer}</span> — La correcta era <span className="font-bold text-emerald-400">{correctAnswer}</span>
                      </div>
                    )}
                    {status === 'unanswered' && (
                      <div className="text-xs text-amber-400/80 mb-2">
                        No respondiste — Respuesta correcta: <span className="font-bold text-emerald-400">{correctAnswer}</span>
                      </div>
                    )}

                    {/* Explanation toggle */}
                    <button
                      onClick={() => setExpandedExplanation(prev => ({ ...prev, [sq.id]: !isExpanded }))}
                      className="flex items-center gap-1.5 text-xs font-medium text-primary/80 hover:text-primary transition-colors"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      {isExpanded ? 'Ocultar explicación' : 'Ver explicación'}
                      <ChevronRight className={cn('w-3 h-3 transition-transform', isExpanded && 'rotate-90')} />
                    </button>

                    {isExpanded && (
                      <div className="mt-2 glass p-3 rounded-xl border-l-4 border-primary">
                        <p className="text-blue-200/70 text-xs leading-relaxed">{sq.question.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12 text-blue-300/40">
                <AlertCircle className="w-8 h-8 mx-auto mb-3" />
                <p className="text-sm">No hay preguntas en esta categoría</p>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  // ── ACTIVE SIMULACRUM ──
  return (
    <div className="min-h-[100dvh] flex flex-col bg-deep-950">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
        <div className="px-4">
          <div className="flex items-center justify-between h-12">
            <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
            </Link>
            <div className="flex-1 min-w-0 mx-3 text-center">
              <h1 className="font-semibold text-white text-xs truncate">{currentSimulacrum.name}</h1>
            </div>
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-lg font-mono text-xs font-bold flex-shrink-0',
              timeRemaining <= 300 ? 'bg-red-500/10 text-red-400 animate-pulse' : 'bg-primary/10 text-primary'
            )}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
        <div className="h-0.5 bg-white/[0.04]">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress.percentage}%` }} />
        </div>
      </header>

      {/* Question navigator */}
      <div className="px-4 py-2 overflow-x-auto scrollbar-hide border-b border-white/[0.04]">
        <div className="flex gap-1 min-w-max justify-center">
          {simQuestions.map((sq, index) => {
            const isCurrent = index === currentQuestionIndex
            const isAnswered = !!answers[sq.question_id]
            return (
              <button
                key={sq.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={cn(
                  'w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-medium transition-all flex-shrink-0',
                  isCurrent ? 'ring-2 ring-primary bg-primary text-white scale-110' :
                  isAnswered ? 'bg-primary/20 text-primary' :
                  'bg-white/[0.04] text-blue-300/40'
                )}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Question + Options */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        {currentQuestion && (
          <div key={currentQuestion.id} className="animate-slide-up">
            {/* Tags */}
            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', getDifficultyColor(currentQuestion.question.difficulty))}>
                {currentQuestion.question.difficulty}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                {currentQuestion.question.subtopic.area.name}
              </span>
            </div>

            {/* Statement */}
            <h2 className="text-base font-medium text-white mb-4 leading-relaxed">
              {currentQuestion.question.statement}
            </h2>

            {/* Options */}
            <div className="space-y-2">
              {Object.entries(currentQuestion.question.options).map(([key, value]) => {
                const isSelected = answers[currentQuestion.question_id] === key
                return (
                  <button
                    key={key}
                    onClick={() => handleAnswer(currentQuestion.question_id, key)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all active:scale-[0.98]',
                      isSelected
                        ? 'bg-primary/10 border-2 border-primary shadow-[0_0_16px_rgba(20,184,166,0.15)]'
                        : 'bg-white/[0.03] border border-white/[0.06] active:bg-white/[0.06]'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0',
                      isSelected ? 'bg-primary text-white' : 'bg-white/[0.06] text-blue-200/60'
                    )}>
                      {key}
                    </div>
                    <span className="text-white text-sm flex-1 leading-snug">{value}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 glass border-t border-white/[0.08] px-4 py-3 safe-area-bottom">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <div className="text-xs text-blue-300/30 font-medium">
            {currentQuestionIndex + 1}/{simQuestions.length}
          </div>

          {currentQuestionIndex === simQuestions.length - 1 ? (
            <button
              onClick={submitSimulacrum}
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-primary to-primary-600 text-white shadow-[0_4px_20px_rgba(20,184,166,0.35)] hover:shadow-[0_8px_30px_rgba(20,184,166,0.45)] disabled:opacity-40 transition-all active:scale-95"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Finalizar <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-all active:scale-95"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Start overlay. Reached by drafts and by legacy `in_progress` rows that
          were created without a started_at and so have no running clock.
          (Completed simulacrums returned above, in the results view.) */}
      {!isActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-950/80 backdrop-blur-sm px-6">
          <GlassCard className="p-8 text-center rounded-3xl max-w-sm w-full" hover={false}>
            <Brain className="w-14 h-14 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-bold text-white mb-2">¿Listo para comenzar?</h2>
            <p className="text-sm text-blue-200/60 mb-6">
              {currentSimulacrum.total_questions} preguntas · {currentSimulacrum.time_limit_minutes} min
            </p>
            <GlassButton onClick={startSimulacrum} className="w-full">
              <Play className="w-5 h-5" /> Iniciar simulacro
            </GlassButton>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
