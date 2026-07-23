-- ============================================================
-- XILEX Schema Extensions: SIMADI Especializaciones (Fase 2)
-- Run AFTER schema_FIXED.sql in Supabase SQL Editor
-- ============================================================

-- 1) Add "especializacion" area to SIMADI
INSERT INTO areas (university_id, code, name, description, question_count, time_limit_minutes, order_index)
SELECT id, 'especializacion', 'Especialización',
       'Bloque 3: Conocimientos específicos según cluster de carrera (SIMADI)',
       30, 45, 3
FROM universities WHERE code = 'simadi'
ON CONFLICT (university_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  question_count = EXCLUDED.question_count,
  time_limit_minutes = EXCLUDED.time_limit_minutes;

-- 2) Subtopics for SIMADI - Especialización (all clusters combined)
-- Ciencia y Tecnología
INSERT INTO subtopics (area_id, code, name, description, difficulty_weight)
SELECT a.id, s.code, s.name, s.description, s.difficulty_weight
FROM areas a
CROSS JOIN (VALUES
  ('algebra', 'Álgebra', 'Ecuaciones, inecuaciones, funciones, polinomios', 1.0),
  ('trigonometria', 'Trigonometría Básica', 'Razones trigonométricas, triángulos, identidades', 1.1),
  ('funciones', 'Funciones y Gráficas', 'Lineales, cuadráticas, análisis de gráficas', 1.1),
  ('fisica_cinematica', 'Física - Cinemática', 'Movimiento rectilíneo, velocidad, aceleración', 1.2),
  ('fisica_fuerza', 'Física - Fuerza y Estática', 'Leyes de Newton, equilibrio, fuerzas', 1.2),
  ('geometria', 'Geometría', 'Áreas, volúmenes, teorema de Pitágoras', 1.1),
  ('dibujo_tecnico', 'Dibujo Técnico', 'Proyecciones, vistas, visualización espacial', 1.3)
) AS s(code, name, description, difficulty_weight)
WHERE a.university_id = (SELECT id FROM universities WHERE code = 'simadi')
  AND a.code = 'especializacion'
ON CONFLICT (area_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  difficulty_weight = EXCLUDED.difficulty_weight;

-- Ciencias Sociales / Humanidades / Educación
INSERT INTO subtopics (area_id, code, name, description, difficulty_weight)
SELECT a.id, s.code, s.name, s.description, s.difficulty_weight
FROM areas a
CROSS JOIN (VALUES
  ('historia_universal', 'Historia Universal y Contemporánea', 'Guerras, revoluciones, procesos históricos mundiales', 1.0),
  ('historia_venezuela', 'Historia de Venezuela', 'Independencia, caudillismo, siglo XX, democracia', 1.0),
  ('geografia', 'Geografía Política y Económica Mundial', 'Población, recursos, bloques económicos, medio ambiente', 1.1),
  ('cultura_general', 'Cultura General y Actualidad Internacional', 'Organismos internacionales, conflictos actuales, premios', 1.0),
  ('economia', 'Economía Básica', 'Oferta/demanda, inflación, PIB, política fiscal/monetaria', 1.1)
) AS s(code, name, description, difficulty_weight)
WHERE a.university_id = (SELECT id FROM universities WHERE code = 'simadi')
  AND a.code = 'especializacion'
ON CONFLICT (area_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  difficulty_weight = EXCLUDED.difficulty_weight;

-- Salud (Biología + Química)
INSERT INTO subtopics (area_id, code, name, description, difficulty_weight)
SELECT a.id, s.code, s.name, s.description, s.difficulty_weight
FROM areas a
CROSS JOIN (VALUES
  ('biologia_celula', 'Biología - La Célula', 'Organelos, membrana, transporte, división celular', 1.0),
  ('genetica', 'Genética', 'Leyes de Mendel, ADN, herencia, mutaciones', 1.1),
  ('sistemas_cuerpo', 'Sistemas del Cuerpo Humano', 'Digestivo, circulatorio, respiratorio, nervioso, excretor', 1.2),
  ('ecologia', 'Ecología', 'Ecosistemas, cadenas tróficas, ciclos biogeoquímicos', 1.1),
  ('quimica_atomica', 'Química - Estructura Atómica', 'Modelos atómicos, configuración electrónica, tabla periódica', 1.0),
  ('quimica_enlaces', 'Enlaces Químicos', 'Iónico, covalente, metálico, propiedades', 1.1),
  ('quimica_nomenclatura', 'Nomenclatura Química', 'IUPAC, sales, óxidos, ácidos, bases', 1.0),
  ('quimica_estequiometria', 'Estequiometría', 'Mol, rendimientos, reactivo limitante, concentraciones', 1.2),
  ('quimica_acidos', 'Ácidos y Bases / pH', 'Teorías, pH, pOH, hidrólisis, indicadores', 1.1)
) AS s(code, name, description, difficulty_weight)
WHERE a.university_id = (SELECT id FROM universities WHERE code = 'simadi')
  AND a.code = 'especializacion'
ON CONFLICT (area_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  difficulty_weight = EXCLUDED.difficulty_weight;

-- 3) question_clusters junction table
CREATE TABLE IF NOT EXISTS question_clusters (
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  cluster_code TEXT REFERENCES simad_clusters(code) ON DELETE CASCADE,
  PRIMARY KEY (question_id, cluster_code)
);

CREATE INDEX IF NOT EXISTS idx_question_clusters_question ON question_clusters(question_id);
CREATE INDEX IF NOT EXISTS idx_question_clusters_cluster ON question_clusters(cluster_code);

-- 4) Add target_clusters to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS target_clusters TEXT[] DEFAULT '{}';

-- 5) RLS policies for new table
ALTER TABLE question_clusters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read question_clusters" ON question_clusters
  FOR SELECT USING (true);

-- 6) Helper function: get_random_questions with cluster filter
CREATE OR REPLACE FUNCTION get_random_questions(
  p_university_ids UUID[],
  p_area_ids UUID[],
  p_limit INTEGER,
  p_subtopic_ids UUID[] DEFAULT NULL,
  p_difficulty question_difficulty DEFAULT NULL,
  p_exclude_ids UUID[] DEFAULT '{}',
  p_cluster_codes TEXT[] DEFAULT NULL
)
RETURNS SETOF questions LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT q.*
  FROM questions q
  WHERE q.university_id = ANY(p_university_ids)
    AND q.area_id = ANY(p_area_ids)
    AND q.is_active = true
    AND q.id <> ALL(p_exclude_ids)
    AND (p_subtopic_ids IS NULL OR q.subtopic_id = ANY(p_subtopic_ids))
    AND (p_difficulty IS NULL OR q.difficulty = p_difficulty)
    AND (
      p_cluster_codes IS NULL
      OR p_cluster_codes = '{}'
      OR EXISTS (
        SELECT 1 FROM question_clusters qc
        WHERE qc.question_id = q.id
        AND qc.cluster_code = ANY(p_cluster_codes)
      )
    )
  ORDER BY RANDOM()
  LIMIT p_limit;
END;
$$;

-- Overload with default p_limit position (for backward compatibility)
CREATE OR REPLACE FUNCTION get_random_questions(
  p_university_ids UUID[],
  p_area_ids UUID[],
  p_limit INTEGER,
  p_subtopic_ids UUID[] DEFAULT NULL,
  p_difficulty question_difficulty DEFAULT NULL,
  p_exclude_ids UUID[] DEFAULT '{}'
)
RETURNS SETOF questions LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM get_random_questions(
    p_university_ids, p_area_ids, p_limit,
    p_subtopic_ids, p_difficulty, p_exclude_ids,
    NULL::TEXT[]
  );
END;
$$;