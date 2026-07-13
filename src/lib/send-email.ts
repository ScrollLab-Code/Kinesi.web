import { Resend } from 'resend'

export type SendEmailOptions = {
  resendApiKey?: string
  resendFrom?: string
  resendTo?: string
}

type LeadPayload = {
  name: string
  lastname: string
  email: string
  phone: string
  career: string
  result?: string
  answers?: string
}

type TestimonialPayload = {
  name: string
  career: string
  testimonial: string
  email?: string
  phone?: string
}

type BookingPayload = {
  type: 'booking'
  name: string
  lastname: string
  email: string
  phone: string
  subject: string
  dateTime: string
}

const defaultResendFrom = 'onboarding@resend.dev'
const defaultResendTo = 'Giacomassi.nqn@gmail.com'

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const toCleanString = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

const parseLeadPayload = (body: unknown): LeadPayload | null => {
  if (!body || typeof body !== 'object') return null

  const record = body as Record<string, unknown>
  const name = toCleanString(record.name)
  const lastname = toCleanString(record.lastname)
  const email = toCleanString(record.email)
  const phone = toCleanString(record.phone)
  const career = toCleanString(record.career)

  if (!name || !lastname || !email || !phone || !career) return null

  return {
    name,
    lastname,
    email,
    phone,
    career,
    result: toCleanString(record.result) || undefined,
    answers: toCleanString(record.answers) || undefined,
  }
}

const parseTestimonialPayload = (body: unknown): TestimonialPayload | null => {
  if (!body || typeof body !== 'object') return null

  const record = body as Record<string, unknown>
  const name = toCleanString(record.name)
  const career = toCleanString(record.career)
  const testimonial = toCleanString(record.testimonial)
  const email = toCleanString(record.email) || undefined
  const phone = toCleanString(record.phone) || undefined

  if (!name || !career || !testimonial) return null

  return {
    name,
    career,
    testimonial,
    email,
    phone,
  }
}

const parseBookingPayload = (body: unknown): BookingPayload | null => {
  if (!body || typeof body !== 'object') return null

  const record = body as Record<string, unknown>
  if (record.type !== 'booking') return null

  const name = toCleanString(record.name)
  const lastname = toCleanString(record.lastname)
  const email = toCleanString(record.email)
  const phone = toCleanString(record.phone)
  const subject = toCleanString(record.subject)
  const dateTime = toCleanString(record.dateTime)

  if (!name || !lastname || !email || !phone || !subject || !dateTime) return null

  return {
    type: 'booking',
    name,
    lastname,
    email,
    phone,
    subject,
    dateTime
  }
}

const buildEmailText = (lead: LeadPayload) => {
  return [
    'Nuevo lead',
    '',
    `Nombre: ${lead.name}`,
    `Apellido: ${lead.lastname}`,
    `Email: ${lead.email}`,
    `Telefono: ${lead.phone}`,
    `Carrera: ${lead.career}`,
    '',
    `Resultado: ${lead.result ?? '-'}`,
    '',
    'Respuestas:',
    lead.answers ?? '-',
  ].join('\n')
}

const buildTestimonialText = (testimonial: TestimonialPayload) => {
  return [
    'Nuevo testimonio recibido',
    '',
    `Nombre: ${testimonial.name}`,
    `Carrera: ${testimonial.career}`,
    `Email: ${testimonial.email ?? '-'}`,
    `Telefono: ${testimonial.phone ?? '-'}`,
    '',
    'Testimonio:',
    testimonial.testimonial,
  ].join('\n')
}

const buildBookingText = (booking: BookingPayload) => {
  return [
    `Hola ${booking.name} ${booking.lastname},`,
    '',
    '¡Tu solicitud de Acompañamiento en Kinase Academy ha sido registrada con éxito!',
    '',
    'Para que tu tutor asignado pueda preparar la sesión de forma personalizada y darte la mejor ayuda posible, por favor completa el Test de Rendimiento Académico (Semáforo) dentro de nuestra plataforma antes de la fecha de tu encuentro.',
    '',
    'Solo te tomará 2 minutos y nos brindará información clave sobre tus hábitos de estudio y estilo de vida.',
    '',
    'Detalles de tu solicitud:',
    `- Tema/Materia: ${booking.subject}`,
    `- Día y Horario: ${booking.dateTime}`,
    '',
    '¡Nos vemos pronto en la academia!',
    'El equipo de Kinase Academy.'
  ].join('\n')
}

const readJsonBody = async (req: Request) => {
  try {
    return await req.json()
  } catch {
    return null
  }
}

export const handleSendEmail = async (
  req: Request,
  options: SendEmailOptions
): Promise<Response> => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Metodo no permitido' }, { status: 405 })
  }

  const resendApiKey = toCleanString(options.resendApiKey)
  const resendFrom = toCleanString(options.resendFrom) || defaultResendFrom
  const resendTo = toCleanString(options.resendTo) || defaultResendTo

  if (!resendApiKey) {
    return Response.json(
      { error: 'Falta RESEND_API_KEY en variables de entorno' },
      { status: 500 }
    )
  }

  if (!isValidEmail(resendFrom)) {
    return Response.json(
      {
        error: 'Email remitente inválido',
        details: `El remitente "${resendFrom}" no es válido. Configura RESEND_FROM_EMAIL correctamente.`,
      },
      { status: 500 }
    )
  }

  if (!isValidEmail(resendTo)) {
    return Response.json(
      {
        error: 'Email destinatario inválido',
        details: `El destinatario "${resendTo}" no es válido. Configura SEND_TO_EMAIL correctamente.`,
      },
      { status: 500 }
    )
  }

  const payload = await readJsonBody(req)
  const lead = parseLeadPayload(payload)
  const testimonial = parseTestimonialPayload(payload)
  const booking = parseBookingPayload(payload)

  if (!lead && !testimonial && !booking) {
    return Response.json(
      { error: 'Faltan datos del formulario para enviar el email.' },
      { status: 400 }
    )
  }

  let emailText = ''
  let subject = ''
  let targetRecipient = resendTo

  if (lead) {
    emailText = buildEmailText(lead)
    subject = 'Nuevo diagnostico recibido'
  } else if (testimonial) {
    emailText = buildTestimonialText(testimonial)
    subject = 'Nuevo testimonio recibido'
  } else if (booking) {
    emailText = buildBookingText(booking)
    subject = '📋 Completa tu Test Académico antes de tu Acompañamiento - Kinase Academy'
    
    if (resendFrom !== 'onboarding@resend.dev' && isValidEmail(booking.email)) {
      targetRecipient = booking.email
    }
  }

  try {
    const resend = new Resend(resendApiKey)

    const data = await resend.emails.send({
      from: resendFrom,
      to: targetRecipient,
      subject,
      text: emailText,
    })

    return Response.json({
      success: true,
      data,
    })
  } catch (error) {
    const details =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null
          ? JSON.stringify(error)
          : String(error)

    return Response.json(
      {
        error:
          'Resend rechazó el email. Revisá remitente, destinatario o dominio.',
        details,
        from: resendFrom,
        to: resendTo,
      },
      { status: 400 }
    )
  }
}
