import { useState } from "react"
import { motion } from "framer-motion"

type PaymentScheduleProps = {
  onRegister: () => void
  registered: boolean
}

export default function PaymentSchedule({ onRegister, registered }: PaymentScheduleProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [career, setCareer] = useState("")
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmationSent, setConfirmationSent] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !career) {
      return
    }

    setSending(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          career,
          result: 'Registro gratuito',
          answers: `Nombre: ${name}\nCarrera: ${career}`,
        }),
      })

      const text = await response.text()
      let data: { error?: string } | null = null

      try {
        data = text ? JSON.parse(text) : null
      } catch {
        data = null
      }

      if (!response.ok) {
        throw new Error(
          data?.error || text || 'No se pudo enviar el correo de confirmación.'
        )
      }

      setConfirmationSent(true)
      onRegister()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error al registrar.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="unirse" className="border-t border-slate-200 bg-[#f8fbff] py-28 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-5">Registro</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
            Registrate gratis y desbloqueá el marketplace y el test de perfil.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-slate-600">
            No hay pagos en este paso. Completa tus datos y accedé a recursos creados por estudiantes, junto con tu análisis académico.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-5">Comienza gratis</p>
            {!registered ? (
              <>
                <label className="mb-5 block text-sm text-slate-600">
                  Nombre completo
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Tu nombre"
                    className="mt-3 h-14 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 text-slate-900 outline-none focus:border-sky-400"
                  />
                </label>

                <label className="mb-5 block text-sm text-slate-600">
                  Email
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="tu@email.com"
                    className="mt-3 h-14 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 text-slate-900 outline-none focus:border-sky-400"
                  />
                </label>

                <label className="mb-8 block text-sm text-slate-600">
                  Carrera / área de estudio
                  <input
                    value={career}
                    onChange={(event) => setCareer(event.target.value)}
                    placeholder="Ej. Derecho, Ingeniería, Medicina"
                    className="mt-3 h-14 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 text-slate-900 outline-none focus:border-sky-400"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={!name || !email || !career || sending}
                  className="inline-flex w-full items-center justify-center rounded-full bg-sky-700 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? 'Enviando...' : 'Registrarme gratis'}
                </button>

                {submitError ? (
                  <p className="mt-4 text-sm text-rose-600">{submitError}</p>
                ) : null}
                {confirmationSent ? (
                  <p className="mt-4 text-sm text-slate-600">
                    Revisa tu correo: ya te enviamos la confirmación.
                  </p>
                ) : null}
              </>
            ) : (
              <div className="space-y-6">
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-slate-900">
                  <p className="text-sm uppercase tracking-[0.28em] text-sky-600 mb-2">Acceso desbloqueado</p>
                  <p className="text-lg leading-relaxed">
                    ¡Perfecto, {name}! Ya podés ver el marketplace, completar el test y explorar los recursos comunitarios.
                  </p>
                </div>
                <a
                  href="#marketplace"
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-900 transition hover:bg-slate-200"
                >
                  Ir al marketplace
                </a>
              </div>
            )}

            <p className="mt-6 text-sm leading-relaxed text-slate-500">
              Este registro es gratis. Cuando termine, vas a ver todo el contenido desbloqueado sin necesidad de pagar nada.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-5">Por qué registrarte</p>
            <div className="space-y-5 text-slate-600">
              <p>Accedé al marketplace estudiantil sin pagar nada en este paso.</p>
              <p>Obtén tu análisis de perfil académico y recomendaciones en el mismo momento.</p>
              <p>Publicá o consultá recursos creados por otros estudiantes en una sola experiencia desbloqueada.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
