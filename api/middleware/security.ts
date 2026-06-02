/**
 * API MIDDLEWARE DE SEGURIDAD
 * Validar requests, rate limiting, logging
 */

import { RATE_LIMITS, RateLimiter, logSecurityEvent, SECURITY_HEADERS } from '../../security-config';

const rateLimiter = new RateLimiter();

export interface SecureRequest extends Request {
  userId?: string;
  ip?: string;
}

/**
 * Middleware para validar y asegurar requests
 */
export async function withSecurity(
  handler: (req: SecureRequest) => Promise<Response>
) {
  return async (req: Request): Promise<Response> => {
    try {
      // Obtener IP del cliente
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
      
      // Validar rate limit por IP
      const rateLimitKey = `api_${ip}`;
      if (!rateLimiter.isAllowed(rateLimitKey, RATE_LIMITS.API.requests, RATE_LIMITS.API.window)) {
        logSecurityEvent({
          timestamp: new Date().toISOString(),
          event: "API_CALL",
          ip,
          severity: "WARNING",
          details: `Rate limit exceeded for IP: ${ip}`,
        });
        
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: getSecurityHeaders(),
        });
      }

      // Validar método HTTP
      if (!['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'].includes(req.method)) {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: getSecurityHeaders(),
        });
      }

      // Validar Content-Type si es POST/PUT
      if (['POST', 'PUT'].includes(req.method)) {
        const contentType = req.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          return new Response(JSON.stringify({ error: 'Invalid Content-Type' }), {
            status: 400,
            headers: getSecurityHeaders(),
          });
        }
      }

      // Adjuntar IP al request
      const secureReq = req as SecureRequest;
      secureReq.ip = ip;

      // Validar tamaño de payload
      const contentLength = parseInt(req.headers.get('content-length') || '0');
      if (contentLength > 1024 * 100) { // 100KB máximo
        return new Response(JSON.stringify({ error: 'Payload too large' }), {
          status: 413,
          headers: getSecurityHeaders(),
        });
      }

      // Ejecutar handler
      const response = await handler(secureReq);
      
      // Adjuntar headers de seguridad
      const secureResponse = new Response(response.body, response);
      Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
        secureResponse.headers.set(key, value);
      });
      
      return secureResponse;
    } catch (error) {
      logSecurityEvent({
        timestamp: new Date().toISOString(),
        event: "ERROR",
        severity: "CRITICAL",
        details: `API Error: ${error instanceof Error ? error.message : 'Unknown'}`,
      });

      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: getSecurityHeaders(),
      });
    }
  };
}

/**
 * Retornar headers de seguridad
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  };
}

/**
 * Validar JWT Token
 */
export async function validateToken(authHeader?: string | null): Promise<{ valid: boolean; userId?: string }> {
  if (!authHeader?.startsWith('Bearer ')) {
    return { valid: false };
  }

  try {
    const token = authHeader.slice(7);
    
    // Aquí validarías con JWT library (jsonwebtoken)
    // Por ahora simulamos
    const isValid = token.length > 20; // Validación básica
    
    return { valid: isValid, userId: isValid ? 'user_123' : undefined };
  } catch (error) {
    return { valid: false };
  }
}
