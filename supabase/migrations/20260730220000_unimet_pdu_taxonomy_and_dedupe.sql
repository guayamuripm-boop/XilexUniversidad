-- UNIMET / PDU: completar la taxonomía oficial y desactivar preguntas duplicadas.
--
-- Contexto. El manual oficial de la Prueba Diagnóstica de Ubicación describe la
-- Aptitud Cuantitativa como razonamientos "algorítmico, estadístico,
-- proporcional, figurativo, de seriación, estimación, equivalencias
-- matemáticas, interpretación de gráficos y tablas, lógico [y] espacial". La
-- base ya tenía subtemas vacíos para casi todos, pero faltaban cuatro
-- categorías que el banco no cubría en absoluto.
--
-- Además, 28 preguntas de UNIMET son copias exactas de otra (mismo enunciado y
-- mismas cuatro opciones, distinto id). Como el sorteo de preguntas trabaja por
-- id, un mismo simulacro podía mostrar la misma pregunta hasta seis veces.
--
-- Idempotente: puede ejecutarse más de una vez sin efectos adicionales.

BEGIN;

-- ── 1. Subtemas que faltaban en unimet/cuantitativo ────────────────────────
INSERT INTO subtopics (area_id, code, name, description, difficulty_weight)
SELECT a.id, v.code, v.name, v.description, v.weight
FROM areas a
JOIN universities u ON u.id = a.university_id
CROSS JOIN (VALUES
  ('estadistica_y_probabilidad', 'Estadística y Probabilidad',
   'Promedios simples y ponderados, mediana, moda y probabilidad elemental', 1.1),
  ('razonamiento_logico_conjuntos', 'Razonamiento Lógico y Conjuntos',
   'Silogismos, diagramas de conjuntos, condicionales y negación de cuantificadores', 1.2),
  ('geometria_y_medicion', 'Geometría y Medición',
   'Perímetros, áreas, volúmenes, semejanza y conversión de unidades', 1.1),
  ('funciones_y_variacion', 'Funciones y Variación',
   'Proporcionalidad directa e inversa, crecimiento lineal y exponencial, lectura de funciones', 1.2)
) AS v(code, name, description, weight)
WHERE u.code = 'unimet' AND a.code = 'cuantitativo'
ON CONFLICT (area_id, code) DO NOTHING;

-- ── 2. Subtemas huérfanos sin preguntas ────────────────────────────────────
-- Dos generaciones de seeds dejaron pares como comprension_de_textos /
-- comprension_textos. Solo se borran los que no tienen ninguna pregunta
-- asociada, de modo que nunca se pierde contenido.
DELETE FROM subtopics s
USING areas a, universities u
WHERE s.area_id = a.id
  AND a.university_id = u.id
  AND u.code = 'unimet'
  AND s.code IN ('comprension_textos', 'ortografia_puntuacion')
  AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.subtopic_id = s.id);

-- ── 3. Desactivar preguntas duplicadas de UNIMET ───────────────────────────
-- Se conserva la más antigua de cada grupo (por created_at, desempatando por
-- id) y se desactivan las demás. No se borran: si alguna aparece en un
-- simulacro ya respondido, la respuesta del usuario debe seguir siendo legible.
WITH ranked AS (
  SELECT q.id,
         ROW_NUMBER() OVER (
           PARTITION BY q.statement, q.options, q.correct_answer
           ORDER BY q.created_at, q.id
         ) AS rn
  FROM questions q
  JOIN universities u ON u.id = q.university_id
  WHERE u.code = 'unimet' AND q.is_active
)
UPDATE questions q
SET is_active = false,
    updated_at = NOW()
FROM ranked r
WHERE q.id = r.id AND r.rn > 1;

COMMIT;
