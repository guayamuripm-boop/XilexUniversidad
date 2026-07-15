-- XILEX Seed Data for Phase 1: SIMADI (UCV) + UNIMET
-- Run this AFTER schema.sql in Supabase SQL Editor

-- ============================================================
-- SAMPLE QUESTIONS - SIMADI Razonamiento Lógico
-- ============================================================

DO $$
DECLARE
  v_silogismos UUID;
  v_proposicional UUID;
  v_analitico UUID;
  v_numericos UUID;
  v_figurales UUID;
  v_acentuacion UUID;
  v_ortografia UUID;
  v_vocabulario UUID;
  v_analogias UUID;
  v_comprension UUID;
  v_gramatica UUID;
  v_simadi_id UUID;
  v_unimet_id UUID;
  v_logico_id UUID;
  v_verbal_id UUID;
  v_cuantitativo_id UUID;
  v_verbal_unimet_id UUID;
BEGIN
  -- Get university IDs
  SELECT id INTO v_simadi_id FROM universities WHERE code = 'simadi';
  SELECT id INTO v_unimet_id FROM universities WHERE code = 'unimet';

  -- Get area IDs
  SELECT id INTO v_logico_id FROM areas WHERE university_id = v_simadi_id AND code = 'logico';
  SELECT id INTO v_verbal_id FROM areas WHERE university_id = v_simadi_id AND code = 'verbal';
  SELECT id INTO v_cuantitativo_id FROM areas WHERE university_id = v_unimet_id AND code = 'cuantitativo';
  SELECT id INTO v_verbal_unimet_id FROM areas WHERE university_id = v_unimet_id AND code = 'verbal';

  -- Get subtopic IDs for SIMADI Lógico
  SELECT id INTO v_silogismos FROM subtopics WHERE area_id = v_logico_id AND code = 'silogismos';
  SELECT id INTO v_proposicional FROM subtopics WHERE area_id = v_logico_id AND code = 'proposicional';
  SELECT id INTO v_analitico FROM subtopics WHERE area_id = v_logico_id AND code = 'analitico';
  SELECT id INTO v_numericos FROM subtopics WHERE area_id = v_logico_id AND code = 'numericos';
  SELECT id INTO v_figurales FROM subtopics WHERE area_id = v_logico_id AND code = 'figurales';

  -- Get subtopic IDs for SIMADI Verbal
  SELECT id INTO v_acentuacion FROM subtopics WHERE area_id = v_verbal_id AND code = 'acentuacion';
  SELECT id INTO v_ortografia FROM subtopics WHERE area_id = v_verbal_id AND code = 'ortografia';
  SELECT id INTO v_vocabulario FROM subtopics WHERE area_id = v_verbal_id AND code = 'vocabulario';
  SELECT id INTO v_analogias FROM subtopics WHERE area_id = v_verbal_id AND code = 'analogias';
  SELECT id INTO v_comprension FROM subtopics WHERE area_id = v_verbal_id AND code = 'comprension';
  SELECT id INTO v_gramatica FROM subtopics WHERE area_id = v_verbal_id AND code = 'gramatica';

  -- ============================================================
  -- SIMADI - RAZONAMIENTO LÓGICO (Sample Questions)
  -- ============================================================

  -- Silogismos
  INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference) VALUES
  (v_silogismos, v_simadi_id, v_logico_id,
   'Todos los médicos son profesionales. Algunos profesionales son investigadores. ¿Cuál conclusión es válida?',
   '{"A": "Todos los investigadores son médicos", "B": "Algunos médicos son investigadores", "C": "Ningún médico es investigador", "D": "No se puede concluir nada"}',
   'D',
   'De "Todos los M son P" y "Algunos P son I" no se deduce ninguna relación necesaria entre M e I. La conclusión válida es que no se puede concluir nada.',
   'medium', 'generated_pattern', 'Patrón SIMADI 2024 - Silogismos categóricos'),
  
  (v_silogismos, v_simadi_id, v_logico_id,
   'Ningún estudiante es profesor. Todos los profesores son educadores. ¿Qué se deduce?',
   '{"A": "Ningún estudiante es educador", "B": "Algunos educadores no son estudiantes", "C": "Todos los educadores son profesores", "D": "Algunos estudiantes son educadores"}',
   'B',
   'Si ningún E es P y todos los P son ED, entonces algunos ED no son E (los que son P). Es una inferencia válida por conversión de la premisa negativa.',
   'medium', 'generated_pattern', 'Patrón SIMADI - Silogismos con premisa negativa'),

  -- Lógica Proposicional
  (v_proposicional, v_simadi_id, v_logico_id,
   'Si llueve, entonces el suelo está mojado. El suelo no está mojado. ¿Qué se concluye?',
   '{"A": "Llovió", "B": "No llovió", "C": "El suelo está seco por otra razón", "D": "No se puede saber"}',
   'B',
   'Es una aplicación del Modus Tollens: Si P → Q y ¬Q, entonces ¬P. Por tanto, no llovió.',
   'easy', 'official_model', 'Modelo SIMADI 2024 - Lógica proposicional'),

  (v_proposicional, v_simadi_id, v_logico_id,
   'Solo si estudias, aprobarás. Aprobaste. ¿Qué se deduce?',
   '{"A": "Estudiaste", "B": "No estudiaste", "C": "El examen fue fácil", "D": "No se puede concluir"}',
   'A',
   '"Solo si P, Q" equivale a "Si Q, entonces P". Como Q (aprobaste) es verdadero, P (estudiaste) debe ser verdadero.',
   'medium', 'generated_pattern', 'Patrón SIMADI - Conectivo "solo si"'),

  -- Razonamiento Analítico
  (v_analitico, v_simadi_id, v_logico_id,
   'Cinco amigos (A, B, C, D, E) se sientan en una fila. A está a la izquierda de B. C está a la derecha de D. E está entre B y D. ¿Quién está en el centro?',
   '{"A": "A", "B": "B", "C": "C", "D": "E"}',
   'D',
   'Ordenando: A - B - E - D - C (o C - D - E - B - A). En ambos casos E queda en el centro.',
   'hard', 'generated_pattern', 'Patrón SIMADI - Ordenamiento lineal'),

  -- Series Numéricas
  (v_numericos, v_simadi_id, v_logico_id,
   'Completa la serie: 2, 6, 12, 20, 30, ?',
   '{"A": "40", "B": "42", "C": "44", "D": "46"}',
   'B',
   'La serie sigue el patrón n×(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42.',
   'easy', 'official_model', 'Modelo SIMADI 2023 - Series numéricas'),

  (v_numericos, v_simadi_id, v_logico_id,
   'Encuentra el siguiente término: 3, 7, 15, 31, 63, ?',
   '{"A": "127", "B": "125", "C": "129", "D": "123"}',
   'A',
   'Cada término es 2ⁿ⁺¹ - 1: 2²-1=3, 2³-1=7, 2⁴-1=15, 2⁵-1=31, 2⁶-1=63, 2⁷-1=127.',
   'medium', 'generated_pattern', 'Patrón SIMADI - Potencias de 2 menos 1'),

  -- ============================================================
  -- SIMADI - RAZONAMIENTO VERBAL (Sample Questions)
  -- ============================================================

  -- Acentuación y Puntuación
  (v_acentuacion, v_simadi_id, v_verbal_id,
   'Seleccione la oración con correcta acentuación y puntuación:',
   '{"A": "El niño, que estudia mucho, aprobó el examen.", "B": "El niño que estudia mucho aprobó, el examen.", "C": "El niño que estudia mucho, aprobó el examen.", "D": "El niño, que estudia mucho aprobó el examen."}',
   'A',
   'La coma encierra una aposición explicativa ("que estudia mucho"). Las otras opciones tienen errores de puntuación.',
   'easy', 'official_model', 'Modelo SIMADI 2024 - Acentuación y puntuación'),

  -- Analogías Verbales
  (v_analogias, v_simadi_id, v_verbal_id,
   'MÉDICO : HOSPITAL :: PROFESOR : ?',
   '{"A": "ESCUELA", "B": "ESTUDIANTE", "C": "LIBRO", "D": "CLASE"}',
   'A',
   'Relación lugar de trabajo: el médico trabaja en el hospital, el profesor trabaja en la escuela.',
   'easy', 'official_model', 'Modelo SIMADI 2024 - Analogías verbales'),

  (v_analogias, v_simadi_id, v_verbal_id,
   'FRIO : CALOR :: OSCURO : ?',
   '{"A": "NEGRO", "B": "SOMBRA", "C": "CLARO", "D": "NOCHE"}',
   'C',
   'Relación de antónimos: frío es opuesto a calor, oscuro es opuesto a claro.',
   'easy', 'generated_pattern', 'Patrón SIMADI - Antonimia'),

  -- Comprensión Lectora
  (v_comprension, v_simadi_id, v_verbal_id,
   'Texto: "La biodiversidad no es solo la variedad de especies, sino también la diversidad genética dentro de cada especie y la variedad de ecosistemas. Su pérdida reduce la capacidad de adaptación de la vida en la Tierra."
   
   ¿Cuál es la idea principal del texto?',
   '{"A": "Hay muchas especies en la Tierra", "B": "La biodiversidad incluye diversidad genética y de ecosistemas", "C": "La vida se adapta fácilmente", "D": "Las especies están en peligro"}',
   'B',
   'El texto define biodiversidad como un concepto que abarca tres niveles: especies, genes y ecosistemas.',
   'medium', 'official_model', 'Modelo SIMADI 2024 - Comprensión lectora'),

  -- Gramática
  (v_gramatica, v_simadi_id, v_verbal_id,
   'Identifique la oración con concordancia correcta:',
   '{"A": "La mayoría de los estudiantes aprobaron el examen.", "B": "La mayoría de los estudiantes aprobó el examen.", "C": "La mayoría de los estudiantes han aprobado el examen.", "D": "La mayoría de los estudiantes han aprobado el examen."}',
   'A',
   '"La mayoría de" + plural toma verbo en plural: "aprobaron". Es concordancia por atracción.',
   'medium', 'generated_pattern', 'Patrón SIMADI - Concordancia'),

  -- ============================================================
  -- UNIMET - APTITUD CUANTITATIVA (Sample Questions)
  -- ============================================================

  DECLARE
    v_aritmetica UUID;
    v_algebra UUID;
    v_geometria UUID;
    v_estadistica UUID;
    v_razonamiento UUID;
    v_comprension_unimet UUID;
    v_vocabulario_unimet UUID;
    v_gramatica_unimet UUID;
    v_analogias_unimet UUID;
  BEGIN
    -- Get UNIMET subtopic IDs
    SELECT id INTO v_aritmetica FROM subtopics WHERE area_id = v_cuantitativo_id AND code = 'aritmetica';
    SELECT id INTO v_algebra FROM subtopics WHERE area_id = v_cuantitativo_id AND code = 'algebra';
    SELECT id INTO v_geometria FROM subtopics WHERE area_id = v_cuantitativo_id AND code = 'geometria';
    SELECT id INTO v_estadistica FROM subtopics WHERE area_id = v_cuantitativo_id AND code = 'estadistica';
    SELECT id INTO v_razonamiento FROM subtopics WHERE area_id = v_cuantitativo_id AND code = 'razonamiento';

    SELECT id INTO v_comprension_unimet FROM subtopics WHERE area_id = v_verbal_unimet_id AND code = 'comprension';
    SELECT id INTO v_vocabulario_unimet FROM subtopics WHERE area_id = v_verbal_unimet_id AND code = 'vocabulario';
    SELECT id INTO v_gramatica_unimet FROM subtopics WHERE area_id = v_verbal_unimet_id AND code = 'gramatica';
    SELECT id INTO v_analogias_unimet FROM subtopics WHERE area_id = v_verbal_unimet_id AND code = 'analogias';

    -- Aritmética
    INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference) VALUES
    (v_aritmetica, v_unimet_id, v_cuantitativo_id,
     'Si el 30% de un número es 45, ¿cuál es el 70% de ese número?',
     '{"A": "90", "B": "105", "C": "100", "D": "95"}',
     'B',
     'Si 30% = 45, entonces 10% = 15, y 70% = 15 × 7 = 105.',
     'easy', 'official_model', 'Manual UNIMET - Porcentajes'),

    (v_aritmetica, v_unimet_id, v_cuantitativo_id,
     'Un artículo se vende con 20% de descuento y su precio final es $80. ¿Cuál era su precio original?',
     '{"A": "$96", "B": "$100", "C": "$104", "D": "$90"}',
     'B',
     'Si el 80% (100% - 20%) = $80, entonces 100% = $80 / 0.8 = $100.',
     'easy', 'generated_pattern', 'Patrón UNIMET - Descuentos'),

    -- Álgebra
    (v_algebra, v_unimet_id, v_cuantitativo_id,
     'Resuelve para x: 3x - 7 = 2x + 8',
     '{"A": "15", "B": "1", "C": "-1", "D": "5"}',
     'A',
     '3x - 2x = 8 + 7 → x = 15',
     'easy', 'official_model', 'Manual UNIMET - Ecuaciones lineales'),

    (v_algebra, v_unimet_id, v_cuantitativo_id,
     'Si (x + 2)(x - 3) = 0, ¿cuáles son los valores de x?',
     '{"A": "2 y 3", "B": "-2 y 3", "C": "2 y -3", "D": "-2 y -3"}',
     'B',
     'Producto nulo: x + 2 = 0 → x = -2; x - 3 = 0 → x = 3.',
     'easy', 'generated_pattern', 'Patrón UNIMET - Factorización'),

    -- Geometría
    (v_geometria, v_unimet_id, v_cuantitativo_id,
     'El área de un círculo es 64π cm². ¿Cuál es su circunferencia?',
     '{"A": "8π cm", "B": "16π cm", "C": "32π cm", "D": "64π cm"}',
     'B',
     'Área = πr² = 64π → r² = 64 → r = 8. Circunferencia = 2πr = 16π.',
     'medium', 'official_model', 'Manual UNIMET - Geometría'),

    -- Estadística
    (v_estadistica, v_unimet_id, v_cuantitativo_id,
     'Las notas de 5 estudiantes son: 14, 16, 18, 12, 20. ¿Cuál es la media aritmética?',
     '{"A": "15", "B": "16", "C": "17", "D": "18"}',
     'B',
     'Media = (14 + 16 + 18 + 12 + 20) / 5 = 80 / 5 = 16.',
     'easy', 'generated_pattern', 'Patrón UNIMET - Media aritmética'),

    -- ============================================================
    -- UNIMET - APTITUD VERBAL (Sample Questions)
    -- ============================================================

    -- Comprensión Lectora
    (v_comprension_unimet, v_unimet_id, v_verbal_unimet_id,
     'Texto: "La innovación tecnológica no solo transforma la forma en que producimos, sino también cómo nos relacionamos. Cada avance redefine los límites de lo posible."
     
     Según el texto, la innovación tecnológica:',
     '{"A": "Solo afecta la producción", "B": "Transforma producción y relaciones", "C": "Elimina lo imposible", "D": "No cambia la sociedad"}',
     'B',
     'El texto dice explícitamente "no solo transforma la forma en que producimos, sino también cómo nos relacionamos".',
     'easy', 'official_model', 'Manual UNIMET - Comprensión lectora'),

    -- Vocabulario
    (v_vocabulario_unimet, v_unimet_id, v_verbal_unimet_id,
     'Sinónimo de "EPÍTOME":',
     '{"A": "RESUMEN", "B": "OPUESTO", "C": "DETALLE", "D": "EJEMPLO"}',
     'A',
     'Epítome significa resumen, compendio o extracto de lo esencial.',
     'medium', 'generated_pattern', 'Patrón UNIMET - Sinónimos'),

    -- Analogías
    (v_analogias_unimet, v_unimet_id, v_verbal_unimet_id,
     'ARQUITECTO : PLANO :: ESCRITOR : ?',
     '{"A": "LIBRO", "B": "BORRADOR", "C": "PLUMA", "D": "LECTOR"}',
     'B',
     'El arquitecto crea un plano (boceto/plan) antes de la obra final; el escritor crea un borrador antes del libro final.',
     'medium', 'official_model', 'Manual UNIMET - Analogías verbales'),

    -- Gramática
    (v_gramatica_unimet, v_unimet_id, v_verbal_unimet_id,
     'Escoja la oración correctamente redactada:',
     '{"A": "A quien vi ayer era tu hermano.", "B": "A quién vi ayer era tu hermano.", "C": "Vi a quien era tu hermano ayer.", "D": "Vi a quién era tu hermano ayer."}',
     'A',
     'Función de complemento de régimen: "a quien" (pronombre relativo con preposición). "Quién" solo se usa en preguntas directas e indirectas.',
     'medium', 'official_model', 'Manual UNIMET - Gramática y redacción');

  END $$;