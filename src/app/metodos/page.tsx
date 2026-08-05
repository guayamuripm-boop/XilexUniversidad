'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Brain, Search, ListOrdered, AlertTriangle, Zap, Lightbulb, ChevronRight,
  Target, Clock, Filter, Sparkles, ShieldQuestion, GraduationCap, Play, X,
  CalendarCheck,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass'
import { cn } from '@/lib/utils'
import {
  METODOS, AREAS, TIPS, CATEGORIAS_TIP, MNEMOTECNIAS, POLITICAS_RESPUESTA,
  type AreaClave, type CategoriaTip, type Metodo,
} from '@/lib/metodos'

export const dynamic = 'force-dynamic'

type Pestana = 'metodos' | 'tips' | 'trucos'

const PESTANAS: { clave: Pestana; nombre: string; icono: typeof Brain; descripcion: string }[] = [
  {
    clave: 'metodos',
    nombre: 'Metodologías',
    icono: ListOrdered,
    descripcion: 'Un procedimiento paso a paso para cada tipo de ejercicio.',
  },
  {
    clave: 'tips',
    nombre: 'Tips para resolver',
    icono: Target,
    descripcion: 'Cómo recorrer la prueba, repartir el tiempo y descartar opciones.',
  },
  {
    clave: 'trucos',
    nombre: 'Trucos y mnemotecnias',
    icono: Lightbulb,
    descripcion: 'Frases cortas que resuelven ejercicios enteros si las tienes memorizadas.',
  },
]

export default function MetodosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CentroDeEstudio />
    </Suspense>
  )
}

function CentroDeEstudio() {
  const searchParams = useSearchParams()
  // `?m=<slug>` llega desde la explicación reforzada de una pregunta: el
  // aspirante venía de fallar un ejercicio y quiere el método completo.
  const metodoInicial = searchParams.get('m')

  const [pestana, setPestana] = useState<Pestana>('metodos')
  const [area, setArea] = useState<AreaClave | 'todas'>('todas')
  const [busqueda, setBusqueda] = useState('')
  const [abierto, setAbierto] = useState<string | null>(metodoInicial)
  const refMetodo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!metodoInicial) return
    setPestana('metodos')
    setAbierto(metodoInicial)
    // El método puede estar filtrado fuera de la vista si el usuario tenía otro
    // área seleccionada; abrir la pestaña no basta.
    setArea('todas')
    const t = setTimeout(() => {
      refMetodo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(t)
  }, [metodoInicial])

  const metodosVisibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return METODOS.filter(m => {
      if (area !== 'todas' && m.area !== area) return false
      if (!q) return true
      return (
        m.nombre.toLowerCase().includes(q) ||
        m.resumen.toLowerCase().includes(q) ||
        m.dondeAparece.toLowerCase().includes(q) ||
        m.pasos.some(p => p.detalle.toLowerCase().includes(q)) ||
        m.trucos.some(t => t.toLowerCase().includes(q)) ||
        m.trampas.some(t => t.toLowerCase().includes(q))
      )
    })
  }, [area, busqueda])

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Encabezado */}
        <div className="mb-8 animate-fade-in">
          <Link href="/" className="mb-6 inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">XILEX</span>
          </Link>
          <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Centro de <span className="text-primary">métodos y estrategias</span>
          </h1>
          <p className="max-w-2xl text-lg text-blue-200/60">
            El examen no repite preguntas: repite tipos. Aquí está el procedimiento de
            cada tipo, las trampas que te van a poner y las frases que conviene
            llevarte memorizadas.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/plan" className="btn-primary text-sm">
              <CalendarCheck className="h-4 w-4" /> Plan UNIMET (26 ago)
            </Link>
            <Link href="/entrenamiento" className="btn-secondary text-sm">
              <Play className="h-4 w-4" /> Practicar sin miedo
            </Link>
            <Link href="/practice" className="btn-secondary text-sm">
              <Clock className="h-4 w-4" /> Simulacro cronometrado
            </Link>
          </div>
        </div>

        {/* Pestañas */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PESTANAS.map(p => {
            const Icono = p.icono
            const activa = pestana === p.clave
            return (
              <button
                key={p.clave}
                onClick={() => setPestana(p.clave)}
                className={cn(
                  'rounded-2xl border p-4 text-left transition-all',
                  activa
                    ? 'border-primary/40 bg-primary/[0.07] shadow-[0_0_20px_rgba(20,184,166,0.12)]'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.04]'
                )}
              >
                <Icono className={cn('mb-2 h-5 w-5', activa ? 'text-primary' : 'text-blue-300/50')} />
                <div className={cn('text-sm font-semibold', activa ? 'text-white' : 'text-blue-100/80')}>
                  {p.nombre}
                </div>
                <div className="mt-0.5 text-xs leading-snug text-blue-300/45">{p.descripcion}</div>
              </button>
            )
          })}
        </div>

        {pestana === 'metodos' && (
          <>
            {/* Filtros */}
            <div className="mb-5 space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-300/40" />
                <input
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar: silogismo, porcentaje, tilde, analogía, cubo…"
                  className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-9 pr-9 text-sm text-white placeholder:text-blue-300/35 focus:border-primary/40 focus:outline-none"
                />
                {busqueda && (
                  <button
                    onClick={() => setBusqueda('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/40 hover:text-white"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 flex-shrink-0 text-blue-300/40" />
                {(['todas', ...Object.keys(AREAS)] as (AreaClave | 'todas')[]).map(a => (
                  <button
                    key={a}
                    onClick={() => setArea(a)}
                    className={cn(
                      'rounded-xl px-3 py-1.5 text-xs font-medium transition-all',
                      area === a
                        ? 'border border-primary/30 bg-primary/15 text-primary'
                        : 'border border-white/[0.06] bg-white/[0.04] text-blue-300/50 hover:bg-white/[0.06]'
                    )}
                  >
                    {a === 'todas' ? 'Todas las áreas' : AREAS[a].nombre}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 text-xs text-blue-300/40">
              {metodosVisibles.length} método{metodosVisibles.length === 1 ? '' : 's'}
              {area !== 'todas' && ` · ${AREAS[area].descripcion}`}
            </div>

            <div className="space-y-3">
              {metodosVisibles.map(m => (
                <div key={m.slug} ref={m.slug === abierto ? refMetodo : undefined}>
                  <TarjetaMetodo
                    metodo={m}
                    abierto={abierto === m.slug}
                    onToggle={() => setAbierto(abierto === m.slug ? null : m.slug)}
                  />
                </div>
              ))}
              {metodosVisibles.length === 0 && (
                <div className="py-12 text-center text-blue-300/40">
                  <Search className="mx-auto mb-3 h-8 w-8" />
                  <p className="text-sm">Nada con «{busqueda}». Prueba con otra palabra.</p>
                </div>
              )}
            </div>
          </>
        )}

        {pestana === 'tips' && <PanelTips />}
        {pestana === 'trucos' && <PanelTrucos />}
      </div>
    </div>
  )
}

// ── Métodos ────────────────────────────────────────────────────────────────

function TarjetaMetodo({
  metodo, abierto, onToggle,
}: {
  metodo: Metodo
  abierto: boolean
  onToggle: () => void
}) {
  const area = AREAS[metodo.area]

  return (
    <GlassCard
      hover={false}
      className={cn(
        'overflow-hidden rounded-3xl transition-all',
        abierto && 'border-primary/25 bg-white/[0.06]'
      )}
    >
      <button onClick={onToggle} className="flex w-full items-start gap-3 p-4 text-left">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <span className={cn('rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-semibold', area.color)}>
              {area.nombre}
            </span>
          </div>
          <h3 className="font-semibold text-white">{metodo.nombre}</h3>
          <p className="mt-1 text-sm leading-relaxed text-blue-200/60">{metodo.resumen}</p>
          {!abierto && (
            <p className="mt-1.5 text-xs text-blue-300/35">{metodo.dondeAparece}</p>
          )}
        </div>
        <ChevronRight
          className={cn(
            'mt-1 h-5 w-5 flex-shrink-0 text-blue-300/40 transition-transform',
            abierto && 'rotate-90'
          )}
        />
      </button>

      {abierto && (
        <div className="space-y-4 border-t border-white/[0.06] px-4 pb-5 pt-4">
          <p className="text-xs text-blue-300/45">
            <GraduationCap className="mr-1 inline h-3.5 w-3.5" />
            {metodo.dondeAparece}
          </p>

          {/* Pasos */}
          <section>
            <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-primary">
              <ListOrdered className="h-3.5 w-3.5" /> Cómo se resuelve
            </h4>
            <ol className="space-y-2.5">
              {metodo.pasos.map((paso, i) => (
                <li key={paso.titulo} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-white/90">
                      {paso.titulo.replace(/^\d+\.\s*/, '')}
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-blue-200/65">{paso.detalle}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Ejemplo resuelto */}
          {metodo.ejemplo && (
            <section className="rounded-2xl border border-primary/20 bg-primary/[0.05] p-3.5">
              <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Ejemplo resuelto
              </h4>
              <p className="mb-2 text-sm font-medium text-white">{metodo.ejemplo.enunciado}</p>
              <ol className="mb-2 space-y-1">
                {metodo.ejemplo.pasos.map((p, i) => (
                  <li key={i} className="text-sm leading-relaxed text-blue-100/70">
                    <span className="mr-1.5 text-primary/70">{i + 1}.</span>
                    {p}
                  </li>
                ))}
              </ol>
              <p className="text-sm font-semibold text-emerald-300">
                Respuesta: {metodo.ejemplo.respuesta}
              </p>
            </section>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Trampas */}
            <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-3.5">
              <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-red-400">
                <AlertTriangle className="h-3.5 w-3.5" /> Trampas típicas
              </h4>
              <ul className="space-y-1.5">
                {metodo.trampas.map((t, i) => (
                  <li key={i} className="flex gap-1.5 text-sm leading-relaxed text-red-100/70">
                    <span className="text-red-400/60">·</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Trucos */}
            <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-3.5">
              <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-400">
                <Zap className="h-3.5 w-3.5" /> Atajos que sí valen
              </h4>
              <ul className="space-y-1.5">
                {metodo.trucos.map((t, i) => (
                  <li key={i} className="flex gap-1.5 text-sm leading-relaxed text-emerald-100/70">
                    <span className="text-emerald-400/60">·</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Mnemotecnias */}
          {metodo.mnemotecnias && metodo.mnemotecnias.length > 0 && (
            <section className="space-y-2">
              <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-violet-400">
                <Lightbulb className="h-3.5 w-3.5" /> Para llevártelo memorizado
              </h4>
              {metodo.mnemotecnias.map(mn => (
                <div
                  key={mn.clave}
                  className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.05] p-3"
                >
                  <div className="text-sm font-bold text-violet-300">«{mn.clave}»</div>
                  <p className="mt-1 text-sm leading-relaxed text-violet-100/70">{mn.significado}</p>
                  <p className="mt-1 text-xs leading-relaxed text-violet-100/50">{mn.uso}</p>
                </div>
              ))}
            </section>
          )}

          <Link
            href={`/entrenamiento?metodo=${metodo.slug}`}
            className="btn-primary inline-flex w-full justify-center text-sm sm:w-auto"
          >
            <Play className="h-4 w-4" /> Practicar este tipo sin cronómetro
          </Link>
        </div>
      )}
    </GlassCard>
  )
}

// ── Tips ───────────────────────────────────────────────────────────────────

function PanelTips() {
  const categorias = Object.keys(CATEGORIAS_TIP) as CategoriaTip[]

  return (
    <div className="space-y-8">
      <GlassCard hover={false} className="rounded-3xl border-primary/20 bg-primary/[0.04] p-5">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
          <ShieldQuestion className="h-5 w-5 text-primary" />
          Lo primero: ¿respondo o dejo en blanco?
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-blue-200/65">
          Es la decisión con más impacto sobre tu puntaje, y depende de cómo puntúa
          cada prueba. Equivocarse aquí cuesta más que fallar varios ejercicios.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {POLITICAS_RESPUESTA.map(p => (
            <div
              key={p.universidad}
              className={cn(
                'rounded-2xl border p-3.5',
                p.penaliza
                  ? 'border-amber-500/25 bg-amber-500/[0.05]'
                  : 'border-emerald-500/25 bg-emerald-500/[0.05]'
              )}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-semibold text-white">{p.nombre}</span>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                    p.penaliza
                      ? 'bg-amber-500/15 text-amber-300'
                      : 'bg-emerald-500/15 text-emerald-300'
                  )}
                >
                  {p.penaliza ? 'penaliza' : 'no penaliza'}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-blue-200/60">{p.regla}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/80">{p.recomendacion}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {categorias.map(c => {
        const meta = CATEGORIAS_TIP[c]
        const tips = TIPS.filter(t => t.categoria === c)
        return (
          <section key={c}>
            <h2 className="text-lg font-semibold text-white">{meta.nombre}</h2>
            <p className="mb-3 text-sm text-blue-300/45">{meta.descripcion}</p>
            <div className="grid gap-3 md:grid-cols-2">
              {tips.map(t => (
                <GlassCard key={t.slug} hover={false} className="rounded-2xl p-4">
                  <h3 className="mb-1.5 font-semibold text-white">{t.titulo}</h3>
                  <p className="text-sm leading-relaxed text-blue-100/75">{t.texto}</p>
                  <p className="mt-2.5 border-t border-white/[0.06] pt-2.5 text-xs leading-relaxed text-blue-300/50">
                    <span className="font-semibold text-blue-200/70">Por qué funciona:</span>{' '}
                    {t.porque}
                  </p>
                </GlassCard>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

// ── Trucos y mnemotecnias ──────────────────────────────────────────────────

function PanelTrucos() {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-blue-200/60">
        Estas frases no son adornos: son atajos que sustituyen a un razonamiento
        completo. Memorizadas, resuelven el ejercicio antes de que empieces a
        pensarlo. Repásalas la mañana del examen.
      </p>

      {MNEMOTECNIAS.map(bloque => (
        <GlassCard key={bloque.slug} hover={false} className="rounded-3xl p-5">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-white">{bloque.titulo}</h2>
            <span
              className={cn(
                'rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-semibold',
                bloque.area === 'general' ? 'text-blue-200/60' : AREAS[bloque.area].color
              )}
            >
              {bloque.area === 'general' ? 'Transversal' : AREAS[bloque.area].nombre}
            </span>
          </div>
          <p className="mb-4 text-sm text-blue-300/45">{bloque.descripcion}</p>

          <div className="space-y-2.5">
            {bloque.items.map(item => (
              <div
                key={item.clave}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3.5"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-amber" />
                  <div>
                    <div className="text-sm font-bold text-white">«{item.clave}»</div>
                    <p className="mt-1 text-sm leading-relaxed text-blue-100/75">
                      {item.significado}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-blue-300/50">{item.uso}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
