/**
 * Sanitize user input to prevent XSS attacks
 * Escapes HTML special characters
 */
export function escapeHtml(text: string | undefined): string {
  if (!text) return ''
  
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  
  return String(text).replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char])
}

/**
 * Validate lead email form data
 */
export interface LeadFormData {
  name?: string
  lastname?: string
  email?: string
  phone?: string
  career?: string
  result?: string
  answers?: string
}

export function validateLeadData(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data || typeof data !== 'object') {
    errors.push('Datos inválidos')
    return { valid: false, errors }
  }
  
  const lead = data as LeadFormData
  
  // Validate required fields
  if (!lead.name || lead.name.trim().length === 0) {
    errors.push('El nombre es requerido')
  }
  if (!lead.email || lead.email.trim().length === 0) {
    errors.push('El email es requerido')
  } else if (!isValidEmail(lead.email)) {
    errors.push('El email no es válido')
  }
  
  // Validate string length limits (prevent DoS)
  if (lead.name && lead.name.length > 100) {
    errors.push('El nombre es demasiado largo')
  }
  if (lead.email && lead.email.length > 100) {
    errors.push('El email es demasiado largo')
  }
  if (lead.answers && lead.answers.length > 5000) {
    errors.push('Las respuestas son demasiado largas')
  }
  
  return { valid: errors.length === 0, errors }
}

/**
 * Simple email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
