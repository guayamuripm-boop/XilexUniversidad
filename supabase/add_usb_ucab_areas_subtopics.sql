-- ============================================================
-- XILEX — ÁREAS Y SUBTEMAS PARA USB Y UCAB (Fase 2)
-- Ejecutar DESPUÉS de schema_FIXED.sql
-- ============================================================

DO $$
DECLARE
  -- University IDs
  v_usb_id UUID;
  v_ucab_id UUID;
  -- Area IDs
  v_usb_habilidades UUID;
  v_usb_conocimientos UUID;
  v_ucab_verbal UUID;
  v_ucab_numerica UUID;
  v_ucab_logico UUID;
  -- USB subtopic IDs
  v_usb_vocabulario UUID;
  v_usb_analogias UUID;
  v_usb_vectores UUID;
  v_usb_geometria UUID;
  v_usb_progresiones UUID;
  v_usb_funciones UUID;
  v_usb_cubos UUID;
  v_usb_desarrollo UUID;
  -- UCAB subtopic IDs
  v_ucab_vocabulario UUID;
  v_ucab_analogias UUID;
  v_ucab_aritmetica UUID;
  v_ucab_movimiento UUID;
  v_ucab_fracciones UUID;
  v_ucab_series UUID;
  v_ucab_silogismos UUID;
  v_ucab_ordenamiento UUID;
  v_ucab_porcentajes UUID;
BEGIN
  -- ============================================================
  -- Get University IDs
  -- ============================================================
  SELECT id INTO v_usb_id FROM universities WHERE code = 'usb';
  SELECT id INTO v_ucab_id FROM universities WHERE code = 'ucab';

  -- ============================================================
  -- Create Areas for USB
  -- ============================================================
  INSERT INTO areas (university_id, code, name, description, question_count, time_limit_minutes, order_index) VALUES
    (v_usb_id, 'habilidades', 'Habilidades', 'Razonamiento verbal, cuantitativo y espacial', 45, 60, 1),
    (v_usb_id, 'conocimientos', 'Conocimientos', 'Conocimientos específicos por carrera', 45, 60, 2)
  ON CONFLICT (university_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    question_count = EXCLUDED.question_count,
    time_limit_minutes = EXCLUDED.time_limit_minutes;

  -- ============================================================
  -- Create Areas for UCAB
  -- ============================================================
  INSERT INTO areas (university_id, code, name, description, question_count, time_limit_minutes, order_index) VALUES
    (v_ucab_id, 'verbal', 'Habilidad Verbal', 'Vocabulario, analogías, comprensión lectora', 45, 60, 1),
    (v_ucab_id, 'numerica', 'Habilidad Numérica', 'Aritmética, algebra, geometría, estadística', 45, 60, 2),
    (v_ucab_id, 'logico', 'Razonamiento Lógico-Matemático', 'Series, silogismos, ordenamiento, problemas', 30, 40, 3)
  ON CONFLICT (university_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    question_count = EXCLUDED.question_count,
    time_limit_minutes = EXCLUDED.time_limit_minutes;

  -- ============================================================
  -- Get Area IDs
  -- ============================================================
  SELECT id INTO v_usb_habilidades FROM areas WHERE university_id = v_usb_id AND code = 'habilidades';
  SELECT id INTO v_usb_conocimientos FROM areas WHERE university_id = v_usb_id AND code = 'conocimientos';
  SELECT id INTO v_ucab_verbal FROM areas WHERE university_id = v_ucab_id AND code = 'verbal';
  SELECT id INTO v_ucab_numerica FROM areas WHERE university_id = v_ucab_id AND code = 'numerica';
  SELECT id INTO v_ucab_logico FROM areas WHERE university_id = v_ucab_id AND code = 'logico';

  -- ============================================================
  -- Create Subtopics for USB - Habilidades
  -- ============================================================
  INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
    (v_usb_habilidades, 'vocabulario', 'Vocabulario', 'Significado de palabras, polisemia, contexto', 1.0),
    (v_usb_habilidades, 'analogias', 'Analogías Verbales', 'Relaciones semánticas entre pares de palabras', 1.1),
    (v_usb_habilidades, 'comprension', 'Comprensión Lectora', 'Idea principal, inferencias, tono del autor', 1.2)
  ON CONFLICT (area_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    difficulty_weight = EXCLUDED.difficulty_weight;

  -- ============================================================
  -- Create Subtopics for USB - Conocimientos (Cuantitativa/Espacial)
  -- ============================================================
  INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
    (v_usb_conocimientos, 'vectores', 'Vectores en el Plano', 'Operaciones con vectores, combinaciones lineales', 1.2),
    (v_usb_conocimientos, 'geometria', 'Geometría Plana', 'Áreas, perímetros, circunferencias inscritas', 1.1),
    (v_usb_conocimientos, 'progresiones', 'Progresiones', 'Aritméticas, geométricas, infinitas, sumas', 1.2),
    (v_usb_conocimientos, 'funciones', 'Funciones', 'Evaluación, composición, dominio, rango', 1.1),
    (v_usb_conocimientos, 'cubos', 'Cubos y Sólidos', 'Cubos pintados, caras visibles, cortes', 1.2),
    (v_usb_conocimientos, 'desarrollo', 'Desarrollo de Sólidos', 'Dados, cubos, desarrollo plano a 3D', 1.1)
  ON CONFLICT (area_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    difficulty_weight = EXCLUDED.difficulty_weight;

  -- ============================================================
  -- Create Subtopics for UCAB - Verbal
  -- ============================================================
  INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
    (v_ucab_verbal, 'vocabulario', 'Vocabulario', 'Significado de palabras, polisemia, contexto', 1.0),
    (v_ucab_verbal, 'analogias', 'Analogías Verbales', 'Relaciones semánticas entre pares de palabras', 1.1),
    (v_ucab_verbal, 'comprension', 'Comprensión Lectora', 'Idea principal, inferencias, tono del autor', 1.2)
  ON CONFLICT (area_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    difficulty_weight = EXCLUDED.difficulty_weight;

  -- ============================================================
  -- Create Subtopics for UCAB - Numérica
  -- ============================================================
  INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
    (v_ucab_numerica, 'aritmetica_comercial', 'Aritmética Comercial', 'Descuentos, intereses, porcentajes, proporciones', 1.0),
    (v_ucab_numerica, 'movimiento', 'Movimiento y Velocidad', 'Distancia = velocidad × tiempo, problemas de movimiento', 1.0),
    (v_ucab_numerica, 'fracciones', 'Fracciones y Proporciones', 'Operaciones con fracciones, regla de tres, proporciones', 1.1)
  ON CONFLICT (area_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    difficulty_weight = EXCLUDED.difficulty_weight;

  -- ============================================================
  -- Create Subtopics for UCAB - Lógico-Matemático
  -- ============================================================
  INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
    (v_ucab_logico, 'series', 'Series Numéricas', 'Patrones, progresiones, siguiente término', 1.0),
    (v_ucab_logico, 'silogismos', 'Silogismos', 'Razonamiento deductivo con premisas categóricas', 1.0),
    (v_ucab_logico, 'ordenamiento', 'Ordenamiento', 'Secuenciación, orden lineal, posiciones', 1.1),
    (v_ucab_logico, 'porcentajes', 'Porcentajes', 'Cálculo de porcentajes, aumentos, descuentos', 1.0)
  ON CONFLICT (area_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    difficulty_weight = EXCLUDED.difficulty_weight;

  -- ============================================================
  -- Get Subtopic IDs
  -- ============================================================
  SELECT id INTO v_usb_vocabulario FROM subtopics WHERE area_id = v_usb_habilidades AND code = 'vocabulario';
  SELECT id INTO v_usb_analogias FROM subtopics WHERE area_id = v_usb_habilidades AND code = 'analogias';
  SELECT id INTO v_usb_vectores FROM subtopics WHERE area_id = v_usb_conocimientos AND code = 'vectores';
  SELECT id INTO v_usb_geometria FROM subtopics WHERE area_id = v_usb_conocimientos AND code = 'geometria';
  SELECT id INTO v_usb_progresiones FROM subtopics WHERE area_id = v_usb_conocimientos AND code = 'progresiones';
  SELECT id INTO v_usb_funciones FROM subtopics WHERE area_id = v_usb_conocimientos AND code = 'funciones';
  SELECT id INTO v_usb_cubos FROM subtopics WHERE area_id = v_usb_conocimientos AND code = 'cubos';
  SELECT id INTO v_usb_desarrollo FROM subtopics WHERE area_id = v_usb_conocimientos AND code = 'desarrollo';

  SELECT id INTO v_ucab_vocabulario FROM subtopics WHERE area_id = v_ucab_verbal AND code = 'vocabulario';
  SELECT id INTO v_ucab_analogias FROM subtopics WHERE area_id = v_ucab_verbal AND code = 'analogias';
  SELECT id INTO v_ucab_aritmetica FROM subtopics WHERE area_id = v_ucab_numerica AND code = 'aritmetica_comercial';
  SELECT id INTO v_ucab_movimiento FROM subtopics WHERE area_id = v_ucab_numerica AND code = 'movimiento';
  SELECT id INTO v_ucab_fracciones FROM subtopics WHERE area_id = v_ucab_numerica AND code = 'fracciones';
  SELECT id INTO v_ucab_series FROM subtopics WHERE area_id = v_ucab_logico AND code = 'series';
  SELECT id INTO v_ucab_silogismos FROM subtopics WHERE area_id = v_ucab_logico AND code = 'silogismos';
  SELECT id INTO v_ucab_ordenamiento FROM subtopics WHERE area_id = v_ucab_logico AND code = 'ordenamiento';
  SELECT id INTO v_ucab_porcentajes FROM subtopics WHERE area_id = v_ucab_logico AND code = 'porcentajes';

  RAISE NOTICE 'Áreas y subtemas creados correctamente para USB y UCAB';
END $$;