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

  if (!lead) {
    return Response.json(
      { error: 'Faltan datos del formulario para enviar el email.' },
      { status: 400 }
    )
  }

  try {
    const resend = new Resend(resendApiKey)

    const data = await resend.emails.send({
      from: resendFrom,
      to: resendTo,
      subject: 'Nuevo diagnostico recibido',
      text: buildEmailText(lead),
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
