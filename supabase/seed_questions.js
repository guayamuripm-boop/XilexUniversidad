#!/usr/bin/env node
/**
 * Carga el banco de ejercicios (CSV de /banco) en Supabase.
 *
 *   node supabase/seed_questions.js              # simulacro, no escribe nada
 *   node supabase/seed_questions.js --apply      # inserta lo que falte
 *
 * Es idempotente: cada pregunta se marca con un `source_reference` derivado del
 * archivo y del id del CSV (`banco:lote4:242`), y solo se insertan las que aún
 * no existen. Volver a ejecutarlo no duplica nada.
 *
 * Sustituye a import_csv.js / deploy_specializations*.js, que generaban SQL con
 * un parser CSV que se rompía con campos multilínea y con códigos de subtema
 * que ya no coinciden con los de la base.
 *
 * Requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (se leen de
 * .env.local si existe).
 */
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const APP_DIR = path.resolve(__dirname, '..')
const BANCO_DIR = path.resolve(APP_DIR, '..', 'banco')
const APPLY = process.argv.includes('--apply')

// ------------------------------------------------------------------
// Entorno
// ------------------------------------------------------------------
function loadEnv() {
  const file = path.join(APP_DIR, '.env.local')
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}
loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

// ------------------------------------------------------------------
// CSV (RFC 4180: comillas escapadas y saltos de línea dentro de campos)
// ------------------------------------------------------------------
function parseCsv(text) {
  const rows = []
  let row = [], field = '', inQuotes = false
  text = text.replace(/^﻿/, '')
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else inQuotes = false
      } else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows.filter(r => r.some(v => v.trim() !== ''))
}

function readCsv(file) {
  const rows = parseCsv(fs.readFileSync(file, 'utf8'))
  const header = rows[0].map(h => h.trim())
  return rows.slice(1).map(r => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])))
}

// ------------------------------------------------------------------
// Mapeo CSV -> taxonomía de la base
// ------------------------------------------------------------------
const SOURCES = [
  { tag: 'fase1', file: path.join(BANCO_DIR, 'Xilex_Banco_Ejercicios_Fase1 (1).csv') },
  { tag: 'fase1b', file: path.join(BANCO_DIR, 'Xilex_Banco_Ejercicios_Fase1_Lote2.csv') },
  { tag: 'lote3', file: path.join(BANCO_DIR, 'Xilex_Banco_Ejercicios_Lote3.csv') },
  { tag: 'lote4', file: path.join(BANCO_DIR, 'files (2)', 'Xilex_Banco_Ejercicios_Lote4_UCV_SIMADI.csv') },
  { tag: 'lote5', file: path.join(BANCO_DIR, 'files (2)', 'Xilex_Banco_Ejercicios_Lote5_UNIMET_PDU.csv') },
  { tag: 'lote6', file: path.join(BANCO_DIR, 'files (2)', 'Xilex_Banco_Ejercicios_Lote6_USB.csv') },
  { tag: 'lote7', file: path.join(BANCO_DIR, 'files (2)', 'Xilex_Banco_Ejercicios_Lote7_UCAB.csv') },
  // Generado por `node banco/build_lote8.js` a partir de banco/lote8_unimet_src.js.
  // No editar el CSV a mano: se regenera y se valida desde esa fuente.
  { tag: 'lote8', file: path.join(BANCO_DIR, 'Xilex_Banco_Ejercicios_Lote8_UNIMET_PDU.csv') },
  // Reposición del banco heredado tras depurarlo. Fuente: banco/lote9_unimet_src.js.
  { tag: 'lote9', file: path.join(BANCO_DIR, 'Xilex_Banco_Ejercicios_Lote9_UNIMET_PDU.csv') },
  // Refuerzo de SIMADI, USB y UCAB, que se habían quedado atrás mientras los
  // lotes 8 y 9 ampliaban la UNIMET. Fuente: banco/lote10_src.js.
  { tag: 'lote10', file: path.join(BANCO_DIR, 'Xilex_Banco_Ejercicios_Lote10_UCV_USB_UCAB.csv') },
]

const UNIVERSITY_BY_INSTITUCION = { UCV: 'simadi', UNIMET: 'unimet', USB: 'usb', UCAB: 'ucab' }

/** `institucion|area` del CSV -> código de área en la base. */
const AREA_MAP = {
  'UCV|Razonamiento logico': 'logico',
  'UCV|Razonamiento verbal': 'verbal',
  'UNIMET|Aptitud cuantitativa': 'cuantitativo',
  'UNIMET|Aptitud verbal': 'verbal',
  // La USB divide su prueba en Habilidades (verbal) y Conocimientos
  // (cuantitativa + espacial); el CSV usa tres etiquetas.
  'USB|Habilidad verbal': 'habilidades',
  'USB|Habilidad cuantitativa': 'conocimientos',
  'USB|Habilidad espacial': 'conocimientos',
  'UCAB|Habilidad verbal': 'verbal',
  'UCAB|Habilidad numerica': 'numerica',
  'UCAB|Razonamiento logico-matematico': 'logico',
}

/** Subtemas cuyo nombre en el CSV no coincide con el código ya existente. */
const SUBTOPIC_ALIASES = {
  'unimet|verbal|significado_de_palabras_en_contexto': 'palabras_contexto',
  'usb|conocimientos|geometria_plana': 'geometria',
  'usb|conocimientos|vectores_en_el_plano': 'vectores',
  'usb|conocimientos|cubos_y_solidos': 'cubos',
  'usb|conocimientos|desarrollo_de_solidos': 'desarrollo',
  'ucab|numerica|fracciones_y_proporciones': 'fracciones',
  'ucab|numerica|movimiento_y_velocidad': 'movimiento',
  'ucab|verbal|analogias_verbales': 'analogias',
  'ucab|logico|series_numericas': 'series',
}

const slug = (s) => s
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '')

/** dificultad 1-5 del CSV -> enum question_difficulty */
function toDifficulty(raw) {
  const n = Number(raw)
  if (!Number.isFinite(n)) return 'medium'
  if (n <= 2) return 'easy'
  if (n === 3) return 'medium'
  return 'hard'
}

function toSourceType(raw) {
  if (raw === 'oficial' || raw === 'official_model') return 'official_model'
  if (raw === 'original') return 'original'
  return 'generated_pattern'
}

// ------------------------------------------------------------------
async function main() {
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

  const [{ data: unis }, { data: areas }, { data: subs }] = await Promise.all([
    admin.from('universities').select('id, code'),
    admin.from('areas').select('id, code, university_id'),
    admin.from('subtopics').select('id, code, area_id'),
  ])

  const uniByCode = new Map(unis.map(u => [u.code, u]))
  const areaByKey = new Map()
  for (const a of areas) {
    const uni = unis.find(u => u.id === a.university_id)
    if (uni) areaByKey.set(`${uni.code}|${a.code}`, a)
  }
  const subByKey = new Map()
  for (const s of subs) {
    const a = areas.find(x => x.id === s.area_id)
    const uni = a && unis.find(u => u.id === a.university_id)
    if (uni) subByKey.set(`${uni.code}|${a.code}|${s.code}`, s)
  }

  // Referencias ya presentes, para no reinsertar.
  const existing = new Set()
  for (let from = 0; ; from += 1000) {
    const { data, error } = await admin
      .from('questions')
      .select('source_reference')
      .range(from, from + 999)
    if (error) throw error
    if (!data.length) break
    for (const q of data) if (q.source_reference) existing.add(q.source_reference)
    if (data.length < 1000) break
  }

  const toInsert = []
  const problems = []
  let seen = 0, skipped = 0

  for (const { tag, file } of SOURCES) {
    if (!fs.existsSync(file)) {
      problems.push(`archivo no encontrado: ${file}`)
      continue
    }
    for (const row of readCsv(file)) {
      seen++
      const ref = `banco:${tag}:${row.id}`
      if (existing.has(ref)) { skipped++; continue }

      const uniCode = UNIVERSITY_BY_INSTITUCION[row.institucion]
      const areaCode = AREA_MAP[`${row.institucion}|${row.area}`]
      if (!uniCode || !areaCode) {
        problems.push(`${ref}: sin mapeo de area "${row.institucion} / ${row.area}"`)
        continue
      }

      const area = areaByKey.get(`${uniCode}|${areaCode}`)
      if (!area) { problems.push(`${ref}: area ${uniCode}/${areaCode} no existe en la BD`); continue }

      const subSlug = slug(row.subtema)
      const aliasKey = `${uniCode}|${areaCode}|${subSlug}`
      const subCode = SUBTOPIC_ALIASES[aliasKey] ?? subSlug
      const sub = subByKey.get(`${uniCode}|${areaCode}|${subCode}`)
      if (!sub) {
        problems.push(`${ref}: subtema ${uniCode}/${areaCode}/${subCode} ("${row.subtema}") no existe en la BD`)
        continue
      }

      const answer = (row.respuesta_correcta || '').toUpperCase()
      if (!['A', 'B', 'C', 'D'].includes(answer)) {
        problems.push(`${ref}: respuesta_correcta inválida "${row.respuesta_correcta}"`)
        continue
      }
      if (!row.enunciado || !row.opcion_a || !row.opcion_b || !row.opcion_c || !row.opcion_d) {
        problems.push(`${ref}: enunciado u opciones vacías`)
        continue
      }

      toInsert.push({
        subtopic_id: sub.id,
        university_id: uniByCode.get(uniCode).id,
        area_id: area.id,
        statement: row.enunciado,
        options: { A: row.opcion_a, B: row.opcion_b, C: row.opcion_c, D: row.opcion_d },
        correct_answer: answer,
        explanation: row.explicacion || 'Sin explicación disponible.',
        difficulty: toDifficulty(row.dificultad),
        source_type: toSourceType(row.fuente_tipo),
        source_reference: ref,
        is_active: true,
      })
    }
  }

  console.log(`Filas leídas:        ${seen}`)
  console.log(`Ya en la base:       ${skipped}`)
  console.log(`Listas para cargar:  ${toInsert.length}`)
  console.log(`Descartadas:         ${problems.length}`)
  if (problems.length) {
    console.log('\nProblemas:')
    for (const p of problems.slice(0, 40)) console.log('  -', p)
    if (problems.length > 40) console.log(`  ... y ${problems.length - 40} más`)
  }

  const byTarget = {}
  for (const q of toInsert) {
    const a = areas.find(x => x.id === q.area_id)
    const u = unis.find(x => x.id === a.university_id)
    const k = `${u.code}/${a.code}`
    byTarget[k] = (byTarget[k] || 0) + 1
  }
  console.log('\nDistribución de lo que se cargaría:')
  for (const k of Object.keys(byTarget).sort()) console.log(`  ${k.padEnd(28)} ${byTarget[k]}`)

  if (!APPLY) {
    console.log('\n(simulacro — nada se escribió. Usa --apply para cargar.)')
    return
  }
  if (!toInsert.length) {
    console.log('\nNada que cargar.')
    return
  }

  const BATCH = 100
  let inserted = 0
  for (let i = 0; i < toInsert.length; i += BATCH) {
    const chunk = toInsert.slice(i, i + BATCH)
    const { error } = await admin.from('questions').insert(chunk)
    if (error) {
      console.error(`\nError en el lote ${i / BATCH + 1}:`, error.message)
      process.exit(1)
    }
    inserted += chunk.length
    process.stdout.write(`\rInsertadas ${inserted}/${toInsert.length}`)
  }
  console.log('\nListo.')
}

main().catch(err => { console.error(err); process.exit(1) })
