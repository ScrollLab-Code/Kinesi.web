import { Resend } from "resend"
import { escapeHtml, isValidEmail, validateLeadData, LeadFormData } from "./utils"
import { generateLeadEmailHtml, generateConfirmationEmailHtml } from "./email-templates"

const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

type VercelRequest = {
  method?: string
  body?: unknown
}

type VercelResponse = {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Validate HTTP method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Use POST." })
  }

  // Validate API key
  if (!resendApiKey) {
    console.error("Missing RESEND_API_KEY environment variable")
    return res
      .status(500)
      .json({ error: "Error de configuración del servidor. Contacte al administrador." })
  }

  const resend = new Resend(resendApiKey)
  const contactEmail = process.env.RESEND_CONTACT_EMAIL || process.env.VITE_CONTACT_EMAIL || ""

  // Validate contact email configured
  if (!contactEmail || !isValidEmail(contactEmail)) {
    console.error("Missing or invalid RESEND_CONTACT_EMAIL environment variable", contactEmail)
    return res
      .status(500)
      .json({ error: "Error de configuración del servidor. Contacte al administrador." })
  }

  if (!fromEmail || !isValidEmail(fromEmail)) {
    console.error("Missing or invalid RESEND_FROM_EMAIL environment variable", fromEmail)
    return res
      .status(500)
      .json({ error: "Error de configuración del servidor. Contacte al administrador." })
  }

  // Validate and sanitize request body
  const body = req.body as LeadFormData
  const validation = validateLeadData(body)

  if (!validation.valid) {
    return res.status(400).json({
      error: "Datos inválidos",
      details: validation.errors,
    })
  }

  // Sanitize all user inputs to prevent XSS
  const sanitizedLead: LeadFormData = {
    name: escapeHtml(body.name),
    lastname: escapeHtml(body.lastname),
    email: escapeHtml(body.email),
    phone: escapeHtml(body.phone),
    career: escapeHtml(body.career),
    result: escapeHtml(body.result),
    answers: escapeHtml(body.answers),
  }

  try {
    // Send lead notification email to admin
    const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      subject: `📋 Nuevo Lead: ${sanitizedLead.name} ${sanitizedLead.lastname}`,
      html: generateLeadEmailHtml(sanitizedLead),
      replyTo: sanitizedLead.email,
    })

    if (adminEmailError) {
      console.error("Resend admin email error:", adminEmailError)
      return res.status(400).json({
        error: "Error al enviar el email de notificación",
        details: adminEmailError,
      })
    }

    // Send confirmation email to user
    const { data: userEmailData, error: userEmailError } = await resend.emails.send({
      from: fromEmail,
      to: sanitizedLead.email || "",
      subject: "✅ Hemos recibido tu formulario - Kinase",
      html: generateConfirmationEmailHtml(sanitizedLead.name || "Usuario"),
    })

    if (userEmailError) {
      console.error("Resend user confirmation email error:", userEmailError)
      // Don't fail the request if confirmation email fails, as admin email was sent
      console.warn("Confirmation email failed but admin email was sent successfully")
    }

    return res.status(200).json({
      success: true,
      message: "Formulario enviado correctamente. Te enviaremos un email de confirmación.",
      data: {
        adminEmail: adminEmailData,
        confirmationEmail: userEmailData,
      },
    })
  } catch (error) {
    console.error("Email function error:", error)

    return res.status(500).json({
      error: "Error al procesar tu solicitud",
      message: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}
