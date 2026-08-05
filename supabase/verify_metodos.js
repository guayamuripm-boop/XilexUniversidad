#!/usr/bin/env node
/**
 * ¿Qué subtemas de la base se quedan sin método en `src/lib/metodos.ts`?
 *
 *   node supabase/verify_metodos.js
 *
 * La explicación reforzada que aparece bajo cada pregunta se engancha por el
 * código del subtema. Si alguien añade un subtema a la base y no lo declara en
 * ningún método, esas preguntas pierden el bloque de método sin que nada falle
 * ni avise: siguen respondiéndose igual, solo dejan de enseñar. Este script
 * convierte ese silencio en un error visible.
 *
 * Los subtemas de `simadi/especializacion` quedan fuera a propósito: son
 * asignaturas de contenido (Genética, Historia de Venezuela) y no tipos de
 * ejercicio, así que no existe un "método de resolución" que darles sin
 * inventarlo.
 */
const fs = require('fs'), path = require('path')
const APP = path.resolve(__dirname, '..')
for (const line of fs.readFileSync(path.join(APP, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
}

// Códigos declarados en los métodos.
const src = fs.readFileSync(path.join(APP, 'src', 'lib', 'metodos.ts'), 'utf8')
const declarados = new Set()
for (const bloque of src.matchAll(/subtemas:\s*\[([^\]]*)\]/g)) {
  for (const s of bloque[1].matchAll(/'([^']+)'/g)) declarados.add(s[1])
}
const cubre = (code) =>
  declarados.has(code) || [...declarados].some(d => code.includes(d) || d.includes(code))

const { createClient } = require('@supabase/supabase-js')
const a = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
;(async () => {
  const [{ data: u }, { data: ar }, { data: s }] = await Promise.all([
    a.from('universities').select('id,code'),
    a.from('areas').select('id,code,university_id'),
    a.from('subtopics').select('id,code,area_id'),
  ])
  const um = new Map(u.map(x => [x.id, x.code])), am = new Map(ar.map(x => [x.id, x]))

  // Cuántas preguntas activas cuelgan de cada subtema, para priorizar.
  const porSub = new Map()
  for (let from = 0; ; from += 1000) {
    const { data } = await a.from('questions').select('subtopic_id').eq('is_active', true).range(from, from + 999)
    if (!data || !data.length) break
    for (const q of data) porSub.set(q.subtopic_id, (porSub.get(q.subtopic_id) || 0) + 1)
    if (data.length < 1000) break
  }

  const sinMetodo = []
  for (const x of s) {
    const A = am.get(x.area_id); if (!A) continue
    const uni = um.get(A.university_id)
    if (A.code === 'especializacion') continue // asignaturas de contenido, sin método de resolución
    if (!cubre(x.code)) sinMetodo.push({ ruta: `${uni}/${A.code}/${x.code}`, n: porSub.get(x.id) || 0 })
  }

  console.log(`Métodos declarados: ${declarados.size} códigos de subtema.`)
  if (sinMetodo.length === 0) {
    console.log('✓ Todos los subtemas de razonamiento tienen método asociado.')
  } else {
    console.log(`✗ ${sinMetodo.length} subtema(s) sin método:`)
    for (const x of sinMetodo.sort((p, q) => q.n - p.n)) console.log(`  ${x.ruta.padEnd(50)} ${x.n} preguntas`)
  }
})()
