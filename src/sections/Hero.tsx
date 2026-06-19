import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { supabase } from "../lib/supabase"

const studyTips = [
  "Estudia en bloques de 25 minutos y deja 5 minutos reales de descanso.",
  "Antes de leer, mira titulos, resumenes y preguntas para orientar tu atencion.",
  "Explica el tema con tus palabras: si no sale simple, todavia falta una vuelta.",
  "Deja una lista chica para mañana antes de cerrar la compu.",
  "Primero resolvemos lo que traba tu cursada; despues optimizamos el metodo.",
]

const nextActions = [
  {
    title: "Publica tu duda",
    detail: "Materia, tema trabado o parcial cercano.",
  },
  {
    title: "Recibi respuestas",
    detail: "Comunidad + apoyo experto cuando haga falta.",
  },
  {
    title: "inverti en acompañamiento academico",
    detail: "Mentorias, planes de estudio y preparacion intensiva.",
  },
]

const weeklyPlan = [
  "Ordenar materias y fechas",
  "Priorizar temas que mas pesan",
  "Armar bloques de estudio",
  "Revisar avance con seguimiento",
]

type HeroProps = {
  onAuthenticated?: () => void
}

export default function Hero({ onAuthenticated }: HeroProps) {
  const [tipIndex, setTipIndex] = useState(0)
  const [accessMode, setAccessMode] = useState<"email" | "phone">("email")
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [authStatus, setAuthStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTipIndex((current) => (current + 1) % studyTips.length)
    }, 4200)

    return () => window.clearInterval(timer)
  }, [])

  const activateLocalAccess = (message: string) => {
    onAuthenticated?.()
    setAuthStatus(message)
  }

  const normalizePhone = (value: string) =>
    value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "")

  const createAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanName = name.trim()
    const cleanContact =
      accessMode === "email" ? contact.trim() : normalizePhone(contact)

    if (!cleanName || !cleanContact) {
      setAuthStatus("Completa tu nombre y tu medio de acceso.")
      return
    }

    setIsLoading(true)
    setAuthStatus("")

    try {
      const redirectTo = `${window.location.origin}${window.location.pathname}`
      const payload =
        accessMode === "email"
          ? {
              email: cleanContact,
              options: {
                emailRedirectTo: redirectTo,
                data: { name: cleanName },
              },
            }
          : {
              phone: cleanContact,
              options: {
                data: { name: cleanName },
              },
            }

      const { error } = await supabase.auth.signInWithOtp(payload)

      if (error) throw error

      activateLocalAccess(
        accessMode === "email"
          ? "Acceso demo activado. Si Supabase tarda, ya podés entrar."
          : "Acceso demo activado. Si el SMS tarda, ya podés entrar."
      )

      setAuthStatus(
        accessMode === "email"
          ? "Te enviamos el acceso por email. Ya podés usar la plataforma."
          : "Te enviamos el acceso por SMS. Ya podés usar la plataforma."
      )
    } catch (error) {
      setAuthStatus(
        error instanceof Error
          ? `${error.message}. No se activó el acceso demo.`
          : "No se pudo validar con Supabase. Intentá de nuevo más tarde."
      )
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <section
      id="inicio"
      className="min-h-screen bg-stone-50 pt-20 text-slate-950"
    >
      <div className="grid min-h-[calc(100vh-80px)] lg:grid-cols-[0.92fr_1.08fr]">
        <div
          id="registro"
          className="flex items-center px-6 py-12 md:px-10 lg:px-16"
        >
          <div className="mx-auto w-full max-w-xl">
            <div className="mb-8">
              <p className="text-5xl font-black leading-none tracking-tight text-slate-950 md:text-7xl">
                KINASE
              </p>

              <p className="mt-2 text-sm font-black uppercase tracking-[0.28em] text-emerald-700">
                Academy
              </p>
            </div>

            <h2 className="mb-5 text-4xl font-black leading-tight md:text-5xl">
              Invierta en su aprendizaje y estudie con un plan.
            </h2>

            <p className="mb-8 text-lg leading-8 text-slate-600">
              Kinase combina comunidad tipo foro, marketplace de recursos y
              acompañamiento personalizado para que el estudiante no se quede
              solo cuando se traba una materia.
            </p>

            <form
              onSubmit={createAccount}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6"
            >
              <div className="mb-5 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setAccessMode("email")}
                  className={`rounded-md px-4 py-2 text-sm font-bold transition ${
                    accessMode === "email"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Email
                </button>

                <button
                  type="button"
                  onClick={() => setAccessMode("phone")}
                  className={`rounded-md px-4 py-2 text-sm font-bold transition ${
                    accessMode === "phone"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Celular
                </button>
              </div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                {accessMode === "email" ? "Tu email" : "Tu celular"}
              </label>

              <input
                type={accessMode === "email" ? "email" : "tel"}
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder={
                  accessMode === "email"
                    ? "estudiante@email.com"
                    : "+54 9 11 0000 0000"
                }
                className="mb-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              />

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Nombre
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Como queres aparecer en la comunidad"
                className="mb-5 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="mb-3 w-full rounded-lg bg-slate-950 px-5 py-3.5 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isLoading ? "Creando acceso..." : "Crear mi cuenta gratis"}
              </button>

              {authStatus && (
                <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold leading-6 text-emerald-900">
                  {authStatus}
                </p>
              )}

            </form>
          </div>
        </div>

        <div className="relative min-h-[580px] overflow-hidden bg-slate-950 px-6 py-12 text-white md:px-10 lg:px-16">
          <div className="absolute inset-0 study-library" />
          <div className="absolute inset-0 bg-slate-950/58" />

          <div className="relative z-10 grid h-full min-h-[520px] content-between gap-8">
            <div className="max-w-2xl">
              <h3 className="text-4xl font-black leading-tight md:text-5xl">
                Invierta en su aprendizaje y estudie con un plan.
              </h3>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
              <div className="rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">
                  Pasos recomendados
                </p>

                <div className="space-y-3">
                  {nextActions.map((action, index) => (
                    <div
                      key={action.title}
                      className="grid grid-cols-[38px_1fr] gap-3 rounded-lg bg-white/10 p-3"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-300 text-sm font-black text-slate-950">
                        {index + 1}
                      </span>

                      <div>
                        <h4 className="font-black">{action.title}</h4>
                        <p className="text-sm leading-6 text-slate-200">
                          {action.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/15 bg-white p-5 text-slate-950 shadow-2xl">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
                      Plan semanal
                    </p>
                    <h4 className="text-2xl font-black">Modo parcial</h4>
                  </div>

                  <span className="rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white">
                    7 dias
                  </span>
                </div>

                <div className="space-y-3">
                  {weeklyPlan.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-md border border-slate-200 bg-stone-50 p-3"
                    >
                      <span className="h-3 w-3 rounded-full bg-emerald-600" />
                      <span className="font-bold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="max-w-2xl rounded-lg border border-emerald-300/30 bg-emerald-300/15 p-5 backdrop-blur">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">
                Consejo rapido
              </p>

              <p className="text-xl font-bold leading-8">{studyTips[tipIndex]}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
