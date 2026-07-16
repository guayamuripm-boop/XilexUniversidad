'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GlassCard, GlassButton } from '@/components/ui/glass'
import { useSimulacrumStore } from '@/lib/store'
import { 
  Brain, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight, 
  Flag, ArrowRight, Loader2, Play, Home, AlertCircle
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
      area: { id: string; name: string; code: string }
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

  const supabase = createClient()

  useEffect(() => {
    const loadSimulacrum = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push(`/auth/login?redirect=/simulacrum/${simulacrumId}`)
          return
        }

        const { data: simData, error } = await supabase
          .from('simulacrums')
          .select(`*, simulacrum_questions (*, question:questions (*, subtopic:subtopics (id, name, area:areas (id, name, code))))`)
          .eq('id', simulacrumId)
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        if (!simData) throw new Error('Simulacro no encontrado')

        const sorted = simData.simulacrum_questions
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((sq: any) => ({ ...sq, question: sq.question })) as SimulacrumQuestion[]

        setSimulacrum(simData, sorted)

        if (simData.status === 'in_progress' && simData.started_at) {
          const elapsed = Math.floor((Date.now() - new Date(simData.started_at).getTime()) / 1000)
          const total = simData.time_limit_minutes * 60
          setTimeRemaining(Math.max(0, total - elapsed))
          setActive(true)
        }
      } catch (err) {
        console.error('Error loading simulacrum:', err)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    loadSimulacrum()
  }, [simulacrumId, setSimulacrum, setTimeRemaining, setActive, router, supabase])

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return
    const interval = setInterval(() => {
      if (timeRemaining <= 1) {
        setActive(false)
        submitSimulacrum()
      } else {
        setTimeRemaining(timeRemaining - 1)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isActive, timeRemaining, setTimeRemaining, setActive])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = getProgress()
  const simQuestions = questions

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setAnswer(questionId, answer)
  }, [setAnswer])

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
      await supabase.from('simulacrums').update({ status: 'in_progress', started_at: new Date().toISOString() }).eq('id', simulacrumId)
      setActive(true)
      setTimeRemaining(currentSimulacrum?.time_limit_minutes ? currentSimulacrum.time_limit_minutes * 60 : 0)
    } catch (err) {
      console.error('Error starting:', err)
    }
  }

  const submitSimulacrum = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let correct = 0
      const sqUpdates = simQuestions.map((sq, index) => {
        const userAnswer = answers[sq.question_id]
        const isCorrect = userAnswer === sq.question.correct_answer
        if (isCorrect) correct++
        return {
          simulacrum_id: simulacrumId, question_id: sq.question_id,
          user_answer: userAnswer || null, is_correct: isCorrect,
          answered_at: userAnswer ? new Date().toISOString() : null,
          time_spent_seconds: 0, order_index: index,
        }
      })

      const { error: upsertErr } = await supabase
        .from('simulacrum_questions')
        .upsert(sqUpdates, { onConflict: 'simulacrum_id,question_id', ignoreDuplicates: false })

      if (upsertErr) {
        for (const u of sqUpdates) {
          await supabase.from('simulacrum_questions')
            .update({ user_answer: u.user_answer, is_correct: u.is_correct, answered_at: u.answered_at, time_spent_seconds: u.time_spent_seconds })
            .eq('simulacrum_id', simulacrumId).eq('question_id', u.question_id)
        }
      }

      const score = simQuestions.length > 0 ? (correct / simQuestions.length) * 100 : 0
      const unanswered = simQuestions.length - Object.keys(answers).length
      const { error: simErr } = await supabase.from('simulacrums').update({
        status: 'completed', score, correct_count: correct,
        incorrect_count: simQuestions.length - correct - unanswered,
        unanswered_count: unanswered, completed_at: new Date().toISOString(),
      }).eq('id', simulacrumId)

      if (simErr) throw simErr

      for (const sq of simQuestions) {
        const userAnswer = answers[sq.question_id]
        if (userAnswer) {
          await supabase.rpc('update_user_progress', {
            p_user_id: user.id, p_question_id: sq.question_id,
            p_is_correct: userAnswer === sq.question.correct_answer, p_time_spent_seconds: 0,
          })
        }
      }

      reset()
      window.location.href = `/simulacrum/${simulacrumId}`
    } catch (err) {
      console.error('Error submitting:', err)
      alert('Error al enviar. Intenta de nuevo.')
      setSubmitting(false)
    }
  }

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
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
          <div className="px-4 h-14 flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
            </Link>
          </div>
        </header>

        <main className="px-4 py-6 max-w-2xl mx-auto">
          <GlassCard className="p-6 text-center mb-6 rounded-3xl animate-fade-in">
            <span className={cn(
              'inline-block px-5 py-2 rounded-full text-2xl font-bold mb-4',
              (currentSimulacrum.score ?? 0) >= 70 ? 'bg-accent-emerald/10 text-accent-emerald' :
              (currentSimulacrum.score ?? 0) >= 50 ? 'bg-accent-amber/10 text-accent-amber' :
              'bg-red-500/10 text-red-400'
            )}>
              {currentSimulacrum.score?.toFixed(1)}%
            </span>
            <h2 className="text-xl font-bold text-white mb-4">{currentSimulacrum.name}</h2>
            <div className="flex justify-center gap-4 text-sm text-blue-200/60 mb-6">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-accent-emerald" /> {currentSimulacrum.correct_count} correctas</span>
              <span className="flex items-center gap-1"><XCircle className="w-4 h-4 text-red-400" /> {currentSimulacrum.incorrect_count} incorrectas</span>
              <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4 text-accent-amber" /> {currentSimulacrum.unanswered_count} sin responder</span>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard" className="btn-secondary text-sm"><Home className="w-4 h-4" /> Dashboard</Link>
              <Link href="/practice" className="btn-primary text-sm"><Play className="w-4 h-4" /> Nuevo</Link>
            </div>
          </GlassCard>

          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" /> Revisión
          </h3>

          <div className="space-y-4">
            {simQuestions.map((sq) => {
              const isCorrect = sq.is_correct
              const userAnswer = sq.user_answer
              const correctAnswer = sq.question.correct_answer
              return (
                <GlassCard key={sq.id} className="p-4 rounded-3xl">
                  <div className="flex items-center gap-2 text-xs mb-3 flex-wrap">
                    <span className={cn('px-2 py-0.5 rounded-full font-medium', getDifficultyColor(sq.question.difficulty))}>{sq.question.difficulty}</span>
                    <span className="px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">{sq.question.subtopic.area.name}</span>
                    {isCorrect === true && <CheckCircle2 className="w-4 h-4 text-accent-emerald" />}
                    {isCorrect === false && <XCircle className="w-4 h-4 text-red-400" />}
                    {userAnswer === null && <AlertCircle className="w-4 h-4 text-accent-amber" />}
                  </div>
                  <p className="text-white text-sm mb-3 leading-relaxed">{sq.question.statement}</p>
                  <div className="space-y-2 mb-3">
                    {Object.entries(sq.question.options).map(([key, value]) => (
                      <div key={key} className={cn(
                        'flex items-center gap-3 p-2.5 rounded-xl text-sm',
                        key === correctAnswer ? 'bg-accent-emerald/10 border border-accent-emerald/30' :
                        key === userAnswer ? 'bg-red-500/10 border border-red-500/30' :
                        'bg-white/[0.03] border border-white/[0.06]'
                      )}>
                        <div className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0',
                          key === correctAnswer ? 'bg-accent-emerald text-white' :
                          key === userAnswer ? 'bg-red-500 text-white' :
                          'bg-white/[0.08] text-blue-200/60'
                        )}>{key}</div>
                        <span className="text-blue-100 flex-1">{value}</span>
                        {key === correctAnswer && <CheckCircle2 className="w-4 h-4 text-accent-emerald" />}
                        {key === userAnswer && key !== correctAnswer && <XCircle className="w-4 h-4 text-red-400" />}
                      </div>
                    ))}
                  </div>
                  <div className="glass p-3 rounded-xl border-l-4 border-primary">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Brain className="w-3.5 h-3.5 text-primary" />
                      <span className="font-medium text-white text-xs">Explicación</span>
                    </div>
                    <p className="text-blue-200/70 text-xs leading-relaxed">{sq.question.explanation}</p>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </main>
      </div>
    )
  }

  // ── ACTIVE SIMULACRUM ──
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
        <div className="px-3 sm:px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
            </Link>
            <div className="flex-1 min-w-0 mx-3">
              <h1 className="font-semibold text-white text-sm truncate">{currentSimulacrum.name}</h1>
              <p className="text-xs text-blue-300/40">{currentQuestionIndex + 1} de {simQuestions.length}</p>
            </div>
            <div className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold flex-shrink-0',
              timeRemaining <= 300 ? 'bg-red-500/10 text-red-400 animate-pulse' : 'bg-primary/10 text-primary'
            )}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-white/[0.04]">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress.percentage}%` }} />
        </div>
      </header>

      {/* Question navigator - horizontal scroll */}
      <div className="px-3 sm:px-4 py-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 min-w-max">
          {simQuestions.map((sq, index) => {
            const isCurrent = index === currentQuestionIndex
            const isAnswered = !!answers[sq.question_id]
            return (
              <button
                key={sq.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all flex-shrink-0',
                  isCurrent ? 'ring-2 ring-primary bg-primary text-white' :
                  isAnswered ? 'bg-primary/15 text-primary' :
                  'bg-white/[0.04] text-blue-300/40'
                )}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Question + Options - scrollable */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-3">
        {currentQuestion && (
          <div className="glass rounded-3xl p-4 sm:p-5 animate-slide-up">
            {/* Tags */}
            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getDifficultyColor(currentQuestion.question.difficulty))}>
                {currentQuestion.question.difficulty}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {currentQuestion.question.subtopic.area.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/[0.04] text-blue-200/60">
                {currentQuestion.question.subtopic.name}
              </span>
            </div>

            {/* Statement */}
            <p className="text-base sm:text-lg font-medium text-white mb-5 leading-relaxed">
              {currentQuestion.question.statement}
            </p>

            {/* Options */}
            <div className="space-y-2.5 mb-4">
              {Object.entries(currentQuestion.question.options).map(([key, value]) => {
                const isSelected = answers[currentQuestion.question_id] === key
                return (
                  <button
                    key={key}
                    onClick={() => handleAnswer(currentQuestion.question_id, key)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl text-left transition-all',
                      isSelected
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-white/[0.03] border border-white/[0.06] hover:border-primary/25 hover:bg-primary/[0.03]'
                    )}
                  >
                    <div className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0',
                      isSelected ? 'bg-primary text-white' : 'bg-white/[0.06] text-blue-200/60'
                    )}>
                      {key}
                    </div>
                    <span className="text-white text-sm sm:text-base flex-1 leading-snug">{value}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* Bottom navigation - fixed */}
      <div className="sticky bottom-0 glass border-t border-white/[0.08] px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <GlassButton variant="ghost" onClick={handlePrev} disabled={currentQuestionIndex === 0} size="sm" className="!px-3">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </GlassButton>

          <div className="flex items-center gap-1.5 text-xs text-blue-300/40">
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{answers[currentQuestion?.question_id] ? 'Respondida' : 'Pendiente'}</span>
          </div>

          <div className="flex items-center gap-2">
            {currentQuestionIndex < simQuestions.length - 1 && (
              <GlassButton variant="outline" onClick={handleNext} size="sm" className="!px-3">
                <span className="hidden sm:inline">Saltar</span>
                <ChevronRight className="w-4 h-4" />
              </GlassButton>
            )}

            {currentQuestionIndex === simQuestions.length - 1 ? (
              <GlassButton onClick={submitSimulacrum} disabled={submitting} size="sm" className="!px-4">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Finalizar <ArrowRight className="w-4 h-4" /></>}
              </GlassButton>
            ) : (
              <GlassButton onClick={handleNext} size="sm" className="!px-4">
                Siguiente <ChevronRight className="w-4 h-4" />
              </GlassButton>
            )}
          </div>
        </div>
      </div>

      {/* Draft start */}
      {!isActive && currentSimulacrum.status === 'draft' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-950/80 backdrop-blur-sm px-4">
          <GlassCard className="p-6 sm:p-8 text-center rounded-3xl max-w-sm w-full">
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
