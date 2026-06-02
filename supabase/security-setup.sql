/**
 * CONFIGURACIÓN SUPABASE CON ROW-LEVEL SECURITY (RLS)
 * SQL para ejecutar en la consola de Supabase
 * 
 * IMPORTANTE: Ejecutar en orden para crear estructura segura
 */

-- ============================================================================
-- 1. HABILITAR EXTENSIONES
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgjwt";

-- ============================================================================
-- 2. CREAR TABLA DE USUARIOS (si no existe)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(254) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(50) DEFAULT 'user' -- 'user', 'mentor', 'admin'
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- ============================================================================
-- 3. CREAR TABLA DE PARTICULARES CON SEGURIDAD
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.particulares (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  especialidad VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(254),
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Índices para performance
CREATE INDEX idx_particulares_user_id ON public.particulares(user_id);
CREATE INDEX idx_particulares_especialidad ON public.particulares(especialidad);
CREATE INDEX idx_particulares_is_active ON public.particulares(is_active);

-- ============================================================================
-- 4. CREAR TABLA DE CONTACTOS CON LIMITACIÓN
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

-- Límite de registros
CREATE INDEX idx_contacts_email_created ON public.contacts(email, created_at);

-- ============================================================================
-- 5. TABLA DE AUDIT LOG (Seguridad)
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
-- 6. TABLA DE RATE LIMITING
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
-- 7. HABILITAR RLS (ROW-LEVEL SECURITY) EN PARTICULARES
-- ============================================================================
ALTER TABLE public.particulares ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios solo ven particulares activos
CREATE POLICY "Usuarios ven particulares activos"
  ON public.particulares FOR SELECT
  USING (is_active = TRUE);

-- Política: Particulares solo editan su propio perfil
CREATE POLICY "Particulares editan su perfil"
  ON public.particulares FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Política: Particulares insertan su propio registro
CREATE POLICY "Particulares crean su perfil"
  ON public.particulares FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 8. HABILITAR RLS EN USERS
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios solo ven su propio registro
CREATE POLICY "Usuarios ven su propio perfil"
  ON public.users FOR SELECT
  USING (id = auth.uid());

-- Política: Usuarios editan su propio registro
CREATE POLICY "Usuarios editan su perfil"
  ON public.users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================================================
-- 9. HABILITAR RLS EN CONTACTS
-- ============================================================================
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Política: Solo admins pueden ver contactos
CREATE POLICY "Solo admins ven contactos"
  ON public.contacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Política: Cualquiera puede insertar
CREATE POLICY "Todos pueden enviar contacto"
  ON public.contacts FOR INSERT
  WITH CHECK (TRUE);

-- ============================================================================
-- 10. FUNCIÓN PARA AUDITAR CAMBIOS
-- ============================================================================
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

-- Activar auditoría en particulares
CREATE TRIGGER audit_particulares
  AFTER INSERT OR UPDATE OR DELETE ON public.particulares
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- ============================================================================
-- 11. FUNCIÓN PARA RATE LIMITING
-- ============================================================================
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
  -- Limpiar intentos antiguos
  DELETE FROM public.rate_limits
  WHERE window_start < NOW() - (p_window_seconds || ' seconds')::INTERVAL;

  -- Contar intentos en la ventana actual
  SELECT COUNT(*) INTO v_count
  FROM public.rate_limits
  WHERE ip_address = p_ip_address
    AND endpoint = p_endpoint
    AND window_start > NOW() - (p_window_seconds || ' seconds')::INTERVAL;

  -- Registrar nuevo intento
  INSERT INTO public.rate_limits (ip_address, endpoint, attempt_count, window_start)
  VALUES (p_ip_address, p_endpoint, 1, NOW())
  ON CONFLICT (ip_address, endpoint, window_start) DO UPDATE
  SET attempt_count = attempt_count + 1;

  -- Retornar si está dentro del límite
  RETURN v_count < p_max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 12. FUNCIÓN PARA AUTO-ACTUALIZAR UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a particulares
CREATE TRIGGER update_particulares_updated_at
  BEFORE UPDATE ON public.particulares
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Aplicar trigger a users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 13. BACKUPS AUTOMÁTICOS (Ya configurado en Supabase, pero documentar)
-- ============================================================================
-- Supabase automáticamente hace backup diario
-- Panel de Control > Database > Backups > Automated backups (habilitado)

-- ============================================================================
-- 14. GRANTS RESTRICTIVOS
-- ============================================================================
-- Revocar permisos públicos
REVOKE ALL ON public.users FROM PUBLIC;
REVOKE ALL ON public.particulares FROM PUBLIC;
REVOKE ALL ON public.contacts FROM PUBLIC;
REVOKE ALL ON public.audit_logs FROM PUBLIC;

-- Solo authenticated users pueden acceder (controlado por RLS)
GRANT SELECT ON public.particulares TO authenticated;
GRANT INSERT, UPDATE ON public.particulares TO authenticated;
GRANT SELECT, INSERT ON public.contacts TO authenticated;
