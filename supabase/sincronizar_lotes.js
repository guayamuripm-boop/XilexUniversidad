#!/usr/bin/env node
/**
 * Sincroniza en la base los campos editables de las preguntas ya cargadas.
 *
 *   node supabase/sincronizar_lotes.js            # informa
 *   node supabase/sincronizar_lotes.js --apply    # actualiza
 *
 * `seed_questions.js` solo inserta lo que falta: si una pregunta ya existe la
 * salta. Eso basta para cargar, pero no para corregir. Cuando cambia la
 * dificultad, la explicación o la respuesta de una pregunta que ya está en la
 * base, su identificador de contenido no cambia (el hash cubre enunciado y
 * opciones, no estos campos), así que el seeder no vuelve a tocarla y la
 * corrección se queda en el CSV.
 *
 * Este script cierra ese hueco: recorre los CSV de los lotes propios y
 * actualiza los campos que difieran de lo que hay en la base.
 */
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const APP_DIR = path.resolve(__dirname, '..')
const BANCO = path.resolve(APP_DIR, '..', 'banco')
const APPLY = process.argv.includes('--apply')

const LOTES = [
  { tag: 'lote8', file: path.join(BANCO, 'Xilex_Banco_Ejercicios_Lote8_UNIMET_PDU.csv') },
  { tag: 'lote9', file: path.join(BANCO, 'Xilex_Banco_Ejercicios_Lote9_UNIMET_PDU.csv') },
]

for (const line of fs.readFileSync(path.join(APP_DIR, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

function parseCsv(text) {
  const rows = []; let row = [], field = '', inQuotes = false
  text = text.replace(/^﻿/, '')
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++ } else inQuotes = false } else field += c }
    else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows.filter(r => r.some(v => v.trim() !== ''))
}

const toDifficulty = (raw) => {
  const n = Number(raw)
  if (!Number.isFinite(n)) return 'medium'
  return n <= 2 ? 'easy' : n === 3 ? 'medium' : 'hard'
}

async function main() {
  const deseado = new Map()
  for (const { tag, file } of LOTES) {
    if (!fs.existsSync(file)) { console.log(`(falta ${path.basename(file)})`); continue }
    const rows = parseCsv(fs.readFileSync(file, 'utf8'))
    const h = rows[0].map(x => x.trim())
    for (const r of rows.slice(1)) {
      const o = Object.fromEntries(h.map((k, i) => [k, (r[i] ?? '').trim()]))
      deseado.set(`banco:${tag}:${o.id}`, {
        difficulty: toDifficulty(o.dificultad),
        explanation: o.explicacion || 'Sin explicación disponible.',
        correct_answer: (o.respuesta_correcta || '').toUpperCase(),
        options: { A: o.opcion_a, B: o.opcion_b, C: o.opcion_c, D: o.opcion_d },
      })
    }
  }
  console.log(`Preguntas en los CSV propios: ${deseado.size}`)

  let actuales = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await admin
      .from('questions')
      .select('id, source_reference, difficulty, explanation, correct_answer, options')
      .or('source_reference.like.banco:lote8:%,source_reference.like.banco:lote9:%')
      .range(from, from + 999)
    if (error) throw error
    if (!data.length) break
    actuales = actuales.concat(data)
    if (data.length < 1000) break
  }
  console.log(`Preguntas de esos lotes en la base: ${actuales.length}`)

  // Reordenar las opciones de una pregunta ya respondida corrompería el
  // historial: `simulacrum_questions` guarda la respuesta como letra, y esa
  // letra pasaría a señalar un texto distinto. Por eso `options` y
  // `correct_answer` solo se tocan en preguntas que nadie ha respondido; la
  // dificultad y la explicación son seguras en cualquier caso.
  const usadas = new Set()
  const ids = actuales.map(q => q.id)
  for (let i = 0; i < ids.length; i += 100) {
    const { data, error } = await admin
      .from('simulacrum_questions').select('question_id').in('question_id', ids.slice(i, i + 100))
    if (error) throw error
    for (const r of data) usadas.add(r.question_id)
  }
  console.log(`De ellas, ya respondidas por alguien: ${usadas.size}`)

  const cambios = []
  const porCampo = {}
  let protegidas = 0
  for (const q of actuales) {
    const d = deseado.get(q.source_reference)
    if (!d) continue
    const parche = {}
    if (q.difficulty !== d.difficulty) parche.difficulty = d.difficulty
    if (q.explanation !== d.explanation) parche.explanation = d.explanation

    const cambiaOpciones = q.correct_answer !== d.correct_answer ||
      JSON.stringify(q.options) !== JSON.stringify(d.options)
    if (cambiaOpciones) {
      if (usadas.has(q.id)) {
        protegidas++
      } else {
        parche.correct_answer = d.correct_answer
        parche.options = d.options
      }
    }

    if (Object.keys(parche).length) {
      for (const k of Object.keys(parche)) porCampo[k] = (porCampo[k] || 0) + 1
      cambios.push({ id: q.id, parche })
    }
  }
  if (protegidas) console.log(`Se respeta el orden de opciones en ${protegidas} ya respondidas.`)

  console.log(`\n  Preguntas con algún campo desactualizado: ${cambios.length}`)
  for (const [k, v] of Object.entries(porCampo)) console.log(`    ${k}: ${v}`)

  if (!APPLY) { console.log('\n(simulacro — nada se escribió. Usa --apply.)'); return }
  if (!cambios.length) { console.log('\nNada que actualizar.'); return }

  let hechos = 0
  for (const c of cambios) {
    const { error } = await admin.from('questions')
      .update({ ...c.parche, updated_at: new Date().toISOString() }).eq('id', c.id)
    if (error) throw error
    hechos++
    if (hechos % 50 === 0) process.stdout.write(`\rActualizadas ${hechos}/${cambios.length}`)
  }
  console.log(`\rActualizadas ${hechos}/${cambios.length}. Listo.`)
}

main().catch(e => { console.error(e); process.exit(1) })
