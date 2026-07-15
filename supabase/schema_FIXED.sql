-- XILEX Database Schema for Supabase (PostgreSQL) - COMPLETE FIXED VERSION
-- Run this ENTIRE FILE in Supabase SQL Editor → Run

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS (must be FIRST)
-- ============================================================
CREATE TYPE question_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE question_source_type AS ENUM ('official_model', 'generated_pattern', 'original');
CREATE TYPE simulacrum_type AS ENUM ('university', 'mixed');
CREATE TYPE simulacrum_status AS ENUM ('draft', 'in_progress', 'completed', 'abandoned');
CREATE TYPE mastery_level AS ENUM ('novice', 'learning', 'proficient', 'mastered');

-- ============================================================
-- TABLES
-- ============================================================

-- Universities
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Areas
CREATE TABLE areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  question_count INTEGER DEFAULT 30,
  time_limit_minutes INTEGER,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(university_id, code)
);

-- Subtopics
CREATE TABLE subtopics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area_id UUID REFERENCES areas(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  difficulty_weight NUMERIC DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(area_id, code)
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subtopic_id UUID REFERENCES subtopics(id) ON DELETE CASCADE,
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  area_id UUID REFERENCES areas(id) ON DELETE CASCADE,
  statement TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  difficulty question_difficulty DEFAULT 'medium',
  source_type question_source_type DEFAULT 'original',
  source_reference TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  target_universities TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simulacrums
CREATE TABLE simulacrums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type simulacrum_type NOT NULL,
  university_ids UUID[] NOT NULL,
  area_ids UUID[] NOT NULL,
  total_questions INTEGER NOT NULL,
  time_limit_minutes INTEGER NOT NULL,
  status simulacrum_status DEFAULT 'draft',
  score NUMERIC(5,2),
  correct_count INTEGER,
  incorrect_count INTEGER,
  unanswered_count INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simulacrum questions
CREATE TABLE simulacrum_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  simulacrum_id UUID REFERENCES simulacrums(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  user_answer TEXT,
  is_correct BOOLEAN,
  answered_at TIMESTAMPTZ,
  time_spent_seconds INTEGER,
  order_index INTEGER NOT NULL,
  UNIQUE(simulacrum_id, question_id)
);

-- User progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  area_id UUID REFERENCES areas(id) ON DELETE CASCADE,
  subtopic_id UUID REFERENCES subtopics(id) ON DELETE CASCADE,
  total_attempts INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  incorrect_attempts INTEGER DEFAULT 0,
  accuracy_rate NUMERIC(5,2) DEFAULT 0,
  avg_time_seconds NUMERIC(8,2),
  last_attempted_at TIMESTAMPTZ,
  mastery_level mastery_level DEFAULT 'novice',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, university_id, area_id, subtopic_id)
);

-- SIMADI Clusters
CREATE TABLE simad_clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  careers TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_areas_university ON areas(university_id);
CREATE INDEX idx_subtopics_area ON subtopics(area_id);
CREATE INDEX idx_questions_subtopic ON questions(subtopic_id);
CREATE INDEX idx_questions_university_area ON questions(university_id, area_id);
CREATE INDEX idx_questions_active ON questions(is_active) WHERE is_active = true;
CREATE INDEX idx_simulacrums_user ON simulacrums(user_id);
CREATE INDEX idx_simulacrum_questions_simulacrum ON simulacrum_questions(simulacrum_id);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_subtopic ON user_progress(subtopic_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulacrums ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulacrum_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE simad_clusters ENABLE ROW LEVEL SECURITY;

-- Public read access for reference data (no restrictions)
CREATE POLICY "Public read universities" ON universities FOR SELECT USING (true);
CREATE POLICY "Public read areas" ON areas FOR SELECT USING (true);
CREATE POLICY "Public read subtopics" ON subtopics FOR SELECT USING (true);
CREATE POLICY "Public read questions" ON questions FOR SELECT USING (is_active = true);
CREATE POLICY "Public read simad_clusters" ON simad_clusters FOR SELECT USING (true);

CREATE POLICY "Users own profile" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own simulacrums" ON simulacrums FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own simulacrum questions" ON simulacrum_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM simulacrums s
      WHERE s.id = simulacrum_questions.simulacrum_id
      AND s.user_id = auth.uid()
    )
  );
CREATE POLICY "Users own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON universities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subtopics_updated_at BEFORE UPDATE ON subtopics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_simulacrums_updated_at BEFORE UPDATE ON simulacrums FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_simad_clusters_updated_at BEFORE UPDATE ON simad_clusters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- FUNCTIONS (p_limit ANTES de los opcionales)
-- ============================================================

-- Get random questions for simulacrum generation
CREATE OR REPLACE FUNCTION get_random_questions(
  p_university_ids UUID[],
  p_area_ids UUID[],
  p_limit INTEGER,                              -- REQUERIDO PRIMERO
  p_subtopic_ids UUID[] DEFAULT NULL,
  p_difficulty question_difficulty DEFAULT NULL,
  p_exclude_ids UUID[] DEFAULT '{}'
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
  ORDER BY RANDOM()
  LIMIT p_limit;
END;
$$;

-- Calculate simulacrum score
CREATE OR REPLACE FUNCTION calculate_simulacrum_score(p_simulacrum_id UUID)
RETURNS TABLE (
  score NUMERIC(5,2),
  correct_count INTEGER,
  incorrect_count INTEGER,
  unanswered_count INTEGER
) LANGUAGE plpgsql AS $$
DECLARE
  v_total INTEGER;
  v_correct INTEGER;
  v_incorrect INTEGER;
  v_unanswered INTEGER;
  v_score NUMERIC(5,2);
BEGIN
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE is_correct = true),
    COUNT(*) FILTER (WHERE is_correct = false),
    COUNT(*) FILTER (WHERE user_answer IS NULL)
  INTO v_total, v_correct, v_incorrect, v_unanswered
  FROM simulacrum_questions
  WHERE simulacrum_id = p_simulacrum_id;

  IF v_total > 0 THEN
    v_score := ROUND((v_correct::NUMERIC / v_total) * 100, 2);
  ELSE
    v_score := 0;
  END IF;

  RETURN QUERY SELECT v_score, v_correct, v_incorrect, v_unanswered;
END;
$$;

-- Update user progress after answering
CREATE OR REPLACE FUNCTION update_user_progress(
  p_user_id UUID,
  p_question_id UUID,
  p_is_correct BOOLEAN,
  p_time_spent_seconds INTEGER
)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
  v_question RECORD;
  v_existing RECORD;
BEGIN
  SELECT university_id, area_id, subtopic_id
  INTO v_question
  FROM questions
  WHERE id = p_question_id;

  SELECT * INTO v_existing
  FROM user_progress
  WHERE user_id = p_user_id
    AND university_id = v_question.university_id
    AND area_id = v_question.area_id
    AND subtopic_id = v_question.subtopic_id;

  IF v_existing IS NULL THEN
    INSERT INTO user_progress (
      user_id, university_id, area_id, subtopic_id,
      total_attempts, correct_attempts, incorrect_attempts,
      accuracy_rate, avg_time_seconds, last_attempted_at,
      mastery_level
    ) VALUES (
      p_user_id, v_question.university_id, v_question.area_id, v_question.subtopic_id,
      1,
      CASE WHEN p_is_correct THEN 1 ELSE 0 END,
      CASE WHEN p_is_correct THEN 0 ELSE 1 END,
      CASE WHEN p_is_correct THEN 100 ELSE 0 END,
      p_time_spent_seconds,
      NOW(),
      CASE WHEN p_is_correct THEN 'learning' ELSE 'novice' END
    );
  ELSE
    UPDATE user_progress
    SET
      total_attempts = total_attempts + 1,
      correct_attempts = correct_attempts + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
      incorrect_attempts = incorrect_attempts + CASE WHEN p_is_correct THEN 0 ELSE 1 END,
      accuracy_rate = ROUND(
        (correct_attempts + CASE WHEN p_is_correct THEN 1 ELSE 0 END)::NUMERIC
        / (total_attempts + 1) * 100, 2
      ),
      avg_time_seconds = ROUND(
        (avg_time_seconds * total_attempts + p_time_spent_seconds)::NUMERIC
        / (total_attempts + 1), 2
      ),
      last_attempted_at = NOW(),
      mastery_level = CASE
        WHEN (correct_attempts + CASE WHEN p_is_correct THEN 1 ELSE 0 END)::NUMERIC
             / (total_attempts + 1) >= 0.9 THEN 'mastered'
        WHEN (correct_attempts + CASE WHEN p_is_correct THEN 1 ELSE 0 END)::NUMERIC
             / (total_attempts + 1) >= 0.7 THEN 'proficient'
        WHEN (correct_attempts + CASE WHEN p_is_correct THEN 1 ELSE 0 END)::NUMERIC
             / (total_attempts + 1) >= 0.4 THEN 'learning'
        ELSE 'novice'
      END,
      updated_at = NOW()
    WHERE id = v_existing.id;
  END IF;
END;
$$;

-- ============================================================
-- SEED DATA - Phase 1: SIMADI + UNIMET
-- ============================================================

-- Universities
INSERT INTO universities (code, name, description, active) VALUES
  ('simadi', 'SIMADI (UCV)', 'Sistema de Admisión de la Universidad Central de Venezuela', true),
  ('unimet', 'UNIMET', 'Universidad Metropolitana - Prueba de Aptitud Académica', true),
  ('usb', 'USB', 'Universidad Simón Bolívar - Prueba de Habilidades y Conocimientos', false),
  ('ucab', 'UCAB', 'Universidad Católica Andrés Bello - Prueba de Conocimientos', false)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  active = EXCLUDED.active;

-- Areas for SIMADI
INSERT INTO areas (university_id, code, name, description, question_count, time_limit_minutes, order_index) VALUES
  ((SELECT id FROM universities WHERE code = 'simadi'), 'logico', 'Razonamiento Lógico',
   'Evalúa destrezas de pensamiento para representar, relacionar e inferir información y resolver problemas',
   30, 45, 1),
  ((SELECT id FROM universities WHERE code = 'simadi'), 'verbal', 'Razonamiento Verbal',
   'Mide la capacidad de usar correctamente el idioma castellano',
   30, 45, 2)
ON CONFLICT (university_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  question_count = EXCLUDED.question_count,
  time_limit_minutes = EXCLUDED.time_limit_minutes;

-- Areas for UNIMET
INSERT INTO areas (university_id, code, name, description, question_count, time_limit_minutes, order_index) VALUES
  ((SELECT id FROM universities WHERE code = 'unimet'), 'cuantitativo', 'Aptitud Cuantitativa',
   'Razonamiento matemático y resolución de problemas cuantitativos',
   45, 60, 1),
  ((SELECT id FROM universities WHERE code = 'unimet'), 'verbal', 'Aptitud Verbal',
   'Comprensión lectora, vocabulario y razonamiento verbal',
   45, 60, 2)
ON CONFLICT (university_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  question_count = EXCLUDED.question_count,
  time_limit_minutes = EXCLUDED.time_limit_minutes;

-- Subtopics for SIMADI - Razonamiento Lógico
INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'simadi') AND code = 'logico'), 'silogismos', 'Silogismos', 'Razonamiento deductivo con premisas categóricas', 1.0),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'simadi') AND code = 'logico'), 'proposicional', 'Lógica Proposicional', 'Conectivos lógicos, tablas de verdad, equivalencias', 1.1),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'simadi') AND code = 'logico'), 'analitico', 'Razonamiento Analítico', 'Ordenación, agrupación, condicionales complejos', 1.2),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'simadi') AND code = 'logico'), 'numericos', 'Series y Patrones Numéricos', 'Secuencias, progresiones, patrones numéricos', 1.0),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'simadi') AND code = 'logico'), 'figurales', 'Series y Patrones Figurales', 'Matrices, analogías figurales, completación', 1.1)
ON CONFLICT (area_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  difficulty_weight = EXCLUDED.difficulty_weight;

-- Subtopics for SIMADI - Razonamiento Verbal
INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'simadi') AND code = 'verbal'), 'acentuacion', 'Acentuación y Puntuación', 'Reglas de acentuación, signos de puntuación', 0.8),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'simadi') AND code = 'verbal'), 'ortografia', 'Ortografía', 'Uso correcto de letras, homófonos, reglas ortográficas', 0.9),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'simadi') AND code = 'verbal'), 'vocabulario', 'Vocabulario y Sinónimos/Antónimos', 'Significado de palabras, relaciones semánticas', 1.0),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'simadi') AND code = 'verbal'), 'analogias', 'Analogías Verbales', 'Relaciones de significado entre pares de palabras', 1.1),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'simadi') AND code = 'verbal'), 'comprension', 'Comprensión Lectora', 'Idea principal, inferencias, tono, propósito del autor', 1.2),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'simadi') AND code = 'verbal'), 'gramatica', 'Gramática y Sintaxis', 'Concordancia, regencia, estructura oracional', 1.0)
ON CONFLICT (area_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  difficulty_weight = EXCLUDED.difficulty_weight;

-- Subtopics for UNIMET - Aptitud Cuantitativa
INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'unimet') AND code = 'cuantitativo'), 'aritmetica', 'Aritmética', 'Operaciones, proporciones, porcentajes, potencias', 1.0),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'unimet') AND code = 'cuantitativo'), 'algebra', 'Álgebra', 'Ecuaciones, inecuaciones, funciones, polinomios', 1.1),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'unimet') AND code = 'cuantitativo'), 'geometria', 'Geometría', 'Áreas, volúmenes, teoremas, trigonometría básica', 1.1),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'unimet') AND code = 'cuantitativo'), 'estadistica', 'Estadística y Probabilidad', 'Media, moda, mediana, probabilidad simple, combinatoria', 1.0),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'unimet') AND code = 'cuantitativo'), 'razonamiento', 'Razonamiento Matemático', 'Problemas de lógica cuantitativa, suites', 1.2)
ON CONFLICT (area_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  difficulty_weight = EXCLUDED.difficulty_weight;

-- Subtopics for UNIMET - Aptitud Verbal
INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'unimet') AND code = 'verbal'), 'comprension', 'Comprensión Lectora', 'Textos académicos, inferencias, idea principal', 1.1),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'unimet') AND code = 'verbal'), 'vocabulario', 'Vocabulario', 'Sinónimos, antónimos, polisemia, contextos', 1.0),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'unimet') AND code = 'verbal'), 'gramatica', 'Gramática y Redacción', 'Concordancia, puntuación, cohesión, coherencia', 1.0),
  ((SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'unimet') AND code = 'verbal'), 'analogias', 'Analogías Verbales', 'Relaciones semánticas entre pares', 1.1)
ON CONFLICT (area_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  difficulty_weight = EXCLUDED.difficulty_weight;

-- SIMADI Clusters (Phase 2 - Área de Conocimiento)
INSERT INTO simad_clusters (code, name, description, careers) VALUES
  ('salud', 'Salud', 'Medicina, Enfermería, Bioanálisis, Odontología, Farmacia', ARRAY['Medicina', 'Enfermería', 'Bioanálisis', 'Odontología', 'Farmacia']),
  ('agro_mar', 'Agro y Mar', 'Agronomía, Veterinaria, Ingeniería Pesquera, Acuicultura', ARRAY['Agronomía', 'Veterinaria', 'Ing. Pesquera', 'Acuicultura']),
  ('ciencia_tecnologia', 'Ciencia y Tecnología', 'Ingenierías, Física, Química, Matemáticas, Computación', ARRAY['Ing. Civil', 'Ing. Mecánica', 'Ing. Eléctrica', 'Ing. Química', 'Física', 'Química', 'Matemáticas', 'Computación']),
  ('sociales_humanidades', 'Ciencias Sociales / Humanidades / Educación', 'Derecho, Administración, Psicología, Educación, Comunicación', ARRAY['Derecho', 'Administración', 'Psicología', 'Educación', 'Comunicación Social', 'Sociología'])
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  careers = EXCLUDED.careers;