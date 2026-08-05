'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Brain, CheckCircle2, Circle, Clock, ExternalLink, Sparkles, Target,
  AlertTriangle, BookOpen, ChevronDown, Flame, ListChecks,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass'
import { cn } from '@/lib/utils'
import {
  PLAN_UNIMET, SEMANAS, TIPO_INFO, HERRAMIENTAS_EXTERNAS, PRINCIPIOS_DEL_PLAN,
  diaDeHoy, diasHastaElExamen, type DiaPlan,
} from '@/lib/plan'

export const dynamic = 'force-dynamic'

const CLAVE_PROGRESO = 'xilex:plan-unimet:progreso'

function cargarProgreso(): Record<number, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(CLAVE_PROGRESO) ?? '{}')
  } catch {
    return {}
  }
}

export default function PlanPage() {
  const [progreso, setProgreso] = useState<Record<number, boolean>>({})
  const [cargado, setCargado] = useState(false)
  const [hoy, setHoy] = useState<Date | null>(null)
  const refHoy = useRef<HTMLDivElement>(null)

  // La fecha real solo se conoce en el cliente; calcularla en el primer
  // render de servidor desalinearía el marcado de "hoy" con el reloj del
  // usuario, así que se resuelve después de montar.
  useEffect(() => {
    setHoy(new Date())
    setProgreso(cargarProgreso())
    setCargado(true)
  }, [])

  useEffect(() => {
    if (!cargado) return
    window.localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(progreso))
  }, [progreso, cargado])

  useEffect(() => {
    if (!hoy) return
    const t = setTimeout(() => {
      refHoy.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 150)
    return () => clearTimeout(t)
  }, [hoy])

  const diaHoy = useMemo(() => (hoy ? diaDeHoy(hoy) : null), [hoy])
  const diasRestantes = hoy ? diasHastaElExamen(hoy) : null

  const totalHechos = Object.values(progreso).filter(Boolean).length
  const totalDias = PLAN_UNIMET.length
  const porcentaje = Math.round((totalHechos / totalDias) * 100)

  const marcar = (dia: number, valor: boolean) =>
    setProgreso(p => ({ ...p, [dia]: valor }))

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Encabezado */}
        <div className="mb-8 animate-fade-in">
          <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">XILEX</span>
          </Link>
          <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Plan <span className="text-primary">UNIMET</span> · rumbo al 26 de agosto
          </h1>
          <p className="max-w-2xl text-lg text-blue-200/60">
            Tu plan de estudio, día por día, con el ejercicio exacto de XILEX enlazado
            en cada bloque. Marca lo que completes; queda guardado en este navegador.
          </p>
        </div>

        {/* Resumen */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <GlassCard hover={false} className="rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {diasRestantes !== null ? Math.max(0, diasRestantes) : '—'}
            </div>
            <div className="mt-0.5 text-xs text-blue-300/45">días para el examen</div>
          </GlassCard>
          <GlassCard hover={false} className="rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalHechos}/{totalDias}</div>
            <div className="mt-0.5 text-xs text-blue-300/45">días completados</div>
          </GlassCard>
          <GlassCard hover={false} className="col-span-2 rounded-2xl p-4 sm:col-span-1">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-blue-300/45">Progreso del plan</span>
              <span className="font-semibold text-white">{porcentaje}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full bg-primary transition-all" style={{ width: `${porcentaje}%` }} />
            </div>
          </GlassCard>
          <Link
            href={diaHoy ? `#dia-${diaHoy.dia}` : '#semana-1'}
            className="flex flex-col items-center justify-center rounded-2xl border border-primary/25 bg-primary/[0.07] p-4 text-center transition-colors hover:bg-primary/[0.12]"
          >
            <Flame className="mb-1 h-5 w-5 text-accent-amber" />
            <div className="text-xs font-semibold text-white">
              {diaHoy ? `Ir al día ${diaHoy.dia}` : 'Fuera de rango'}
            </div>
          </Link>
        </div>

        {/* Herramientas externas */}
        <details className="group mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-white">
            <ListChecks className="h-4 w-4 text-primary" />
            Herramientas externas del plan
            <ChevronDown className="ml-auto h-4 w-4 text-blue-300/40 transition-transform group-open:rotate-180" />
          </summary>
          <div className="grid gap-2 px-4 pb-4 sm:grid-cols-2">
            {HERRAMIENTAS_EXTERNAS.map(h => (
              <a
                key={h.nombre}
                href={h.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-primary/25 hover:bg-primary/[0.04]"
              >
                <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  {h.nombre} <ExternalLink className="h-3 w-3 text-blue-300/40" />
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-blue-300/50">{h.uso}</p>
              </a>
            ))}
          </div>
        </details>

        {/* Semanas */}
        <div className="space-y-10">
          {SEMANAS.map(semana => {
            const dias = PLAN_UNIMET.filter(d => d.semana === semana.semana)
            const hechosSemana = dias.filter(d => progreso[d.dia]).length
            return (
              <section key={semana.semana} id={`semana-${semana.semana}`}>
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h2 className="text-xl font-bold text-white">
                    Semana {semana.semana} <span className="text-primary">· {semana.titulo}</span>
                  </h2>
                  <span className="flex-shrink-0 text-xs text-blue-300/40">
                    {semana.rango} · {hechosSemana}/{dias.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {dias.map(dia => (
                    <div
                      key={dia.dia}
                      id={`dia-${dia.dia}`}
                      ref={diaHoy?.dia === dia.dia ? refHoy : undefined}
                    >
                      <TarjetaDia
                        dia={dia}
                        hecho={!!progreso[dia.dia]}
                        esHoy={diaHoy?.dia === dia.dia}
                        atrasado={
                          !progreso[dia.dia] && hoy !== null &&
                          new Date(dia.fecha + 'T23:59:59') < hoy && dia.tipo !== 'examen'
                        }
                        onMarcar={v => marcar(dia.dia, v)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {/* Por qué está armado así */}
        <section className="mt-12">
          <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-white">
            <BookOpen className="h-5 w-5 text-primary" /> Por qué está armado así
          </h2>
          <p className="mb-4 text-sm text-blue-300/45">
            Por si en algún momento dudas de seguirlo.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {PRINCIPIOS_DEL_PLAN.map(p => (
              <GlassCard key={p.titulo} hover={false} className="rounded-2xl p-4">
                <h3 className="mb-1 text-sm font-semibold text-white">{p.titulo}</h3>
                <p className="text-xs leading-relaxed text-blue-200/60">{p.texto}</p>
              </GlassCard>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-blue-200/60">
            Si en algún momento un subtema sigue fallando mucho, dale una sesión extra
            esa semana en vez de seguir el orden fijo — el plan es una guía, ajústalo a
            tus resultados reales.
          </p>
        </section>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/metodos" className="btn-secondary text-sm">
            <Target className="h-4 w-4" /> Métodos y estrategias
          </Link>
          <Link href="/entrenamiento" className="btn-primary text-sm">
            <Sparkles className="h-4 w-4" /> Entrenar ahora
          </Link>
        </div>
      </div>
    </div>
  )
}

function TarjetaDia({
  dia, hecho, esHoy, atrasado, onMarcar,
}: {
  dia: DiaPlan
  hecho: boolean
  esHoy: boolean
  atrasado: boolean
  onMarcar: (v: boolean) => void
}) {
  const info = TIPO_INFO[dia.tipo]
  const [abierto, setAbierto] = useState(false)

  // `esHoy` llega en false en el primer render — la fecha real solo se conoce
  // tras montar, para no desalinear el servidor con el reloj del usuario — así
  // que abrir la tarjeta de hoy no puede resolverse con un valor inicial: hay
  // que reaccionar cuando `esHoy` pasa a true.
  useEffect(() => {
    if (esHoy) setAbierto(true)
  }, [esHoy])

  return (
    <GlassCard
      hover={false}
      className={cn(
        'overflow-hidden rounded-2xl transition-all',
        esHoy && 'border-primary/40 bg-primary/[0.05] shadow-[0_0_20px_rgba(20,184,166,0.1)]',
        hecho && !esHoy && 'opacity-70'
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={() => onMarcar(!hecho)}
          aria-label={hecho ? 'Marcar como pendiente' : 'Marcar como hecho'}
          className="mt-0.5 flex-shrink-0"
        >
          {hecho
            ? <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            : <Circle className="h-6 w-6 text-blue-300/30 hover:text-primary/60" />}
        </button>

        <button onClick={() => setAbierto(v => !v)} className="min-w-0 flex-1 text-left">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-blue-300/45">
              Día {dia.dia} · {dia.etiquetaFecha}
            </span>
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', info.bg, info.color)}>
              {info.etiqueta}
            </span>
            {esHoy && (
              <span className="rounded-full bg-accent-amber/15 px-2 py-0.5 text-[10px] font-bold text-accent-amber">
                HOY
              </span>
            )}
            {atrasado && (
              <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-300">
                sin marcar
              </span>
            )}
            {dia.minutosTotal > 0 && (
              <span className="ml-auto flex items-center gap-1 text-[11px] text-blue-300/40">
                <Clock className="h-3 w-3" /> {dia.minutosTotal} min
              </span>
            )}
          </div>
          <h3 className={cn('font-semibold', hecho ? 'text-blue-100/70 line-through' : 'text-white')}>
            {dia.titulo}
          </h3>
        </button>

        <ChevronDown
          className={cn('mt-1 h-4 w-4 flex-shrink-0 text-blue-300/40 transition-transform', abierto && 'rotate-180')}
        />
      </div>

      {abierto && (
        <div className="space-y-3 border-t border-white/[0.06] px-4 pb-4 pt-3">
          {dia.anki && (
            <p className="text-xs text-blue-300/45">
              + repaso de Anki al empezar (5-10 min, según lo que te toque ese día).
            </p>
          )}
          {dia.bloques.map((b, i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-sm leading-relaxed text-blue-100/80">
                {b.detalle}
                {b.minutos > 0 && <span className="ml-1.5 text-xs text-blue-300/40">({b.minutos} min)</span>}
              </p>
              {b.enlaces && b.enlaces.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {b.enlaces.map(e =>
                    e.externo ? (
                      <a
                        key={e.href}
                        href={e.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-white/[0.05] px-2.5 py-1 text-xs font-medium text-blue-200/70 transition-colors hover:bg-white/[0.09] hover:text-white"
                      >
                        {e.etiqueta} <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <Link
                        key={e.href}
                        href={e.href}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        {e.etiqueta}
                      </Link>
                    )
                  )}
                </div>
              )}
              {b.brecha && (
                <div className="mt-2 flex gap-1.5 rounded-lg border border-accent-amber/20 bg-accent-amber/[0.05] p-2">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent-amber" />
                  <p className="text-xs leading-relaxed text-amber-100/70">{b.brecha}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  )
}
