#!/usr/bin/env node
/**
 * Verificación de extremo a extremo del simulacro de UNIMET, con la clave
 * anónima: es decir, pasando por RLS exactamente igual que el navegador.
 *
 *   node supabase/verify_unimet.js
 *
 * Comprueba que un examen completo de 100 preguntas se puede sortear, que no
 * trae contenido repetido, que cubre las categorías oficiales y que ninguna
 * pregunta viene rota.
 */
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

for (const line of fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

// Clave anónima a propósito: valida también las políticas RLS.
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})

let fallos = 0
const check = (ok, msg) => { console.log(`  ${ok ? '✓' : '✗'} ${msg}`); if (!ok) fallos++ }

async function main() {
  const { data: uni } = await db.from('universities').select('id, code').eq('code', 'unimet').single()
  const { data: areas } = await db.from('areas').select('id, code, question_count, time_limit_minutes')
    .eq('university_id', uni.id)

  console.log('Estructura de la PDU en la base:')
  for (const a of areas.sort((x, y) => x.code.localeCompare(y.code))) {
    console.log(`  ${a.code.padEnd(14)} ${a.question_count} preguntas · ${a.time_limit_minutes} min`)
  }
  const cuant = areas.find(a => a.code === 'cuantitativo')
  const verbal = areas.find(a => a.code === 'verbal')

  console.log('\nComprobaciones de estructura (manual oficial: 50/75 y 50/60):')
  check(cuant.question_count === 50 && cuant.time_limit_minutes === 75, 'cuantitativa: 50 preguntas, 75 min')
  check(verbal.question_count === 50 && verbal.time_limit_minutes === 60, 'verbal: 50 preguntas, 60 min')

  // Un examen completo, como lo pediría /practice.
  const { data: qs, error } = await db.rpc('get_random_questions', {
    p_university_ids: [uni.id],
    p_area_ids: areas.map(a => a.id),
    p_limit: 100,
    p_exclude_ids: [],
    p_cluster_codes: null,
  })

  console.log('\nSorteo de un examen completo (100 preguntas) vía RPC con clave anónima:')
  if (error) { check(false, `la RPC falló: ${error.message}`); process.exit(1) }
  check(qs.length === 100, `devuelve 100 preguntas (devolvió ${qs.length})`)

  const ids = new Set(qs.map(q => q.id))
  check(ids.size === qs.length, 'sin ids repetidos')

  // El defecto que motivó el saneamiento: contenido idéntico con id distinto.
  const firmas = qs.map(q => q.statement + '||' + JSON.stringify(q.options))
  const repetidas = firmas.length - new Set(firmas).size
  check(repetidas === 0, `sin preguntas de contenido repetido (repetidas: ${repetidas})`)

  const rotas = qs.filter(q =>
    !q.statement || !q.explanation ||
    !['A', 'B', 'C', 'D'].includes(q.correct_answer) ||
    !q.options || Object.keys(q.options).length !== 4 ||
    !q.options[q.correct_answer]
  )
  check(rotas.length === 0, `ninguna pregunta mal formada (rotas: ${rotas.length})`)
  check(qs.every(q => q.is_active), 'ninguna pregunta desactivada')

  const dif = {}
  for (const q of qs) dif[q.difficulty] = (dif[q.difficulty] || 0) + 1
  console.log(`\n  Dificultad del examen sorteado: ${JSON.stringify(dif)}`)
  check((dif.hard || 0) >= 10, `incluye una proporción real de difíciles (${dif.hard || 0} de 100)`)

  // Cobertura de la taxonomía oficial.
  const { data: subs } = await db.from('subtopics').select('id, code, area_id')
  const subById = new Map(subs.map(s => [s.id, s]))
  const cubiertos = new Set(qs.map(q => subById.get(q.subtopic_id)?.code).filter(Boolean))
  console.log(`\n  Subtemas distintos en este examen: ${cubiertos.size}`)

  const OFICIALES_CUANT = ['seriacion', 'razonamiento_algoritmico', 'estimacion', 'razonamiento_proporcional',
    'equivalencias_matematicas', 'interpretacion_graficos', 'estadistica_y_probabilidad',
    'razonamiento_logico_conjuntos', 'geometria_y_medicion', 'funciones_y_variacion']
  const OFICIALES_VERBAL = ['ortografia', 'puntuacion', 'redaccion_indirecta', 'palabras_contexto',
    'relaciones_analogicas', 'orden_logico', 'comprension_de_textos']

  console.log('\nCategorías oficiales con preguntas activas en el banco:')
  const idsArea = new Set(areas.map(a => a.id))
  for (const code of [...OFICIALES_CUANT, ...OFICIALES_VERBAL]) {
    const sub = subs.find(s => s.code === code && idsArea.has(s.area_id))
    if (!sub) { check(false, `${code}: el subtema no existe`); continue }
    const { count } = await db.from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('subtopic_id', sub.id).eq('is_active', true)
    check(count > 0, `${code.padEnd(32)} ${count} preguntas`)
  }

  console.log(fallos === 0 ? '\n✓ Todo correcto.' : `\n✗ ${fallos} comprobación(es) fallida(s).`)
  process.exit(fallos === 0 ? 0 : 1)
}

main().catch(e => { console.error(e); process.exit(1) })
