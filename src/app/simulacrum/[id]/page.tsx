'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GlassCard, GlassButton } from '@/components/ui/glass'
import { useSimulacrumStore } from '@/lib/store'
import { 
  Brain, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  ArrowRight, 
  Loader2, 
  Play,
  Home,
  AlertCircle
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
      area: {
        id: string
        name: string
        code: string
      }
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
}

export default function SimulacrumPage() {
  const router = useRouter()
  const params = useParams()
  const simulacrumId = params.id as string

  const {
    currentSimulacrum,
    questions,
    currentQuestionIndex,
    answers,
    timeRemaining,
    isActive,
    setSimulacrum,
    setAnswer,
    setCurrentQuestionIndex,
    setTimeRemaining,
    setActive,
    nextQuestion,
    prevQuestion,
    getProgress,
    reset,
  } = useSimulacrumStore()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

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
          .select(`
            *,
            simulacrum_questions (
              *,
              question:questions (
                *,
                subtopic:subtopics (
                  id, name,
                  area:areas (id, name, code)
                )
              )
            )
          `)
          .eq('id', simulacrumId)
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        if (!simData) throw new Error('Simulacro no encontrado')

        const sortedQuestions = simData.simulacrum_questions
          .sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
          .map((sq: any) => ({ ...sq, question: sq.question })) as SimulacrumQuestion[]

        setSimulacrum(simData, sortedQuestions)
        
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
      const current = timeRemaining
      if (current <= 1) {
        setActive(false)
        submitSimulacrum()
      } else {
        setTimeRemaining(current - 1)
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
      setQuestionStartTime(Date.now())
    }
  }, [currentQuestionIndex, questions.length, setCurrentQuestionIndex])

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setQuestionStartTime(Date.now())
    }
  }, [currentQuestionIndex, setCurrentQuestionIndex])

  const startSimulacrum = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('simulacrums')
        .update({ 
          status: 'in_progress', 
          started_at: new Date().toISOString() 
        })
        .eq('id', simulacrumId)

      setActive(true)
      setTimeRemaining(currentSimulacrum?.time_limit_minutes ? currentSimulacrum.time_limit_minutes * 60 : 0)
      setQuestionStartTime(Date.now())
    } catch (err) {
      console.error('Error starting simulacrum:', err)
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
          simulacrum_id: simulacrumId,
          question_id: sq.question_id,
          user_answer: userAnswer || null,
          is_correct: isCorrect,
          answered_at: userAnswer ? new Date().toISOString() : null,
          time_spent_seconds: 0,
          order_index: index,
        }
      })

      const { error: upsertErr } = await supabase
        .from('simulacrum_questions')
        .upsert(sqUpdates, {
          onConflict: 'simulacrum_id,question_id',
          ignoreDuplicates: false,
        })

      if (upsertErr) {
        console.error('Upsert error:', upsertErr)
        for (const update of sqUpdates) {
          const { error } = await supabase
            .from('simulacrum_questions')
            .update({
              user_answer: update.user_answer,
              is_correct: update.is_correct,
              answered_at: update.answered_at,
              time_spent_seconds: update.time_spent_seconds,
            })
            .eq('simulacrum_id', simulacrumId)
            .eq('question_id', update.question_id)
          if (error) console.error('Individual update error:', error)
        }
      }

      const score = simQuestions.length > 0 ? (correct / simQuestions.length) * 100 : 0
      const unanswered = simQuestions.length - Object.keys(answers).length
      const { error: simErr } = await supabase
        .from('simulacrums')
        .update({
          status: 'completed',
          score,
          correct_count: correct,
          incorrect_count: simQuestions.length - correct - unanswered,
          unanswered_count: unanswered,
          completed_at: new Date().toISOString(),
        })
        .eq('id', simulacrumId)

      if (simErr) {
        console.error('Simulacrum update error:', simErr)
        throw simErr
      }

      for (const sq of simQuestions) {
        const userAnswer = answers[sq.question_id]
        if (userAnswer) {
          const { error: rpcErr } = await supabase.rpc('update_user_progress', {
            p_user_id: user.id,
            p_question_id: sq.question_id,
            p_is_correct: userAnswer === sq.question.correct_answer,
            p_time_spent_seconds: 0,
          })
          if (rpcErr) console.error('Progress update error:', rpcErr)
        }
      }

      reset()
      window.location.href = `/simulacrum/${simulacrumId}`
    } catch (err) {
      console.error('Error submitting simulacrum:', err)
      alert('Error al enviar el simulacro. Intenta de nuevo.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-3xl text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-200/60">Cargando simulacro...</p>
        </div>
      </div>
    )
  }

  if (!currentSimulacrum) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="p-8 max-w-md w-full text-center rounded-3xl">
          <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold text-white mb-2">Simulacro no encontrado</h1>
          <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Volver al dashboard
          </Link>
        </GlassCard>
      </div>
    )
  }

  if (currentSimulacrum.status === 'completed') {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <GlassCard className="p-8 text-center mb-8 rounded-3xl animate-fade-in">
            <div className="mb-4">
              <span className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold',
                currentSimulacrum.score! >= 70 
                  ? 'bg-accent-emerald/10 text-accent-emerald' :
                  currentSimulacrum.score! >= 50
                  ? 'bg-accent-amber/10 text-accent-amber' :
                  'bg-red-500/10 text-red-400'
              )}>
                {currentSimulacrum.score?.toFixed(1)}%
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{currentSimulacrum.name}</h2>
            <div className="flex items-center justify-center gap-6 text-sm text-blue-200/60">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {currentSimulacrum.correct_count} correctas
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="w-4 h-4 text-red-500" />
                {currentSimulacrum.incorrect_count} incorrectas
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                {currentSimulacrum.unanswered_count} sin responder
              </span>
            </div>
            <div className="flex gap-3 justify-center mt-6">
              <Link href="/dashboard" className="btn-secondary">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/practice" className="btn-primary">
                <Play className="w-4 h-4" />
                Nuevo simulacro
              </Link>
            </div>
          </GlassCard>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Revisión de respuestas
            </h2>
            
            {simQuestions.map((sq) => {
              const isCorrect = sq.is_correct
              const userAnswer = sq.user_answer
              const correctAnswer = sq.question.correct_answer
              
              return (
                <GlassCard key={sq.id} className="p-5 rounded-3xl overflow-hidden">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          getDifficultyColor(sq.question.difficulty)
                        )}>
                          {sq.question.difficulty}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {sq.question.subtopic.area.name} / {sq.question.subtopic.name}
                        </span>
                        {isCorrect === true && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {isCorrect === false && <XCircle className="w-4 h-4 text-red-500" />}
                        {userAnswer === null && <AlertCircle className="w-4 h-4 text-amber-500" />}
                      </div>
                      <p className="text-white">{sq.question.statement}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium',
                        isCorrect ? 'bg-accent-emerald/10 text-accent-emerald' :
                        userAnswer ? 'bg-red-500/10 text-red-400' :
                        'bg-accent-amber/10 text-accent-amber'
                      )}>
                        {isCorrect ? 'Correcta' : userAnswer ? 'Incorrecta' : 'Sin responder'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {Object.entries(sq.question.options).map(([key, value]) => (
                      <div 
                        key={key} 
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-2xl transition-colors',
                          key === correctAnswer 
                            ? 'bg-accent-emerald/10 border border-accent-emerald/30' :
                            key === userAnswer
                            ? 'bg-red-500/10 border border-red-500/30' :
                            'bg-white/[0.04] border border-white/[0.08]'
                        )}
                      >
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0',
                          key === correctAnswer 
                            ? 'bg-emerald-500 text-white' :
                            key === userAnswer
                            ? 'bg-red-500 text-white' :
                            'bg-white/[0.08] text-blue-200/60'
                        )}>
                          {key}
                        </div>
                        <span className="text-white">{value}</span>
                        {key === correctAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                        {key === userAnswer && key !== correctAnswer && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
                      </div>
                    ))}
                  </div>

                  <div className="glass p-4 rounded-2xl border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="font-medium text-white">Explicación</span>
                    </div>
                    <p className="text-blue-200 text-sm leading-relaxed">
                      {sq.question.explanation}
                    </p>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
              </Link>
              <div>
                <h1 className="font-semibold text-white text-sm">{currentSimulacrum.name}</h1>
                <p className="text-xs text-blue-300/40">
                  Pregunta {currentQuestionIndex + 1} de {simQuestions.length}
                </p>
              </div>
            </div>

            <div className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-lg font-bold transition-colors',
              timeRemaining <= 300 
                ? 'bg-red-500/10 text-red-400 animate-pulse' 
                : 'bg-primary/10 text-primary'
            )}>
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>

            <div className="hidden md:block w-48">
              <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300" 
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className="text-xs text-blue-300/40 text-right mt-1">
                {progress.answered} / {progress.total} respondidas
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {simQuestions.map((sq, index) => {
              const isCurrent = index === currentQuestionIndex
              const isAnswered = !!answers[sq.question_id]
              const isCorrect = sq.is_correct
              
              return (
                <button
                  key={sq.id}
                  onClick={() => {
                    setCurrentQuestionIndex(index)
                    setQuestionStartTime(Date.now())
                  }}
                  className={cn(
                    'w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-medium transition-all',
                    isCurrent 
                      ? 'ring-2 ring-primary ring-offset-2 bg-primary text-white' :
                      isCorrect === true
                      ? 'bg-accent-emerald/10 text-accent-emerald' :
                      isCorrect === false
                      ? 'bg-red-500/10 text-red-400' :
                      isAnswered
                      ? 'bg-primary/10 text-primary' :
                      'bg-white/[0.04] text-blue-300/40 hover:bg-white/[0.08]'
                  )}
                  title={`Pregunta ${index + 1}`}
                >
                  {isCorrect === true ? <CheckCircle2 className="w-4 h-4" /> : 
                   isCorrect === false ? <XCircle className="w-4 h-4" /> : 
                   index + 1}
                </button>
              )
            })}
          </div>
        </div>

        {currentQuestion && (
          <GlassCard className="p-6 rounded-3xl animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                getDifficultyColor(currentQuestion.question.difficulty)
              )}>
                {currentQuestion.question.difficulty}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {currentQuestion.question.subtopic.area.name}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/[0.04] text-blue-200/60">
                {currentQuestion.question.subtopic.name}
              </span>
            </div>

            <p className="text-xl font-medium text-white mb-6 leading-relaxed">
              {currentQuestion.question.statement}
            </p>

            <div className="space-y-3 mb-6">
              {Object.entries(currentQuestion.question.options).map(([key, value]) => {
                const isSelected = answers[currentQuestion.question_id] === key
                return (
                  <button
                    key={key}
                    onClick={() => handleAnswer(currentQuestion.question_id, key)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all',
                      isSelected
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-white/[0.04] border border-white/[0.08] hover:border-primary/30 hover:bg-primary/[0.04]'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg flex-shrink-0',
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-white/[0.08] text-blue-200/60'
                    )}>
                      {key}
                    </div>
                    <span className="text-white flex-1">{value}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <GlassButton 
                variant="ghost" 
                onClick={handlePrev} 
                disabled={currentQuestionIndex === 0}
                size="lg"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </GlassButton>

              <div className="flex items-center gap-2 text-sm text-blue-300/40">
                <Flag className="w-4 h-4" />
                {answers[currentQuestion.question_id] ? 'Respondida' : 'Pendiente'}
              </div>

              <div className="flex items-center gap-2">
                {currentQuestionIndex < simQuestions.length - 1 && (
                  <GlassButton 
                    variant="outline"
                    onClick={handleNext}
                    size="lg"
                    className="ml-auto"
                  >
                    Saltar
                    <ChevronRight className="w-4 h-4" />
                  </GlassButton>
                )}

                {currentQuestionIndex === simQuestions.length - 1 ? (
                  <GlassButton 
                    onClick={submitSimulacrum} 
                    disabled={submitting}
                    size="lg"
                    className="ml-auto"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Finalizar
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </GlassButton>
                ) : (
                  <GlassButton 
                    onClick={handleNext} 
                    size="lg"
                    className="ml-auto"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </GlassButton>
                )}
              </div>
            </div>
          </GlassCard>
        )}

        {!isActive && currentSimulacrum.status === 'draft' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <GlassCard className="p-8 text-center rounded-3xl">
              <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold text-white mb-2">
                ¿Listo para comenzar?
              </h2>
              <p className="text-blue-200/60 mb-6 max-w-md mx-auto">
                Este simulacro tiene {currentSimulacrum.total_questions} preguntas y un límite de {currentSimulacrum.time_limit_minutes} minutos. 
                Una vez iniciado, el tiempo comenzará a correr.
              </p>
              <GlassButton 
                onClick={startSimulacrum} 
                size="lg"
                className="w-full max-w-xs rounded-2xl"
              >
                <Play className="w-5 h-5" />
                Iniciar simulacro
              </GlassButton>
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  )
}
