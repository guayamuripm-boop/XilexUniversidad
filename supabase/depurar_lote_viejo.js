#!/usr/bin/env node
/**
 * Depura el banco heredado de UNIMET (lotes fase1, fase1b, lote3 y lote5).
 *
 *   node supabase/depurar_lote_viejo.js            # informa, no escribe
 *   node supabase/depurar_lote_viejo.js --apply    # aplica
 *
 * Ese banco tiene 327 preguntas, pero solo 111 enunciados distintos: el resto
 * son la misma plantilla con otros números ("Si 3x + 1 = 7" aparece nueve
 * veces). Además, dos categorías completas usan un tipo de ítem que no es el de
 * la PDU:
 *
 *   - "Transforme a estilo indirecto: El gerente afirmó..." — en la prueba real,
 *     redacción indirecta consiste en elegir la mejor de cuatro versiones de un
 *     mismo texto, no en pasar una cita a estilo indirecto.
 *   - "Reordene para formar un párrafo coherente" — el ítem oficial reordena
 *     seis fragmentos de UNA oración, no oraciones completas.
 *
 * Se desactivan (nunca se borran: pueden estar en simulacros ya respondidos):
 *   1. Todas las de esas dos categorías mal planteadas.
 *   2. Las que exceden el tope de 2 preguntas por plantilla.
 *
 * Las preguntas del lote 8 no se tocan.
 */
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const APP_DIR = path.resolve(__dirname, '..')
const APPLY = process.argv.includes('--apply')
const TOPE_POR_PLANTILLA = 2

for (const line of fs.readFileSync(path.join(APP_DIR, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

/** Ítems cuyo tipo no corresponde al de la PDU. */
const FORMATO_AJENO = /Transforme a estilo indirecto|Reordene para formar un párrafo/i

/** Enunciado con los números neutralizados: dos preguntas con la misma plantilla colapsan. */
const plantillaDe = (s) =>
  String(s).replace(/[0-9]+([.,][0-9]+)?/g, '#').replace(/\s+/g, ' ').trim().toLowerCase()

async function main() {
  const { data: uni } = await admin.from('universities').select('id').eq('code', 'unimet').single()

  let qs = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await admin
      .from('questions')
      .select('id, statement, source_reference, is_active, created_at')
      .eq('university_id', uni.id).eq('is_active', true)
      .range(from, from + 999)
    if (error) throw error
    if (!data.length) break
    qs = qs.concat(data)
    if (data.length < 1000) break
  }

  const viejas = qs.filter(q => !/:lote8:/.test(q.source_reference || ''))
  console.log(`Preguntas activas de UNIMET: ${qs.length}  (heredadas: ${viejas.length})`)

  const porFormato = viejas.filter(q => FORMATO_AJENO.test(q.statement))
  const resto = viejas.filter(q => !FORMATO_AJENO.test(q.statement))

  const grupos = new Map()
  for (const q of resto) {
    const k = plantillaDe(q.statement)
    if (!grupos.has(k)) grupos.set(k, [])
    grupos.get(k).push(q)
  }
  const porClon = []
  for (const grupo of grupos.values()) {
    grupo.sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)) || a.id.localeCompare(b.id))
    porClon.push(...grupo.slice(TOPE_POR_PLANTILLA))
  }

  const retirar = [...porFormato, ...porClon]
  console.log(`\n  Por usar un tipo de ítem ajeno a la PDU: ${porFormato.length}`)
  console.log(`  Por exceder ${TOPE_POR_PLANTILLA} preguntas de la misma plantilla: ${porClon.length}`)
  console.log(`  Total a desactivar: ${retirar.length}`)
  console.log(`  Heredadas que quedan activas: ${viejas.length - retirar.length}`)
  console.log(`  Total UNIMET activo tras la depuración: ${qs.length - retirar.length}`)

  if (!APPLY) {
    console.log('\n(simulacro — nada se escribió. Usa --apply.)')
    return
  }

  const ids = retirar.map(q => q.id)
  let hechas = 0
  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100)
    const { error } = await admin.from('questions')
      .update({ is_active: false, updated_at: new Date().toISOString() }).in('id', chunk)
    if (error) throw error
    hechas += chunk.length
    process.stdout.write(`\rDesactivadas ${hechas}/${ids.length}`)
  }
  console.log('\nListo. Las preguntas siguen en la base para no romper historiales.')
}

main().catch(e => { console.error(e); process.exit(1) })
