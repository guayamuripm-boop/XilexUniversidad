-- ============================================================
-- XILEX - FIX GRANTS (ejecutar después del schema + seed)
-- El SQL Editor corre como postgres (superuser) y funciona,
-- pero la API (roles anon/authenticated/service_role) necesita GRANTS.
-- ============================================================

-- Grants para lectura pública (tablas de referencia)
GRANT SELECT ON public.universities TO anon, authenticated;
GRANT SELECT ON public.areas TO anon, authenticated;
GRANT SELECT ON public.subtopics TO anon, authenticated;
GRANT SELECT ON public.questions TO anon, authenticated;
GRANT SELECT ON public.simad_clusters TO anon, authenticated;

-- Grants completos para tablas de usuario (RLS protege las filas)
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.simulacrums TO anon, authenticated;
GRANT ALL ON public.simulacrum_questions TO anon, authenticated;
GRANT ALL ON public.user_progress TO anon, authenticated;

-- service_role necesita todo
GRANT ALL ON public.universities TO service_role;
GRANT ALL ON public.areas TO service_role;
GRANT ALL ON public.subtopics TO service_role;
GRANT ALL ON public.questions TO service_role;
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.simulacrums TO service_role;
GRANT ALL ON public.simulacrum_questions TO service_role;
GRANT ALL ON public.user_progress TO service_role;
GRANT ALL ON public.simad_clusters TO service_role;

-- Permitir secuencias (por si acaso)
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Permitir ejecutar funciones (RPC)
GRANT EXECUTE ON FUNCTION public.get_random_questions(UUID[], UUID[], INTEGER, UUID[], question_difficulty, UUID[]) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.calculate_simulacrum_score(UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_user_progress(UUID, UUID, BOOLEAN, INTEGER) TO anon, authenticated, service_role;

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM public.questions;
  RAISE NOTICE 'Total preguntas en banco: %', v_count;
END $$;
