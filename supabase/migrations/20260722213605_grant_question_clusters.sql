GRANT ALL ON public.question_clusters TO service_role;
GRANT ALL ON public.question_clusters TO authenticated;
GRANT ALL ON public.question_clusters TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
