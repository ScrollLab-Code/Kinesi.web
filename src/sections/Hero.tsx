import { useState } from "react"
import type { FormEvent } from "react"
import { supabase } from "../lib/supabase"
import logoIcon from "../assets/logo_icon.jpg"

type HeroProps = {
  onAuthenticated?: () => void
}

export default function Hero({ onAuthenticated }: HeroProps) {
  const [accessMode, setAccessMode] = useState<"email" | "phone">("email")
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [authStatus, setAuthStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
      setAuthStatus("Por favor, ingresá tu nombre y un contacto válido.")
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

      setAuthStatus(
        accessMode === "email"
          ? "Te enviamos un enlace de acceso a tu correo electrónico."
          : "Te enviamos un código de verificación por SMS."
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo conectar con el servicio de autenticación."
      setAuthStatus(`Error: ${message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setIsLoading(true)
    setAuthStatus("")
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${window.location.pathname}`,
        }
      })
      if (error) throw error
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al iniciar sesión con Google."
      setAuthStatus(`Error: ${message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      id="inicio"
      className="min-h-[calc(100vh-80px)] bg-[#fbf9f5] dark:bg-[#091211] text-slate-900 flex flex-col items-center justify-center pt-8 pb-16 px-6"
    >
      <div className="mx-auto max-w-xl w-full text-center space-y-6">
        
        {/* Brand Header Badge */}
        <div className="inline-flex items-center gap-2.5 bg-white dark:bg-[#0e1614] border border-[#e5e0d5] dark:border-[#1d3330] rounded-full px-4 py-1.5 shadow-sm">
          <img 
            src={logoIcon} 
            alt="KINASE Logo Mark" 
            className="h-5 w-5 object-contain rounded-md" 
          />
          <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-800 dark:text-white">
            Kinase Academy
          </span>
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
            Medicina
          </span>
        </div>

        {/* Hero Headings - Clean NotebookLM Style */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Tu carrera de medicina, organizada.
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-normal">
            Conectate con compañeros, conseguí apuntes aprobados y prepará Anatomía, Histología y Fisiología con método.
          </p>
        </div>

        {/* Centered Registration Card (NotebookLM Style) */}
        <div className="notebook-hero-card rounded-2xl p-6 sm:p-8 text-left transition-all duration-300">
          
          <form onSubmit={createAccount} className="space-y-4">
            
            {/* Primary Google Login Button */}
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#142220] py-3 text-sm font-bold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-[#1a2c28] transition shadow-sm cursor-pointer"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
              <span className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">o con tu cuenta</span>
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* Email / Phone Toggle */}
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 dark:bg-[#0a1211] p-1 border border-slate-200 dark:border-[#1d3330]">
              <button
                type="button"
                onClick={() => setAccessMode("email")}
                className={`rounded-lg py-1.5 text-xs font-bold transition ${
                  accessMode === "email"
                    ? "bg-white dark:bg-[#142220] text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
              >
                Email
              </button>

              <button
                type="button"
                onClick={() => setAccessMode("phone")}
                className={`rounded-lg py-1.5 text-xs font-bold transition ${
                  accessMode === "phone"
                    ? "bg-white dark:bg-[#142220] text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
              >
                Celular
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Tu nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="ej. Martina"
                required
                className="w-full rounded-xl border border-slate-200 dark:border-[#1d3330] bg-white dark:bg-[#070a09] px-4 py-2.5 outline-none transition focus:border-emerald-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                {accessMode === "email" ? "Correo electrónico" : "Número de celular"}
              </label>
              <input
                type={accessMode === "email" ? "email" : "tel"}
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder={
                  accessMode === "email"
                    ? "ej. estudiante@fmed.uba.ar"
                    : "ej. +54 9 11 1234 5678"
                }
                required
                className="w-full rounded-xl border border-slate-200 dark:border-[#1d3330] bg-white dark:bg-[#070a09] px-4 py-2.5 outline-none transition focus:border-emerald-700 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#0e2723] hover:bg-slate-900 dark:bg-emerald-800 dark:hover:bg-emerald-700 py-3 text-xs font-bold text-white transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Ingresando..." : "Ingresar a Kinase"}
            </button>

            {/* NotebookLM Style Direct Demo Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => activateLocalAccess("Modo Demo activado.")}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition underline underline-offset-4 cursor-pointer"
              >
                Probar sin registro (Modo Demo) →
              </button>
            </div>

            {authStatus && (
              <p className="rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 p-3 text-xs font-medium text-emerald-800 dark:text-emerald-300 text-center">
                {authStatus}
              </p>
            )}

          </form>
        </div>

        {/* Minimal Footnote Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            Material verificado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            Simulacros y flashcards
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            Comunidad de estudiantes
          </span>
        </div>

      </div>
    </section>
  )
}
