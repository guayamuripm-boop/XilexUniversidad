-- ============================================================
-- XILEX - FIX: Trigger sincronización auth.users → public.users
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Función que crea perfil público al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, target_universities)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    '{}'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$;

-- 2. Trigger en auth.users (se ejecuta tras INSERT)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Crear perfiles para usuarios existentes que no tengan fila en public.users
INSERT INTO public.users (id, email, full_name, target_universities)
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name',
  '{}'
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL;

-- 4. Verificar
SELECT 'Usuarios en auth:' AS info, COUNT(*) FROM auth.users
UNION ALL
SELECT 'Usuarios en public.users:', COUNT(*) FROM public.users;