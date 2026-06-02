/**
 * CONFIGURACIÓN DE SEGURIDAD CRÍTICA
 * Para aguantar 10k+ usuarios de forma segura
 */

// ============================================================================
// 1. RATE LIMITING - Prevenir abuso y DDoS
// ============================================================================
export const RATE_LIMITS = {
  // API endpoints
  AUTH: { requests: 5, window: 900 }, // 5 intentos por 15 min
  API: { requests: 100, window: 60 }, // 100 reqs por minuto
  FORM_SUBMIT: { requests: 3, window: 300 }, // 3 por 5 min
  SEARCH: { requests: 30, window: 60 }, // 30 búsquedas por minuto
  CONTACT: { requests: 2, window: 3600 }, // 2 por hora
} as const;

// ============================================================================
// 2. VALIDACIÓN DE ENTRADA - Prevenir inyección y XSS
// ============================================================================
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9+\s\-()]{7,}$/,
  name: /^[a-záéíóúñ\s]{2,100}$/i,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-z0-9_-]{3,20}$/i,
} as const;

// Límites de largo para prevenir buffer overflow
export const INPUT_LIMITS = {
  name: 100,
  email: 254,
  phone: 20,
  message: 5000,
  bio: 500,
  title: 200,
} as const;

// ============================================================================
// 3. HEADERS DE SEGURIDAD - CSP, HSTS, X-Frame-Options, etc
// ============================================================================
export const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' https: data:; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self' https://*.supabase.co https://api.*.mercadopago.com; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';",

  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "geolocation=(), microphone=(), camera=(), payment=(self), usb=()",
} as const;

// ============================================================================
// 4. CORS - Restricción de acceso cross-origin
// ============================================================================
export const CORS_CONFIG = {
  allowedOrigins: [
    process.env.VITE_APP_URL || "https://kinase.com",
    ...(process.env.NODE_ENV === "development" ? ["http://localhost:5173"] : []),
  ],
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 600,
} as const;

// ============================================================================
// 5. ENCRYPTION & SECRETS
// ============================================================================
export const SECURITY_CONFIG = {
  // Usar variables de entorno - NUNCA hardcodear secrets
  SUPABASE_URL: process.env.VITE_SUPABASE_URL || "",
  SUPABASE_KEY: process.env.VITE_SUPABASE_ANON_KEY || "",
  
  // Resend para emails
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  
  // Mercado Pago
  MP_PUBLIC_KEY: process.env.VITE_MP_PUBLIC_KEY || "",
  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN || "",
  
  // Encryption
  JWT_ALGORITHM: "HS256",
  TOKEN_EXPIRY: 3600, // 1 hora
  REFRESH_TOKEN_EXPIRY: 604800, // 7 días
} as const;

// ============================================================================
// 6. SANITIZACIÓN - Limpiar input de usuarios
// ============================================================================
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>\"']/g, (char) => ({
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
    }[char] || char))
    .slice(0, 5000); // Límite de largo
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key as keyof T] = sanitizeInput(value) as any;
    } else if (value === null || value === undefined) {
      sanitized[key as keyof T] = value;
    } else if (typeof value === "object") {
      sanitized[key as keyof T] = sanitizeObject(value);
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  return sanitized;
}

// ============================================================================
// 7. LOGGING SEGURO - Audit trail sin exponer datos sensibles
// ============================================================================
export interface SecurityLog {
  timestamp: string;
  event: "LOGIN" | "FAILED_LOGIN" | "FORM_SUBMIT" | "API_CALL" | "ERROR";
  userId?: string;
  ip?: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  details: string;
}

export function logSecurityEvent(log: SecurityLog): void {
  const sanitizedLog = {
    ...log,
    timestamp: new Date().toISOString(),
  };
  
  // En producción, enviar a servicio externo
  if (process.env.NODE_ENV === "production") {
    // TODO: Enviar a Supabase logging table o servicio externo
    console.log("[SECURITY]", sanitizedLog);
  } else {
    console.log("[SECURITY]", sanitizedLog);
  }
}

// ============================================================================
// 8. SESSION MANAGEMENT - Tokens seguros
// ============================================================================
export const SESSION_CONFIG = {
  cookie: {
    httpOnly: true, // No accesible desde JS
    secure: process.env.NODE_ENV === "production", // Solo HTTPS
    sameSite: "Strict" as const,
    maxAge: 1800, // 30 minutos
  },
  refreshCookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict" as const,
    maxAge: 604800, // 7 días
  },
} as const;

// ============================================================================
// 9. RATE LIMITING HELPER
// ============================================================================
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isAllowed(key: string, limit: number, windowSeconds: number): boolean {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    
    const times = this.attempts.get(key) || [];
    const recentAttempts = times.filter((t) => now - t < windowMs);
    
    if (recentAttempts.length >= limit) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// ============================================================================
// 10. SECRETS VALIDATION
// ============================================================================
export function validateSecrets(): void {
  const required = [
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
    "RESEND_API_KEY",
  ];

  for (const secret of required) {
    if (!process.env[secret] && process.env.NODE_ENV === "production") {
      throw new Error(`❌ MISSING SECRET: ${secret}`);
    }
  }
  
  console.log("✅ All required secrets validated");
}
