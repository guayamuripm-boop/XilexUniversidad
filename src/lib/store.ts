import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Question {
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

interface SimulacrumQuestion {
  id: string
  simulacrum_id: string
  question_id: string
  user_answer: string | null
  is_correct: boolean | null
  answered_at: string | null
  time_spent_seconds: number | null
  order_index: number
  question: Question
}

interface Simulacrum {
  id: string
  name: string
  total_questions: number
  time_limit_minutes: number
  status: 'draft' | 'in_progress' | 'completed' | 'abandoned'
  score: number | null
  correct_count: number | null
  incorrect_count: number | null
  unanswered_count: number | null
}

interface SimulacrumState {
  currentSimulacrum: Simulacrum | null
  questions: SimulacrumQuestion[]
  currentQuestionIndex: number
  answers: Record<string, string>
  timeRemaining: number
  isActive: boolean
  
  setSimulacrum: (simulacrum: Simulacrum, questions: SimulacrumQuestion[]) => void
  setAnswer: (questionId: string, answer: string) => void
  setCurrentQuestionIndex: (index: number) => void
  setTimeRemaining: (seconds: number) => void
  setActive: (active: boolean) => void
  nextQuestion: () => void
  prevQuestion: () => void
  getCurrentQuestion: () => SimulacrumQuestion | undefined
  getProgress: () => { answered: number; total: number; percentage: number }
  reset: () => void
}

export const useSimulacrumStore = create<SimulacrumState>()(
  persist(
    (set, get) => ({
      currentSimulacrum: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      timeRemaining: 0,
      isActive: false,

      setSimulacrum: (simulacrum, questions) => set({
        currentSimulacrum: simulacrum,
        questions,
        currentQuestionIndex: 0,
        answers: {},
        timeRemaining: simulacrum.time_limit_minutes * 60,
        isActive: true,
      }),

      setAnswer: (questionId, answer) => set((state) => ({
        answers: { ...state.answers, [questionId]: answer },
      })),

      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

      setTimeRemaining: (seconds) => set({ timeRemaining: seconds }),

      setActive: (active) => set({ isActive: active }),

      nextQuestion: () => set((state) => ({
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1),
      })),

      prevQuestion: () => set((state) => ({
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      })),

      getCurrentQuestion: () => {
        const { questions, currentQuestionIndex } = get()
        return questions[currentQuestionIndex]
      },

      getProgress: () => {
        const { questions, answers } = get()
        const answered = Object.keys(answers).filter(k => answers[k]).length
        return {
          answered,
          total: questions.length,
          percentage: questions.length > 0 ? Math.round((answered / questions.length) * 100) : 0,
        }
      },

      reset: () => set({
        currentSimulacrum: null,
        questions: [],
        currentQuestionIndex: 0,
        answers: {},
        timeRemaining: 0,
        isActive: false,
      }),
    }),
    {
      name: 'xilex-simulacrum',
      partialize: (state) => ({
        currentSimulacrum: state.currentSimulacrum,
        questions: state.questions,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        timeRemaining: state.timeRemaining,
        isActive: state.isActive,
      }),
    }
  )
)

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'system',
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'xilex-ui',
    }
  )
)

interface AuthState {
  user: { id: string; email: string; full_name: string | null; target_universities: string[] } | null
  targetUniversities: string[]
  setUser: (user: AuthState['user']) => void
  setTargetUniversities: (universities: string[]) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      targetUniversities: [],
      setUser: (user) => set({ user }),
      setTargetUniversities: (universities) => set({ targetUniversities: universities }),
      clearUser: () => set({ user: null, targetUniversities: [] }),
    }),
    {
      name: 'xilex-auth',
    }
  )
)