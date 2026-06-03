/**
 * SETUP COMPLETO PARA SUPABASE - KINASE ACADEMY
 * Ejecutar en orden en: https://supabase.com/dashboard > SQL Editor
 * 
 * IMPORTANTE: Ejecutar una sección a la vez para detectar errores
 */

-- ============================================================================
-- PARTE 1: EXTENSIONES
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgjwt";

-- ============================================================================
-- PARTE 2: TABLA DE USUARIOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(254) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(50) DEFAULT 'user'
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- ============================================================================
-- PARTE 3: TABLA DE LEADS (Para los formularios)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id bigint generated always as identity primary key,
  name text not null,
  lastname text not null,
  email text not null,
  phone text not null,
  career text not null,
  result text,
  answers text,
  created_at timestamptz not null default now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;
CREATE POLICY "Anyone can create leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================================================
-- PARTE 4: TABLA DE POSTS DE COMUNIDAD
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.community_posts (
  id bigint generated always as identity primary key,
  title text not null,
  body text not null,
  tag text not null default 'Recursos',
  author text not null default 'Nuevo estudiante',
  votes integer not null default 1,
  comments integer not null default 0,
  created_at timestamptz not null default now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read community posts" ON public.community_posts;
CREATE POLICY "Anyone can read community posts"
ON public.community_posts
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can create community posts" ON public.community_posts;
CREATE POLICY "Anyone can create community posts"
ON public.community_posts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update community votes" ON public.community_posts;
CREATE POLICY "Anyone can update community votes"
ON public.community_posts
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Insertar datos de ejemplo
INSERT INTO public.community_posts (title, body, tag, author, votes, comments)
SELECT *
FROM (
  VALUES
    (
      'No llego con Anatomia, como priorizo?',
      'Tengo parcial en 8 dias y estoy entre locomotor y neuro. Busco orden para no estudiar todo al mismo nivel.',
      'Medicina',
      'SofiMed',
      42,
      18
    ),
    (
      'Plantilla para preparar finales orales',
      'Comparto una estructura que me sirvio: mapa de bolillas, preguntas frecuentes y practica con timer.',
      'Recursos',
      'Fran',
      31,
      9
    ),
    (
      'Como estudiar matematica sin copiar ejercicios?',
      'Me sale mirar la resolucion y siento que entiendo, pero despues no puedo resolver solo.',
      'Ingenieria',
      'Lautaro',
      27,
      14
    )
) as seed(title, body, tag, author, votes, comments)
WHERE NOT EXISTS (
  SELECT 1 FROM public.community_posts
);

-- ============================================================================
-- PARTE 5: TABLA DE TESTIMONIOS (NUEVA - Para los usuarios)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id bigint generated always as identity primary key,
  name text not null,
  career text not null,
  text text not null,
  created_at timestamptz not null default now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read testimonials" ON public.testimonials;
CREATE POLICY "Anyone can read testimonials"
ON public.testimonials
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can create testimonials" ON public.testimonials;
CREATE POLICY "Anyone can create testimonials"
ON public.testimonials
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================================================
-- PARTE 6: TABLA DE PARTICULARES (Tutores)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.particulares (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  especialidad VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(254),
  ciudad VARCHAR(100),
  modalidad VARCHAR(100),
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_particulares_user_id ON public.particulares(id);
CREATE INDEX idx_particulares_especialidad ON public.particulares(especialidad);
CREATE INDEX idx_particulares_is_active ON public.particulares(is_active);

ALTER TABLE public.particulares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios ven particulares activos" ON public.particulares;
CREATE POLICY "Usuarios ven particulares activos"
ON public.particulares FOR SELECT
USING (is_active = TRUE);

DROP POLICY IF EXISTS "Particulares editan su perfil" ON public.particulares;
CREATE POLICY "Particulares editan su perfil"
ON public.particulares FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Particulares crean su perfil" ON public.particulares;
CREATE POLICY "Particulares crean su perfil"
ON public.particulares FOR INSERT
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Anon puede ver particulares" ON public.particulares;
CREATE POLICY "Anon puede ver particulares"
ON public.particulares FOR SELECT
TO anon
USING (is_active = TRUE);

DROP POLICY IF EXISTS "Anon puede insertar particulares" ON public.particulares;
CREATE POLICY "Anon puede insertar particulares"
ON public.particulares FOR INSERT
TO anon
WITH CHECK (true);

-- ============================================================================
-- PARTE 7: TABLA DE CONTACTOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  user_agent TEXT,
  processed BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_contacts_email_created ON public.contacts(email, created_at);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Solo admins ven contactos" ON public.contacts;
CREATE POLICY "Solo admins ven contactos"
ON public.contacts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Todos pueden enviar contacto" ON public.contacts;
CREATE POLICY "Todos pueden enviar contacto"
ON public.contacts FOR INSERT
WITH CHECK (TRUE);

-- ============================================================================
-- PARTE 8: TABLA DE AUDIT LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50),
  record_id BIGINT,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- ============================================================================
-- PARTE 9: TABLA DE RATE LIMITING
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id BIGSERIAL PRIMARY KEY,
  ip_address INET NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  attempt_count INT DEFAULT 1,
  window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(ip_address, endpoint, window_start)
);

CREATE INDEX idx_rate_limits_ip ON public.rate_limits(ip_address);

-- ============================================================================
-- PARTE 10: FUNCIONES Y TRIGGERS
-- ============================================================================

-- Función para auditar cambios
CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data, new_data)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    to_jsonb(OLD),
    to_jsonb(NEW)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger de auditoría en particulares
DROP TRIGGER IF EXISTS audit_particulares ON public.particulares;
CREATE TRIGGER audit_particulares
  AFTER INSERT OR UPDATE OR DELETE ON public.particulares
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- Función para auto-actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para particulares
DROP TRIGGER IF EXISTS update_particulares_updated_at ON public.particulares;
CREATE TRIGGER update_particulares_updated_at
  BEFORE UPDATE ON public.particulares
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para users
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Función para rate limiting
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_ip_address INET,
  p_endpoint VARCHAR,
  p_max_requests INT DEFAULT 100,
  p_window_seconds INT DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INT;
BEGIN
  DELETE FROM public.rate_limits
  WHERE window_start < NOW() - (p_window_seconds || ' seconds')::INTERVAL;

  SELECT COUNT(*) INTO v_count
  FROM public.rate_limits
  WHERE ip_address = p_ip_address
    AND endpoint = p_endpoint
    AND window_start > NOW() - (p_window_seconds || ' seconds')::INTERVAL;

  INSERT INTO public.rate_limits (ip_address, endpoint, attempt_count, window_start)
  VALUES (p_ip_address, p_endpoint, 1, NOW())
  ON CONFLICT (ip_address, endpoint, window_start) DO UPDATE
  SET attempt_count = attempt_count + 1;

  RETURN v_count < p_max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PARTE 11: PERMISOS FINALES
-- ============================================================================
REVOKE ALL ON public.users FROM PUBLIC;
REVOKE ALL ON public.audit_logs FROM PUBLIC;

GRANT SELECT ON public.particulares TO authenticated;
GRANT INSERT, UPDATE ON public.particulares TO authenticated;
GRANT SELECT, INSERT ON public.contacts TO authenticated;
GRANT SELECT, INSERT ON public.testimonials TO authenticated;
GRANT SELECT, INSERT ON public.leads TO authenticated;
GRANT SELECT ON public.community_posts TO authenticated;
GRANT INSERT, UPDATE ON public.community_posts TO authenticated;
