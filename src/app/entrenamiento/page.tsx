'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GlassCard, GlassButton } from '@/components/ui/glass'
import { ExplicacionReforzada, PistaDelMetodo } from '@/components/ExplicacionReforzada'
import {
  Brain, Play, Lightbulb, CheckCircle2, XCircle, ArrowRight, RotateCcw, Eye,
  ShieldCheck, AlertCircle, Loader2, Sparkles, Target, BookOpen, Home, ChevronLeft,
} from 'lucide-react'
import { cn, getDifficultyColor } from '@/lib/utils'
import { metodoParaSubtema, metodoPorSlug } from '@/lib/metodos'

export const dynamic = 'force-dynamic'

interface Subtema { id: string; code: string; name: string; area_id: string }
interface Area { id: string; code: string; name: string; university_id: string }
interface Universidad { id: string; code: string; name: string }

interface Pregunta {
  id: string
  statement: string
  options: Record<string, string>
  correct_answer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  subtopic_id: string
}

/**
 * Estado de cada pregunta dentro de la sesión.
 *
 * `descartadas` guarda los intentos fallidos para tacharlos en pantalla: en el
 * modo entrenamiento un error no cierra la pregunta, la estrecha.
 */
interface EstadoPregunta {
  descartadas: string[]
  resuelta: boolean
  revelada: boolean
  pista: 0 | 1 | 2
  aciertoLimpio: boolean | null
}

const CANTIDADES = [10, 15, 20, 30]

export default function EntrenamientoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Entrenamiento />
    </Suspense>
  )
}

function Entrenamiento() {
  const searchParams = useSearchParams()
  const metodoPedido = searchParams.get('metodo')
  const supabase = createClient()

  const [fase, setFase] = useState<'config' | 'sesion' | 'resumen'>('config')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [universidades, setUniversidades] = useState<Universidad[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [subtemas, setSubtemas] = useState<Subtema[]>([])

  const [uniSel, setUniSel] = useState<string | null>(null)
  const [areaSel, setAreaSel] = useState<string | null>(null)
  const [temasSel, setTemasSel] = useState<string[]>([])
  const [cantidad, setCantidad] = useState(10)
  const [guardarProgreso, setGuardarProgreso] = useState(false)

  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [indice, setIndice] = useState(0)
  const [estados, setEstados] = useState<Record<string, EstadoPregunta>>({})
  const [iniciando, setIniciando] = useState(false)

  const metodoObjetivo = metodoPedido ? metodoPorSlug(metodoPedido) : null

  // ── Carga de la taxonomía ────────────────────────────────────────────────
  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        const [u, a, s] = await Promise.all([
          supabase.from('universities').select('id, code, name').eq('active', true).order('code'),
          supabase.from('areas').select('id, code, name, university_id'),
          supabase.from('subtopics').select('id, code, name, area_id'),
        ])
        if (u.error) throw u.error
        if (a.error) throw a.error
        if (s.error) throw s.error
        if (cancelado) return
        setUniversidades(u.data ?? [])
        setAreas(a.data ?? [])
        setSubtemas(s.data ?? [])
      } catch (e: any) {
        if (!cancelado) setError(e?.message ?? 'No se pudo cargar el catálogo de temas.')
      } finally {
        if (!cancelado) setCargando(false)
      }
    }
    cargar()
    return () => { cancelado = true }
  }, [supabase])

  const areasDeUni = useMemo(
    () => areas.filter(a => a.university_id === uniSel),
    [areas, uniSel]
  )
  const temasDeArea = useMemo(
    () => subtemas.filter(s => s.area_id === areaSel),
    [subtemas, areaSel]
  )
  const subtemaPorId = useMemo(() => {
    const m = new Map<string, Subtema>()
    for (const s of subtemas) m.set(s.id, s)
    return m
  }, [subtemas])
  const areaPorId = useMemo(() => {
    const m = new Map<string, Area>()
    for (const a of areas) m.set(a.id, a)
    return m
  }, [areas])

  /**
   * Al llegar desde «Practicar este tipo», preselecciona la primera
   * universidad y área que tengan temas de ese método, y marca esos temas.
   */
  useEffect(() => {
    if (!metodoObjetivo || cargando || uniSel) return
    const candidatos = subtemas.filter(s => metodoObjetivo.subtemas.includes(s.code))
    if (candidatos.length === 0) return
    const area = areaPorId.get(candidatos[0].area_id)
    if (!area) return
    setUniSel(area.university_id)
    setAreaSel(area.id)
    setTemasSel(candidatos.filter(c => c.area_id === area.id).map(c => c.id))
  }, [metodoObjetivo, cargando, uniSel, subtemas, areaPorId])

  // ── Arranque de la sesión ────────────────────────────────────────────────
  const iniciar = async () => {
    if (!uniSel || !areaSel) return
    setIniciando(true)
    setError('')
    try {
      const { data, error: rpcError } = await supabase.rpc('get_random_questions', {
        p_university_ids: [uniSel],
        p_area_ids: [areaSel],
        p_limit: cantidad,
        p_subtopic_ids: temasSel.length > 0 ? temasSel : null,
        p_exclude_ids: [],
        p_cluster_codes: null,
      })
      if (rpcError) throw rpcError

      const lista = (data ?? []) as Pregunta[]
      if (lista.length === 0) {
        throw new Error(
          temasSel.length > 0
            ? 'Todavía no hay ejercicios de esos temas. Prueba con el área completa.'
            : 'No hay ejercicios disponibles para esta combinación.'
        )
      }

      setPreguntas(lista)
      setEstados(
        Object.fromEntries(
          lista.map(q => [
            q.id,
            { descartadas: [], resuelta: false, revelada: false, pista: 0, aciertoLimpio: null } as EstadoPregunta,
          ])
        )
      )
      setIndice(0)
      setFase('sesion')
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo iniciar el entrenamiento.')
    } finally {
      setIniciando(false)
    }
  }

  // ── Responder ────────────────────────────────────────────────────────────
  const registrarProgreso = useCallback(
    async (preguntaId: string, acierto: boolean) => {
      if (!guardarProgreso) return
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      // Solo el primer intento: es el único que mide conocimiento real. Los
      // reintentos, que son el punto del modo, falsearían el dominio hacia
      // arriba si también contaran.
      await supabase.rpc('update_user_progress', {
        p_user_id: user.id,
        p_question_id: preguntaId,
        p_is_correct: acierto,
        p_time_spent_seconds: 0,
      })
    },
    [guardarProgreso, supabase]
  )

  const responder = (pregunta: Pregunta, opcion: string) => {
    const estado = estados[pregunta.id]
    if (!estado || estado.resuelta || estado.revelada) return

    const primerIntento = estado.descartadas.length === 0
    const acierto = opcion === pregunta.correct_answer

    if (primerIntento) void registrarProgreso(pregunta.id, acierto)

    if (acierto) {
      setEstados(p => ({
        ...p,
        [pregunta.id]: { ...estado, resuelta: true, aciertoLimpio: primerIntento },
      }))
      return
    }

    const descartadas = [...estado.descartadas, opcion]
    // Con tres descartes solo queda una alternativa: seguir "intentando" sería
    // teatro. Se revela y se pasa a explicar.
    const seAcabaron = descartadas.length >= Object.keys(pregunta.options).length - 1
    setEstados(p => ({
      ...p,
      [pregunta.id]: {
        ...estado,
        descartadas,
        revelada: seAcabaron,
        aciertoLimpio: estado.aciertoLimpio ?? false,
      },
    }))
  }

  const revelar = (pregunta: Pregunta) => {
    const estado = estados[pregunta.id]
    if (!estado) return
    if (estado.descartadas.length === 0 && !estado.resuelta) {
      void registrarProgreso(pregunta.id, false)
    }
    setEstados(p => ({
      ...p,
      [pregunta.id]: { ...estado, revelada: true, aciertoLimpio: estado.aciertoLimpio ?? false },
    }))
  }

  const pedirPista = (pregunta: Pregunta) => {
    const estado = estados[pregunta.id]
    if (!estado) return
    setEstados(p => ({
      ...p,
      [pregunta.id]: { ...estado, pista: estado.pista === 0 ? 1 : 2 },
    }))
  }

  const reiniciarPregunta = (pregunta: Pregunta) => {
    setEstados(p => ({
      ...p,
      [pregunta.id]: {
        descartadas: [],
        resuelta: false,
        revelada: false,
        pista: 0,
        aciertoLimpio: p[pregunta.id]?.aciertoLimpio ?? null,
      },
    }))
  }

  const volverAConfigurar = () => {
    setFase('config')
    setPreguntas([])
    setEstados({})
    setIndice(0)
  }

  // ── Render ───────────────────────────────────────────────────────────────
  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass rounded-3xl p-8 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-blue-200/60">Cargando temas…</p>
        </div>
      </div>
    )
  }

  if (fase === 'config') {
    return (
      <ConfiguracionEntrenamiento
        universidades={universidades}
        areasDeUni={areasDeUni}
        temasDeArea={temasDeArea}
        uniSel={uniSel}
        setUniSel={u => { setUniSel(u); setAreaSel(null); setTemasSel([]) }}
        areaSel={areaSel}
        setAreaSel={a => { setAreaSel(a); setTemasSel([]) }}
        temasSel={temasSel}
        setTemasSel={setTemasSel}
        cantidad={cantidad}
        setCantidad={setCantidad}
        guardarProgreso={guardarProgreso}
        setGuardarProgreso={setGuardarProgreso}
        iniciar={iniciar}
        iniciando={iniciando}
        error={error}
        metodoNombre={metodoObjetivo?.nombre ?? null}
      />
    )
  }

  if (fase === 'resumen') {
    return (
      <ResumenEntrenamiento
        preguntas={preguntas}
        estados={estados}
        subtemaPorId={subtemaPorId}
        areaPorId={areaPorId}
        onRepetir={() => {
          setEstados(
            Object.fromEntries(
              preguntas.map(q => [
                q.id,
                { descartadas: [], resuelta: false, revelada: false, pista: 0, aciertoLimpio: null } as EstadoPregunta,
              ])
            )
          )
          setIndice(0)
          setFase('sesion')
        }}
        onNueva={volverAConfigurar}
      />
    )
  }

  // ── Sesión ───────────────────────────────────────────────────────────────
  const pregunta = preguntas[indice]
  const estado = estados[pregunta.id]
  const subtema = subtemaPorId.get(pregunta.subtopic_id)
  const area = subtema ? areaPorId.get(subtema.area_id) : undefined
  const cerrada = estado.resuelta || estado.revelada
  const limpias = preguntas.filter(q => estados[q.id]?.aciertoLimpio === true).length
  const trabajadas = preguntas.filter(q => estados[q.id]?.resuelta || estados[q.id]?.revelada).length

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
        <div className="flex h-12 items-center gap-3 px-4">
          <button onClick={volverAConfigurar} className="flex items-center gap-1.5 text-blue-200/70 hover:text-white">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-xs font-medium">Salir</span>
          </button>
          <div className="mx-auto flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold text-emerald-300">
              Sin cronómetro · sin puntaje
            </span>
          </div>
          <div className="text-xs font-medium text-blue-300/40">
            {indice + 1}/{preguntas.length}
          </div>
        </div>
        <div className="h-0.5 bg-white/[0.04]">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(trabajadas / preguntas.length) * 100}%` }}
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-5">
        {/* Etiquetas */}
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', getDifficultyColor(pregunta.difficulty))}>
            {pregunta.difficulty}
          </span>
          {subtema && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {subtema.name}
            </span>
          )}
          {estado.aciertoLimpio === true && (
            <span className="ml-auto rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
              A la primera
            </span>
          )}
        </div>

        <h2 className="mb-4 text-base font-medium leading-relaxed text-white">
          {pregunta.statement}
        </h2>

        {/* Pista */}
        {!cerrada && estado.pista > 0 && (
          <div className="mb-4">
            <PistaDelMetodo
              subtema={subtema?.code}
              areaCodigo={area?.code}
              nivel={estado.pista === 1 ? 1 : 2}
            />
          </div>
        )}

        {/* Opciones */}
        <div className="space-y-2">
          {Object.entries(pregunta.options).map(([clave, texto]) => {
            const esCorrecta = clave === pregunta.correct_answer
            const descartada = estado.descartadas.includes(clave)
            const mostrarCorrecta = cerrada && esCorrecta
            const mostrarFallo = descartada

            return (
              <button
                key={clave}
                onClick={() => responder(pregunta, clave)}
                disabled={cerrada || descartada}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all',
                  mostrarCorrecta
                    ? 'border-2 border-emerald-500 bg-emerald-500/10'
                    : mostrarFallo
                      ? 'border border-red-500/30 bg-red-500/[0.06] opacity-60'
                      : cerrada
                        ? 'border border-white/[0.06] bg-white/[0.02] opacity-50'
                        : 'border border-white/[0.06] bg-white/[0.03] active:scale-[0.98] active:bg-white/[0.06]'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                    mostrarCorrecta
                      ? 'bg-emerald-500 text-white'
                      : mostrarFallo
                        ? 'bg-red-500/70 text-white'
                        : 'bg-white/[0.06] text-blue-200/60'
                  )}
                >
                  {clave}
                </div>
                <span
                  className={cn(
                    'flex-1 text-sm leading-snug',
                    mostrarFallo ? 'text-red-200/60 line-through' : 'text-white'
                  )}
                >
                  {texto}
                </span>
                {mostrarCorrecta && <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400" />}
                {mostrarFallo && <XCircle className="h-4 w-4 flex-shrink-0 text-red-400/70" />}
              </button>
            )
          })}
        </div>

        {/* Reacción al intento fallido: el mensaje central del modo */}
        {!cerrada && estado.descartadas.length > 0 && (
          <div className="mt-4 flex gap-2.5 rounded-2xl border border-accent-amber/25 bg-accent-amber/[0.06] p-3.5">
            <RotateCcw className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-amber" />
            <div>
              <p className="text-sm font-semibold text-white">Esa no era. Sigue tú.</p>
              <p className="mt-0.5 text-xs leading-relaxed text-amber-100/70">
                Aquí no se pierde nada por fallar: la descartamos y te quedan{' '}
                {Object.keys(pregunta.options).length - estado.descartadas.length}.
                Si quieres, pide una pista antes de volver a decidir.
              </p>
            </div>
          </div>
        )}

        {/* Feedback al resolver */}
        {estado.resuelta && (
          <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] p-3.5">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400" />
            <p className="text-sm font-semibold text-emerald-200">
              {estado.aciertoLimpio
                ? '¡Correcta a la primera!'
                : 'Correcta. Llegaste tú, que es lo que cuenta.'}
            </p>
          </div>
        )}

        {/* Explicación reforzada */}
        {cerrada && (
          <div className="mt-4">
            <ExplicacionReforzada
              explicacion={pregunta.explanation}
              subtema={subtema?.code}
              areaCodigo={area?.code}
              respuestaCorrecta={pregunta.correct_answer}
            />
          </div>
        )}

        {/* Acciones */}
        <div className="mt-5 flex flex-wrap gap-2">
          {!cerrada && estado.pista < 2 && (
            <button
              onClick={() => pedirPista(pregunta)}
              className="btn-secondary text-sm"
            >
              <Lightbulb className="h-4 w-4" />
              {estado.pista === 0 ? 'Dame una pista' : 'Otra pista'}
            </button>
          )}
          {!cerrada && (
            <button onClick={() => revelar(pregunta)} className="btn-ghost text-sm">
              <Eye className="h-4 w-4" /> Ver la respuesta y el método
            </button>
          )}
          {cerrada && (
            <button onClick={() => reiniciarPregunta(pregunta)} className="btn-ghost text-sm">
              <RotateCcw className="h-4 w-4" /> Intentarla de nuevo
            </button>
          )}
        </div>
      </main>

      {/* Navegación */}
      <div className="sticky bottom-0 glass safe-area-bottom border-t border-white/[0.08] px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <button
            onClick={() => setIndice(i => Math.max(0, i - 1))}
            disabled={indice === 0}
            className="rounded-xl px-3 py-2.5 text-sm font-medium text-blue-200 transition-all hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Anterior
          </button>

          <div className="text-center text-[11px] leading-tight text-blue-300/40">
            <span className="font-semibold text-emerald-300/70">{limpias}</span> a la primera
            <br />
            de {trabajadas} trabajada{trabajadas === 1 ? '' : 's'}
          </div>

          {indice === preguntas.length - 1 ? (
            <button
              onClick={() => setFase('resumen')}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(20,184,166,0.35)] transition-all active:scale-95"
            >
              Ver resumen <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setIndice(i => Math.min(preguntas.length - 1, i + 1))}
              className="flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/10 active:scale-95"
            >
              Siguiente <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Configuración ──────────────────────────────────────────────────────────

function ConfiguracionEntrenamiento(props: {
  universidades: Universidad[]
  areasDeUni: Area[]
  temasDeArea: Subtema[]
  uniSel: string | null
  setUniSel: (id: string) => void
  areaSel: string | null
  setAreaSel: (id: string) => void
  temasSel: string[]
  setTemasSel: (t: string[]) => void
  cantidad: number
  setCantidad: (n: number) => void
  guardarProgreso: boolean
  setGuardarProgreso: (b: boolean) => void
  iniciar: () => void
  iniciando: boolean
  error: string
  metodoNombre: string | null
}) {
  const {
    universidades, areasDeUni, temasDeArea, uniSel, setUniSel, areaSel, setAreaSel,
    temasSel, setTemasSel, cantidad, setCantidad, guardarProgreso, setGuardarProgreso,
    iniciar, iniciando, error, metodoNombre,
  } = props

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">XILEX</span>
        </Link>

        <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
          Modo <span className="text-primary">entrenamiento</span>
        </h1>
        <p className="mb-6 max-w-2xl text-lg text-blue-200/60">
          Sin cronómetro, sin puntaje y sin penalización. Fallas, te decimos por qué,
          y vuelves a intentarlo hasta que el método te salga solo.
        </p>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {[
            { icono: RotateCcw, titulo: 'Puedes fallar', texto: 'Un error descarta la opción y te deja seguir intentando.' },
            { icono: Lightbulb, titulo: 'Pistas antes de la respuesta', texto: 'Te recuerdan por dónde se empieza sin regalarte el resultado.' },
            { icono: BookOpen, titulo: 'Explicación con método', texto: 'No solo por qué esa es la correcta: cómo se resuelven todas las de su tipo.' },
          ].map(f => (
            <GlassCard key={f.titulo} hover={false} className="rounded-2xl p-4">
              <f.icono className="mb-2 h-5 w-5 text-primary" />
              <div className="text-sm font-semibold text-white">{f.titulo}</div>
              <p className="mt-0.5 text-xs leading-relaxed text-blue-300/50">{f.texto}</p>
            </GlassCard>
          ))}
        </div>

        {metodoNombre && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-primary/25 bg-primary/[0.06] p-3.5">
            <Target className="h-4 w-4 flex-shrink-0 text-primary" />
            <p className="text-sm text-blue-100/80">
              Vas a practicar <span className="font-semibold text-white">{metodoNombre}</span>.
              Ya te marcamos los temas correspondientes.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Universidad */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
              <Target className="h-5 w-5 text-primary" /> 1. Universidad
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {universidades.map(u => (
                <button
                  key={u.id}
                  onClick={() => setUniSel(u.id)}
                  className={cn(
                    'rounded-2xl border p-3 text-left transition-all',
                    uniSel === u.id
                      ? 'border-primary/40 bg-primary/[0.08]'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16]'
                  )}
                >
                  <div className="text-sm font-semibold text-white">{u.name}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Área */}
          {uniSel && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                <BookOpen className="h-5 w-5 text-primary" /> 2. Área
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {areasDeUni.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAreaSel(a.id)}
                    className={cn(
                      'rounded-2xl border p-3 text-left transition-all',
                      areaSel === a.id
                        ? 'border-primary/40 bg-primary/[0.08]'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16]'
                    )}
                  >
                    <div className="text-sm font-semibold text-white">{a.name}</div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Temas */}
          {areaSel && temasDeArea.length > 0 && (
            <section>
              <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-white">
                <Sparkles className="h-5 w-5 text-primary" /> 3. Temas
              </h2>
              <p className="mb-3 text-sm text-blue-300/45">
                Opcional. Sin marcar nada practicas el área completa; marcando uno
                atacas justo lo que te cuesta.
              </p>
              <div className="flex flex-wrap gap-2">
                {temasDeArea.map(t => {
                  const activo = temasSel.includes(t.id)
                  const metodo = metodoParaSubtema(t.code)
                  return (
                    <button
                      key={t.id}
                      onClick={() =>
                        setTemasSel(activo ? temasSel.filter(x => x !== t.id) : [...temasSel, t.id])
                      }
                      title={metodo ? `Método: ${metodo.nombre}` : undefined}
                      className={cn(
                        'rounded-xl px-3 py-1.5 text-xs font-medium transition-all',
                        activo
                          ? 'border border-primary/30 bg-primary/15 text-primary'
                          : 'border border-white/[0.06] bg-white/[0.04] text-blue-300/55 hover:bg-white/[0.07]'
                      )}
                    >
                      {t.name}
                    </button>
                  )
                })}
              </div>
              {temasSel.length > 0 && (
                <button
                  onClick={() => setTemasSel([])}
                  className="mt-2 text-xs text-blue-300/40 underline hover:text-blue-200"
                >
                  Quitar la selección de temas
                </button>
              )}
            </section>
          )}

          {/* Cantidad y progreso */}
          {areaSel && (
            <section className="space-y-4">
              <div>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                  <Play className="h-5 w-5 text-primary" /> 4. Cuántos ejercicios
                </h2>
                <div className="flex flex-wrap gap-2">
                  {CANTIDADES.map(n => (
                    <button
                      key={n}
                      onClick={() => setCantidad(n)}
                      className={cn(
                        'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                        cantidad === n
                          ? 'border border-primary/30 bg-primary/15 text-primary'
                          : 'border border-white/[0.06] bg-white/[0.04] text-blue-300/55 hover:bg-white/[0.07]'
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                <input
                  type="checkbox"
                  checked={guardarProgreso}
                  onChange={e => setGuardarProgreso(e.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded border-primary text-primary focus:ring-primary/50"
                />
                <div>
                  <div className="text-sm font-medium text-white">
                    Guardar esto en mi progreso por subtema
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-blue-300/50">
                    Desactivado, esta sesión no queda registrada en ninguna parte: puedes
                    equivocarte todo lo que haga falta. Activado, se guarda solo tu{' '}
                    <span className="text-blue-200/70">primer intento</span> de cada
                    ejercicio, que es el único que mide lo que sabes de verdad.
                  </p>
                </div>
              </label>
            </section>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <GlassButton
            onClick={iniciar}
            disabled={!areaSel || iniciando}
            className="w-full rounded-2xl"
            size="lg"
          >
            {iniciando ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Preparando…
              </>
            ) : (
              <>
                <Play className="h-5 w-5" /> Empezar a entrenar
              </>
            )}
          </GlassButton>

          <p className="text-center text-xs text-blue-300/40">
            ¿Quieres la presión del examen real?{' '}
            <Link href="/practice" className="text-primary hover:underline">
              Haz un simulacro cronometrado
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Resumen ────────────────────────────────────────────────────────────────

function ResumenEntrenamiento({
  preguntas, estados, subtemaPorId, areaPorId, onRepetir, onNueva,
}: {
  preguntas: Pregunta[]
  estados: Record<string, EstadoPregunta>
  subtemaPorId: Map<string, Subtema>
  areaPorId: Map<string, Area>
  onRepetir: () => void
  onNueva: () => void
}) {
  const limpias = preguntas.filter(q => estados[q.id]?.aciertoLimpio === true).length
  const conAyuda = preguntas.filter(
    q => estados[q.id]?.resuelta && estados[q.id]?.aciertoLimpio === false
  ).length
  const reveladas = preguntas.filter(q => estados[q.id]?.revelada).length
  const sinTocar = preguntas.length - limpias - conAyuda - reveladas

  /** Métodos donde hubo tropiezos, ordenados por cuántas veces. */
  const aRepasar = useMemo(() => {
    const cuenta = new Map<string, { nombre: string; slug: string; veces: number }>()
    for (const q of preguntas) {
      const e = estados[q.id]
      if (!e || e.aciertoLimpio !== false) continue
      const sub = subtemaPorId.get(q.subtopic_id)
      const area = sub ? areaPorId.get(sub.area_id) : undefined
      const metodo = metodoParaSubtema(sub?.code, area?.code)
      if (!metodo) continue
      const previo = cuenta.get(metodo.slug)
      cuenta.set(metodo.slug, {
        nombre: metodo.nombre,
        slug: metodo.slug,
        veces: (previo?.veces ?? 0) + 1,
      })
    }
    return [...cuenta.values()].sort((a, b) => b.veces - a.veces)
  }, [preguntas, estados, subtemaPorId, areaPorId])

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <GlassCard hover={false} className="mb-6 rounded-3xl p-6 text-center">
          <Sparkles className="mx-auto mb-3 h-10 w-10 text-primary" />
          <h1 className="mb-1 text-2xl font-bold text-white">Sesión terminada</h1>
          <p className="mb-6 text-sm text-blue-200/60">
            {limpias === preguntas.length
              ? 'Todas a la primera. Sube la dificultad o pasa a un simulacro cronometrado.'
              : 'Lo que fallaste aquí es exactamente lo que ya no vas a fallar en el examen.'}
          </p>

          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { valor: limpias, etiqueta: 'A la primera', clase: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { valor: conAyuda, etiqueta: 'Con intentos', clase: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
              { valor: reveladas, etiqueta: 'Reveladas', clase: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
              { valor: sinTocar, etiqueta: 'Sin tocar', clase: 'text-blue-300/60 bg-white/[0.04] border-white/[0.08]' },
            ].map(c => (
              <div key={c.etiqueta} className={cn('rounded-2xl border p-3', c.clase)}>
                <div className="text-2xl font-bold">{c.valor}</div>
                <div className="mt-0.5 text-xs opacity-70">{c.etiqueta}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={onRepetir} className="btn-secondary text-sm">
              <RotateCcw className="h-4 w-4" /> Repetir estas mismas
            </button>
            <button onClick={onNueva} className="btn-primary text-sm">
              <Play className="h-4 w-4" /> Otra sesión
            </button>
          </div>
        </GlassCard>

        {aRepasar.length > 0 && (
          <GlassCard hover={false} className="mb-6 rounded-3xl p-5">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-white">
              <BookOpen className="h-5 w-5 text-accent-amber" /> Métodos que conviene repasar
            </h2>
            <p className="mb-4 text-sm text-blue-300/45">
              Salen de los ejercicios donde no acertaste a la primera. Léelos completos
              antes de la próxima sesión.
            </p>
            <div className="space-y-2">
              {aRepasar.map(m => (
                <Link
                  key={m.slug}
                  href={`/metodos?m=${m.slug}`}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3 transition-colors hover:border-primary/25 hover:bg-primary/[0.04]"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-amber/15 text-sm font-bold text-accent-amber">
                    {m.veces}
                  </div>
                  <span className="flex-1 text-sm font-medium text-white">{m.nombre}</span>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary/70" />
                </Link>
              ))}
            </div>
          </GlassCard>
        )}

        <div className="flex justify-center gap-3">
          <Link href="/dashboard" className="btn-ghost text-sm">
            <Home className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/metodos" className="btn-ghost text-sm">
            <BookOpen className="h-4 w-4" /> Centro de métodos
          </Link>
        </div>
      </div>
    </div>
  )
}
