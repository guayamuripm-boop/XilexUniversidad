'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Brain, Lightbulb, AlertTriangle, Zap, ListOrdered, ArrowUpRight, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { metodoParaSubtema, type Metodo } from '@/lib/metodos'

/**
 * Explicación de una pregunta, reforzada con el método de su subtema.
 *
 * La explicación que trae cada pregunta del banco resuelve ESA pregunta. Sola,
 * enseña a resolver un ejercicio; acompañada del método, de la trampa típica y
 * del truco del subtema, enseña a resolver el tipo. Esa es la diferencia entre
 * revisar un simulacro y estudiar con él.
 *
 * El método no vive en la base de datos sino en `lib/metodos.ts`, de modo que
 * este bloque aparece igual bajo las 900 y pico preguntas del banco sin haber
 * tenido que reescribir ninguna.
 */
export function ExplicacionReforzada({
  explicacion,
  subtema,
  areaCodigo,
  respuestaCorrecta,
  compacto = false,
}: {
  explicacion: string
  subtema?: string | null
  areaCodigo?: string | null
  respuestaCorrecta?: string
  /** En el repaso de resultados hay decenas de bloques: se abre plegado. */
  compacto?: boolean
}) {
  const metodo = metodoParaSubtema(subtema, areaCodigo)
  const [verMetodo, setVerMetodo] = useState(!compacto)

  return (
    <div className="space-y-3">
      {/* Por qué la respuesta correcta lo es */}
      <div className="glass rounded-2xl border-l-4 border-primary p-3.5">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Brain className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-primary">
            Por qué la respuesta es {respuestaCorrecta ?? 'esa'}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-blue-100/80">{explicacion}</p>
      </div>

      {metodo && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
          <button
            onClick={() => setVerMetodo(v => !v)}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
          >
            <ListOrdered className="h-3.5 w-3.5 flex-shrink-0 text-accent-amber" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-accent-amber">
              Método: {metodo.nombre}
            </span>
            <ChevronRight
              className={cn(
                'ml-auto h-3.5 w-3.5 flex-shrink-0 text-blue-300/40 transition-transform',
                verMetodo && 'rotate-90'
              )}
            />
          </button>

          {verMetodo && (
            <div className="space-y-3 px-3.5 pb-3.5">
              <p className="text-xs leading-relaxed text-blue-200/70">{metodo.resumen}</p>

              <ol className="space-y-1.5">
                {metodo.pasos.map((paso, i) => (
                  <li key={paso.titulo} className="flex gap-2">
                    <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-[9px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-xs leading-relaxed text-blue-100/70">
                      <span className="font-semibold text-white/90">
                        {paso.titulo.replace(/^\d+\.\s*/, '')}.
                      </span>{' '}
                      {paso.detalle}
                    </span>
                  </li>
                ))}
              </ol>

              {metodo.trampas[0] && (
                <div className="flex gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-2.5">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-400" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-red-400">
                      Trampa típica
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-red-100/70">
                      {metodo.trampas[0]}
                    </p>
                  </div>
                </div>
              )}

              {metodo.trucos[0] && (
                <div className="flex gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-2.5">
                  <Zap className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                      Truco rápido
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-emerald-100/70">
                      {metodo.trucos[0]}
                    </p>
                  </div>
                </div>
              )}

              {metodo.mnemotecnias?.[0] && (
                <div className="flex gap-2 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-2.5">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-violet-400" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-violet-400">
                      Para recordarlo: «{metodo.mnemotecnias[0].clave}»
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-violet-100/70">
                      {metodo.mnemotecnias[0].significado} {metodo.mnemotecnias[0].uso}
                    </p>
                  </div>
                </div>
              )}

              <Link
                href={`/metodos?m=${metodo.slug}`}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-primary/80 transition-colors hover:text-primary"
              >
                Ver el método completo, con ejemplo resuelto
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Pista previa: el primer paso del método, sin revelar la respuesta.
 *
 * Existe para el modo entrenamiento. Un aspirante trancado tiene dos salidas
 * malas —adivinar o mirar la respuesta— y una buena: que le recuerden por dónde
 * se empieza. Esto es lo tercero.
 */
export function PistaDelMetodo({
  subtema,
  areaCodigo,
  nivel,
}: {
  subtema?: string | null
  areaCodigo?: string | null
  /** 1 = por dónde empezar; 2 = añade la trampa que hay que evitar. */
  nivel: 1 | 2
}) {
  const metodo: Metodo | null = metodoParaSubtema(subtema, areaCodigo)
  if (!metodo) return null

  return (
    <div className="space-y-2 rounded-2xl border border-accent-amber/25 bg-accent-amber/[0.06] p-3.5">
      <div className="flex items-center gap-1.5">
        <Lightbulb className="h-3.5 w-3.5 text-accent-amber" />
        <span className="text-[11px] font-bold uppercase tracking-wide text-accent-amber">
          Pista {nivel} de 2 · {metodo.nombre}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-amber-100/80">
        <span className="font-semibold text-white/90">
          {metodo.pasos[0].titulo.replace(/^\d+\.\s*/, '')}.
        </span>{' '}
        {metodo.pasos[0].detalle}
      </p>
      {nivel === 2 && metodo.trampas[0] && (
        <p className="border-t border-accent-amber/15 pt-2 text-xs leading-relaxed text-amber-100/70">
          <span className="font-semibold text-white/90">Cuidado con esto:</span> {metodo.trampas[0]}
        </p>
      )}
    </div>
  )
}
