/**
 * AUTH USERS SETUP
 * Crea tabla de usuarios públicos vinculada con auth.users
 * Deshabilita requisito de confirmación de email
 */

-- 1. CREAR TABLA PÚBLICA DE USUARIOS
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HABILITAR RLS EN TABLA DE USUARIOS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS RLS PARA USUARIOS
-- Cualquiera puede leer su propio perfil
DROP POLICY IF EXISTS "Users can read their own profile" ON public.users;
CREATE POLICY "Users can read their own profile"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Cualquiera puede actualizar su propio perfil
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. FUNCIÓN Y TRIGGER PARA SINCRONIZAR USUARIOS NUEVOS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name')
  ON CONFLICT (id) DO UPDATE SET
    email = NEW.email,
    name = COALESCE(NEW.raw_user_meta_data->>'name', public.users.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ELIMINAR TRIGGER SI EXISTE
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- CREAR TRIGGER
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. CREAR INDEX PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- 6. HABILITAR REALTIME PARA TABLA DE USUARIOS
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

-- Insertar usuarios existentes si los hay
INSERT INTO public.users (id, email, name)
SELECT id, email, raw_user_meta_data->>'name' as name
FROM auth.users
ON CONFLICT DO NOTHING;

-- 7. CREAR VIEW DE USUARIOS ACTIVOS (OPCIONAL)
CREATE OR REPLACE VIEW public.active_users AS
SELECT 
  u.id,
  u.email,
  u.name,
  u.created_at,
  u.updated_at
FROM public.users u
WHERE u.created_at >= NOW() - INTERVAL '90 days';

-- PERMITIR LECTURA A ANON Y AUTHENTICATED
GRANT SELECT ON public.active_users TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
