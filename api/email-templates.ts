import { LeadFormData } from './utils'

/**
 * Generate professional HTML email for lead notification
 */
export function generateLeadEmailHtml(lead: LeadFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 24px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 24px;
          }
          .field-group {
            margin-bottom: 16px;
          }
          .field-label {
            font-weight: 600;
            color: #667eea;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .field-value {
            margin-top: 4px;
            color: #333;
            padding: 8px;
            background-color: #f3f4f6;
            border-left: 3px solid #667eea;
            padding-left: 12px;
          }
          .divider {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 24px 0;
          }
          .footer {
            background-color: #f9fafb;
            padding: 16px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Nuevo Lead Recibido</h1>
          </div>
          
          <div class="content">
            <h2 style="color: #667eea; margin-top: 0;">Información Personal</h2>
            
            <div class="field-group">
              <div class="field-label">Nombre</div>
              <div class="field-value">${lead.name || 'No proporcionado'}</div>
            </div>
            
            <div class="field-group">
              <div class="field-label">Apellido</div>
              <div class="field-value">${lead.lastname || 'No proporcionado'}</div>
            </div>
            
            <div class="field-group">
              <div class="field-label">Email</div>
              <div class="field-value"><a href="mailto:${lead.email}">${lead.email || 'No proporcionado'}</a></div>
            </div>
            
            <div class="field-group">
              <div class="field-label">Teléfono</div>
              <div class="field-value">${lead.phone || 'No proporcionado'}</div>
            </div>
            
            <div class="field-group">
              <div class="field-label">Carrera</div>
              <div class="field-value">${lead.career || 'No proporcionado'}</div>
            </div>
            
            <hr class="divider">
            
            <h2 style="color: #667eea;">Diagnóstico</h2>
            
            <div class="field-group">
              <div class="field-label">Resultado</div>
              <div class="field-value">${lead.result || 'No proporcionado'}</div>
            </div>
            
            <div class="field-group">
              <div class="field-label">Respuestas Detalladas</div>
              <div class="field-value">${lead.answers || 'No proporcionado'}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>Este es un email automático de tu plataforma Kinase. No responder directamente.</p>
            <p>Responde al email del lead para ponerte en contacto.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Generate confirmation email for the user who submitted the form
 */
export function generateConfirmationEmailHtml(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 24px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 24px;
          }
          .cta-button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 16px;
            font-weight: 600;
          }
          .footer {
            background-color: #f9fafb;
            padding: 16px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Formulario Recibido</h1>
          </div>
          
          <div class="content">
            <p>Hola <strong>${name}</strong>,</p>
            
            <p>Gracias por completar nuestro formulario de diagnóstico. Hemos recibido tu información correctamente.</p>
            
            <p>Nuestro equipo reviará tus respuestas y se pondrá en contacto contigo pronto con los resultados personalizados.</p>
            
            <p>Si tienes alguna pregunta, no dudes en escribirnos a <strong>contacto@kinase.com</strong></p>
            
            <p>Saludos,<br>El equipo de Kinase</p>
          </div>
          
          <div class="footer">
            <p>Este es un email automático. Por favor no responder a este correo.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
