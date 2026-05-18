import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const resend = new Resend(resendApiKey)

export default {
  async fetch(req: Request) {
    if (req.method !== "POST") {
      return Response.json(
        { error: "Metodo no permitido" },
        { status: 405 }
      )
    }

    if (!resendApiKey) {
      return Response.json(
        { error: "Falta RESEND_API_KEY en Vercel" },
        { status: 500 }
      )
    }

    const body = await req.json()

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "Giacomassi.nqn@gmail.com",
        subject: "Nuevo diagnostico recibido",
        html: `
          <h2>Nuevo lead</h2>

          <p><strong>Nombre:</strong> ${body.name}</p>
          <p><strong>Apellido:</strong> ${body.lastname}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Telefono:</strong> ${body.phone}</p>
          <p><strong>Carrera:</strong> ${body.career}</p>

          <hr />

          <p><strong>Resultado:</strong> ${body.result}</p>

          <p><strong>Respuestas:</strong></p>

          <p>${body.answers}</p>
        `,
      })

      return Response.json({
        success: true,
      })
    } catch (error) {
      return Response.json(
        {
          error: error instanceof Error ? error.message : "Error desconocido",
        },
        { status: 500 }
      )
    }
  },
}
