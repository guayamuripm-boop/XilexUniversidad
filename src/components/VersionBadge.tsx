'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Etiqueta de versión de la esquina.
 *
 * Antes mostraba un sello de build crudo ("build 2026-07-28 02:02"), que a un
 * estudiante no le dice nada, y se pintaba en todas las páginas: durante el
 * examen quedaba encima del botón "Siguiente / Finalizar", porque la barra
 * inferior del simulacro no declara z-index y la etiqueta iba con z-40.
 *
 * Ahora muestra la versión de la app, se aparta de las pantallas donde estorba
 * y solo despliega el detalle del build si se toca.
 *
 * Los tres valores se resuelven en el build (ver `next.config.mjs`). No se
 * calculan aquí porque este es un componente de cliente y `new Date()` daría
 * un valor distinto en el servidor y en el navegador.
 */
const VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0'
const BUILD_DATE = process.env.NEXT_PUBLIC_BUILD_DATE ?? ''
const COMMIT = process.env.NEXT_PUBLIC_COMMIT_SHA ?? ''

/** Rutas donde la etiqueta molesta más de lo que informa. */
const OCULTA_EN = ['/simulacrum/']

export function VersionBadge() {
  const pathname = usePathname()
  const [abierta, setAbierta] = useState(false)

  if (OCULTA_EN.some(p => pathname?.startsWith(p))) return null

  const detalle = [BUILD_DATE, COMMIT].filter(Boolean).join(' · ')

  return (
    <div className="fixed bottom-3 right-3 z-30 select-none">
      <button
        type="button"
        onClick={() => setAbierta(v => !v)}
        aria-label={`Versión ${VERSION}${detalle ? `, compilada el ${detalle}` : ''}`}
        className="glass rounded-full pl-2 pr-2.5 py-1 flex items-center gap-1.5 border border-white/[0.06]
                   text-[11px] text-blue-200/40 hover:text-blue-100/80 hover:border-white/[0.12]
                   transition-colors"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald/70" />
        <span className="font-mono tracking-tight">v{VERSION}</span>
        {abierta && detalle && (
          <span className="font-mono text-blue-300/40 border-l border-white/[0.08] pl-1.5 ml-0.5">
            {detalle}
          </span>
        )}
      </button>
    </div>
  )
}
