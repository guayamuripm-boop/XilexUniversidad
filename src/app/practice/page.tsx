'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GlassCard, GlassButton } from '@/components/ui/glass'
import { Brain, Target, Play, Clock, Users, Trophy, ArrowRight, Plus, CheckCircle2, Sparkles } from 'lucide-react'
import { getUniversityColor, getUniversityName } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const universities = [
  {
    code: 'simadi',
    name: 'SIMADI (UCV)',
    areas: [
      { code: 'logico', name: 'Razonamiento Lógico', questions: 30, time: 45 },
      { code: 'verbal', name: 'Razonamiento Verbal', questions: 30, time: 45 },
      { code: 'especializacion', name: 'Especialización (Bloque 3)', questions: 30, time: 45 },
    ],
    totalQuestions: 90,
    totalTime: 135,
    status: 'active',
    description: 'Examen común para todas las carreras. 3er bloque varía por cluster.',
  },
  {
    code: 'unimet',
    name: 'UNIMET',
    areas: [
      { code: 'cuantitativo', name: 'Aptitud Cuantitativa', questions: 45, time: 60 },
      { code: 'verbal', name: 'Aptitud Verbal', questions: 45, time: 60 },
    ],
    totalQuestions: 90,
    totalTime: 120,
    status: 'active',
    description: 'PDU igual para todas las carreras. Índice: 75% prueba + 25% notas.',
  },
  {
    code: 'usb',
    name: 'USB',
    areas: [
      { code: 'habilidades', name: 'Habilidades', questions: 34, time: 50 },
      { code: 'conocimientos', name: 'Conocimientos', questions: 66, time: 70 },
    ],
    totalQuestions: 100,
    totalTime: 120,
    status: 'active',
    description: 'Examen único para carreras largas. Solo cambia puntaje de corte.',
  },
  {
    code: 'ucab',
    name: 'UCAB',
    areas: [
      { code: 'verbal', name: 'Prueba Verbal', questions: 34, time: 40 },
      { code: 'numerica', name: 'Prueba Numérica', questions: 33, time: 40 },
      { code: 'logico', name: 'Razonamiento Lógico', questions: 33, time: 40 },
    ],
    totalQuestions: 100,
    totalTime: 120,
    status: 'active',
    description: 'Prueba común a 19 carreras y 5 TSU. IIA determina corte.',
  },
]

export default function PracticePage() {
  const router = useRouter()
  const [selectedUni, setSelectedUni] = useState<string | null>(null)
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [questionCount, setQuestionCount] = useState(20)
  const [loading, setLoading] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  const supabase = createClient()

  const handleStartSimulacrum = async () => {
    if (!selectedUni) return
    
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push(`/auth/login?redirect=/practice`)
        return
      }

      // Obtener clusters del usuario si es SIMADI
      const { data: userData } = await supabase
        .from('users')
        .select('target_clusters')
        .eq('id', user.id)
        .single()

      const userClusters = userData?.target_clusters || []

      const { data: uniData, error: uniError } = await supabase
        .from('universities')
        .select('id')
        .eq('code', selectedUni)
        .single()

      if (uniError || !uniData) {
        throw new Error(`Universidad no encontrada: ${uniError?.message || 'Código inválido'}`)
      }

      const universityId = uniData.id

      const { data: areas, error: areasError } = await supabase
        .from('areas')
        .select('id, code')
        .eq('university_id', universityId)

      if (areasError) throw areasError
      if (!areas || areas.length === 0) throw new Error('No areas found for this university')

      const areaIds = selectedAreas.length > 0 
        ? areas.filter(a => selectedAreas.includes(a.code)).map(a => a.id)
        : areas.map(a => a.id)

      // Obtener clusters del usuario si es SIMADI y se selecciona especializacion
      const hasEspecializacion = selectedAreas.includes('especializacion') && selectedUni === 'simadi'
      const clusterCodes = hasEspecializacion ? userClusters : null

      const { data: questions, error } = await supabase.rpc('get_random_questions', {
        p_university_ids: [universityId],
        p_area_ids: areaIds,
        p_limit: questionCount,
        p_exclude_ids: [],
        p_cluster_codes: clusterCodes,
      })

      if (error) throw error

      if (!questions || questions.length === 0) {
        throw new Error('No hay preguntas disponibles para esta configuración')
      }

      const { data: simulacrum, error: simError } = await supabase
        .from('simulacrums')
        .insert({
          user_id: user.id,
          name: `${getUniversityName(selectedUni)} - ${selectedAreas.length > 0 ? selectedAreas.join(', ') : 'Completo'}`,
          type: 'university',
          university_ids: [universityId],
          area_ids: areaIds,
          total_questions: questions.length,
          time_limit_minutes: Math.round(questionCount * 1.5),
          status: 'in_progress',
        })
        .select()
        .single()

      if (simError) throw simError

      const uniqueQuestionsMap = new Map<string, any>()
      for (const q of questions) {
        if (!uniqueQuestionsMap.has(q.id)) {
          uniqueQuestionsMap.set(q.id, q)
        }
      }
      const uniqueQuestions = Array.from(uniqueQuestionsMap.values())
      
      const simQuestions = uniqueQuestions.map((q: any, i: number) => ({
        simulacrum_id: simulacrum.id,
        question_id: q.id,
        order_index: i,
      }))

      const { error: sqError } = await supabase
        .from('simulacrum_questions')
        .upsert(simQuestions, { 
          onConflict: 'simulacrum_id,question_id',
          ignoreDuplicates: true
        })

      if (sqError) throw sqError

      router.push(`/simulacrum/${simulacrum.id}`)
    } catch (err: any) {
      console.error('Error creating simulacrum:', err)
      alert(`Error: ${err.message || err}\n\nDetalles:\n${JSON.stringify(err, null, 2)}`)
    } finally {
      setLoading(false)
    }
  }

  const uni = universities.find(u => u.code === selectedUni)

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">XILEX</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Crear tu <span className="text-primary">simulacro personalizado</span>
          </h1>
          <p className="text-lg text-blue-200/60 max-w-2xl">
            Elige universidad, áreas y número de preguntas. Practica a tu ritmo con feedback inmediato.
          </p>
        </div>

        {/* University Selection */}
        <div className="mb-10 animate-slide-up">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            1. Selecciona tu universidad objetivo
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {universities.map((u) => (
              <button
                key={u.code}
                onClick={() => {
                  setSelectedUni(u.code)
                  setSelectedAreas([])
                  setShowConfig(u.status === 'active')
                }}
                className={`glass card-hover p-4 relative group rounded-3xl ${
                  selectedUni === u.code 
                    ? 'ring-2 ring-primary border-primary/30 bg-primary/5' 
                    : ''
                } ${u.status === 'coming' ? 'opacity-60' : ''}`}
                disabled={u.status === 'coming'}
              >
                {u.status === 'coming' && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 text-xs font-medium rounded-full bg-white/[0.04] text-blue-300/40">
                    Próximamente
                  </div>
                )}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${getUniversityColor(u.code).replace('text-', 'bg-')}`}>
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1">{u.name}</h3>
                <p className="text-sm text-blue-300/40 mb-3 line-clamp-2">{u.description}</p>
                <div className="flex flex-wrap gap-1">
                  {u.areas.map(a => (
                    <span key={a.code} className="px-2 py-0.5 text-xs bg-white/[0.04] rounded text-blue-200/60">
                      {a.name}
                    </span>
                  ))}
                </div>
                {selectedUni === u.code && (
                  <CheckCircle2 className="absolute bottom-3 right-3 w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Configuration */}
        {showConfig && uni && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
            {/* Areas Selection */}
            <GlassCard className="p-6 rounded-3xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                2. Elige áreas a practicar
              </h3>
              <div className="space-y-3">
                {uni.areas.map((area) => (
                  <label
                    key={area.code}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedAreas.includes(area.code)
                        ? 'border-primary bg-primary/5'
                        : 'border-white/[0.08] hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={area.code}
                      checked={selectedAreas.includes(area.code)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAreas([...selectedAreas, area.code])
                        } else {
                          setSelectedAreas(selectedAreas.filter(a => a !== area.code))
                        }
                      }}
                      className="w-5 h-5 text-primary border-primary rounded focus:ring-primary/50"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white">{area.name}</div>
                      <div className="text-sm text-blue-300/40">
                        {area.questions} preguntas · {area.time} min
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">{area.questions}</div>
                      <div className="text-xs text-blue-300/40">preguntas</div>
                    </div>
                  </label>
                ))}
              </div>
              {selectedAreas.length === 0 && (
                <p className="mt-4 text-sm text-accent-amber flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Selecciona al menos un área o deja vacío para practicar todas
                </p>
              )}
            </GlassCard>

            {/* Question Count & Summary */}
            <GlassCard className="p-6 rounded-3xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                3. Configura tu simulacro
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Número de preguntas: {questionCount}
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={uni.totalQuestions}
                    step={5}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-blue-300/40 mt-1">
                    <span>Mín: 10</span>
                    <span>Máx: {uni.totalQuestions}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200/60">Preguntas</span>
                    <span className="font-semibold text-white">{questionCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200/60">Tiempo estimado</span>
                    <span className="font-semibold text-white">
                      ~{Math.round(questionCount * 1.5)} min
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200/60">Áreas seleccionadas</span>
                    <span className="font-semibold text-white">
                      {selectedAreas.length > 0 ? selectedAreas.length : uni.areas.length}
                    </span>
                  </div>
                </div>

                <GlassButton
                  onClick={handleStartSimulacrum}
                  disabled={loading || questionCount < 10}
                  className="w-full rounded-2xl"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creando simulacro...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Iniciar simulacro
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </GlassButton>

                <p className="text-center text-xs text-blue-300/40">
                  Gratis · Sin límite de intentos · Feedback explicado
                </p>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Features preview */}
        <section className="mt-16 animate-fade-in">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            ¿Por qué practicar con <span className="text-primary">XILEX</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'Ejercicios propios', desc: 'Banco original clasificado por universidad, área y subtema. No copiamos exámenes filtrados.' },
              { icon: Trophy, title: 'Feedback explicado', desc: 'Cada respuesta tiene su explicación detallada. Aprendes del error, no solo ves si acertaste.' },
              { icon: Users, title: 'Progreso por subtema', desc: 'Mide tu dominio en Acentuación, Silogismos, Analogías, Comprensión y más. No solo puntaje global.' },
            ].map((f, i) => (
              <GlassCard key={f.title} className="p-6 rounded-3xl card-hover">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-blue-200/60">{f.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
