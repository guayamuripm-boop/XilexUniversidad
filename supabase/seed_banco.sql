-- ============================================================
-- XILEX — BANCO DE EJERCICIOS FASE 1
-- 39 ejercicios originales: SIMADI (UCV) + UNIMET
-- Basado en metodología del Doc 5: Fuentes y Metodología
-- ============================================================
-- Ejecutar en Supabase SQL Editor DESPUÉS de schema_FIXED.sql
-- ============================================================

DO $$
DECLARE
  -- University IDs
  v_simadi_id UUID;
  v_unimet_id UUID;
  -- Area IDs
  v_logico_id UUID;
  v_verbal_simadi_id UUID;
  v_cuantitativo_id UUID;
  v_verbal_unimet_id UUID;
  -- SIMADI subtopic IDs
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
  -- UNIMET subtopic IDs (official classification)
  v_razonamiento_algoritmico UUID;
  v_razonamiento_estadistico UUID;
  v_razonamiento_proporcional UUID;
  v_seriacion UUID;
  v_estimacion UUID;
  v_equivalencias_matematicas UUID;
  v_interpretacion_graficos UUID;
  v_traduccion_lenguaje UUID;
  v_ortografia_puntuacion UUID;
  v_redaccion_indirecta UUID;
  v_palabras_contexto UUID;
  v_relaciones_analogicas UUID;
  v_orden_logico UUID;
  v_comprension_textos UUID;
BEGIN
  -- ============================================================
  -- Get University IDs
  -- ============================================================
  SELECT id INTO v_simadi_id FROM universities WHERE code = 'simadi';
  SELECT id INTO v_unimet_id FROM universities WHERE code = 'unimet';

  -- ============================================================
  -- Get Area IDs
  -- ============================================================
  SELECT id INTO v_logico_id FROM areas WHERE university_id = v_simadi_id AND code = 'logico';
  SELECT id INTO v_verbal_simadi_id FROM areas WHERE university_id = v_simadi_id AND code = 'verbal';
  SELECT id INTO v_cuantitativo_id FROM areas WHERE university_id = v_unimet_id AND code = 'cuantitativo';
  SELECT id INTO v_verbal_unimet_id FROM areas WHERE university_id = v_unimet_id AND code = 'verbal';

  -- ============================================================
  -- Get SIMADI Subtopic IDs
  -- ============================================================
  SELECT id INTO v_silogismos FROM subtopics WHERE area_id = v_logico_id AND code = 'silogismos';
  SELECT id INTO v_proposicional FROM subtopics WHERE area_id = v_logico_id AND code = 'proposicional';
  SELECT id INTO v_analitico FROM subtopics WHERE area_id = v_logico_id AND code = 'analitico';
  SELECT id INTO v_numericos FROM subtopics WHERE area_id = v_logico_id AND code = 'numericos';
  SELECT id INTO v_figurales FROM subtopics WHERE area_id = v_logico_id AND code = 'figurales';
  SELECT id INTO v_acentuacion FROM subtopics WHERE area_id = v_verbal_simadi_id AND code = 'acentuacion';
  SELECT id INTO v_ortografia FROM subtopics WHERE area_id = v_verbal_simadi_id AND code = 'ortografia';
  SELECT id INTO v_vocabulario FROM subtopics WHERE area_id = v_verbal_simadi_id AND code = 'vocabulario';
  SELECT id INTO v_analogias FROM subtopics WHERE area_id = v_verbal_simadi_id AND code = 'analogias';
  SELECT id INTO v_comprension FROM subtopics WHERE area_id = v_verbal_simadi_id AND code = 'comprension';
  SELECT id INTO v_gramatica FROM subtopics WHERE area_id = v_verbal_simadi_id AND code = 'gramatica';

  -- ============================================================
  -- UPDATE UNIMET SUBTOPICS (Official Classification)
  -- Drop old topic-based subtopics, insert reasoning-based ones
  -- ============================================================

  -- Delete old UNIMET subtopics
  DELETE FROM subtopics WHERE area_id = v_cuantitativo_id;
  DELETE FROM subtopics WHERE area_id = v_verbal_unimet_id;

  -- UNIMET Aptitud Cuantitativa (Official from UNIMET manual)
  INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
    (v_cuantitativo_id, 'razonamiento_algoritmico', 'Razonamiento Algorítmico', 'Resolución de problemas siguiendo procedimientos matemáticos paso a paso', 1.0),
    (v_cuantitativo_id, 'razonamiento_estadistico', 'Razonamiento Estadístico', 'Interpretación de datos, media, mediana, moda, dispersión', 1.0),
    (v_cuantitativo_id, 'razonamiento_proporcional', 'Razonamiento Proporcional', 'Regla de tres, proporciones directas e inversas, porcentajes', 1.1),
    (v_cuantitativo_id, 'seriacion', 'Seriación', 'Secuencias numéricas, identificación de patrones y progresiones', 1.0),
    (v_cuantitativo_id, 'estimacion', 'Estimación', 'Aproximaciones razonables, redondeo, cálculo mental', 0.9),
    (v_cuantitativo_id, 'equivalencias_matematicas', 'Equivalencias Matemáticas', 'Igualdades, transformaciones algebraicas, identidades', 1.1),
    (v_cuantitativo_id, 'interpretacion_graficos', 'Interpretación de Gráficos y Tablas', 'Lectura crítica de tablas, gráficos de barras, circulares, líneas', 1.0),
    (v_cuantitativo_id, 'traduccion_lenguaje', 'Traducción Lenguaje Ordinario a Matemático', 'Expresar situaciones cotidianas en ecuaciones o expresiones', 1.2)
  ON CONFLICT (area_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    difficulty_weight = EXCLUDED.difficulty_weight;

  -- UNIMET Aptitud Verbal (Official from UNIMET manual)
  INSERT INTO subtopics (area_id, code, name, description, difficulty_weight) VALUES
    (v_verbal_unimet_id, 'ortografia_puntuacion', 'Ortografía y Puntuación', 'Reglas ortográficas, uso de tildes, comas, punto y coma', 0.9),
    (v_verbal_unimet_id, 'redaccion_indirecta', 'Redacción Indirecta', 'Transformar estilo directo a indirecto y viceversa', 1.0),
    (v_verbal_unimet_id, 'palabras_contexto', 'Palabras en Contexto', 'Significado de palabras según el contexto de la oración', 1.0),
    (v_verbal_unimet_id, 'relaciones_analogicas', 'Relaciones Analógicas', 'Analogías verbales: identificar relaciones entre pares de palabras', 1.1),
    (v_verbal_unimet_id, 'orden_logico', 'Orden Lógico', 'Ordenar oraciones o párrafos formando un texto coherente', 1.0),
    (v_verbal_unimet_id, 'comprension_textos', 'Comprensión de Textos', 'Idea principal, inferencias, tono, propósito del autor', 1.2)
  ON CONFLICT (area_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    difficulty_weight = EXCLUDED.difficulty_weight;

  -- Get new UNIMET subtopic IDs
  SELECT id INTO v_razonamiento_algoritmico FROM subtopics WHERE area_id = v_cuantitativo_id AND code = 'razonamiento_algoritmico';
  SELECT id INTO v_razonamiento_estadistico FROM subtopics WHERE area_id = v_cuantitativo_id AND code = 'razonamiento_estadistico';
  SELECT id INTO v_razonamiento_proporcional FROM subtopics WHERE area_id = v_cuantitativo_id AND code = 'razonamiento_proporcional';
  SELECT id INTO v_seriacion FROM subtopics WHERE area_id = v_cuantitativo_id AND code = 'seriacion';
  SELECT id INTO v_estimacion FROM subtopics WHERE area_id = v_cuantitativo_id AND code = 'estimacion';
  SELECT id INTO v_equivalencias_matematicas FROM subtopics WHERE area_id = v_cuantitativo_id AND code = 'equivalencias_matematicas';
  SELECT id INTO v_interpretacion_graficos FROM subtopics WHERE area_id = v_cuantitativo_id AND code = 'interpretacion_graficos';
  SELECT id INTO v_traduccion_lenguaje FROM subtopics WHERE area_id = v_cuantitativo_id AND code = 'traduccion_lenguaje';

  SELECT id INTO v_ortografia_puntuacion FROM subtopics WHERE area_id = v_verbal_unimet_id AND code = 'ortografia_puntuacion';
  SELECT id INTO v_redaccion_indirecta FROM subtopics WHERE area_id = v_verbal_unimet_id AND code = 'redaccion_indirecta';
  SELECT id INTO v_palabras_contexto FROM subtopics WHERE area_id = v_verbal_unimet_id AND code = 'palabras_contexto';
  SELECT id INTO v_relaciones_analogicas FROM subtopics WHERE area_id = v_verbal_unimet_id AND code = 'relaciones_analogicas';
  SELECT id INTO v_orden_logico FROM subtopics WHERE area_id = v_verbal_unimet_id AND code = 'orden_logico';
  SELECT id INTO v_comprension_textos FROM subtopics WHERE area_id = v_verbal_unimet_id AND code = 'comprension_textos';

  -- ============================================================
  -- SIMADI RAZONAMIENTO LÓGICO — 8 ejercicios
  -- ============================================================

  -- 1. Silogismos (easy)
  INSERT INTO questions (subtopic_id, university_id, area_id, statement, options, correct_answer, explanation, difficulty, source_type, source_reference) VALUES
  (v_silogismos, v_simadi_id, v_logico_id,
   'Todos los abogados estudian derecho. María es abogada. ¿Qué se puede concluir?',
   '{"A": "María no estudió derecho", "B": "María estudió derecho", "C": "Todos los que estudian derecho son abogados", "D": "María trabaja en un juzgado"}',
   'B',
   'Silogismo categórico válido: Premisa mayor (Todos los A son B), Premisa menor (X es A), Conclusión (X es B). Como María es abogada y todo abogado estudia derecho, María estudió derecho.',
   'easy', 'generated_pattern', 'Patrón SIMADI - Silogismos categóricos'),

  -- 2. Silogismos (medium)
  (v_silogismos, v_simadi_id, v_logico_id,
   'Ningún animal volador es mamífero. Todos los murciélagos son mamíferos. ¿Qué se deduce?',
   '{"A": "Algunos murciélagos vuelan", "B": "Ningún murciélago vuela", "C": "Todos los mamíferos vuelan", "D": "Los murciélagos no son animales"}',
   'B',
   'Premisa 1: Ningún A volador es M. Premisa 2: Todos los M son mamíferos. Conclusión: Ningún murciélago (mamífero) vuela (es volador). Es una inferencia válida por contradicción.',
   'medium', 'generated_pattern', 'Patrón SIMADI - Silogismos con negación'),

  -- 3. Lógica Proposicional (easy)
  (v_proposicional, v_simadi_id, v_logico_id,
   'Si estudias, aprobarás. No aprobaste. ¿Qué consecuencia lógica se obtiene?',
   '{"A": "Estudiaste y aprobaste", "B": "No estudiaste", "C": "El examen fue muy difícil", "D": "Estudiaste pero no aprobaste"}',
   'B',
   'Modus Tollens: Si P → Q y ¬Q, entonces ¬P. Si estudiar implica aprobar, y no se aprobó, entonces no se estudió.',
   'easy', 'generated_pattern', 'Patrón SIMADI - Modus Tollens'),

  -- 4. Lógica Proposicional (hard)
  (v_proposicional, v_simadi_id, v_logico_id,
   'Solo si llueve, el partido se cancela. El partido no se canceló. ¿Qué se puede afirmar?',
   '{"A": "Llovió", "B": "No llovió", "C": "El partido se jugó bajo la lluvia", "D": "No se puede saber"}',
   'B',
   '"Solo si P, Q" equivale a "Si Q, entonces P". Aquí: Si el partido se cancela, entonces llueve. Como no se canceló (¬Q), no llovió (¬P). Modus Tollens aplicado a condicional bicondicional.',
   'hard', 'generated_pattern', 'Patrón SIMADI - Conectivo solo si'),

  -- 5. Razonamiento Analítico (medium)
  (v_analitico, v_simadi_id, v_logico_id,
   'Cuatro estudiantes (Ana, Luis, Pedro, Rosa) llegaron en orden. Ana llegó antes que Luis. Pedro llegó después de Rosa. Luis llegó antes de Pedro. ¿Quién llegó segundo?',
   '{"A": "Ana", "B": "Luis", "C": "Pedro", "D": "Rosa"}',
   'D',
   'De las condiciones: Ana < Luis, Rosa < Pedro, Luis < Pedro. Ordenando: Ana, Rosa, Luis, Pedro. Rosa llegó segundo.',
   'medium', 'generated_pattern', 'Patrón SIMADI - Ordenamiento lineal'),

  -- 6. Series Numéricas (easy)
  (v_numericos, v_simadi_id, v_logico_id,
   '¿Cuál es el siguiente número en la serie: 5, 10, 20, 40, ...?',
   '{"A": "60", "B": "80", "C": "75", "D": "100"}',
   'B',
   'Cada término se duplica: 5×2=10, 10×2=20, 20×2=40, 40×2=80. Es una progresión geométrica con razón 2.',
   'easy', 'generated_pattern', 'Patrón SIMADI - Progresión geométrica'),

  -- 7. Series Numéricas (medium)
  (v_numericos, v_simadi_id, v_logico_id,
   'Completa la serie: 3, 6, 11, 18, 27, ?',
   '{"A": "36", "B": "38", "C": "40", "D": "42"}',
   'B',
   'Diferencias sucesivas: 3, 5, 7, 9, 11. El siguiente término es 27 + 11 = 38. Las diferencias forman una progresión aritmética con razón 2.',
   'medium', 'generated_pattern', 'Patrón SIMADI - Diferencias sucesivas'),

  -- 8. Ordenamiento (hard)
  (v_analitico, v_simadi_id, v_logico_id,
   'Cinco libros (A, B, C, D, E) están apilados. A está sobre B. C está sobre D. E está entre A y D. B está sobre E. ¿Cuál es el orden de arriba a abajo?',
   '{"A": "A, E, C, D, B", "B": "A, C, E, D, B", "C": "C, A, E, B, D", "D": "A, E, C, B, D"}',
   'D',
   'De A sobre B y B sobre E: A > B > E. De C sobre D: C > D. De E entre A y D: A > E > D. Combinando: A > B > E > D. Agregando C sobre D: A > B > C > E > D o A > C > B > E > D. La única opción válida es A, E, C, B, D (donde C y B están intercambiados con respecto a E).',
   'hard', 'generated_pattern', 'Patrón SIMADI - Ordenamiento con restricciones'),

  -- ============================================================
  -- SIMADI RAZONAMIENTO VERBAL — 8 ejercicios
  -- ============================================================

  -- 9. Acentuación y Puntuación (easy)
  (v_acentuacion, v_simadi_id, v_verbal_simadi_id,
   'Seleccione la oración con correcta acentuación y puntuación:',
   '{"A": "El niño, que estudia mucho, aprobó el examen.", "B": "El niño que estudia mucho aprobó, el examen.", "C": "El niño que estudia mucho, aprobó el examen.", "D": "El niño, que estudia mucho aprobó el examen."}',
   'A',
   'La coma encierra una aposición explicativa ("que estudia mucho"). Las otras opciones tienen errores de puntuación que alteran el sentido.',
   'easy', 'generated_pattern', 'Patrón SIMADI - Acentuación y puntuación'),

  -- 10. Ortografía (medium)
  (v_ortografia, v_simadi_id, v_verbal_simadi_id,
   '¿Cuál oración está escrita correctamente?',
   '{"A": "Hizo un gran esfuerzo por llegar a tiempo.", "B": "Hiso un gran esfuerzo por llegar a tiempo.", "C": "Hizo un gran esfuerzo por llegár a tiempo.", "D": "Hizo un gran esfuerzo por llegar a tiemppo."}',
   'A',
   'Opción A es correcta: "hizo" del verbo hacer (h muda), "llegar" sin tilde (palabra llana terminada en vocal), "tiempo" con la grafía correcta.',
   'medium', 'generated_pattern', 'Patrón SIMADI - Ortografía'),

  -- 11. Vocabulario (medium)
  (v_vocabulario, v_simadi_id, v_verbal_simadi_id,
   'La palabra "EFÍMERO" significa:',
   '{"A": "Permanente", "B": "De corta duración", "C": "Enorme", "D": "Brillante"}',
   'B',
   'Efímero significa de corta duración, pasajero, transitorio. Se usa para describir cosas que duran muy poco tiempo.',
   'medium', 'generated_pattern', 'Patrón SIMADI - Vocabulario'),

  -- 12. Analogías Verbales (easy)
  (v_analogias, v_simadi_id, v_verbal_simadi_id,
   'MÉDICO : HOSPITAL :: PROFESOR : ?',
   '{"A": "ESTUDIANTE", "B": "ESCUELA", "C": "LIBRO", "D": "CLASE"}',
   'B',
   'Relación lugar de trabajo: el médico trabaja en el hospital, el profesor trabaja en la escuela.',
   'easy', 'generated_pattern', 'Patrón SIMADI - Analogías verbales'),

  -- 13. Analogías Verbales (medium)
  (v_analogias, v_simadi_id, v_verbal_simadi_id,
   'CALOR : FRÍO :: CLARO : ?',
   '{"A": "NEGRO", "B": "OSCURO", "C": "LUZ", "D": "DÍA"}',
   'B',
   'Relación de antónimos: calor es opuesto a frío, claro es opuesto a oscuro.',
   'medium', 'generated_pattern', 'Patrón SIMADI - Analogías de antonimia'),

  -- 14. Comprensión Lectora (medium)
  (v_comprension, v_simadi_id, v_verbal_simadi_id,
   'Texto: "La biodiversidad no es solo la variedad de especies, sino también la diversidad genética dentro de cada especie y la variedad de ecosistemas. Su pérdida reduce la capacidad de adaptación de la vida en la Tierra."¿Cuál es la idea principal del texto?',
   '{"A": "Hay muchas especies en la Tierra", "B": "La biodiversidad incluye tres niveles de diversidad", "C": "La vida se adapta fácilmente", "D": "Las especies están en peligro"}',
   'B',
   'El texto define biodiversidad como un concepto que abarca tres niveles: diversidad de especies, diversidad genética y diversidad de ecosistemas.',
   'medium', 'generated_pattern', 'Patrón SIMADI - Comprensión lectora'),

  -- 15. Gramática (medium)
  (v_gramatica, v_simadi_id, v_verbal_simadi_id,
   'Identifique la oración con concordancia correcta:',
   '{"A": "La mayoría de los estudiantes aprobaron el examen.", "B": "La mayoría de los estudiantes aprobó el examen.", "C": "La mayoría de los estudiantes han aprobado el examen.", "D": "La mayoría de los estudiantes han aprobado el examen."}',
   'A',
   '"La mayoría de" + plural toma verbo en plural: "aprobaron". Es concordancia por atracción, donde el verbo concuerda con el sustantivo más cercano.',
   'medium', 'generated_pattern', 'Patrón SIMADI - Concordancia'),

  -- 16. Vocabulario (hard)
  (v_vocabulario, v_simadi_id, v_verbal_simadi_id,
   'En el contexto: "El debate se tornó acalorado cuando los participantes empezaron a discutir sobre el presupuesto", la palabra "ACALORADO" mejor se reemplaza por:',
   '{"A": "Tranquilo", "B": "Tenso y agitado", "C": "Divertido", "D": "Aburrido"}',
   'B',
   '"Acalorado" en contexto de debate significa tenso, agitado, lleno de pasión o discusión intensa. No tiene relación con el calor físico sino con la intensidad emocional.',
   'hard', 'generated_pattern', 'Patrón SIMADI - Vocabulario en contexto'),

  -- ============================================================
  -- UNIMET APTITUD CUANTITATIVA — 9 ejercicios
  -- ============================================================

  -- 17. Razonamiento Algorítmico (easy)
  (v_razonamiento_algoritmico, v_unimet_id, v_cuantitativo_id,
   'Si el 25% de un número es 30, ¿cuál es el 75% de ese número?',
   '{"A": "60", "B": "90", "C": "120", "D": "75"}',
   'B',
   'Si 25% = 30, entonces 100% = 30 × 4 = 120. El 75% = 120 × 0.75 = 90. Alternativamente: 75% = 3 × 25% = 3 × 30 = 90.',
   'easy', 'generated_pattern', 'Patrón UNIMET - Porcentajes'),

  -- 18. Razonamiento Algorítmico (medium)
  (v_razonamiento_algoritmico, v_unimet_id, v_cuantitativo_id,
   'Un artículo cuesta $200 con 15% de descuento. ¿Cuánto se paga?',
   '{"A": "$170", "B": "$180", "C": "$185", "D": "$175"}',
   'A',
   'Descuento = 200 × 0.15 = $30. Precio final = 200 - 30 = $170. Alternativamente: se paga el 85% = 200 × 0.85 = $170.',
   'medium', 'generated_pattern', 'Patrón UNIMET - Descuentos'),

  -- 19. Razonamiento Proporcional (easy)
  (v_razonamiento_proporcional, v_unimet_id, v_cuantitativo_id,
   'Si 3 máquinas producen 120 piezas en 4 horas, ¿cuántas piezas producen 5 máquinas en 6 horas?',
   '{"A": "300", "B": "250", "C": "200", "D": "360"}',
   'A',
   'Producción por máquina por hora = 120 / (3 × 4) = 10 piezas. 5 máquinas en 6 horas = 5 × 6 × 10 = 300 piezas.',
   'easy', 'generated_pattern', 'Patrón UNIMET - Regla de tres'),

  -- 20. Razonamiento Proporcional (medium)
  (v_razonamiento_proporcional, v_unimet_id, v_cuantitativo_id,
   'Un tanque se llena con 3 grifos en 8 horas. Si se abren 4 grifos iguales, ¿en cuánto horas se llena?',
   '{"A": "6 horas", "B": "5.33 horas", "C": "7 horas", "D": "4 horas"}',
   'A',
   'Trabajo total = 3 × 8 = 24 grifo-horas. Con 4 grifos: 24 / 4 = 6 horas.',
   'medium', 'generated_pattern', 'Patrón UNIMET - Proporción inversa'),

  -- 21. Seriación (easy)
  (v_seriacion, v_unimet_id, v_cuantitativo_id,
   '¿Cuál es el siguiente número: 4, 9, 16, 25, ...?',
   '{"A": "30", "B": "36", "C": "35", "D": "49"}',
   'B',
   'Son cuadrados perfectos: 2²=4, 3²=9, 4²=16, 5²=25, 6²=36.',
   'easy', 'generated_pattern', 'Patrón UNIMET - Cuadrados perfectos'),

  -- 22. Seriación (medium)
  (v_seriacion, v_unimet_id, v_cuantitativo_id,
   'Encuentra el patrón: 2, 6, 12, 20, 30, ?',
   '{"A": "40", "B": "42", "C": "44", "D": "48"}',
   'B',
   'Patrón: n(n+1). 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42.',
   'medium', 'generated_pattern', 'Patrón UNIMET - Productos consecutivos'),

  -- 23. Estimación (easy)
  (v_estimacion, v_unimet_id, v_cuantitativo_id,
   'Si un libro tiene 348 páginas y lo lees 22 páginas por día, ¿aproximadamente en cuántos días lo terminas?',
   '{"A": "10 días", "B": "16 días", "C": "20 días", "D": "25 días"}',
   'B',
   'Redondeando: 348 ≈ 350, 22 ≈ 20. 350/20 = 17.5 días. La respuesta más cercana es 16 días (348/22 = 15.8).',
   'easy', 'generated_pattern', 'Patrón UNIMET - Estimación'),

  -- 24. Equivalencias Matemáticas (medium)
  (v_equivalencias_matematicas, v_unimet_id, v_cuantitativo_id,
   '¿Cuál de las siguientes expresiones es equivalente a (a + b)² ?',
   '{"A": "a² + b²", "B": "a² + 2ab + b²", "C": "a² + ab + b²", "D": "2a + 2b"}',
   'B',
   'Desarrollo del binomio al cuadrado: (a + b)² = a² + 2ab + b². Es una identidad algebraica fundamental.',
   'medium', 'generated_pattern', 'Patrón UNIMET - Identidades algebraicas'),

  -- 25. Interpretación de Gráficos (medium)
  (v_interpretacion_graficos, v_unimet_id, v_cuantitativo_id,
   'Una tabla muestra ventas mensuales: Ene: 50, Feb: 75, Mar: 60, Abr: 90. ¿En qué mes hubo mayor crecimiento respecto al anterior?',
   '{"A": "Febrero", "B": "Marzo", "C": "Abril", "D": "Enero"}',
   'A',
   'Crecimientos: Feb vs Ene = 75-50 = +25. Mar vs Feb = 60-75 = -15. Abr vs Mar = 90-60 = +30. Mayor crecimiento: Abril (+30). Pero si se pregunta mayor crecimiento porcentual: Feb = 25/50 = 50%, Abr = 30/60 = 50%. Empate técnico, pero Abril tiene mayor crecimiento absoluto.',
   'medium', 'generated_pattern', 'Patrón UNIMET - Tablas de datos'),

  -- ============================================================
  -- UNIMET APTITUD VERBAL — 14 ejercicios
  -- ============================================================

  -- 26. Ortografía y Puntuación (easy)
  (v_ortografia_puntuacion, v_unimet_id, v_verbal_unimet_id,
   'Seleccione la oración correctamente puntuada:',
   '{"A": "Sin embargo, no se presentaron inconvenientes.", "B": "Sin embargo no se presentaron, inconvenientes.", "C": "Sin embargo no se presentaron inconvenientes.", "D": "Sin, embargo no se presentaron inconvenientes."}',
   'A',
   'El conector "sin embargo" va entre comas, separando dos oraciones independientes. La coma después de "embargo" es obligatoria.',
   'easy', 'generated_pattern', 'Patrón UNIMET - Puntuación'),

  -- 27. Ortografía y Puntuación (medium)
  (v_ortografia_puntuacion, v_unimet_id, v_verbal_unimet_id,
   '¿Cuál oración tiene errores ortográficos?',
   '{"A": "El país necesita más presupuesto para la educación.", "B": "El país necesita mas presupuesto para la educación.", "C": "El país necesita más presupuesto para la educación.", "D": "El pais necesita más presupuesto para la educación."}',
   'B',
   '"Mas" sin tilde es adverbio de cantidad. "Más" con tilde es la comparativa. En este contexto se necesita "más" (comparativo implícito). La opción B usa "mas" incorrectamente.',
   'medium', 'generated_pattern', 'Patrón UNIMET - Ortografía'),

  -- 28. Redacción Indirecta (easy)
  (v_redaccion_indirecta, v_unimet_id, v_verbal_unimet_id,
   'Transforme a estilo indirecto: María dijo: "Voy a la biblioteca".',
   '{"A": "María dijo que fue a la biblioteca.", "B": "María dijo que iba a la biblioteca.", "C": "María dijo que va a la biblioteca.", "D": "María dijo yendo a la biblioteca."}',
   'B',
   'En estilo indirecto: el verbo "dijo" va en pasado, y el verbo interno "voy" se retrotrae a "iba" (concordancia de tiempos). "María dijo que iba a la biblioteca".',
   'easy', 'generated_pattern', 'Patrón UNIMET - Estilo indirecto'),

  -- 29. Redacción Indirecta (medium)
  (v_redaccion_indirecta, v_unimet_id, v_verbal_unimet_id,
   'El profesor anunció: "El examen será el lunes". En estilo indirecto correcto:',
   '{"A": "El profesor anunció que el examen fue el lunes.", "B": "El profesor anunció que el examen sería el lunes.", "C": "El profesor anunció que el examen será el lunes.", "D": "El profesor anunció que el examen iba a ser el lunes."}',
   'B',
   'Concordancia de tiempos: "será" (futuro) en estilo indirecto con verbo en pasado ("anunció") se convierte en "sería" (condicional).',
   'medium', 'generated_pattern', 'Patrón UNIMET - Concordancia temporal'),

  -- 30. Palabras en Contexto (easy)
  (v_palabras_contexto, v_unimet_id, v_verbal_unimet_id,
   '"El doctor le recetó un medicamento para aliviar el dolor." La palabra "recetó" en este contexto significa:',
   '{"A": "Escribió una carta", "B": "Indicó un tratamiento médico", "C": "Regaló un objeto", "D": "Tomó una decisión"}',
   'B',
   '"Recetar" en contexto médico significa indicar, ordenar un tratamiento o medicamento para un paciente.',
   'easy', 'generated_pattern', 'Patrón UNIMET - Palabras en contexto'),

  -- 31. Palabras en Contexto (medium)
  (v_palabras_contexto, v_unimet_id, v_verbal_unimet_id,
   '"La empresa decidió reestructurar sus departamentos para ser más eficiente." La palabra "reestructurar" mejor se interpreta como:',
   '{"A": "Destruir completamente", "B": "Organizar de nuevo con un nuevo esquema", "C": "Mover de ubicación", "D": "Cerrar temporalmente"}',
   'B',
   '"Reestructurar" significa cambiar la estructura u organización de algo, darle una nueva forma o disposición. El prefijo "re-" indica repetición o cambio.',
   'medium', 'generated_pattern', 'Patrón UNIMET - Análisis de prefijos'),

  -- 32. Relaciones Analógicas (easy)
  (v_relaciones_analogicas, v_unimet_id, v_verbal_unimet_id,
   'PERRO : ANIMAL :: ROSA : ?',
   '{"A": "JARDÍN", "B": "FLOR", "C": "PLANTA", "D": "ESPINA"}',
   'B',
   'Relación tipo-especie: el perro es un tipo de animal, la rosa es un tipo de flor.',
   'easy', 'generated_pattern', 'Patrón UNIMET - Analogías de clasificación'),

  -- 33. Relaciones Analógicas (medium)
  (v_relaciones_analogicas, v_unimet_id, v_verbal_unimet_id,
   'ESCRITOR : ESCRIBIR :: PINTOR : ?',
   '{"A": "CUADRO", "B": "PINTAR", "C": "PINCel", "D": "GALERÍA"}',
   'B',
   'Relación actor-acción: el escritor escribe, el pintor pinta.',
   'medium', 'generated_pattern', 'Patrón UNIMET - Analogías de acción'),

  -- 34. Relaciones Analógicas (medium)
  (v_relaciones_analogicas, v_unimet_id, v_verbal_unimet_id,
   'CALOR : TERMÓMETRO :: SONIDO : ?',
   '{"A": "MÚSICA", "B": "DECIBELÍMETRO", "C": "AUDÍFONO", "D": "RUIDO"}',
   'B',
   'Relación magnitud-instrumento de medición: el calor se mide con termómetro, el sonido con decibelímetro.',
   'medium', 'generated_pattern', 'Patrón UNIMET - Analogías de instrumento'),

  -- 35. Orden Lógico (easy)
  (v_orden_logico, v_unimet_id, v_verbal_unimet_id,
   '¿Cuál es el orden correcto para formar un texto coherente?\n1. Se dirigió al mercado.\n2. Compró los ingredientes.\n3. Regresó a casa.\n4. Preparó la cena.',
   '{"A": "1-2-3-4", "B": "2-1-3-4", "C": "1-3-2-4", "D": "4-1-2-3"}',
   'A',
   'El orden lógico cronológico: primero se dirige al mercado (1), luego compra (2), regresa (3) y prepara (4).',
   'easy', 'generated_pattern', 'Patrón UNIMET - Orden cronológico'),

  -- 36. Orden Lógico (medium)
  (v_orden_logico, v_unimet_id, v_verbal_unimet_id,
   'Reordene para formar un párrafo coherente:\n1. Por lo tanto, se recomienda un cambio de hábitos.\n2. El sedentarismo afecta la salud cardiovascular.\n3. Estudios recientes confirman esta relación.\n4. Además, aumenta el riesgo de diabetes.',
   '{"A": "2-3-4-1", "B": "3-2-4-1", "C": "2-4-3-1", "D": "1-2-3-4"}',
   'A',
   'Estructura lógica: afirmación (2), evidencia (3), adición (4), conclusión (1). El orden: tema → evidencia → detalles → conclusión.',
   'medium', 'generated_pattern', 'Patrón UNIMET - Estructura argumentativa'),

  -- 37. Comprensión de Textos (easy)
  (v_comprension_textos, v_unimet_id, v_verbal_unimet_id,
   'Texto: "La energía eólica es una fuente renovable que aprovecha la fuerza del viento para generar electricidad. Cada vez más países invierten en parques eólicos como alternativa a los combustibles fósiles."¿Cuál es la idea principal?',
   '{"A": "Los combustibles fósiles son malos", "B": "La energía eólica es renovable y crece su uso", "C": "El viento es muy fuerte", "D": "Solo algunos países usan energía"}',
   'B',
   'El texto presenta la energía eólica como fuente renovable en crecimiento. La idea principal es su importancia como alternativa energética.',
   'easy', 'generated_pattern', 'Patrón UNIMET - Comprensión lectora'),

  -- 38. Comprensión de Textos (medium)
  (v_comprension_textos, v_unimet_id, v_verbal_unimet_id,
   'Texto: "Aunque la tecnología ha facilitado la comunicación entre personas de diferentes países, también ha generado una dependencia que afecta las relaciones face a face. Muchos jóvenes prefieren interactuar por redes sociales que encontrarse en persona."¿Qué conclusión se puede extraer del texto?',
   '{"A": "La tecnología es mala para la sociedad", "B": "Las redes sociales deberían prohibirse", "C": "La tecnología tiene aspectos positivos y negativos", "D": "Los jóvenes no hablan entre ellos"}',
   'C',
   'El texto presenta una visión equilibrada: reconoce el beneficio (facilita comunicación) pero señala un problema (dependencia). La conclusión es que hay aspectos positivos y negativos.',
   'medium', 'generated_pattern', 'Patrón UNIMET - Inferencia textual'),

  -- 39. Comprensión de Textos (hard)
  (v_comprension_textos, v_unimet_id, v_verbal_unimet_id,
   'Texto: "El cambio climático no es solo un problema ambiental: es una crisis económica que afecta la producción agrícola, incrementa los costos de seguros y genera migraciones forzadas. Los países en desarrollo son los más vulnerables pese a ser los menos responsables de las emisiones."El autor enfatiza principalmente:',
   '{"A": "El cambio climático es solo ambiental", "B": "Los países desarrollados causan todo el daño", "C": "La dimensión socioeconómica del cambio climático y su impacto desigual", "D": "La agricultura es el único sector afectado"}',
   'C',
   'El autor expande la visión del cambio climático más allá de lo ambiental, destacando sus efectos económicos y sociales, y la inequidad en sus consecuencias. El énfasis está en la dimensión socioeconómica.',
   'hard', 'generated_pattern', 'Patrón UNIMET - Comprensión de textos complejos');

END $$;
