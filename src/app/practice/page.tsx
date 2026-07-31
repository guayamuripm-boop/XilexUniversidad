'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GlassCard, GlassButton } from '@/components/ui/glass'
import { Brain, Target, Play, Users, Trophy, ArrowRight, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react'
import { getUniversityAccent, getUniversityName } from '@/lib/utils'

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
    // Cifras del Manual de Información General de la PDU: cada prueba tiene 50
    // planteamientos de cuatro alternativas; 75 minutos la cuantitativa y 60 la
    // verbal.
    areas: [
      { code: 'cuantitativo', name: 'Aptitud Cuantitativa', questions: 50, time: 75 },
      { code: 'verbal', name: 'Aptitud Verbal', questions: 50, time: 60 },
    ],
    totalQuestions: 100,
    totalTime: 135,
    status: 'active',
    description: 'PDU igual para todas las carreras. Resta 1/3 de punto por respuesta incorrecta.',
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

type University = typeof universities[number]

/**
 * Minutos por pregunta que concede la prueba real, promediados sobre las áreas
 * elegidas. Antes se usaba un 1,5 fijo para todas las universidades, lo que
 * regalaba tiempo en las áreas más rápidas: la verbal de la UNIMET, por
 * ejemplo, da 60 minutos para 50 preguntas, es decir 1,2 por pregunta.
 */
function minutesPerQuestion(u: University, areaCodes: string[]): number {
  const areas = areaCodes.length > 0
    ? u.areas.filter(a => areaCodes.includes(a.code))
    : u.areas
  const q = areas.reduce((s, a) => s + a.questions, 0)
  const t = areas.reduce((s, a) => s + a.time, 0)
  return q > 0 ? t / q : 1.5
}

export default function PracticePage() {
  const router = useRouter()
  const [selectedUni, setSelectedUni] = useState<string | null>(null)
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [questionCount, setQuestionCount] = useState(20)
  const [loading, setLoading] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleStartSimulacrum = async () => {
    if (!selectedUni) return

    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push(`/auth/login?redirect=/practice`)
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('target_clusters')
        .eq('id', user.id)
        .maybeSingle()

      const userClusters: string[] = userData?.target_clusters || []

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
      if (!areas || areas.length === 0) {
        throw new Error('Esta universidad todavía no tiene áreas configuradas')
      }

      const chosenAreas = selectedAreas.length > 0
        ? areas.filter(a => selectedAreas.includes(a.code))
        : areas
      const areaIds = chosenAreas.map(a => a.id)

      // "especializacion" is the only area whose questions are tagged by cluster.
      // Applying the cluster filter to the whole query would also drop every
      // logico/verbal question (they have no cluster rows), so the two groups are
      // fetched separately and merged.
      const especializacion = selectedUni === 'simadi'
        ? chosenAreas.find(a => a.code === 'especializacion')
        : undefined
      const clusterCodes = userClusters.length > 0 ? userClusters : null
      const generalAreaIds = areaIds.filter(id => id !== especializacion?.id)

      const fetchQuestions = async (ids: string[], clusters: string[] | null, limit: number) => {
        if (ids.length === 0 || limit <= 0) return []
        const { data, error: rpcError } = await supabase.rpc('get_random_questions', {
          p_university_ids: [universityId],
          p_area_ids: ids,
          p_limit: limit,
          p_exclude_ids: [],
          p_cluster_codes: clusters,
        })
        if (rpcError) throw rpcError
        return data ?? []
      }

      let questions: any[]
      if (especializacion && generalAreaIds.length > 0) {
        // Split the requested total proportionally between the two groups.
        const espShare = Math.max(1, Math.round(questionCount / chosenAreas.length))
        const [esp, general] = await Promise.all([
          fetchQuestions([especializacion.id], clusterCodes, espShare),
          fetchQuestions(generalAreaIds, null, questionCount - espShare),
        ])
        questions = [...esp, ...general]
      } else if (especializacion) {
        questions = await fetchQuestions([especializacion.id], clusterCodes, questionCount)
      } else {
        questions = await fetchQuestions(areaIds, null, questionCount)
      }

      if (questions.length === 0) {
        throw new Error(
          especializacion && clusterCodes
            ? 'No hay preguntas para tu cluster de especialización. Revisa tu selección en Configuración.'
            : 'No hay preguntas disponibles para esta configuración'
        )
      }

      const uniqueQuestions = Array.from(
        new Map(questions.map((q: any) => [q.id, q])).values()
      )

      const { data: simulacrum, error: simError } = await supabase
        .from('simulacrums')
        .insert({
          user_id: user.id,
          name: `${getUniversityName(selectedUni)} - ${selectedAreas.length > 0 ? selectedAreas.join(', ') : 'Completo'}`,
          type: 'university',
          university_ids: [universityId],
          area_ids: areaIds,
          // Both must reflect what was actually drawn, not what was requested:
          // the bank may hold fewer questions than the slider asked for.
          total_questions: uniqueQuestions.length,
          // El ritmo lo fija la prueba real de cada área, no una constante.
          time_limit_minutes: Math.max(1, Math.round(
            uniqueQuestions.length * minutesPerQuestion(
              universities.find(u => u.code === selectedUni)!, selectedAreas)
          )),
          status: 'in_progress',
          // Without started_at the simulacrum page cannot compute the remaining
          // time and the countdown stays frozen at 00:00.
          started_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (simError) throw simError

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
      setError(err?.message || 'No se pudo crear el simulacro. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const uni = universities.find(u => u.code === selectedUni)
  const estimatedMinutes = uni
    ? Math.max(1, Math.round(questionCount * minutesPerQuestion(uni, selectedAreas)))
    : 0

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
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${getUniversityAccent(u.code)}`}>
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
                    <span className="text-blue-200/60">Tiempo</span>
                    <span className="font-semibold text-white">
                      {estimatedMinutes} min
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200/60">Ritmo real de la prueba</span>
                    <span className="font-semibold text-white">
                      {minutesPerQuestion(uni, selectedAreas).toFixed(2).replace('.', ',')} min/pregunta
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200/60">Áreas seleccionadas</span>
                    <span className="font-semibold text-white">
                      {selectedAreas.length > 0 ? selectedAreas.length : uni.areas.length}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-2xl text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

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
