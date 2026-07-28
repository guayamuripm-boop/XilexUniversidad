-- ============================================================
-- XILEX — Corrección de funciones RPC y trigger de perfiles
-- Ejecutar en el SQL Editor de Supabase (idempotente).
-- ============================================================
--
-- Arregla tres cosas que impedían que la app funcionara:
--
-- 1. get_random_questions: la definición original en schema.sql declara
--    `p_limit INTEGER` (sin DEFAULT) después de parámetros que sí tienen
--    DEFAULT. PostgreSQL rechaza esa firma, así que la función nunca se creó
--    a partir de ese archivo. Además la app la llama con p_cluster_codes.
--
-- 2. get_user_streak: la página /progress la invoca, pero no existía en
--    ninguna migración. La racha siempre se mostraba en 0.
--
-- 3. handle_new_user: no copiaba target_universities desde los metadatos del
--    registro, así que las universidades elegidas en el paso 2 del alta se
--    perdían cuando la confirmación por email está activada.
-- ============================================================


-- ------------------------------------------------------------
-- 1. get_random_questions (con filtro por cluster)
-- ------------------------------------------------------------
-- Se eliminan las firmas anteriores para que no queden sobrecargas
-- ambiguas que hagan fallar la llamada por PostgREST.
DROP FUNCTION IF EXISTS get_random_questions(UUID[], UUID[], UUID[], question_difficulty, UUID[], INTEGER);
DROP FUNCTION IF EXISTS get_random_questions(UUID[], UUID[], INTEGER, UUID[], question_difficulty, UUID[]);
DROP FUNCTION IF EXISTS get_random_questions(UUID[], UUID[], INTEGER, UUID[], question_difficulty, UUID[], TEXT[]);

CREATE FUNCTION get_random_questions(
  p_university_ids UUID[],
  p_area_ids       UUID[],
  p_limit          INTEGER,
  p_subtopic_ids   UUID[]              DEFAULT NULL,
  p_difficulty     question_difficulty DEFAULT NULL,
  p_exclude_ids    UUID[]              DEFAULT '{}',
  p_cluster_codes  TEXT[]              DEFAULT NULL
)
RETURNS SETOF questions
LANGUAGE sql
STABLE
AS $$
  SELECT q.*
  FROM questions q
  WHERE q.university_id = ANY(p_university_ids)
    AND q.area_id = ANY(p_area_ids)
    AND q.is_active = true
    AND (p_exclude_ids IS NULL OR q.id <> ALL(p_exclude_ids))
    AND (p_subtopic_ids IS NULL OR q.subtopic_id = ANY(p_subtopic_ids))
    AND (p_difficulty IS NULL OR q.difficulty = p_difficulty)
    AND (
      -- Sin cluster indicado no se filtra. Con cluster, la pregunta debe estar
      -- enlazada a alguno de ellos. (Una versión previa combinaba EXISTS con
      -- NOT EXISTS sobre la misma tabla, condición imposible: devolvía 0 filas
      -- siempre que se pasaba un cluster.)
      p_cluster_codes IS NULL
      OR cardinality(p_cluster_codes) = 0
      OR EXISTS (
        SELECT 1 FROM question_clusters qc
        WHERE qc.question_id = q.id
          AND qc.cluster_code = ANY(p_cluster_codes)
      )
    )
  ORDER BY RANDOM()
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION get_random_questions(UUID[], UUID[], INTEGER, UUID[], question_difficulty, UUID[], TEXT[])
  TO anon, authenticated, service_role;


-- ------------------------------------------------------------
-- 2. get_user_streak
-- ------------------------------------------------------------
-- Días consecutivos (hasta hoy o hasta ayer) con al menos un simulacro
-- completado, más la racha más larga histórica.
CREATE OR REPLACE FUNCTION get_user_streak(p_user_id UUID)
RETURNS TABLE (
  current_streak     INTEGER,
  longest_streak     INTEGER,
  last_activity_date DATE
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
AS $$
DECLARE
  v_current    INTEGER := 0;
  v_longest    INTEGER := 0;
  v_run        INTEGER := 0;
  v_last       DATE;
  v_prev       DATE;
  -- Deja de extender la racha actual en cuanto aparece el primer hueco; sin
  -- esto, una racha larga y antigua se contaría como si fuera la de hoy.
  v_in_current BOOLEAN := false;
  r            RECORD;
BEGIN
  FOR r IN
    SELECT DISTINCT (completed_at AT TIME ZONE 'UTC')::DATE AS d
    FROM simulacrums
    WHERE user_id = p_user_id
      AND status = 'completed'
      AND completed_at IS NOT NULL
    ORDER BY d DESC
  LOOP
    IF v_last IS NULL THEN
      v_last := r.d;
      v_run  := 1;
      -- La racha actual solo cuenta si la última actividad fue hoy o ayer.
      IF r.d >= CURRENT_DATE - 1 THEN
        v_current    := 1;
        v_in_current := true;
      END IF;
    ELSIF r.d = v_prev - 1 THEN
      v_run := v_run + 1;
      IF v_in_current THEN
        v_current := v_run;
      END IF;
    ELSE
      v_in_current := false;
      IF v_run > v_longest THEN
        v_longest := v_run;
      END IF;
      v_run := 1;
    END IF;
    v_prev := r.d;
  END LOOP;

  IF v_run > v_longest THEN
    v_longest := v_run;
  END IF;

  RETURN QUERY SELECT v_current, v_longest, v_last;
END;
$$;

GRANT EXECUTE ON FUNCTION get_user_streak(UUID) TO authenticated, service_role;


-- ------------------------------------------------------------
-- 3. handle_new_user — conservar las universidades objetivo
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, target_universities)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(
      ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'target_universities')),
      '{}'::TEXT[]
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    email      = EXCLUDED.email,
    full_name  = COALESCE(EXCLUDED.full_name, public.users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ------------------------------------------------------------
-- 4. Índice de apoyo para get_user_streak y el dashboard
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_simulacrums_user_completed
  ON simulacrums(user_id, completed_at DESC)
  WHERE status = 'completed';
