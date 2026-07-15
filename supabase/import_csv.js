const fs = require('fs');
const path = require('path');

const csvFiles = [
  'Xilex_Banco_Ejercicios_Fase1 (1).csv',
  'Xilex_Banco_Ejercicios_Fase1_Lote2.csv',
  'Xilex_Banco_Ejercicios_Lote3.csv'
];

const bancoDir = 'C:\\Dev\\XILEX\\banco';

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        if (inQuotes && line[j+1] === '"') {
          current += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((h, idx) => row[h] = values[idx].replace(/^"|"$/g, '').replace(/""/g, '"'));
      rows.push(row);
    }
  }
  return rows;
}

const allExercises = [];
const subtopicSet = new Set();

for (const file of csvFiles) {
  const content = fs.readFileSync(path.join(bancoDir, file), 'utf8');
  const rows = parseCSV(content);
  allExercises.push(...rows);
  rows.forEach(r => {
    const key = `${r.institucion}|${r.prueba}|${r.area}|${r.subtema}`;
    subtopicSet.add(key);
  });
}

console.log(`Total ejercicios: ${allExercises.length}`);
console.log(`Subtemas únicos: ${subtopicSet.size}`);
subtopicSet.forEach(s => console.log(`  - ${s}`));

const unimetSubtopics = new Map();
const simadiSubtopics = new Map();

subtopicSet.forEach(key => {
  const [inst, prueba, area, subtema] = key.split('|');
  if (inst === 'UNIMET') {
    const areaKey = area === 'Aptitud verbal' ? 'verbal' : 'cuantitativo';
    if (!unimetSubtopics.has(areaKey)) unimetSubtopics.set(areaKey, new Set());
    unimetSubtopics.get(areaKey).add(subtema);
  } else {
    const areaKey = area === 'Razonamiento verbal' ? 'verbal' : 'logico';
    if (!simadiSubtopics.has(areaKey)) simadiSubtopics.set(areaKey, new Set());
    simadiSubtopics.get(areaKey).add(subtema);
  }
});

console.log('\n--- UNIMET Subtemas por área ---');
unimetSubtopics.forEach((set, area) => {
  console.log(`\n${area}:`);
  Array.from(set).sort().forEach(s => console.log(`  - ${s}`));
});

console.log('\n--- SIMADI Subtemas por área ---');
simadiSubtopics.forEach((set, area) => {
  console.log(`\n${area}:`);
  Array.from(set).sort().forEach(s => console.log(`  - ${s}`));
});

function escapeSql(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "''");
}

function generateSQL() {
  let sql = `-- XILEX - Banco completo 238 ejercicios (3 lotes CSV)
-- Generado automáticamente desde archivos CSV
-- Ejecutar en Supabase SQL Editor

-- ============================================================
-- 1. ACTUALIZAR SUBTEMAS UNIMET (clasificación oficial manual + CSV)
-- ============================================================

DO $$
DECLARE
  v_unimet_id UUID;
  v_cuantitativo_id UUID;
  v_verbal_id UUID;
BEGIN
  SELECT id INTO v_unimet_id FROM universities WHERE code = 'unimet';
  SELECT id INTO v_cuantitativo_id FROM areas WHERE university_id = v_unimet_id AND code = 'cuantitativo';
  SELECT id INTO v_verbal_id FROM areas WHERE university_id = v_unimet_id AND code = 'verbal';

  -- Borrar subtemas UNIMET existentes
  DELETE FROM subtopics WHERE area_id IN (v_cuantitativo_id, v_verbal_id);

  -- UNIMET Cuantitativa (subtemas del CSV + oficiales)
  INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
    (v_cuantitativo_id, 'planteamientos_algebraicos', 'Planteamientos Algebraicos', 'Ecuaciones, sistemas, problemas de edades y mezclas', 1.1),
    (v_cuantitativo_id, 'interpretacion_tablas_equivalencias', 'Interpretación de Tablas y Equivalencias', 'Lectura de tablas, proporcionalidad, equivalencias entre escalas', 1.0),
    (v_cuantitativo_id, 'interpretacion_ponderacion_datos', 'Interpretación y Ponderación de Datos', 'Promedios ponderados, impuestos, descuentos, análisis de tablas con pesos', 1.2),
    (v_cuantitativo_id, 'estimacion_calculo_proporcional', 'Estimación y Cálculo Proporcional', 'Regla de tres, proporciones, estimaciones de consumo/rendimiento', 1.0)
  ON CONFLICT (area_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    difficulty_weight = EXCLUDED.difficulty_weight;

  -- UNIMET Verbal (subtemas del CSV + oficiales)
  INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
    (v_verbal_id, 'ortografia', 'Ortografía', 'Reglas ortográficas, tildes, uso de letras', 0.9),
    (v_verbal_id, 'puntuacion', 'Puntuación', 'Uso correcto de signos de puntuación', 0.9),
    (v_verbal_id, 'redaccion_indirecta', 'Redacción Indirecta', 'Transformación de estilo directo a indirecto', 1.1),
    (v_verbal_id, 'significado_palabras_contexto', 'Significado de Palabras en Contexto', 'Vocabulario según contexto de la oración', 1.0),
    (v_verbal_id, 'relaciones_analogicas', 'Relaciones Analógicas', 'Analogías verbales: identificar relaciones entre pares', 1.1),
    (v_verbal_id, 'orden_logico', 'Orden Lógico', 'Ordenación de oraciones para formar párrafo coherente', 1.0),
    (v_verbal_id, 'comprension_textos', 'Comprensión de Textos', 'Idea principal, inferencias, deducciones de textos', 1.2)
  ON CONFLICT (area_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    difficulty_weight = EXCLUDED.difficulty_weight;
END $$;

-- ============================================================
-- 2. ACTUALIZAR SUBTEMAS SIMADI
-- ============================================================

DO $$
DECLARE
  v_simadi_id UUID;
  v_logico_id UUID;
  v_verbal_id UUID;
BEGIN
  SELECT id INTO v_simadi_id FROM universities WHERE code = 'simadi';
  SELECT id INTO v_logico_id FROM areas WHERE university_id = v_simadi_id AND code = 'logico';
  SELECT id INTO v_verbal_id FROM areas WHERE university_id = v_simadi_id AND code = 'verbal';

  DELETE FROM subtopics WHERE area_id IN (v_logico_id, v_verbal_id);

  -- SIMADI Lógico
  INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
    (v_logico_id, 'deduccion_problemas_logica', 'Deducción y Problemas de Lógica', 'Silogismos, modus ponens/tollens, razonamiento condicional', 1.1),
    (v_logico_id, 'relaciones_numericas', 'Relaciones Numéricas', 'Promedios, proporciones, porcentajes, razones', 1.0),
    (v_logico_id, 'series_analogias_numericas', 'Series y Analogías Numéricas', 'Secuencias numéricas, analogías matemáticas', 1.1),
    (v_logico_id, 'ordenamiento_informacion', 'Ordenamiento de Información', 'Ordenamiento por altura, edad, posición, puntaje', 1.0)
  ON CONFLICT (area_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    difficulty_weight = EXCLUDED.difficulty_weight;

  -- SIMADI Verbal
  INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
    (v_verbal_id, 'acentuacion_puntuacion', 'Acentuación y Puntuación', 'Reglas de acentuación, signos de puntuación, tildes diacríticas', 0.9),
    (v_verbal_id, 'vocabulario_significado_contexto', 'Vocabulario y Significado en Contexto', 'Sinónimos, antónimos, campo semántico, significado contextual', 1.0),
    (v_verbal_id, 'analogias_verbales', 'Analogías Verbales', 'Relaciones de significado entre pares de palabras', 1.1),
    (v_verbal_id, 'ordenacion_logica_parrafos', 'Ordenación Lógica de Párrafos', 'Ordenar oraciones para formar párrafo coherente', 1.0)
  ON CONFLICT (area_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    difficulty_weight = EXCLUDED.difficulty_weight;
END $$;

-- ============================================================
-- 3. INSERTAR EJERCICIOS (238 totales)
-- ============================================================

`;

  // Build exercise inserts
  const exercisesBySubtopic = {};
  
  allExercises.forEach(ex => {
    const subtopicKey = `${ex.institucion}|${ex.prueba}|${ex.area}|${ex.subtema}`;
    if (!exercisesBySubtopic[subtopicKey]) {
      exercisesBySubtopic[subtopicKey] = [];
    }
    exercisesBySubtopic[subtopicKey].push(ex);
  });

  // Map CSV subtopic names to our codes
  const subtopicCodeMap = {
    // UNIMET
    'UNIMET|PDU|Aptitud cuantitativa|Planteamientos algebraicos': 'planteamientos_algebraicos',
    'UNIMET|PDU|Aptitud cuantitativa|Interpretacion de tablas y equivalencias': 'interpretacion_tablas_equivalencias',
    'UNIMET|PDU|Aptitud cuantitativa|Interpretacion y ponderacion de datos': 'interpretacion_ponderacion_datos',
    'UNIMET|PDU|Aptitud cuantitativa|Estimacion y calculo proporcional': 'estimacion_calculo_proporcional',
    'UNIMET|PDU|Aptitud verbal|Ortografia': 'ortografia',
    'UNIMET|PDU|Aptitud verbal|Puntuacion': 'puntuacion',
    'UNIMET|PDU|Aptitud verbal|Redaccion indirecta': 'redaccion_indirecta',
    'UNIMET|PDU|Aptitud verbal|Significado de palabras en contexto': 'significado_palabras_contexto',
    'UNIMET|PDU|Aptitud verbal|Relaciones analogicas': 'relaciones_analogicas',
    'UNIMET|PDU|Aptitud verbal|Orden logico': 'orden_logico',
    'UNIMET|PDU|Aptitud verbal|Comprension de textos': 'comprension_textos',
    // SIMADI
    'UCV|SIMADI|Razonamiento logico|Deduccion y problemas de logica': 'deduccion_problemas_logica',
    'UCV|SIMADI|Razonamiento logico|Relaciones numericas': 'relaciones_numericas',
    'UCV|SIMADI|Razonamiento logico|Series y analogias numericas': 'series_analogias_numericas',
    'UCV|SIMADI|Razonamiento logico|Ordenamiento de informacion': 'ordenamiento_informacion',
    'UCV|SIMADI|Razonamiento verbal|Acentuacion y puntuacion': 'acentuacion_puntuacion',
    'UCV|SIMADI|Razonamiento verbal|Vocabulario y significado en contexto': 'vocabulario_significado_contexto',
    'UCV|SIMADI|Razonamiento verbal|Analogias verbales': 'analogias_verbales',
    'UCV|SIMADI|Razonamiento verbal|Ordenacion logica de parrafos': 'ordenacion_logica_parrafos',
  };

  for (const [subtopicKey, exercises] of Object.entries(exercisesBySubtopic)) {
    const subtopicCode = subtopicCodeMap[subtopicKey];
    if (!subtopicCode) {
      console.warn(`No mapping for: ${subtopicKey}`);
      continue;
    }
    
    const [institucion, prueba, area, subtemaName] = subtopicKey.split('|');
    const univCode = institucion === 'UCV' ? 'simadi' : 'unimet';
    const areaCode = area === 'Razonamiento verbal' || area === 'Aptitud verbal' ? 'verbal' : 
                     area === 'Razonamiento logico' ? 'logico' : 'cuantitativo';
    
    sql += `-- ${institucion} ${area} - ${subtemaName} (${exercises.length} ejercicios)\n`;
    
    exercises.forEach(ex => {
      const options = {
        A: ex.opcion_a,
        B: ex.opcion_b,
        C: ex.opcion_c,
        D: ex.opcion_d
      };
      const optionsJson = JSON.stringify(options);
      const statement = escapeSql(ex.enunciado);
      const explanation = escapeSql(ex.explicacion);
      const sourceRef = escapeSql(ex.fuente_referencia || '');
      const sourceTypeRaw = ex.fuente_tipo || 'generated_pattern';
      const sourceType = sourceTypeRaw === 'generado_similar' ? 'generated_pattern' : sourceTypeRaw;
      const difficulty = ex.dificultad === '1' ? 'easy' : ex.dificultad === '2' ? 'easy' : ex.dificultad === '3' ? 'medium' : 'hard';
      
      sql += `INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference)\n`;
      sql += `SELECT s.id, u.id, a.id,\n`;
      sql += `  '${statement}',\n`;
      sql += `  '${optionsJson}'::jsonb,\n`;
      sql += `  '${ex.respuesta_correcta}',\n`;
      sql += `  '${explanation}',\n`;
      sql += `  '${difficulty}',\n`;
      sql += `  '${sourceType}',\n`;
      sql += `  '${sourceRef}'\n`;
      sql += `FROM subtopics s\n`;
      sql += `JOIN areas a ON a.id = s.area_id\n`;
      sql += `JOIN universities u ON u.id = a.university_id\n`;
      sql += `WHERE u.code = '${univCode}'\n`;
      sql += `  AND a.code = '${areaCode}'\n`;
      sql += `  AND s.code = '${subtopicCode}'\n`;
      sql += `ON CONFLICT DO NOTHING;\n\n`;
    });
  }

  return sql;
}

const sql = generateSQL();
fs.writeFileSync(path.join(bancoDir, 'seed_completo_238.sql'), sql);
console.log('\n✅ SQL generado: C:\\Dev\\XILEX\\banco\\seed_completo_238.sql');