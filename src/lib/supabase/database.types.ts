export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      universities: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      areas: {
        Row: {
          id: string
          university_id: string
          code: string
          name: string
          description: string | null
          question_count: number
          time_limit_minutes: number | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          university_id: string
          code: string
          name: string
          description?: string | null
          question_count?: number
          time_limit_minutes?: number | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          university_id?: string
          code?: string
          name?: string
          description?: string | null
          question_count?: number
          time_limit_minutes?: number | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      subtopics: {
        Row: {
          id: string
          area_id: string
          code: string
          name: string
          description: string | null
          difficulty_weight: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          area_id: string
          code: string
          name: string
          description?: string | null
          difficulty_weight?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          area_id?: string
          code?: string
          name?: string
          description?: string | null
          difficulty_weight?: number
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          subtopic_id: string
          university_id: string
          area_id: string
          statement: string
          options: Json
          correct_answer: string
          explanation: string
          difficulty: 'easy' | 'medium' | 'hard'
          source_type: 'official_model' | 'generated_pattern' | 'original'
          source_reference: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subtopic_id: string
          university_id: string
          area_id: string
          statement: string
          options: Json
          correct_answer: string
          explanation: string
          difficulty?: 'easy' | 'medium' | 'hard'
          source_type?: 'official_model' | 'generated_pattern' | 'original'
          source_reference?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subtopic_id?: string
          university_id?: string
          area_id?: string
          statement?: string
          options?: Json
          correct_answer?: string
          explanation?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          source_type?: 'official_model' | 'generated_pattern' | 'original'
          source_reference?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          target_universities: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          target_universities?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          target_universities?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      simulacrums: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'university' | 'mixed'
          university_ids: string[]
          area_ids: string[]
          total_questions: number
          time_limit_minutes: number
          status: 'draft' | 'in_progress' | 'completed' | 'abandoned'
          score: number | null
          correct_count: number | null
          incorrect_count: number | null
          unanswered_count: number | null
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'university' | 'mixed'
          university_ids: string[]
          area_ids: string[]
          total_questions: number
          time_limit_minutes: number
          status?: 'draft' | 'in_progress' | 'completed' | 'abandoned'
          score?: number | null
          correct_count?: number | null
          incorrect_count?: number | null
          unanswered_count?: number | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'university' | 'mixed'
          university_ids?: string[]
          area_ids?: string[]
          total_questions?: number
          time_limit_minutes?: number
          status?: 'draft' | 'in_progress' | 'completed' | 'abandoned'
          score?: number | null
          correct_count?: number | null
          incorrect_count?: number | null
          unanswered_count?: number | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      simulacrum_questions: {
        Row: {
          id: string
          simulacrum_id: string
          question_id: string
          user_answer: string | null
          is_correct: boolean | null
          answered_at: string | null
          time_spent_seconds: number | null
          order_index: number
        }
        Insert: {
          id?: string
          simulacrum_id: string
          question_id: string
          user_answer?: string | null
          is_correct?: boolean | null
          answered_at?: string | null
          time_spent_seconds?: number | null
          order_index: number
        }
        Update: {
          id?: string
          simulacrum_id?: string
          question_id?: string
          user_answer?: string | null
          is_correct?: boolean | null
          answered_at?: string | null
          time_spent_seconds?: number | null
          order_index?: number
        }
      }
      user_progress: {
        Row: {
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
        }
        Insert: {
          id?: string
          user_id: string
          university_id: string
          area_id: string
          subtopic_id: string
          total_attempts?: number
          correct_attempts?: number
          incorrect_attempts?: number
          accuracy_rate?: number
          avg_time_seconds?: number | null
          last_attempted_at?: string | null
          mastery_level?: 'novice' | 'learning' | 'proficient' | 'mastered'
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          university_id?: string
          area_id?: string
          subtopic_id?: string
          total_attempts?: number
          correct_attempts?: number
          incorrect_attempts?: number
          accuracy_rate?: number
          avg_time_seconds?: number | null
          last_attempted_at?: string | null
          mastery_level?: 'novice' | 'learning' | 'proficient' | 'mastered'
          updated_at?: string
        }
      }
      simad_clusters: {
        Row: {
          id: string
          code: string
          name: string
          description: string
          careers: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description: string
          careers: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string
          careers?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      question_difficulty: 'easy' | 'medium' | 'hard'
      question_source_type: 'official_model' | 'generated_pattern' | 'original'
      simulacrum_type: 'university' | 'mixed'
      simulacrum_status: 'draft' | 'in_progress' | 'completed' | 'abandoned'
      mastery_level: 'novice' | 'learning' | 'proficient' | 'mastered'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type University = Database['public']['Tables']['universities']['Row']
export type Area = Database['public']['Tables']['areas']['Row']
export type Subtopic = Database['public']['Tables']['subtopics']['Row']
export type Question = Database['public']['Tables']['questions']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Simulacrum = Database['public']['Tables']['simulacrums']['Row']
export type SimulacrumQuestion = Database['public']['Tables']['simulacrum_questions']['Row']
export type UserProgress = Database['public']['Tables']['user_progress']['Row']
export type SimadCluster = Database['public']['Tables']['simad_clusters']['Row']

export type QuestionWithDetails = Question & {
  subtopic: Subtopic
  area: Area
  university: University
}

export type SimulacrumWithQuestions = Simulacrum & {
  questions: (SimulacrumQuestion & { question: QuestionWithDetails })[]
}

export type ProgressSummary = {
  university: University
  area: Area
  subtopic: Subtopic
  progress: UserProgress
  mastery: UserProgress['mastery_level']
}