-- Cuadrar la estructura de las áreas de la UNIMET con el manual oficial.
--
-- La tabla `areas` guardaba 45 preguntas y 60 minutos para ambas áreas, cifras
-- que no salen de ninguna fuente. El Manual de Información General de la PDU es
-- explícito: cada prueba tiene cincuenta (50) planteamientos, y el aspirante
-- dispone de setenta y cinco (75) minutos para la cuantitativa y sesenta (60)
-- para la verbal.
--
-- Estos valores no los consumía ninguna pantalla todavía (la estructura estaba
-- además duplicada en el cliente), pero dejarlos mal invita a que la próxima
-- funcionalidad los lea y repita el error.

BEGIN;

UPDATE areas a
SET question_count = 50,
    time_limit_minutes = 75,
    updated_at = NOW()
FROM universities u
WHERE u.id = a.university_id
  AND u.code = 'unimet'
  AND a.code = 'cuantitativo';

UPDATE areas a
SET question_count = 50,
    time_limit_minutes = 60,
    updated_at = NOW()
FROM universities u
WHERE u.id = a.university_id
  AND u.code = 'unimet'
  AND a.code = 'verbal';

COMMIT;
