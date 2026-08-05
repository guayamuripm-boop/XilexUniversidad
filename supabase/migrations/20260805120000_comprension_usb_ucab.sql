-- Crear el subtema "Comprensión Lectora" en USB/Habilidades y UCAB/Verbal.
--
-- `add_usb_ucab_areas_subtopics.sql` ya lo declaraba, pero en la base real no
-- existe: solo están `vocabulario` y `analogias` en esas dos áreas. Cargar el
-- lote 10 lo destapó — sus 13 preguntas de comprensión se descartaban en
-- silencio, porque seed_questions.js omite (con aviso) toda fila cuyo subtema
-- no encuentra.
--
-- Comprensión lectora es parte real de ambas pruebas: la USB la incluye en
-- Habilidad Verbal y la UCAB dedica a ella buena parte de su Prueba Verbal.
-- Además /progress mide el dominio por subtema, así que sin la fila esas
-- preguntas no tendrían dónde acumular progreso.

BEGIN;

INSERT INTO subtopics (area_id, code, name, description, difficulty_weight)
SELECT a.id, 'comprension', 'Comprensión Lectora',
       'Idea principal, inferencias, propósito del autor y tono del texto', 1.2
FROM areas a
JOIN universities u ON u.id = a.university_id
WHERE (u.code = 'usb'  AND a.code = 'habilidades')
   OR (u.code = 'ucab' AND a.code = 'verbal')
ON CONFLICT (area_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  difficulty_weight = EXCLUDED.difficulty_weight;

COMMIT;
