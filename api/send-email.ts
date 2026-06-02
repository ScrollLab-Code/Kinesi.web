/// <reference types="node" />
import { handleSendEmail } from '../src/lib/send-email'
import { RATE_LIMITS, RateLimiter, logSecurityEvent, getSecurityHeaders } from '../security-config'

const rateLimiter = new RateLimiter()

export const config = {
  runtime: 'edge',
}

export default {
  async fetch(req: Request) {
    try {
      // Obtener IP
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
      
      // Validar método HTTP
      if (req.method !== 'POST' && req.method !== 'OPTIONS') {
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          {
            status: 405,
            headers: getSecurityHeaders(),
          }
        )
      }

      // CORS preflight
      if (req.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': process.env.VITE_APP_URL || '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '600',
          },
        })
      }

      // Rate limiting
      const rateLimitKey = `email_${ip}`
      if (!rateLimiter.isAllowed(rateLimitKey, RATE_LIMITS.CONTACT.requests, RATE_LIMITS.CONTACT.window)) {
        logSecurityEvent({
          timestamp: new Date().toISOString(),
          event: 'API_CALL',
          ip,
          severity: 'WARNING',
          details: `Rate limit exceeded for email endpoint from IP: ${ip}`,
        })
        
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again later.' }),
          {
            status: 429,
            headers: getSecurityHeaders(),
          }
        )
      }

      // Validar Content-Type
      const contentType = req.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        return new Response(
          JSON.stringify({ error: 'Invalid Content-Type. Expected application/json' }),
          {
            status: 400,
            headers: getSecurityHeaders(),
          }
        )
      }

      // Validar tamaño del payload
      const contentLength = parseInt(req.headers.get('content-length') || '0')
      if (contentLength > 1024 * 50) { // 50KB máximo
        return new Response(
          JSON.stringify({ error: 'Payload too large' }),
          {
            status: 413,
            headers: getSecurityHeaders(),
          }
        )
      }

      // Procesar email
      const response = await handleSendEmail(req, {
        resendApiKey: process.env.RESEND_API_KEY,
        resendFrom: process.env.RESEND_FROM_EMAIL,
        resendTo: process.env.SEND_TO_EMAIL,
      })

      // Log exitoso
      logSecurityEvent({
        timestamp: new Date().toISOString(),
        event: 'API_CALL',
        ip,
        severity: 'INFO',
        details: `Email sent successfully from IP: ${ip}`,
      })

      return response
    } catch (error) {
      logSecurityEvent({
        timestamp: new Date().toISOString(),
        event: 'ERROR',
        severity: 'CRITICAL',
        details: `Email API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })

      return new Response(
        JSON.stringify({ error: 'Internal Server Error' }),
        {
          status: 500,
          headers: getSecurityHeaders(),
        }
      )
    }
  },
}
