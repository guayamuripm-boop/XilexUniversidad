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

  // Load simulacrum data
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
        
        // If already in progress, set timer
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

  // Timer
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

      // Calculate score
      let correct = 0
      const sqUpdates = simQuestions.map((sq, index) => {
        const userAnswer = answers[sq.question_id]
        const isCorrect = userAnswer === sq.question.correct_answer
        if (isCorrect) correct++

        return {
          simulacrum_id: simulacrumId,
          question_id: sq.question_id,
          user_answer: userAnswer,
          is_correct: isCorrect,
          answered_at: userAnswer ? new Date().toISOString() : null,
          time_spent_seconds: 0, // Could calculate per question
          order_index: index,
        }
      })

      // Update all answers
      const { error: sqError } = await supabase
        .from('simulacrum_questions')
        .upsert(sqUpdates)

      if (sqError) throw sqError

      // Update simulacrum
      const score = simQuestions.length > 0 ? (correct / simQuestions.length) * 100 : 0
      await supabase
        .from('simulacrums')
        .update({
          status: 'completed',
          score,
          correct_count: correct,
          incorrect_count: simQuestions.length - correct - (simQuestions.length - Object.keys(answers).length),
          unanswered_count: simQuestions.length - Object.keys(answers).length,
          completed_at: new Date().toISOString(),
        })
        .eq('id', simulacrumId)

      // Update user progress for each question
      for (const sq of simQuestions) {
        const userAnswer = answers[sq.question_id]
        if (userAnswer) {
          await supabase.rpc('update_user_progress', {
            p_user_id: user.id,
            p_question_id: sq.question_id,
            p_is_correct: userAnswer === sq.question.correct_answer,
            p_time_spent_seconds: 0,
          })
        }
      }

      router.push(`/simulacrum/${simulacrumId}`)
    } catch (err) {
      console.error('Error submitting simulacrum:', err)
      alert('Error al enviar el simulacro. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-[#051817] dark:via-[#0B1F1E] dark:to-[#052826]">
        <div className="glass p-8 rounded-2xl text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Cargando simulacro...</p>
        </div>
      </div>
    )
  }

  if (!currentSimulacrum) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-[#051817] dark:via-[#0B1F1E] dark:to-[#052826]">
        <GlassCard className="p-8 max-w-md w-full text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Simulacro no encontrado</h1>
          <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Volver al dashboard
          </Link>
        </GlassCard>
      </div>
    )
  }

  // Results view
  if (currentSimulacrum.status === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-[#051817] dark:via-[#0B1F1E] dark:to-[#052826]">
        <header className="sticky top-0 z-40 glass border-b border-light-border dark:border-dark-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Score Card */}
          <GlassCard className="p-8 text-center mb-8 animate-fade-in">
            <div className="mb-4">
              <span className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold',
                currentSimulacrum.score! >= 70 
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                  currentSimulacrum.score! >= 50
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              )}>
                {currentSimulacrum.score?.toFixed(1)}%
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{currentSimulacrum.name}</h2>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
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

          {/* Question Review */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Revisión de respuestas
            </h2>
            
            {simQuestions.map((sq) => {
              const isCorrect = sq.is_correct
              const userAnswer = sq.user_answer
              const correctAnswer = sq.question.correct_answer
              
              return (
                <GlassCard key={sq.id} className="p-5 overflow-hidden">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          getDifficultyColor(sq.question.difficulty)
                        )}>
                          {sq.question.difficulty}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-light dark:bg-primary-dark/30 text-primary">
                          {sq.question.subtopic.area.name} / {sq.question.subtopic.name}
                        </span>
                        {isCorrect === true && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {isCorrect === false && <XCircle className="w-4 h-4 text-red-500" />}
                        {userAnswer === null && <AlertCircle className="w-4 h-4 text-amber-500" />}
                      </div>
                      <p className="text-gray-900 dark:text-white">{sq.question.statement}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium',
                        isCorrect ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                        userAnswer ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                      )}>
                        {isCorrect ? 'Correcta' : userAnswer ? 'Incorrecta' : 'Sin responder'}
                      </span>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 mb-4">
                    {Object.entries(sq.question.options).map(([key, value]) => (
                      <div 
                        key={key} 
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-xl transition-colors',
                          key === correctAnswer 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' :
                            key === userAnswer
                            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                            'bg-gray-50 dark:bg-dark-surface/50 border border-light-border dark:border-dark-border'
                        )}
                      >
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0',
                          key === correctAnswer 
                            ? 'bg-emerald-500 text-white' :
                            key === userAnswer
                            ? 'bg-red-500 text-white' :
                            'bg-gray-200 dark:bg-dark-border text-gray-600 dark:text-gray-300'
                        )}>
                          {key}
                        </div>
                        <span className="text-gray-900 dark:text-white">{value}</span>
                        {key === correctAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                        {key === userAnswer && key !== correctAnswer && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  <div className="glass p-4 rounded-xl border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="font-medium text-gray-900 dark:text-white">Explicación</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
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

  // Active / Draft Simulacrum View
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-[#051817] dark:via-[#0B1F1E] dark:to-[#052826]">
      {/* Header with Timer */}
      <header className="sticky top-0 z-40 glass border-b border-light-border dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
              </Link>
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-white text-sm">{currentSimulacrum.name}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Pregunta {currentQuestionIndex + 1} de {simQuestions.length}
                </p>
              </div>
            </div>

            {/* Timer */}
            <div className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold transition-colors',
              timeRemaining <= 300 
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 animate-pulse' 
                : 'bg-primary-light dark:bg-primary-dark/30 text-primary'
            )}>
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>

            {/* Progress */}
            <div className="hidden md:block w-48">
              <div className="h-2 bg-light-border dark:bg-dark-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300" 
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                {progress.answered} / {progress.total} respondidas
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Question Navigator */}
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
                    'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all',
                    isCurrent 
                      ? 'ring-2 ring-primary ring-offset-2 bg-primary text-white' :
                      isCorrect === true
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                      isCorrect === false
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                      isAnswered
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                      'bg-gray-100 dark:bg-dark-border text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-border/50'
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

        {/* Question Card */}
        {currentQuestion && (
          <GlassCard className="p-6 animate-slide-up">
            {/* Subtopic badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                getDifficultyColor(currentQuestion.question.difficulty)
              )}>
                {currentQuestion.question.difficulty}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-light dark:bg-primary-dark/30 text-primary">
                {currentQuestion.question.subtopic.area.name}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-300">
                {currentQuestion.question.subtopic.name}
              </span>
            </div>

            {/* Question Statement */}
            <p className="text-xl font-medium text-gray-900 dark:text-white mb-6 leading-relaxed">
              {currentQuestion.question.statement}
            </p>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {Object.entries(currentQuestion.question.options).map(([key, value]) => {
                const isSelected = answers[currentQuestion.question_id] === key
                return (
                  <button
                    key={key}
                    onClick={() => handleAnswer(currentQuestion.question_id, key)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all',
                      isSelected
                        ? 'bg-primary bg-opacity-10 border-2 border-primary dark:border-primary/50'
                        : 'bg-white/50 dark:bg-dark-surface/50 border border-light-border dark:border-dark-border hover:border-primary/50 hover:bg-primary/5'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg flex-shrink-0',
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-300'
                    )}>
                      {key}
                    </div>
                    <span className="text-gray-900 dark:text-white flex-1">{value}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-light-border dark:border-dark-border">
              <GlassButton 
                variant="ghost" 
                onClick={handlePrev} 
                disabled={currentQuestionIndex === 0}
                size="lg"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </GlassButton>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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

        {/* Start Button (if draft) */}
        {!isActive && currentSimulacrum.status === 'draft' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <GlassCard className="p-8 text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                ¿Listo para comenzar?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Este simulacro tiene {currentSimulacrum.total_questions} preguntas y un límite de {currentSimulacrum.time_limit_minutes} minutos. 
                Una vez iniciado, el tiempo comenzará a correr.
              </p>
              <GlassButton 
                onClick={startSimulacrum} 
                size="lg"
                className="w-full max-w-xs"
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