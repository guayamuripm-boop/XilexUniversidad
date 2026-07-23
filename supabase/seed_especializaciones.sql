-- ============================================================
-- XILEX — SEED ESPECIALIZACIONES SIMADI (105 preguntas)
-- Fase 2: Preguntas específicas por cluster
-- Generado automáticamente desde CSV
-- ============================================================

-- Helper: get area_id for SIMADI especializacion
SELECT 'Setting up variables...' AS step;

-- The DO block will handle the inserts

DO $$
DECLARE
  v_univ_simadi UUID := (SELECT id FROM universities WHERE code = 'simadi');
  v_area_esp UUID := (SELECT id FROM areas WHERE university_id = v_univ_simadi AND code = 'especializacion');
  v_q UUID;
BEGIN
  -- Pregunta 40 (sociales_humanidades / historia_universal)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'historia_universal' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: historia_universal';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿En qué año finalizó la Segunda Guerra Mundial?',
      '{"A":"1943","B":"1945","C":"1939","D":"1950"}'::jsonb,
      'B',
      'La Segunda Guerra Mundial finalizó en 1945, con la rendición de Alemania en mayo y de Japón en agosto de ese año.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 41 (sociales_humanidades / historia_universal)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'historia_universal' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: historia_universal';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Qué evento se considera el detonante inmediato de la Primera Guerra Mundial?',
      '{"A":"El hundimiento del Lusitania","B":"El asesinato del archiduque Francisco Fernando","C":"La invasión de Polonia","D":"La crisis de los misiles en Cuba"}'::jsonb,
      'B',
      'El asesinato del archiduque Francisco Fernando de Austria en Sarajevo (1914) desencadenó la cadena de alianzas que llevó al estallido de la Primera Guerra Mundial.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 42 (sociales_humanidades / historia_universal)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'historia_universal' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: historia_universal';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'La Guerra Fría se caracterizó principalmente por:',
      '{"A":"Un enfrentamiento militar directo entre EE. UU. y la URSS","B":"Una rivalidad ideológica y geopolítica sin confrontación armada directa entre las superpotencias","C":"Una alianza permanente entre capitalismo y comunismo","D":"La reunificación inmediata de Alemania tras 1945"}'::jsonb,
      'B',
      'La Guerra Fría fue un período de tensión ideológica, económica y militar indirecta (guerras subsidiarias, carrera armamentista) entre EE. UU. y la URSS, sin choque bélico directo entre ambas potencias.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 43 (sociales_humanidades / historia_universal)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'historia_universal' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: historia_universal';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Cuál de los siguientes hechos marcó simbólicamente el fin de la Guerra Fría?',
      '{"A":"La caída del Muro de Berlín (1989)","B":"El desembarco de Normandía","C":"La crisis de 1929","D":"La firma del Tratado de Versalles"}'::jsonb,
      'A',
      'La caída del Muro de Berlín en 1989 simbolizó el colapso del bloque soviético en Europa del Este y el fin de la Guerra Fría.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 44 (sociales_humanidades / historia_universal)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'historia_universal' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: historia_universal';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Ordene cronológicamente los siguientes hechos: 1) Crisis de los misiles en Cuba 2) Fin de la Segunda Guerra Mundial 3) Caída del Muro de Berlín 4) Inicio de la Primera Guerra Mundial',
      '{"A":"4, 2, 1, 3","B":"2, 4, 1, 3","C":"4, 1, 2, 3","D":"1, 4, 2, 3"}'::jsonb,
      'A',
      'El orden cronológico correcto es: inicio de la Primera Guerra Mundial (1914), fin de la Segunda Guerra Mundial (1945), crisis de los misiles en Cuba (1962) y caída del Muro de Berlín (1989).',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 45 (sociales_humanidades / historia_venezuela)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'historia_venezuela' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: historia_venezuela';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Qué acontecimiento de 1922 consolidó el inicio del auge petrolero venezolano a nivel internacional?',
      '{"A":"El reventón del pozo Barroso II en Cabimas","B":"La fundación de PDVSA","C":"La Guerra Federal","D":"El Caracazo"}'::jsonb,
      'A',
      'El reventón del pozo Barroso II en Cabimas (1922) tuvo repercusión internacional y marcó el inicio del auge petrolero que transformó la economía venezolana.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 46 (sociales_humanidades / historia_venezuela)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'historia_venezuela' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: historia_venezuela';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Quién gobernó Venezuela durante gran parte del período en que se consolidó la industria petrolera (1908-1935)?',
      '{"A":"Juan Vicente Gómez","B":"Rómulo Betancourt","C":"Marcos Pérez Jiménez","D":"Hugo Chávez"}'::jsonb,
      'A',
      'Juan Vicente Gómez gobernó Venezuela entre 1908 y 1935, período durante el cual se otorgaron las primeras grandes concesiones petroleras.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 47 (sociales_humanidades / historia_venezuela)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'historia_venezuela' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: historia_venezuela';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'La nacionalización de la industria petrolera venezolana, que dio origen a PDVSA, ocurrió en:',
      '{"A":"1958","B":"1976","C":"1989","D":"1999"}'::jsonb,
      'B',
      'La nacionalización de la industria petrolera venezolana entró en vigencia el 1 de enero de 1976, dando origen a Petróleos de Venezuela (PDVSA).',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 48 (sociales_humanidades / historia_venezuela)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'historia_venezuela' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: historia_venezuela';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El período conocido como el ''''Pacto de Punto Fijo'''' (1958) se caracterizó por:',
      '{"A":"Un acuerdo entre los principales partidos políticos para garantizar la alternancia democrática","B":"La instauración de una dictadura militar","C":"La nacionalización del petróleo","D":"La ruptura total de relaciones entre AD y COPEI"}'::jsonb,
      'A',
      'El Pacto de Punto Fijo fue un acuerdo suscrito en 1958 entre los principales partidos políticos venezolanos para garantizar la estabilidad y alternancia del sistema democrático tras la caída de la dictadura.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 49 (sociales_humanidades / historia_venezuela)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'historia_venezuela' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: historia_venezuela';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Ordene cronológicamente: 1) Pacto de Punto Fijo 2) Caída de Marcos Pérez Jiménez 3) Nacionalización petrolera 4) El Caracazo',
      '{"A":"2, 1, 3, 4","B":"1, 2, 3, 4","C":"2, 1, 4, 3","D":"4, 2, 1, 3"}'::jsonb,
      'A',
      'El orden correcto es: caída de Pérez Jiménez (enero de 1958), Pacto de Punto Fijo (octubre de 1958), nacionalización petrolera (1976) y el Caracazo (1989).',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 50 (sociales_humanidades / geografia)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geografia' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geografia';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Cuál es el organismo internacional encargado principalmente de mantener la paz y seguridad entre las naciones?',
      '{"A":"FMI","B":"ONU","C":"OMC","D":"OPEP"}'::jsonb,
      'B',
      'La Organización de las Naciones Unidas (ONU) fue creada con el propósito principal de mantener la paz y la seguridad internacional entre sus Estados miembros.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 51 (sociales_humanidades / geografia)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geografia' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geografia';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Cuál de los siguientes países NO pertenece a la Unión Europea?',
      '{"A":"Alemania","B":"Francia","C":"Reino Unido","D":"España"}'::jsonb,
      'C',
      'El Reino Unido dejó de pertenecer a la Unión Europea tras el proceso conocido como Brexit, formalizado en 2020.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 52 (sociales_humanidades / geografia)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geografia' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geografia';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'La OPEP (Organización de Países Exportadores de Petróleo) tiene como principal función:',
      '{"A":"Regular el comercio agrícola mundial","B":"Coordinar las políticas petroleras de sus países miembros para estabilizar el mercado","C":"Otorgar préstamos a países en desarrollo","D":"Establecer aranceles comerciales globales"}'::jsonb,
      'B',
      'La OPEP fue creada para coordinar y unificar las políticas petroleras de sus miembros, buscando estabilizar los precios del petróleo en el mercado internacional.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 53 (sociales_humanidades / geografia)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geografia' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geografia';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Cuál de los siguientes bloques económicos agrupa a Venezuela junto con otros países de Suramérica?',
      '{"A":"TLCAN","B":"MERCOSUR","C":"ASEAN","D":"Unión Europea"}'::jsonb,
      'B',
      'MERCOSUR (Mercado Común del Sur) es un bloque económico suramericano del que Venezuela ha formado parte como miembro.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 54 (sociales_humanidades / geografia)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geografia' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geografia';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Un país que tiene superávit comercial se caracteriza porque:',
      '{"A":"Sus exportaciones superan en valor a sus importaciones","B":"Sus importaciones superan en valor a sus exportaciones","C":"No realiza comercio internacional","D":"Su moneda se ha devaluado completamente"}'::jsonb,
      'A',
      'El superávit comercial ocurre cuando el valor de las exportaciones de un país es mayor que el valor de sus importaciones en un período determinado.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 55 (sociales_humanidades / cultura_general)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'cultura_general' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: cultura_general';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Cuál es la sede principal de la Organización de las Naciones Unidas?',
      '{"A":"Ginebra","B":"Nueva York","C":"París","D":"Bruselas"}'::jsonb,
      'B',
      'La sede principal de la ONU se encuentra en la ciudad de Nueva York, Estados Unidos.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 56 (sociales_humanidades / cultura_general)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'cultura_general' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: cultura_general';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El G7 es un grupo conformado por:',
      '{"A":"Las siete economías más industrializadas del mundo","B":"Los siete países con mayor población","C":"Los siete países fundadores de la ONU","D":"Los siete mayores productores de petróleo"}'::jsonb,
      'A',
      'El G7 reúne a siete de las economías más industrializadas y desarrolladas del mundo para coordinar políticas económicas y de cooperación internacional.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 57 (sociales_humanidades / cultura_general)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'cultura_general' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: cultura_general';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Qué se entiende por ''''cumbre diplomática'''' en el contexto de relaciones internacionales?',
      '{"A":"Un tratado comercial firmado por empresas privadas","B":"Una reunión de alto nivel entre jefes de Estado o de gobierno para tratar asuntos de interés común","C":"Un conflicto armado entre dos naciones","D":"Un fallo emitido por un tribunal internacional"}'::jsonb,
      'B',
      'Una cumbre diplomática es un encuentro de alto nivel entre líderes de distintos países para negociar y discutir asuntos de interés mutuo.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 58 (sociales_humanidades / cultura_general)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'cultura_general' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: cultura_general';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El término ''''multilateralismo'''' en relaciones internacionales se refiere a:',
      '{"A":"La cooperación entre tres o más países para abordar asuntos comunes","B":"Un acuerdo exclusivo entre dos naciones","C":"La imposición de sanciones unilaterales","D":"El aislamiento comercial de un país"}'::jsonb,
      'A',
      'El multilateralismo implica la coordinación de políticas y la cooperación entre varios países (tres o más) para atender problemas de interés compartido.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 59 (sociales_humanidades / cultura_general)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'cultura_general' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: cultura_general';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Si un país impone aranceles a las importaciones de otro como respuesta a una medida similar de este último, se está ante un escenario de:',
      '{"A":"Cooperación multilateral","B":"Guerra comercial","C":"Integración económica","D":"Devaluación competitiva"}'::jsonb,
      'B',
      'Cuando dos países se imponen aranceles mutuamente como represalia, se genera una escalada conocida como guerra comercial, que tensiona las relaciones económicas bilaterales.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 60 (sociales_humanidades / economia)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'economia' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: economia';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Según la ley de la oferta, cuando el precio de un bien aumenta, la cantidad ofrecida por los productores tiende a:',
      '{"A":"Aumentar","B":"Disminuir","C":"Mantenerse igual","D":"Desaparecer"}'::jsonb,
      'A',
      'La ley de la oferta establece que, manteniendo todo lo demás constante, a mayor precio de un bien, mayor es la cantidad que los productores están dispuestos a ofrecer.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 61 (sociales_humanidades / economia)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'economia' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: economia';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Cuando el precio de un bien disminuye, según la ley de la demanda, la cantidad demandada tiende a:',
      '{"A":"Disminuir","B":"Aumentar","C":"Mantenerse igual","D":"Volverse cero"}'::jsonb,
      'B',
      'La ley de la demanda establece que, a menor precio de un bien, mayor es la cantidad que los consumidores están dispuestos a comprar.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 62 (sociales_humanidades / economia)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'economia' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: economia';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El ''''tipo de cambio'''' de una moneda se define como:',
      '{"A":"La cantidad de una moneda que se necesita para adquirir una unidad de otra moneda","B":"La tasa de interés fijada por el banco central","C":"El porcentaje de inflación anual","D":"El impuesto aplicado a las importaciones"}'::jsonb,
      'A',
      'El tipo de cambio expresa cuántas unidades de una moneda se requieren para obtener una unidad de otra moneda distinta.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 63 (sociales_humanidades / economia)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'economia' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: economia';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Si un país exporta más bienes de los que importa, se dice que tiene:',
      '{"A":"Déficit comercial","B":"Balanza comercial equilibrada","C":"Superávit comercial","D":"Devaluación monetaria"}'::jsonb,
      'C',
      'Cuando el valor de las exportaciones de un país supera al de sus importaciones, se habla de superávit comercial.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 64 (sociales_humanidades / economia)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'economia' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: economia';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En un mercado de manzanas, si una helada destruye buena parte de la cosecha (reduciendo la oferta) mientras la demanda se mantiene constante, lo esperable es que:',
      '{"A":"El precio suba y la cantidad de equilibrio baje","B":"El precio baje y la cantidad de equilibrio suba","C":"El precio y la cantidad de equilibrio se mantengan iguales","D":"El precio baje y la cantidad de equilibrio baje"}'::jsonb,
      'A',
      'Una reducción de la oferta con demanda constante desplaza el punto de equilibrio hacia un precio más alto y una cantidad de equilibrio menor.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pablo',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 65 (salud / biologia_celula)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'biologia_celula' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: biologia_celula';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Cuál es la principal diferencia estructural entre una célula procariota y una eucariota?',
      '{"A":"La eucariota posee núcleo delimitado por membrana y la procariota no","B":"La procariota tiene más organelos que la eucariota","C":"Solo la procariota posee ADN","D":"La eucariota carece de membrana celular"}'::jsonb,
      'A',
      'La diferencia fundamental es que la célula eucariota posee un núcleo verdadero, delimitado por membrana nuclear, mientras que en la procariota el material genético está disperso en el citoplasma.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 66 (salud / biologia_celula)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'biologia_celula' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: biologia_celula';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El organelo encargado de la producción de energía (ATP) en la célula eucariota es:',
      '{"A":"El núcleo","B":"La mitocondria","C":"El aparato de Golgi","D":"El lisosoma"}'::jsonb,
      'B',
      'La mitocondria es el organelo responsable de la respiración celular, proceso mediante el cual se produce la mayor parte del ATP celular.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 67 (salud / biologia_celula)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'biologia_celula' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: biologia_celula';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Durante la mitosis, el resultado final es:',
      '{"A":"Cuatro células hijas con la mitad de cromosomas","B":"Dos células hijas genéticamente idénticas a la célula madre","C":"Dos células hijas con el doble de cromosomas","D":"Una sola célula sin división del núcleo"}'::jsonb,
      'B',
      'La mitosis produce dos células hijas con el mismo número de cromosomas y la misma información genética que la célula madre.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 68 (salud / biologia_celula)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'biologia_celula' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: biologia_celula';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'La meiosis se diferencia de la mitosis principalmente porque:',
      '{"A":"Produce células genéticamente idénticas","B":"Ocurre solo en células vegetales","C":"Reduce a la mitad el número de cromosomas, generando variabilidad genética","D":"No involucra división del núcleo"}'::jsonb,
      'C',
      'La meiosis reduce el número de cromosomas a la mitad (de diploide a haploide) y genera variabilidad genética mediante el intercambio de material genético (crossing-over).',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 69 (salud / biologia_celula)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'biologia_celula' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: biologia_celula';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Si una célula somática humana tiene 46 cromosomas, ¿cuántos cromosomas tendrá cada célula resultante al final de la meiosis?',
      '{"A":"46","B":"92","C":"23","D":"12"}'::jsonb,
      'C',
      'La meiosis reduce el número de cromosomas a la mitad; una célula con 46 cromosomas (diploide) origina células con 23 cromosomas (haploides), como los gametos.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 70 (salud / genetica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'genetica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: genetica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En genética, un individuo heterocigoto para un carácter posee:',
      '{"A":"Dos alelos idénticos","B":"Dos alelos diferentes para ese gen","C":"Ningún alelo","D":"Tres alelos"}'::jsonb,
      'B',
      'Un individuo heterocigoto tiene dos alelos distintos para un mismo gen (por ejemplo, Aa), a diferencia del homocigoto, que posee dos alelos iguales.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 71 (salud / genetica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'genetica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: genetica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'La molécula que contiene la información genética hereditaria es:',
      '{"A":"El ARN mensajero","B":"El ADN","C":"La glucosa","D":"El ATP"}'::jsonb,
      'B',
      'El ADN (ácido desoxirribonucleico) es la molécula que almacena y transmite la información genética hereditaria de una generación a otra.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 72 (salud / genetica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'genetica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: genetica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Según la primera ley de Mendel (ley de la segregación), al cruzar dos individuos heterocigotos (Aa x Aa), la proporción fenotípica esperada en la descendencia (con A dominante) es:',
      '{"A":"1:1","B":"3:1","C":"1:2:1","D":"9:3:3:1"}'::jsonb,
      'B',
      'Al cruzar dos heterocigotos Aa x Aa, la proporción genotípica es 1AA:2Aa:1aa, lo que produce una proporción fenotípica de 3 dominantes por 1 recesivo (3:1).',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 73 (salud / genetica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'genetica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: genetica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Una diferencia clave entre el ADN y el ARN es que:',
      '{"A":"El ADN es monocatenario y el ARN es bicatenario","B":"El ADN contiene timina y el ARN contiene uracilo en su lugar","C":"El ARN es más estable que el ADN","D":"El ADN no contiene información genética"}'::jsonb,
      'B',
      'Una diferencia clave es que el ADN utiliza la base nitrogenada timina, mientras que el ARN la sustituye por uracilo; además, el ADN es típicamente bicatenario y el ARN monocatenario.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 74 (salud / genetica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'genetica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: genetica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En un cruce entre dos plantas heterocigotas para dos características independientes (AaBb x AaBb), ¿qué proporción fenotípica se espera según la segunda ley de Mendel (segregación independiente)?',
      '{"A":"1:1:1:1","B":"3:1","C":"9:3:3:1","D":"1:2:1"}'::jsonb,
      'C',
      'Cuando se cruzan dos individuos dihíbridos (AaBb x AaBb) con genes que segregan independientemente, la proporción fenotípica esperada en la descendencia es 9:3:3:1.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 75 (salud / sistemas_cuerpo)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'sistemas_cuerpo' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: sistemas_cuerpo';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Cuál es la función principal del sistema circulatorio?',
      '{"A":"Transportar oxígeno, nutrientes y desechos por el cuerpo","B":"Producir enzimas digestivas","C":"Regular la temperatura mediante el sudor","D":"Filtrar el aire inhalado"}'::jsonb,
      'A',
      'El sistema circulatorio se encarga de transportar oxígeno, nutrientes, hormonas y productos de desecho a través de la sangre por todo el organismo.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 76 (salud / sistemas_cuerpo)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'sistemas_cuerpo' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: sistemas_cuerpo';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El órgano principal encargado de bombear la sangre en el sistema circulatorio es:',
      '{"A":"El hígado","B":"El corazón","C":"El pulmón","D":"El riñón"}'::jsonb,
      'B',
      'El corazón es el órgano muscular que bombea la sangre a través de los vasos sanguíneos hacia todo el cuerpo.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 77 (salud / sistemas_cuerpo)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'sistemas_cuerpo' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: sistemas_cuerpo';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Durante el proceso de respiración, el intercambio de oxígeno y dióxido de carbono ocurre principalmente en:',
      '{"A":"La tráquea","B":"Los alvéolos pulmonares","C":"La laringe","D":"Los bronquios principales"}'::jsonb,
      'B',
      'El intercambio gaseoso (oxígeno por dióxido de carbono) ocurre en los alvéolos pulmonares, donde la sangre capilar entra en contacto estrecho con el aire inhalado.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 78 (salud / sistemas_cuerpo)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'sistemas_cuerpo' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: sistemas_cuerpo';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'La función principal del sistema nervioso es:',
      '{"A":"Coordinar y controlar las funciones del organismo mediante impulsos eléctricos","B":"Producir glóbulos rojos","C":"Sintetizar proteínas digestivas","D":"Filtrar sustancias tóxicas de la sangre"}'::jsonb,
      'A',
      'El sistema nervioso coordina y regula las funciones del cuerpo mediante la transmisión de impulsos nerviosos (eléctricos y químicos) entre neuronas.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 79 (salud / sistemas_cuerpo)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'sistemas_cuerpo' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: sistemas_cuerpo';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Ordene correctamente el recorrido del bolo alimenticio durante la digestión: 1) Estómago 2) Esófago 3) Intestino delgado 4) Boca',
      '{"A":"4, 2, 1, 3","B":"4, 1, 2, 3","C":"2, 4, 1, 3","D":"4, 2, 3, 1"}'::jsonb,
      'A',
      'El recorrido correcto del alimento es: boca (4), esófago (2), estómago (1) e intestino delgado (3).',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 80 (salud / sistemas_cuerpo)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'sistemas_cuerpo' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: sistemas_cuerpo';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En un ecosistema, los organismos que producen su propio alimento mediante fotosíntesis se denominan:',
      '{"A":"Consumidores primarios","B":"Productores","C":"Descomponedores","D":"Consumidores secundarios"}'::jsonb,
      'B',
      'Los productores (como las plantas y algas) son organismos autótrofos que sintetizan su propio alimento a partir de la energía solar mediante fotosíntesis.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 81 (salud / sistemas_cuerpo)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'sistemas_cuerpo' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: sistemas_cuerpo';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Un ecosistema está formado por:',
      '{"A":"Solo los seres vivos de una zona","B":"Solo los factores físicos de una zona (agua, suelo, clima)","C":"El conjunto de seres vivos y su ambiente físico interactuando entre sí","D":"Únicamente las plantas de una región"}'::jsonb,
      'C',
      'Un ecosistema comprende tanto a los organismos vivos (biocenosis) como al ambiente físico que los rodea (biotopo), interactuando de forma dinámica.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 82 (salud / sistemas_cuerpo)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'sistemas_cuerpo' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: sistemas_cuerpo';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En una cadena alimenticia, los organismos que se alimentan directamente de los productores se denominan:',
      '{"A":"Consumidores primarios","B":"Consumidores terciarios","C":"Descomponedores","D":"Productores"}'::jsonb,
      'A',
      'Los consumidores primarios (herbívoros) son aquellos que se alimentan directamente de los productores (organismos autótrofos).',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 83 (salud / sistemas_cuerpo)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'sistemas_cuerpo' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: sistemas_cuerpo';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Los descomponedores cumplen un papel esencial en el ecosistema porque:',
      '{"A":"Producen oxígeno mediante fotosíntesis","B":"Descomponen materia orgánica muerta y reciclan nutrientes al ambiente","C":"Son el primer eslabón de toda cadena alimenticia","D":"Solo se alimentan de otros consumidores"}'::jsonb,
      'B',
      'Los descomponedores (hongos y bacterias, principalmente) degradan la materia orgánica muerta y devuelven nutrientes esenciales al suelo, cerrando el ciclo de la materia.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 84 (salud / sistemas_cuerpo)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'sistemas_cuerpo' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: sistemas_cuerpo';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En una cadena alimenticia: pasto → saltamontes → rana → serpiente → águila, si la población de ranas disminuyera drásticamente, el efecto más probable sería:',
      '{"A":"Aumento de saltamontes y disminución de serpientes por falta de alimento","B":"Disminución de saltamontes y aumento de serpientes","C":"Ningún efecto sobre las demás poblaciones","D":"Aumento inmediato de águilas"}'::jsonb,
      'A',
      'Si disminuyen las ranas, sus presas (saltamontes) tendrán menos depredadores y tenderán a aumentar, mientras que las serpientes, al perder su principal alimento, tenderán a disminuir.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 85 (salud / quimica_atomica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_atomica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_atomica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Las partículas subatómicas con carga positiva que se encuentran en el núcleo del átomo son:',
      '{"A":"Electrones","B":"Protones","C":"Neutrones","D":"Fotones"}'::jsonb,
      'B',
      'Los protones son partículas subatómicas con carga positiva localizadas en el núcleo del átomo, junto con los neutrones (sin carga).',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 86 (salud / quimica_atomica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_atomica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_atomica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En la tabla periódica, los elementos de un mismo grupo (columna) comparten principalmente:',
      '{"A":"La misma masa atómica","B":"El mismo número de electrones en su capa de valencia","C":"El mismo número de neutrones","D":"El mismo estado físico"}'::jsonb,
      'B',
      'Los elementos de un mismo grupo comparten el número de electrones en su capa de valencia, lo que determina propiedades químicas similares.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 87 (salud / quimica_atomica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_atomica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_atomica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El número atómico de un elemento indica:',
      '{"A":"El número de neutrones en el núcleo","B":"El número de protones en el núcleo","C":"La suma de protones y neutrones","D":"El número de capas electrónicas"}'::jsonb,
      'B',
      'El número atómico corresponde a la cantidad de protones presentes en el núcleo de un átomo y define su identidad como elemento químico.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 88 (salud / quimica_atomica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_atomica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_atomica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Al descender en un mismo grupo de la tabla periódica, el radio atómico de los elementos tiende a:',
      '{"A":"Disminuir","B":"Aumentar","C":"Mantenerse constante","D":"Volverse negativo"}'::jsonb,
      'B',
      'Al descender en un grupo, se añaden nuevos niveles de energía (capas electrónicas), por lo que el radio atómico tiende a aumentar.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 89 (salud / quimica_atomica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_atomica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_atomica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Un átomo neutro tiene número atómico 17 y número másico 35. ¿Cuántos neutrones posee?',
      '{"A":"17","B":"18","C":"35","D":"52"}'::jsonb,
      'B',
      'El número de neutrones se calcula restando el número atómico (protones) al número másico: 35 − 17 = 18 neutrones.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 90 (salud / quimica_enlaces)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_enlaces' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_enlaces';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El enlace iónico se forma principalmente por:',
      '{"A":"Compartición de electrones entre dos no metales","B":"Transferencia de electrones de un metal a un no metal","C":"Compartición de neutrones","D":"Atracción entre núcleos atómicos"}'::jsonb,
      'B',
      'El enlace iónico se produce por la transferencia de uno o más electrones desde un átomo metálico hacia un átomo no metálico, generando iones de carga opuesta que se atraen.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 91 (salud / quimica_enlaces)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_enlaces' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_enlaces';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El enlace covalente se caracteriza por:',
      '{"A":"La transferencia completa de electrones","B":"La compartición de electrones entre átomos, generalmente no metales","C":"La formación exclusiva de gases nobles","D":"La ausencia total de electrones de valencia"}'::jsonb,
      'B',
      'En el enlace covalente, los átomos (generalmente no metales) comparten pares de electrones para alcanzar estabilidad electrónica.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 92 (salud / quimica_enlaces)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_enlaces' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_enlaces';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El compuesto NaCl (cloruro de sodio) es un ejemplo típico de enlace:',
      '{"A":"Covalente polar","B":"Covalente no polar","C":"Iónico","D":"Metálico"}'::jsonb,
      'C',
      'El NaCl se forma por la transferencia de un electrón del sodio (metal) al cloro (no metal), constituyendo un ejemplo clásico de enlace iónico.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 93 (salud / quimica_enlaces)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_enlaces' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_enlaces';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Una molécula de agua (H2O) presenta enlaces:',
      '{"A":"Iónicos","B":"Covalentes polares","C":"Metálicos","D":"Covalentes no polares puros"}'::jsonb,
      'B',
      'En la molécula de agua, el oxígeno comparte electrones con cada hidrógeno, pero debido a la diferencia de electronegatividad, los enlaces resultan covalentes polares.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 94 (salud / quimica_enlaces)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_enlaces' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_enlaces';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Cuál de las siguientes propiedades es característica típica de los compuestos con enlace iónico?',
      '{"A":"Bajo punto de fusión y mala conductividad eléctrica en estado sólido","B":"Alto punto de fusión y buena conductividad eléctrica en disolución acuosa","C":"Son siempre gases a temperatura ambiente","D":"No se disuelven en agua bajo ninguna circunstancia"}'::jsonb,
      'B',
      'Los compuestos iónicos suelen tener altos puntos de fusión y, al disolverse en agua o fundirse, sus iones quedan libres para conducir la corriente eléctrica.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 95 (salud / quimica_nomenclatura)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_nomenclatura' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_nomenclatura';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El compuesto de fórmula CO2 se denomina:',
      '{"A":"Monóxido de carbono","B":"Dióxido de carbono","C":"Carbonato de calcio","D":"Ácido carbónico"}'::jsonb,
      'B',
      'CO2 corresponde al dióxido de carbono, formado por un átomo de carbono unido a dos átomos de oxígeno.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 96 (salud / quimica_nomenclatura)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_nomenclatura' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_nomenclatura';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El compuesto NaOH corresponde a:',
      '{"A":"Hidróxido de sodio","B":"Óxido de sodio","C":"Cloruro de sodio","D":"Sulfato de sodio"}'::jsonb,
      'A',
      'NaOH es el hidróxido de sodio, una base fuerte formada por el catión sodio y el anión hidróxido (OH−).',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 97 (salud / quimica_nomenclatura)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_nomenclatura' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_nomenclatura';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El nombre correcto del compuesto H2SO4 es:',
      '{"A":"Ácido sulfhídrico","B":"Ácido sulfuroso","C":"Ácido sulfúrico","D":"Sulfato de hidrógeno"}'::jsonb,
      'C',
      'H2SO4 es el ácido sulfúrico, uno de los ácidos inorgánicos más comunes, con el azufre en su estado de oxidación más alto (+6).',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 98 (salud / quimica_nomenclatura)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_nomenclatura' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_nomenclatura';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El compuesto CaCO3 se denomina:',
      '{"A":"Óxido de calcio","B":"Carbonato de calcio","C":"Cloruro de calcio","D":"Hidróxido de calcio"}'::jsonb,
      'B',
      'CaCO3 corresponde al carbonato de calcio, compuesto formado por el catión calcio y el anión carbonato.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 99 (salud / quimica_nomenclatura)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_nomenclatura' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_nomenclatura';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Cuál es la fórmula química correcta para el óxido férrico (óxido de hierro III)?',
      '{"A":"FeO","B":"Fe2O3","C":"FeO2","D":"Fe3O4"}'::jsonb,
      'B',
      'El óxido férrico corresponde al hierro con estado de oxidación +3, por lo que su fórmula balanceada es Fe2O3.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 100 (salud / quimica_estequiometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_estequiometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_estequiometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Un mol de cualquier sustancia contiene aproximadamente:',
      '{"A":"6,022×10^23 partículas","B":"1000 partículas","C":"22,4 partículas","D":"3,14 partículas"}'::jsonb,
      'A',
      'El número de Avogadro (6,022×10^23) representa la cantidad de partículas (átomos, moléculas o iones) contenidas en un mol de sustancia.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 101 (salud / quimica_estequiometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_estequiometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_estequiometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'La masa molar del agua (H2O) es aproximadamente:',
      '{"A":"16 g/mol","B":"18 g/mol","C":"20 g/mol","D":"2 g/mol"}'::jsonb,
      'B',
      'La masa molar del agua se calcula sumando las masas atómicas: 2(1)+16 = 18 g/mol aproximadamente.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 102 (salud / quimica_estequiometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_estequiometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_estequiometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Cuántos moles hay en 36 gramos de agua (masa molar aproximada 18 g/mol)?',
      '{"A":"1 mol","B":"2 moles","C":"3 moles","D":"0,5 moles"}'::jsonb,
      'B',
      'El número de moles se obtiene dividiendo la masa entre la masa molar: 36 g ÷ 18 g/mol = 2 moles.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 103 (salud / quimica_estequiometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_estequiometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_estequiometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En la reacción balanceada 2H2 + O2 → 2H2O, ¿cuántos moles de agua se producen a partir de 4 moles de H2 (con O2 en exceso)?',
      '{"A":"2 moles","B":"4 moles","C":"8 moles","D":"1 mol"}'::jsonb,
      'B',
      'La relación estequiométrica entre H2 y H2O es 2:2 (es decir, 1:1); por lo tanto, 4 moles de H2 producen 4 moles de H2O.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 104 (salud / quimica_estequiometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_estequiometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_estequiometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Según la reacción balanceada N2 + 3H2 → 2NH3, ¿cuántos moles de NH3 se producen a partir de 6 moles de H2 (con N2 en exceso)?',
      '{"A":"2 moles","B":"3 moles","C":"4 moles","D":"6 moles"}'::jsonb,
      'C',
      'La relación estequiométrica es 3 moles de H2 por cada 2 moles de NH3; por lo tanto, 6 moles de H2 producen 4 moles de NH3.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 105 (salud / quimica_acidos)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_acidos' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_acidos';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Una sustancia con pH menor a 7 se clasifica como:',
      '{"A":"Básica","B":"Ácida","C":"Neutra","D":"Anfótera"}'::jsonb,
      'B',
      'Una sustancia con pH menor a 7 se considera ácida, mientras que un pH mayor a 7 indica una sustancia básica.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 106 (salud / quimica_acidos)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_acidos' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_acidos';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El agua pura a 25°C tiene un pH de aproximadamente:',
      '{"A":"3","B":"7","C":"10","D":"14"}'::jsonb,
      'B',
      'El agua pura es neutra, con un pH de aproximadamente 7 a 25°C.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 107 (salud / quimica_acidos)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_acidos' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_acidos';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Una sustancia con pH de 12 se clasifica como:',
      '{"A":"Fuertemente ácida","B":"Neutra","C":"Básica","D":"Ligeramente ácida"}'::jsonb,
      'C',
      'Un pH de 12, al ser mayor a 7, corresponde a una sustancia básica (alcalina).',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 108 (salud / quimica_acidos)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_acidos' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_acidos';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Al reaccionar un ácido con una base, el proceso resultante se denomina:',
      '{"A":"Oxidación","B":"Neutralización","C":"Sublimación","D":"Electrólisis"}'::jsonb,
      'B',
      'La reacción entre un ácido y una base, que produce sal y agua, se conoce como reacción de neutralización.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 109 (salud / quimica_acidos)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'quimica_acidos' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: quimica_acidos';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Si una disolución tiene una concentración de iones H+ de 1×10^-3 mol/L, su pH es:',
      '{"A":"3","B":"11","C":"1","D":"7"}'::jsonb,
      'A',
      'El pH se calcula como pH = −log[H+]; para una concentración de 1×10^-3 mol/L, el pH resultante es 3.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Elize',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 110 (ciencia_tecnologia / algebra)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'algebra' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: algebra';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Resuelva la ecuación: 3x + 5 = 20',
      '{"A":"x=3","B":"x=5","C":"x=7","D":"x=15"}'::jsonb,
      'B',
      'Despejando: 3x = 20 − 5 = 15, por lo tanto x = 15/3 = 5.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 111 (ciencia_tecnologia / algebra)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'algebra' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: algebra';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Factorice la expresión: x² − 9',
      '{"A":"(x−3)(x+3)","B":"(x−9)(x+1)","C":"(x−3)²","D":"(x+9)(x−1)"}'::jsonb,
      'A',
      'Es una diferencia de cuadrados: x² − 9 = (x−3)(x+3), ya que 9 = 3².',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 112 (ciencia_tecnologia / algebra)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'algebra' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: algebra';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Resuelva el sistema: x + y = 10; x − y = 2. ¿Cuál es el valor de x?',
      '{"A":"4","B":"6","C":"8","D":"5"}'::jsonb,
      'B',
      'Sumando ambas ecuaciones se elimina y: 2x = 12, por lo tanto x = 6.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 113 (ciencia_tecnologia / algebra)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'algebra' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: algebra';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Factorice: x² + 5x + 6',
      '{"A":"(x+2)(x+3)","B":"(x+1)(x+6)","C":"(x−2)(x−3)","D":"(x+6)(x−1)"}'::jsonb,
      'A',
      'Se buscan dos números que sumen 5 y multipliquen 6: esos números son 2 y 3, por lo tanto x²+5x+6 = (x+2)(x+3).',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 114 (ciencia_tecnologia / algebra)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'algebra' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: algebra';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Resuelva el sistema: 2x + 3y = 12; x − y = 1. ¿Cuál es el valor de y?',
      '{"A":"1","B":"2","C":"3","D":"4"}'::jsonb,
      'B',
      'De la segunda ecuación, x = y+1. Sustituyendo en la primera: 2(y+1)+3y=12 → 5y+2=12 → y=2.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 115 (ciencia_tecnologia / trigonometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'trigonometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: trigonometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En un triángulo rectángulo, el seno de un ángulo se define como:',
      '{"A":"Cateto opuesto / hipotenusa","B":"Cateto adyacente / hipotenusa","C":"Cateto opuesto / cateto adyacente","D":"Hipotenusa / cateto opuesto"}'::jsonb,
      'A',
      'El seno de un ángulo agudo en un triángulo rectángulo se define como la razón entre el cateto opuesto y la hipotenusa.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 116 (ciencia_tecnologia / trigonometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'trigonometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: trigonometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      '¿Cuál es el valor del seno de 90°?',
      '{"A":"0","B":"1","C":"0,5","D":"-1"}'::jsonb,
      'B',
      'El seno de 90° es igual a 1, el valor máximo que puede tomar la función seno.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 117 (ciencia_tecnologia / trigonometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'trigonometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: trigonometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En un triángulo rectángulo, si el cateto opuesto mide 3 y la hipotenusa mide 5, ¿cuál es el valor del seno del ángulo?',
      '{"A":"3/5","B":"5/3","C":"4/5","D":"3/4"}'::jsonb,
      'A',
      'El seno se calcula como cateto opuesto entre hipotenusa: 3/5.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 118 (ciencia_tecnologia / trigonometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'trigonometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: trigonometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En un triángulo rectángulo con catetos de 6 y 8, ¿cuánto mide la hipotenusa?',
      '{"A":"9","B":"10","C":"12","D":"14"}'::jsonb,
      'B',
      'Por el teorema de Pitágoras: hipotenusa = √(6²+8²) = √(36+64) = √100 = 10.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 119 (ciencia_tecnologia / trigonometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'trigonometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: trigonometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En un triángulo rectángulo, el cateto adyacente a un ángulo mide 4 y la hipotenusa mide 5. ¿Cuál es el valor de la tangente de dicho ángulo?',
      '{"A":"3/4","B":"4/3","C":"3/5","D":"4/5"}'::jsonb,
      'A',
      'El cateto opuesto se obtiene por Pitágoras: √(5²−4²)=√9=3. La tangente es cateto opuesto entre cateto adyacente: 3/4.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 120 (ciencia_tecnologia / funciones)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'funciones' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: funciones';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En la función lineal y = 2x + 3, la pendiente es:',
      '{"A":"3","B":"2","C":"5","D":"-2"}'::jsonb,
      'B',
      'En una función lineal de la forma y = mx + b, el coeficiente m representa la pendiente; en este caso, m = 2.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 121 (ciencia_tecnologia / funciones)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'funciones' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: funciones';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El punto donde una función lineal corta al eje Y se denomina:',
      '{"A":"Pendiente","B":"Intersección con el eje X","C":"Ordenada al origen","D":"Dominio"}'::jsonb,
      'C',
      'La ordenada al origen (o intercepto en Y) es el valor de y cuando x = 0, es decir, el punto donde la recta corta el eje vertical.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 122 (ciencia_tecnologia / funciones)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'funciones' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: funciones';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Dada la función f(x) = x² − 4, ¿cuál es el valor de f(3)?',
      '{"A":"5","B":"9","C":"13","D":"-5"}'::jsonb,
      'A',
      'Sustituyendo x=3: f(3) = 3² − 4 = 9 − 4 = 5.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 123 (ciencia_tecnologia / funciones)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'funciones' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: funciones';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'La gráfica de una función cuadrática (parábola) f(x) = ax² + bx + c abre hacia abajo cuando:',
      '{"A":"a > 0","B":"a < 0","C":"a = 0","D":"c < 0"}'::jsonb,
      'B',
      'El signo del coeficiente ''''a'''' determina la orientación de la parábola: si a < 0, la parábola abre hacia abajo (cóncava hacia abajo).',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 124 (ciencia_tecnologia / funciones)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'funciones' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: funciones';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Dada la función f(x) = 2x − 5, ¿para qué valor de x se cumple que f(x) = 7?',
      '{"A":"x=4","B":"x=6","C":"x=1","D":"x=2"}'::jsonb,
      'B',
      'Resolviendo 2x − 5 = 7: 2x = 12, por lo tanto x = 6.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 125 (ciencia_tecnologia / fisica_cinematica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'fisica_cinematica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: fisica_cinematica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'La velocidad se define como:',
      '{"A":"El cambio de posición en el tiempo","B":"La fuerza aplicada sobre un cuerpo","C":"La masa de un objeto en movimiento","D":"El cambio de aceleración en el tiempo"}'::jsonb,
      'A',
      'La velocidad es la magnitud física que expresa el cambio de posición de un cuerpo respecto al tiempo.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 126 (ciencia_tecnologia / fisica_cinematica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'fisica_cinematica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: fisica_cinematica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Un automóvil recorre 150 km en 3 horas a velocidad constante. ¿Cuál es su velocidad promedio?',
      '{"A":"40 km/h","B":"50 km/h","C":"45 km/h","D":"60 km/h"}'::jsonb,
      'B',
      'La velocidad promedio se calcula dividiendo la distancia entre el tiempo: 150 km ÷ 3 h = 50 km/h.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 127 (ciencia_tecnologia / fisica_cinematica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'fisica_cinematica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: fisica_cinematica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'La aceleración se define como:',
      '{"A":"El cambio de velocidad en el tiempo","B":"La distancia total recorrida","C":"El cambio de posición","D":"La fuerza dividida entre el tiempo"}'::jsonb,
      'A',
      'La aceleración es la magnitud física que mide el cambio de velocidad de un cuerpo por unidad de tiempo.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 128 (ciencia_tecnologia / fisica_cinematica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'fisica_cinematica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: fisica_cinematica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Un objeto parte del reposo y acelera uniformemente a 2 m/s². ¿Qué velocidad alcanza después de 5 segundos?',
      '{"A":"5 m/s","B":"10 m/s","C":"7 m/s","D":"2,5 m/s"}'::jsonb,
      'B',
      'Usando v = v0 + a·t, con v0=0: v = 2 m/s² × 5 s = 10 m/s.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 129 (ciencia_tecnologia / fisica_cinematica)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'fisica_cinematica' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: fisica_cinematica';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Un cuerpo se mueve con una velocidad inicial de 10 m/s y una aceleración constante de 2 m/s². ¿Qué distancia recorre en 4 segundos?',
      '{"A":"40 m","B":"56 m","C":"48 m","D":"32 m"}'::jsonb,
      'B',
      'Usando d = v0·t + ½·a·t²: d = 10(4) + 0,5(2)(4²) = 40 + 16 = 56 m.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 130 (ciencia_tecnologia / fisica_fuerza)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'fisica_fuerza' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: fisica_fuerza';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Según la primera ley de Newton, un cuerpo en reposo permanecerá en reposo a menos que:',
      '{"A":"Se le aplique una fuerza neta externa","B":"Pase el tiempo suficiente","C":"Cambie su masa","D":"Se encuentre en el vacío"}'::jsonb,
      'A',
      'La primera ley de Newton (ley de la inercia) establece que un cuerpo permanece en su estado de reposo o movimiento uniforme a menos que actúe sobre él una fuerza neta externa.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 131 (ciencia_tecnologia / fisica_fuerza)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'fisica_fuerza' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: fisica_fuerza';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'La unidad de medida de la fuerza en el Sistema Internacional es:',
      '{"A":"El joule","B":"El newton","C":"El watt","D":"El pascal"}'::jsonb,
      'B',
      'La fuerza se mide en newtons (N) en el Sistema Internacional de Unidades.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 132 (ciencia_tecnologia / fisica_fuerza)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'fisica_fuerza' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: fisica_fuerza';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Según la segunda ley de Newton (F = m·a), si se duplica la masa de un objeto manteniendo la aceleración constante, la fuerza necesaria:',
      '{"A":"Se duplica","B":"Se reduce a la mitad","C":"Permanece igual","D":"Se cuadruplica"}'::jsonb,
      'A',
      'Como F = m·a, si la aceleración se mantiene constante y la masa se duplica, la fuerza necesaria también se duplica, dado que son directamente proporcionales.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 133 (ciencia_tecnologia / fisica_fuerza)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'fisica_fuerza' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: fisica_fuerza';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Un cuerpo está en equilibrio estático cuando:',
      '{"A":"La suma de todas las fuerzas que actúan sobre él es igual a cero","B":"Se mueve con velocidad constante distinta de cero","C":"Existe una fuerza neta actuando sobre él","D":"Su masa es igual a cero"}'::jsonb,
      'A',
      'El equilibrio estático ocurre cuando la resultante de todas las fuerzas que actúan sobre un cuerpo es cero, por lo que este permanece en reposo.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 134 (ciencia_tecnologia / fisica_fuerza)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'fisica_fuerza' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: fisica_fuerza';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Un objeto de 10 kg de masa requiere una fuerza neta de 40 N para acelerar. ¿Cuál es su aceleración?',
      '{"A":"2 m/s²","B":"4 m/s²","C":"0,25 m/s²","D":"400 m/s²"}'::jsonb,
      'B',
      'Aplicando F = m·a, la aceleración es a = F/m = 40 N ÷ 10 kg = 4 m/s².',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 135 (ciencia_tecnologia / geometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El área de un rectángulo de base 8 cm y altura 5 cm es:',
      '{"A":"13 cm²","B":"40 cm²","C":"26 cm²","D":"45 cm²"}'::jsonb,
      'B',
      'El área del rectángulo se calcula como base × altura: 8 cm × 5 cm = 40 cm².',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 136 (ciencia_tecnologia / geometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Según el teorema de Pitágoras, en un triángulo rectángulo con catetos de 3 y 4, la hipotenusa mide:',
      '{"A":"5","B":"6","C":"7","D":"12"}'::jsonb,
      'A',
      'Por el teorema de Pitágoras: hipotenusa = √(3²+4²) = √(9+16) = √25 = 5.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 137 (ciencia_tecnologia / geometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El área de un círculo de radio 7 cm (use π≈22/7) es aproximadamente:',
      '{"A":"44 cm²","B":"154 cm²","C":"22 cm²","D":"88 cm²"}'::jsonb,
      'B',
      'El área del círculo es π·r² = (22/7)×7² = (22/7)×49 = 154 cm².',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 138 (ciencia_tecnologia / geometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'El volumen de un cubo con arista de 4 cm es:',
      '{"A":"16 cm³","B":"48 cm³","C":"64 cm³","D":"12 cm³"}'::jsonb,
      'C',
      'El volumen de un cubo se calcula como arista³: 4³ = 64 cm³.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 139 (ciencia_tecnologia / geometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Un triángulo rectángulo tiene catetos de 6 cm y 8 cm. ¿Cuál es su área?',
      '{"A":"24 cm²","B":"48 cm²","C":"14 cm²","D":"20 cm²"}'::jsonb,
      'A',
      'El área de un triángulo rectángulo es (base × altura)/2, usando los catetos como base y altura: (6×8)/2 = 24 cm².',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 140 (ciencia_tecnologia / geometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En dibujo técnico, la vista que se obtiene al proyectar un objeto desde el frente se denomina:',
      '{"A":"Vista superior","B":"Vista lateral","C":"Vista frontal (o de alzado)","D":"Vista isométrica"}'::jsonb,
      'C',
      'La vista frontal, también llamada de alzado, se obtiene proyectando el objeto desde el frente sobre un plano vertical.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 141 (ciencia_tecnologia / geometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'La vista que muestra un objeto desde arriba se denomina:',
      '{"A":"Vista frontal","B":"Vista superior (o de planta)","C":"Vista lateral","D":"Vista posterior"}'::jsonb,
      'B',
      'La vista superior o de planta se obtiene proyectando el objeto desde arriba sobre un plano horizontal.',
      'easy'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 142 (ciencia_tecnologia / geometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'En el sistema de proyección ortogonal, las tres vistas principales de una pieza son:',
      '{"A":"Frontal, superior y lateral","B":"Isométrica, axonométrica y perspectiva","C":"Frontal, diagonal y curva","D":"Superior, inferior y posterior únicamente"}'::jsonb,
      'A',
      'El sistema de proyección ortogonal utiliza tres vistas principales —frontal, superior y lateral— para representar completamente una pieza en dos dimensiones.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 143 (ciencia_tecnologia / geometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Una proyección isométrica se caracteriza por:',
      '{"A":"Mostrar el objeto en una sola vista plana sin volumen","B":"Representar el objeto en tres dimensiones con los tres ejes formando ángulos iguales de 120° entre sí","C":"Ser idéntica a la vista frontal","D":"Utilizarse solo para piezas circulares"}'::jsonb,
      'B',
      'La proyección isométrica representa el objeto en tres dimensiones sobre un plano, con los tres ejes principales formando ángulos iguales de 120° entre sí.',
      'medium'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;
  -- Pregunta 144 (ciencia_tecnologia / geometria)
  SELECT id INTO v_q FROM subtopics WHERE area_id = v_area_esp AND code = 'geometria' LIMIT 1;
  IF v_q IS NULL THEN
    RAISE NOTICE 'Subtopic not found: geometria';
  ELSE
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
    VALUES (
      v_q,
      v_univ_simadi,
      v_area_esp,
      'Al interpretar un plano con vista frontal, superior y lateral de una pieza en forma de ''''L'''', el estudiante debe reconstruir mentalmente el volumen tridimensional combinando la información de las tres vistas. Esta habilidad de correlacionar vistas 2D con la forma 3D corresponde principalmente a:',
      '{"A":"Visualización espacial","B":"Cálculo algebraico","C":"Razonamiento verbal","D":"Memoria auditiva"}'::jsonb,
      'A',
      'La capacidad de reconstruir mentalmente un objeto tridimensional a partir de sus vistas planas es un componente central de la visualización espacial, habilidad clave evaluada en dibujo técnico.',
      'hard'::question_difficulty,
      'original',
      'Patron: area especifica NO confirmada oficialmente para 2026 en fuente primaria de la Secretaria (segun documento interno ''''Especializaciones'''', es una apuesta razonable basada en convocatorias historicas SIMADI/cursos propedeuticos); contenido 100% original; caso: Pedro',
      true
    )
    ON CONFLICT DO NOTHING;
  END IF;

  -- Link questions to clusters
  INSERT INTO question_clusters (question_id, cluster_code)
  SELECT q.id, c.cluster_code
  FROM questions q
  JOIN (VALUES
  ('40'::text, 'sociales_humanidades'),
  ('41'::text, 'sociales_humanidades'),
  ('42'::text, 'sociales_humanidades'),
  ('43'::text, 'sociales_humanidades'),
  ('44'::text, 'sociales_humanidades'),
  ('45'::text, 'sociales_humanidades'),
  ('46'::text, 'sociales_humanidades'),
  ('47'::text, 'sociales_humanidades'),
  ('48'::text, 'sociales_humanidades'),
  ('49'::text, 'sociales_humanidades'),
  ('50'::text, 'sociales_humanidades'),
  ('51'::text, 'sociales_humanidades'),
  ('52'::text, 'sociales_humanidades'),
  ('53'::text, 'sociales_humanidades'),
  ('54'::text, 'sociales_humanidades'),
  ('55'::text, 'sociales_humanidades'),
  ('56'::text, 'sociales_humanidades'),
  ('57'::text, 'sociales_humanidades'),
  ('58'::text, 'sociales_humanidades'),
  ('59'::text, 'sociales_humanidades'),
  ('60'::text, 'sociales_humanidades'),
  ('61'::text, 'sociales_humanidades'),
  ('62'::text, 'sociales_humanidades'),
  ('63'::text, 'sociales_humanidades'),
  ('64'::text, 'sociales_humanidades'),
  ('65'::text, 'salud'),
  ('66'::text, 'salud'),
  ('67'::text, 'salud'),
  ('68'::text, 'salud'),
  ('69'::text, 'salud'),
  ('70'::text, 'salud'),
  ('71'::text, 'salud'),
  ('72'::text, 'salud'),
  ('73'::text, 'salud'),
  ('74'::text, 'salud'),
  ('75'::text, 'salud'),
  ('76'::text, 'salud'),
  ('77'::text, 'salud'),
  ('78'::text, 'salud'),
  ('79'::text, 'salud'),
  ('80'::text, 'salud'),
  ('81'::text, 'salud'),
  ('82'::text, 'salud'),
  ('83'::text, 'salud'),
  ('84'::text, 'salud'),
  ('85'::text, 'salud'),
  ('86'::text, 'salud'),
  ('87'::text, 'salud'),
  ('88'::text, 'salud'),
  ('89'::text, 'salud'),
  ('90'::text, 'salud'),
  ('91'::text, 'salud'),
  ('92'::text, 'salud'),
  ('93'::text, 'salud'),
  ('94'::text, 'salud'),
  ('95'::text, 'salud'),
  ('96'::text, 'salud'),
  ('97'::text, 'salud'),
  ('98'::text, 'salud'),
  ('99'::text, 'salud'),
  ('100'::text, 'salud'),
  ('101'::text, 'salud'),
  ('102'::text, 'salud'),
  ('103'::text, 'salud'),
  ('104'::text, 'salud'),
  ('105'::text, 'salud'),
  ('106'::text, 'salud'),
  ('107'::text, 'salud'),
  ('108'::text, 'salud'),
  ('109'::text, 'salud'),
  ('110'::text, 'ciencia_tecnologia'),
  ('111'::text, 'ciencia_tecnologia'),
  ('112'::text, 'ciencia_tecnologia'),
  ('113'::text, 'ciencia_tecnologia'),
  ('114'::text, 'ciencia_tecnologia'),
  ('115'::text, 'ciencia_tecnologia'),
  ('116'::text, 'ciencia_tecnologia'),
  ('117'::text, 'ciencia_tecnologia'),
  ('118'::text, 'ciencia_tecnologia'),
  ('119'::text, 'ciencia_tecnologia'),
  ('120'::text, 'ciencia_tecnologia'),
  ('121'::text, 'ciencia_tecnologia'),
  ('122'::text, 'ciencia_tecnologia'),
  ('123'::text, 'ciencia_tecnologia'),
  ('124'::text, 'ciencia_tecnologia'),
  ('125'::text, 'ciencia_tecnologia'),
  ('126'::text, 'ciencia_tecnologia'),
  ('127'::text, 'ciencia_tecnologia'),
  ('128'::text, 'ciencia_tecnologia'),
  ('129'::text, 'ciencia_tecnologia'),
  ('130'::text, 'ciencia_tecnologia'),
  ('131'::text, 'ciencia_tecnologia'),
  ('132'::text, 'ciencia_tecnologia'),
  ('133'::text, 'ciencia_tecnologia'),
  ('134'::text, 'ciencia_tecnologia'),
  ('135'::text, 'ciencia_tecnologia'),
  ('136'::text, 'ciencia_tecnologia'),
  ('137'::text, 'ciencia_tecnologia'),
  ('138'::text, 'ciencia_tecnologia'),
  ('139'::text, 'ciencia_tecnologia'),
  ('140'::text, 'ciencia_tecnologia'),
  ('141'::text, 'ciencia_tecnologia'),
  ('142'::text, 'ciencia_tecnologia'),
  ('143'::text, 'ciencia_tecnologia'),
  ('144'::text, 'ciencia_tecnologia')
  ) AS c(qid, cluster_code) ON q.id = c.qid::uuid
  WHERE q.university_id = v_univ_simadi
  ON CONFLICT DO NOTHING;
END $$;

-- Verification
SELECT 
  sc.code as cluster,
  COUNT(*) as questions
FROM question_clusters qc
JOIN simad_clusters sc ON sc.code = qc.cluster_code
GROUP BY sc.code
ORDER BY sc.code;
