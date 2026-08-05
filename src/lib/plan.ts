/**
 * Plan de estudio UNIMET (PDU), 3 → 26 de agosto de 2026.
 *
 * Es el plan que el propio usuario preparó fuera de XILEX (Anki + Google
 * Sheets + Khan Academy + NotebookLM + un simulador externo para espacial),
 * traído aquí para que `/plan` pueda mostrarlo día a día y enlazar cada
 * bloque directo al ejercicio de XILEX que le corresponde — sin que haya que
 * reconfigurar el simulacro o el modo entrenamiento a mano cada vez.
 *
 * Dos cosas no se inventan aquí, se declaran honestas:
 *
 *  1. Las herramientas externas (Anki, el Sheet, Khan Academy, NotebookLM, el
 *     simulador de espacial, RAE/Fundéu) XILEX no las reemplaza ni las
 *     integra: se listan como enlaces externos, tal cual las nombra el plan.
 *  2. El banco de la UNIMET en XILEX no cubre uno a uno todos los subtemas
 *     que nombra el plan. Donde no hay una coincidencia exacta —"Silogismos"
 *     no es un subtema de la PDU; "Razonamiento espacial" no es una sección
 *     oficial de la PDU según su propio manual— se dice explícitamente en
 *     `brecha`, en vez de enlazar a algo que no es realmente eso.
 */

export type TipoDia =
  | 'diagnostico' | 'revision' | 'practica' | 'espacial' | 'lectura'
  | 'simulacro' | 'repaso' | 'examen'

export interface EnlacePlan {
  href: string
  etiqueta: string
  externo?: boolean
}

export interface BloqueDia {
  detalle: string
  minutos: number
  enlaces?: EnlacePlan[]
  /** Por qué XILEX no tiene un enlace exacto para este bloque, si aplica. */
  brecha?: string
}

export interface DiaPlan {
  dia: number
  /** ISO, año 2026. */
  fecha: string
  etiquetaFecha: string
  semana: number
  minutosTotal: number
  titulo: string
  tipo: TipoDia
  anki: boolean
  bloques: BloqueDia[]
  notas?: string[]
}

export interface SemanaPlan {
  semana: number
  titulo: string
  rango: string
}

export const SEMANAS: SemanaPlan[] = [
  { semana: 1, titulo: 'Diagnóstico y fundamentos', rango: '3–9 ago' },
  { semana: 2, titulo: 'Profundización (interleaving)', rango: '10–16 ago' },
  { semana: 3, titulo: 'Simulacros completos + comprensión lectora', rango: '17–23 ago' },
  { semana: 4, titulo: 'Repaso ligero, sin contenido nuevo', rango: '24–26 ago' },
]

const practica = (metodo: string, etiqueta: string): EnlacePlan => ({
  href: `/entrenamiento?metodo=${metodo}`,
  etiqueta,
})

const simulacro = (params: string, etiqueta: string): EnlacePlan => ({
  href: `/practice?uni=unimet${params}`,
  etiqueta,
})

export const PLAN_UNIMET: DiaPlan[] = [
  // ── SEMANA 1 ───────────────────────────────────────────────────────────
  {
    dia: 1, fecha: '2026-08-03', etiquetaFecha: 'lun 3', semana: 1, minutosTotal: 50,
    titulo: 'Diagnóstico', tipo: 'diagnostico', anki: false,
    bloques: [
      { detalle: 'Configura las 7 herramientas del plan.', minutos: 15 },
      {
        detalle: 'Simulacro MIXTO de diagnóstico, 20 preguntas, cronometrado. No estudies nada antes — es tu línea base.',
        minutos: 35,
        enlaces: [simulacro('&count=20', 'Simulacro mixto · 20 preguntas')],
      },
    ],
  },
  {
    dia: 2, fecha: '2026-08-04', etiquetaFecha: 'mar 4', semana: 1, minutosTotal: 30,
    titulo: 'Revisión del diagnóstico', tipo: 'revision', anki: true,
    bloques: [
      {
        detalle: 'Repasa las 20 preguntas del simulacro de ayer una por una. Anota CADA error en el Sheet.',
        minutos: 20,
        enlaces: [{ href: '/simulacrums', etiqueta: 'Ver el simulacro de ayer' }],
      },
      { detalle: 'Crea tarjetas en Anki de los 5 errores más importantes.', minutos: 5 },
    ],
  },
  {
    dia: 3, fecha: '2026-08-05', etiquetaFecha: 'mié 5', semana: 1, minutosTotal: 35,
    titulo: 'Álgebra / planteamiento de problemas', tipo: 'practica', anki: true,
    bloques: [
      {
        detalle: '12 ejercicios en modo práctica.',
        minutos: 25,
        enlaces: [practica('planteamientos', 'Entrenar: planteamientos algebraicos')],
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },
  {
    dia: 4, fecha: '2026-08-06', etiquetaFecha: 'jue 6', semana: 1, minutosTotal: 35,
    titulo: 'Ortografía y puntuación', tipo: 'practica', anki: true,
    bloques: [
      {
        detalle: '12 ejercicios.',
        minutos: 25,
        enlaces: [
          practica('ortografia', 'Entrenar: ortografía'),
          practica('puntuacion', 'Entrenar: puntuación'),
        ],
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },
  {
    dia: 5, fecha: '2026-08-07', etiquetaFecha: 'vie 7', semana: 1, minutosTotal: 35,
    titulo: 'Proporciones / razonamiento estadístico', tipo: 'practica', anki: true,
    bloques: [
      {
        detalle: '12 ejercicios. Si fallas más del 40 %, mira un video corto de Khan Academy de "razones y proporciones" antes de la próxima sesión de este tema.',
        minutos: 25,
        enlaces: [
          practica('proporciones', 'Entrenar: proporciones'),
          practica('estadistica', 'Entrenar: estadística y probabilidad'),
          { href: 'https://es.khanacademy.org/math/pre-algebra/pre-algebra-ratios-rates/pre-algebra-ratios/v/introduction-to-ratios-new-hd-version', etiqueta: 'Khan Academy: razones y proporciones', externo: true },
        ],
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },
  {
    dia: 6, fecha: '2026-08-08', etiquetaFecha: 'sáb 8', semana: 1, minutosTotal: 35,
    titulo: 'Analogías verbales', tipo: 'practica', anki: true,
    bloques: [
      {
        detalle: '12 ejercicios.',
        minutos: 25,
        enlaces: [practica('analogias', 'Entrenar: analogías verbales')],
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },
  {
    dia: 7, fecha: '2026-08-09', etiquetaFecha: 'dom 9', semana: 1, minutosTotal: 40,
    titulo: 'Mini-simulacro mixto', tipo: 'simulacro', anki: true,
    bloques: [
      {
        detalle: 'Simulacro MIXTO de 20 preguntas cronometrado, mismo formato que el día 1. Compara tu % de aciertos con el diagnóstico inicial.',
        minutos: 25,
        enlaces: [simulacro('&count=20', 'Simulacro mixto · 20 preguntas')],
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },

  // ── SEMANA 2 ───────────────────────────────────────────────────────────
  {
    dia: 8, fecha: '2026-08-10', etiquetaFecha: 'lun 10', semana: 2, minutosTotal: 35,
    titulo: 'Series numéricas y estimación', tipo: 'practica', anki: true,
    bloques: [
      {
        detalle: '12 ejercicios.',
        minutos: 25,
        enlaces: [
          practica('series-numericas', 'Entrenar: series numéricas (seriación)'),
          practica('estimacion', 'Entrenar: estimación'),
        ],
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },
  {
    dia: 9, fecha: '2026-08-11', etiquetaFecha: 'mar 11', semana: 2, minutosTotal: 35,
    titulo: 'Palabras en contexto', tipo: 'practica', anki: true,
    bloques: [
      {
        detalle: '12 ejercicios.',
        minutos: 25,
        enlaces: [practica('palabras-contexto', 'Entrenar: palabras en contexto')],
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },
  {
    dia: 10, fecha: '2026-08-12', etiquetaFecha: 'mié 12', semana: 2, minutosTotal: 40,
    titulo: 'Razonamiento espacial', tipo: 'espacial', anki: true,
    bloques: [
      {
        detalle: '15 ejercicios de cubos desplegados, rotaciones y vistas.',
        minutos: 30,
        enlaces: [{ href: 'https://psicotecnicostest.com/online/Razonamiento-espacial', etiqueta: 'psicotecnicostest.com', externo: true }],
        brecha: 'El manual oficial de la PDU solo describe Aptitud Cuantitativa y Aptitud Verbal — no hay una sección de espacial en el examen. Tampoco hay banco de espacial para UNIMET en XILEX (sí para la USB). Si lo mantienes en tu plan como refuerzo general de lógica, el simulador externo es la vía; si prefieres, esta sesión puede cambiarse por una segunda vuelta a series numéricas o a razonamiento algorítmico.',
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },
  {
    dia: 11, fecha: '2026-08-13', etiquetaFecha: 'jue 13', semana: 2, minutosTotal: 35,
    titulo: 'Orden lógico de párrafos', tipo: 'practica', anki: true,
    bloques: [
      {
        detalle: '12 ejercicios.',
        minutos: 25,
        enlaces: [practica('orden-logico', 'Entrenar: orden lógico')],
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },
  {
    dia: 12, fecha: '2026-08-14', etiquetaFecha: 'vie 14', semana: 2, minutosTotal: 35,
    titulo: 'Silogismos / razonamiento lógico', tipo: 'practica', anki: true,
    bloques: [
      {
        detalle: '12 ejercicios.',
        minutos: 25,
        enlaces: [
          practica('conjuntos', 'Entrenar: conjuntos y diagramas de Venn'),
          practica('algoritmico', 'Entrenar: razonamiento algorítmico'),
        ],
        brecha: 'La PDU no tiene silogismos categóricos clásicos (eso es SIMADI/UCAB): la parte "lógica" de la cuantitativa de la UNIMET es razonamiento con conjuntos y razonamiento algorítmico. Son el reemplazo más cercano dentro de la taxonomía real del examen.',
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },
  {
    dia: 13, fecha: '2026-08-15', etiquetaFecha: 'sáb 15', semana: 2, minutosTotal: 35,
    titulo: 'Redacción', tipo: 'practica', anki: true,
    bloques: [
      {
        detalle: '12 ejercicios (identificar la oración mejor escrita). Consulta Fundéu para las dudas puntuales que te queden.',
        minutos: 25,
        enlaces: [
          practica('redaccion', 'Entrenar: redacción'),
          { href: 'https://www.fundeu.es/', etiqueta: 'Fundéu', externo: true },
        ],
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },
  {
    dia: 14, fecha: '2026-08-16', etiquetaFecha: 'dom 16', semana: 2, minutosTotal: 45,
    titulo: 'Simulacro mixto a ritmo real', tipo: 'simulacro', anki: true,
    bloques: [
      {
        detalle: 'Simulacro MIXTO de 30 preguntas cronometrado, ritmo real (1,5 min/preg cuantitativa, 1,2 min/preg verbal).',
        minutos: 30,
        enlaces: [simulacro('&count=30', 'Simulacro mixto · 30 preguntas')],
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },

  // ── SEMANA 3 ───────────────────────────────────────────────────────────
  {
    dia: 15, fecha: '2026-08-17', etiquetaFecha: 'lun 17', semana: 3, minutosTotal: 60,
    titulo: 'Simulacro completo · Cuantitativa', tipo: 'simulacro', anki: true,
    bloques: [
      {
        detalle: '50 preguntas, 75 min reales. Si no tienes la hora completa, hazlo en dos sesiones el mismo día.',
        minutos: 50,
        enlaces: [simulacro('&areas=cuantitativo&count=50', 'Simulacro completo · Cuantitativa (50 preg · 75 min)')],
      },
    ],
  },
  {
    dia: 16, fecha: '2026-08-18', etiquetaFecha: 'mar 18', semana: 3, minutosTotal: 35,
    titulo: 'Revisión: Cuantitativa', tipo: 'revision', anki: true,
    bloques: [
      {
        detalle: 'Revisa cada error del simulacro de ayer, anótalos en el Sheet.',
        minutos: 25,
        enlaces: [{ href: '/simulacrums', etiqueta: 'Ver el simulacro de ayer' }],
      },
      { detalle: 'Crea tarjetas de los 5 errores más importantes.', minutos: 5 },
    ],
  },
  {
    dia: 17, fecha: '2026-08-19', etiquetaFecha: 'mié 19', semana: 3, minutosTotal: 60,
    titulo: 'Simulacro completo · Verbal', tipo: 'simulacro', anki: true,
    bloques: [
      {
        detalle: '50 preguntas, 60 min reales.',
        minutos: 50,
        enlaces: [simulacro('&areas=verbal&count=50', 'Simulacro completo · Verbal (50 preg · 60 min)')],
      },
    ],
  },
  {
    dia: 18, fecha: '2026-08-20', etiquetaFecha: 'jue 20', semana: 3, minutosTotal: 35,
    titulo: 'Revisión: Verbal', tipo: 'revision', anki: true,
    bloques: [
      {
        detalle: 'Revisa cada error del simulacro de ayer, anótalos en el Sheet.',
        minutos: 25,
        enlaces: [{ href: '/simulacrums', etiqueta: 'Ver el simulacro de ayer' }],
      },
      { detalle: 'Crea tarjetas de los 5 errores más importantes.', minutos: 5 },
    ],
  },
  {
    dia: 19, fecha: '2026-08-21', etiquetaFecha: 'vie 21', semana: 3, minutosTotal: 35,
    titulo: 'Comprensión lectora con NotebookLM', tipo: 'lectura', anki: true,
    bloques: [
      {
        detalle: 'Pega un artículo de noticias (300-400 palabras) en NotebookLM y pídele 6 preguntas de comprensión (idea principal, propósito, inferencias, argumento a favor/en contra). Respóndelas sin ver el texto de nuevo.',
        minutos: 25,
        enlaces: [
          { href: 'https://notebooklm.google.com/', etiqueta: 'NotebookLM', externo: true },
          practica('comprension', 'Complemento en XILEX: comprensión lectora'),
        ],
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },
  {
    dia: 20, fecha: '2026-08-22', etiquetaFecha: 'sáb 22', semana: 3, minutosTotal: 35,
    titulo: 'Repaso del subtema más débil', tipo: 'practica', anki: true,
    bloques: [
      {
        detalle: 'Repite el subtema (de cuantitativa o verbal) con más errores acumulados en tu Sheet hasta ahora. 12 ejercicios.',
        minutos: 25,
        enlaces: [
          { href: '/progress', etiqueta: 'Ver tu progreso por subtema' },
          { href: '/entrenamiento', etiqueta: 'Elegir el tema en Entrenamiento' },
        ],
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },
  {
    dia: 21, fecha: '2026-08-23', etiquetaFecha: 'dom 23', semana: 3, minutosTotal: 45,
    titulo: 'Simulacro mixto a velocidad', tipo: 'simulacro', anki: true,
    bloques: [
      {
        detalle: 'Simulacro MIXTO de 30 preguntas cronometrado, enfocado en velocidad: si una pregunta te toma más de 90 segundos, sáltala y sigue.',
        minutos: 30,
        enlaces: [simulacro('&count=30', 'Simulacro mixto · 30 preguntas')],
      },
      { detalle: 'Anota los errores en el Sheet y crea tarjetas de los importantes.', minutos: 5 },
    ],
  },

  // ── SEMANA 4 ───────────────────────────────────────────────────────────
  {
    dia: 22, fecha: '2026-08-24', etiquetaFecha: 'lun 24', semana: 4, minutosTotal: 25,
    titulo: 'Repaso ligero', tipo: 'repaso', anki: true,
    bloques: [
      { detalle: 'Solo Anki hoy — no abras XILEX para ejercicios nuevos.', minutos: 10 },
      {
        detalle: 'Lee tu Google Sheet completo de errores, de principio a fin, sin resolver nada, solo repasando qué regla o concepto era cada uno.',
        minutos: 15,
      },
    ],
  },
  {
    dia: 23, fecha: '2026-08-25', etiquetaFecha: 'mar 25', semana: 4, minutosTotal: 20,
    titulo: 'Último repaso', tipo: 'repaso', anki: true,
    bloques: [
      {
        detalle: 'Relee solo las tarjetas de Anki marcadas como "difíciles" o que fallaste más de una vez. Nada más. Duerme bien esta noche.',
        minutos: 10,
      },
    ],
  },
  {
    dia: 24, fecha: '2026-08-26', etiquetaFecha: 'mié 26', semana: 4, minutosTotal: 0,
    titulo: 'Día del examen', tipo: 'examen', anki: false,
    bloques: [
      {
        detalle: 'No repases nada nuevo en la mañana. Lleva lápiz N.º 2 o HB, borrador y sacapuntas. No se permite calculadora.',
        minutos: 0,
      },
    ],
  },
]

/** El día de hoy en el plan, o null si hoy cae fuera del rango 3–26 de agosto. */
export function diaDeHoy(hoy: Date = new Date()): DiaPlan | null {
  const iso = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
    .toISOString().slice(0, 10)
  return PLAN_UNIMET.find(d => d.fecha === iso) ?? null
}

export function diasHastaElExamen(hoy: Date = new Date()): number {
  const examen = new Date('2026-08-26T00:00:00')
  const hoy0 = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  return Math.round((examen.getTime() - hoy0.getTime()) / 86_400_000)
}

export const TIPO_INFO: Record<TipoDia, { etiqueta: string; color: string; bg: string }> = {
  diagnostico: { etiqueta: 'Diagnóstico', color: 'text-accent-violet', bg: 'bg-accent-violet/10' },
  revision: { etiqueta: 'Revisión de errores', color: 'text-accent-amber', bg: 'bg-accent-amber/10' },
  practica: { etiqueta: 'Práctica por tema', color: 'text-primary', bg: 'bg-primary/10' },
  espacial: { etiqueta: 'Espacial (externo)', color: 'text-accent-sky', bg: 'bg-accent-sky/10' },
  lectura: { etiqueta: 'Comprensión lectora', color: 'text-accent-sky', bg: 'bg-accent-sky/10' },
  simulacro: { etiqueta: 'Simulacro cronometrado', color: 'text-accent-emerald', bg: 'bg-accent-emerald/10' },
  repaso: { etiqueta: 'Repaso ligero', color: 'text-blue-300', bg: 'bg-white/[0.05]' },
  examen: { etiqueta: 'Examen', color: 'text-red-400', bg: 'bg-red-500/10' },
}

export interface HerramientaExterna {
  nombre: string
  url: string
  uso: string
}

export const HERRAMIENTAS_EXTERNAS: HerramientaExterna[] = [
  {
    nombre: 'Anki',
    url: 'https://apps.ankiweb.net/',
    uso: 'Repetición espaciada. Ahí van todas las tarjetas de tus errores; se abre todos los días.',
  },
  {
    nombre: 'Google Sheets',
    url: 'https://sheets.google.com/',
    uso: 'Bitácora de errores: Fecha | Subtema | Pregunta/Error | Por qué fallé | Regla correcta | ¿Ya está en Anki?',
  },
  {
    nombre: 'Khan Academy en español',
    url: 'https://es.khanacademy.org/',
    uso: 'Videos cortos de álgebra, proporciones y estadística, solo cuando un tema se sienta débil de base.',
  },
  {
    nombre: 'psicotecnicostest.com',
    url: 'https://psicotecnicostest.com/online/Razonamiento-espacial',
    uso: 'Simulador de cubos desplegados, rotaciones y vistas.',
  },
  {
    nombre: 'NotebookLM',
    url: 'https://notebooklm.google.com/',
    uso: 'Generador ilimitado de preguntas de comprensión lectora a partir de cualquier texto que le pegues.',
  },
  {
    nombre: 'RAE y Fundéu',
    url: 'https://www.fundeu.es/',
    uso: 'Consulta rápida de dudas de ortografía o redacción que la explicación de XILEX no resuelva del todo.',
  },
]

export const PRINCIPIOS_DEL_PLAN: { titulo: string; texto: string }[] = [
  {
    titulo: 'Anki todos los días',
    texto: 'Repetición espaciada: distribuir el repaso en el tiempo supera por mucho estudiar todo de golpe.',
  },
  {
    titulo: 'Resolver, no releer',
    texto: 'Recuperación activa: forzar a tu cerebro a recordar fortalece la memoria más que repasar teoría pasivamente.',
  },
  {
    titulo: 'Cuantitativa y verbal alternadas',
    texto: 'Intercalado (interleaving): se siente más difícil en el momento, pero produce aprendizaje más duradero que un bloque largo del mismo tema.',
  },
  {
    titulo: 'Simulacros completos en la semana 3',
    texto: 'Dificultades deseables: es incómodo fallar bajo presión de tiempo real, pero es exactamente ahí donde más se aprende.',
  },
  {
    titulo: 'Semana 4 sin contenido nuevo',
    texto: 'Evita la saturación de último minuto, que el propio manual de la UNIMET desaconseja.',
  },
]
