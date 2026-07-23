// ==============================================
// XILEX - Especializaciones SIMADI (Fase 2)
// SOLUCIÓN: SQL simple sin IDs problemáticos de fuente_reference
// ==============================================

-- Primero, asegúrate de que el area y subtopics existan
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

-- Insert subtopics para la especialización
INSERT INTO subtopics (area_id, code, name, description, difficulty_weight)
SELECT a.id, s.code, s.name, s.description, s.difficulty_weight
FROM areas a
CROSS JOIN (VALUES
  ('historia_universal', 'Historia Universal y Contemporánea', 'Guerras, revoluciones, procesos históricos mundiales', 1.0),
  ('historia_venezuela', 'Historia de Venezuela', 'Independencia, caudillismo, siglo XX, democracia', 1.0),
  ('geografia', 'Geografía Política y Económica Mundial', 'Población, recursos, bloques económicos, medio ambiente', 1.1),
  ('cultura_general', 'Cultura General y Actualidad Internacional', 'Organismos internacionales, conflictos actuales, premios', 1.0),
  ('economia', 'Economía Básica', 'Oferta/demanda, inflación, PIB, política fiscal/monetaria', 1.1),
  ('algebra', 'Álgebra', 'Ecuaciones, inecuaciones, funciones, polinomios', 1.0),
  ('trigonometria', 'Trigonometría Básica', 'Razones trigonométricas, triángulos, identidades', 1.1),
  ('funciones', 'Funciones y Gráficas', 'Lineales, cuadráticas, análisis de gráficas', 1.1),
  ('fisica_cinematica', 'Física - Cinemática', 'Movimiento rectilíneo, velocidad, aceleración', 1.2),
  ('fisica_fuerza', 'Física - Fuerza y Estática', 'Leyes de Newton, equilibrio, fuerzas', 1.2),
  ('geometria', 'Geometría', 'Áreas, volúmenes, teorema de Pitágoras', 1.1),
  ('dibujo_tecnico', 'Dibujo Técnico', 'Proyecciones, vistas, visualización espacial', 1.3),
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

-- Función para calcular cuales pertenecen a cada cluster por ID
CREATE OR REPLACE FUNCTION cluster_for_question(qid INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF qid BETWEEN 40 AND 64 THEN
    RETURN 'sociales_humanidades';
  ELSIF qid BETWEEN 65 AND 100 THEN
    RETURN 'salud';
  ELSE
    RETURN 'ciencia_tecnologia';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Inserta preguntas y establece source_reference con cluster
cDO $$
DECLARE
  v_univ_simadi UUID := (SELECT id FROM universities WHERE code = 'simadi');
  v_area_esp UUID := (SELECT id FROM areas WHERE university_id = v_univ_simadi AND code = 'especializacion');
  v_subtopic UUID;
  v_question_id UUID;
  v_cluster_code TEXT;
BEGIN
  FOR i IN 40..144 LOOP
    -- Determinar cluster
    v_cluster_code := cluster_for_question(i);
    
    -- Encontrar subtopic apropiado para este ID
    v_subtopic := (
      SELECT id FROM subtopics 
      WHERE area_id = v_area_esp
      ORDER BY 
        CASE 
          WHEN v_cluster_code IN ('sociales_humanidades', 'historia_universal') THEN 1
          WHEN v_cluster_code IN ('salud', 'algebra') THEN 2
          ELSE 3
        END
      LIMIT 1
    );
    
    IF v_subtopic IS NOT NULL THEN
      -- Insertar pregunta (UUID generado automáticamente)
      INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference, is_active)
      VALUES (
        v_subtopic,
        v_univ_simadi,
        v_area_esp,
        ('Pregunta ' || i || ': ' || v_cluster_code),
        ('{"A":"Opción A","B":"Opción B","C":"Opción C","D":"Opción D"}'::jsonb),
        ('A'),
        ('Explicación pregunta ' || i),
        'medium',
        'original',
        ('cluster:' || v_cluster_code || '|pregunta:' || i),
        true
      ) RETURNING id INTO v_question_id;
      
      -- Insertar en question_clusters
      INSERT INTO question_clusters (question_id, cluster_code)
      VALUES (v_question_id, v_cluster_code)
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END $$;

-- Verificar resultado
SELECT 
  sc.code as cluster,
  COUNT(q.id) as preguntas,
  COUNT(DISTINCT q.id) as preguntas_distintas
FROM question_clusters qc
JOIN simad_clusters sc ON sc.code = qc.cluster_code
JOIN questions q ON q.id = qc.question_id
WHERE q.university_id = (SELECT id FROM universities WHERE code = 'simadi')
  AND q.area_id = (SELECT id FROM areas WHERE university_id = (SELECT id FROM universities WHERE code = 'simadi') AND code = 'especializacion')
GROUP BY sc.code
ORDER BY sc.code;