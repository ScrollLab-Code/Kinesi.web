# Email API Documentation

## Overview

The email API handles sending notifications for form submissions using Resend email service. It includes:
- Lead notification emails sent to admin
- Confirmation emails sent to users
- Input validation and HTML sanitization
- Professional email templates with inline styles

## Setup

### Environment Variables

Add these to your `.env.local` file (or deploy as environment variables):

```
RESEND_API_KEY=your_resend_api_key_here
RESEND_CONTACT_EMAIL=your-business-email@example.com
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### Getting a Resend API Key

1. Go to [Resend.com](https://resend.com)
2. Create an account and verify your domain
3. Generate an API key from the dashboard
4. Copy the API key to your environment variables

**Important**: The `RESEND_FROM_EMAIL` must be a verified domain in your Resend account. The default `onboarding@resend.dev` is for testing only.

## API Endpoint

**URL**: `https://your-domain/api/send-email`
**Method**: `POST`
**Content-Type**: `application/json`

## Request Body

```json
{
  "name": "Juan",
  "lastname": "Pérez",
  "email": "juan@example.com",
  "phone": "+54 9 11 2345 6789",
  "career": "Ingeniería en Sistemas",
  "result": "Resultado del diagnóstico",
  "answers": "Detalles de las respuestas del formulario"
}
```

### Field Validation

- **name** (required): Max 100 characters
- **email** (required): Must be a valid email format
- **lastname**: Max 100 characters
- **phone**: Max 100 characters
- **career**: Max 100 characters
- **result**: Max 5000 characters
- **answers**: Max 5000 characters

## Response

### Success (200)

```json
{
  "success": true,
  "message": "Formulario enviado correctamente. Te enviaremos un email de confirmación.",
  "data": {
    "adminEmail": { "id": "email_id_1" },
    "confirmationEmail": { "id": "email_id_2" }
  }
}
```

### Error (400, 405, 500)

```json
{
  "error": "Description of the error",
  "details": "Additional error information (if applicable)"
}
```

## Security Features

1. **Input Validation**: All fields are validated for type and length
2. **HTML Sanitization**: User input is escaped to prevent XSS attacks
3. **CSRF Protection**: Consider implementing CSRF tokens for form submission
4. **Rate Limiting**: Consider implementing rate limiting to prevent spam
5. **Email Reply-To**: Admin emails include reply-to header for easy response

## Email Templates

### Admin Notification Email
- Professional styled email with user information
- Organized fields for clear readability
- Reply-To header set to user's email

### User Confirmation Email
- Personalized greeting
- Confirmation of submission
- Expected next steps
- No-reply footer

## Frontend Integration Example

```typescript
async function submitDiagnosticForm(formData: LeadFormData) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('Email sent successfully:', result)
      // Show success message to user
    } else {
      console.error('Failed to send email:', result.error)
      // Show error message to user
    }
  } catch (error) {
    console.error('Request error:', error)
  }
}
```

## Troubleshooting

### "Error de configuración del servidor"
- Check that `RESEND_API_KEY` is set
- Check that `RESEND_CONTACT_EMAIL` is set

### "Resend rechazo el email"
- Verify the `RESEND_FROM_EMAIL` is a verified domain
- Check that the recipient email is valid
- Check your Resend account status and quotas

### "Datos inválidos"
- Validate all required fields are present
- Check field lengths don't exceed limits
- Verify email format is correct

## Future Improvements

- [ ] Add rate limiting to prevent spam
- [ ] Implement CSRF token validation
- [ ] Add email templating system for customization
- [ ] Implement email scheduling/queue
- [ ] Add webhook for email delivery status tracking
- [ ] Support multiple recipient emails
