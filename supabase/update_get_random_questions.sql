-- Actualizar get_random_questions para soportar filtrado por cluster
-- Ejecutar en Supabase SQL Editor

CREATE OR REPLACE FUNCTION get_random_questions(
  p_university_ids UUID[],
  p_area_ids UUID[],
  p_limit INTEGER,
  p_subtopic_ids UUID[] DEFAULT NULL,
  p_difficulty question_difficulty DEFAULT NULL,
  p_exclude_ids UUID[] DEFAULT '{}',
  p_cluster_codes TEXT[] DEFAULT NULL
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
    AND (
      p_cluster_codes IS NULL 
      OR p_cluster_codes = '{}'::TEXT[]
      OR EXISTS (
        SELECT 1 FROM question_clusters qc
        WHERE qc.question_id = q.id
        AND qc.cluster_code = ANY(p_cluster_codes)
      )
    )
  ORDER BY RANDOM()
  LIMIT p_limit;
END;
$$;