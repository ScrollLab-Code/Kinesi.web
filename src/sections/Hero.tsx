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
  { title: "Publica tu duda", detail: "Materia, tema trabado o parcial cercano." },
  { title: "Recibi respuestas", detail: "Comunidad + apoyo experto cuando haga falta." },
  { title: "Inverti en acompañamiento academico", detail: "Mentorias, planes de estudio y preparacion intensiva." },
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

const getAuthRedirectUrl = () => `${window.location.origin}/auth/callback`

export default function Hero({ onAuthenticated }: HeroProps) {
  const [tipIndex, setTipIndex] = useState(0)
  const [formMode, setFormMode] = useState<"login" | "register">("login")
  
  // Estados de campos
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const [authStatus, setAuthStatus] = useState("")
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

 useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
    if (session) {
      onAuthenticated?.()
    }
  })
  return () => subscription.unsubscribe()
}, [onAuthenticated])
   

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTipIndex((current) => (current + 1) % studyTips.length)
    }, 4200)
    return () => window.clearInterval(timer)
  }, [])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setAuthStatus("")
    setIsError(false)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthRedirectUrl(),
        }
      })
      if (error) throw error
    } catch (error) {
      setIsError(true)
      setAuthStatus(error instanceof Error ? error.message : "Error al conectar con Google")
      setIsLoading(false)
    }
  }

  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanEmail = email.trim().toLowerCase()
    const cleanName = name.trim()

    setAuthStatus("")
    setIsError(false)

    if (!cleanEmail || !password) {
      setIsError(true)
      setAuthStatus("Por favor, completa todos los campos del formulario.")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setIsError(true)
      setAuthStatus("Por favor, ingresa un email valido.")
      return
    }

    if (password.length < 6) {
      setIsError(true)
      setAuthStatus("La contrasena debe tener al menos 6 caracteres.")
      return
    }

    setIsLoading(true)

    try {
      if (formMode === "login") {
        // Intentar iniciar sesión directamente con email y contraseña
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        })

        if (loginError) {
          const errorMessage = loginError.message.toLowerCase()

          if (errorMessage.includes("email not confirmed")) {
            setIsError(true)
            setAuthStatus("Tu email todavia no esta confirmado. Revisa tu correo y abri el link de activacion.")
          } else if (loginError.status === 400 || errorMessage.includes("invalid login")) {
            setIsError(true)
            setAuthStatus("Email o contrasena incorrectos. Si recien te registraste, confirma primero el correo.")
          } else if (loginError.status === 429) {
            setIsError(true)
            setAuthStatus("Demasiados intentos. Espera un momento y volve a probar.")
          } else {
            setIsError(true)
            setAuthStatus(loginError.message)
          }
          setIsLoading(false)
          return
        }

        if (loginData.session) {
          onAuthenticated?.()
        }

      } else {
        if (!cleanName) {
          setIsError(true)
          setAuthStatus("Por favor, introduce tu nombre para la comunidad.")
          setIsLoading(false)
          return
        }

        // Registro de usuario nuevo con contraseña establecida por él mismo
        const { error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            emailRedirectTo: getAuthRedirectUrl(),
            data: { name: cleanName }
          }
        })

        if (signUpError) throw signUpError
        setFormMode("login")
        setPassword("")
        setAuthStatus("Cuenta creada. Te enviamos un correo de activacion; abrilo y vas a entrar automaticamente.")
      }
    } catch (error) {
      setIsError(true)
      setAuthStatus(error instanceof Error ? error.message : "Error inesperado en el sistema.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFormMode = (mode: "login" | "register") => {
    setFormMode(mode)
    setAuthStatus("")
    setName("")
    setEmail("")
    setPassword("")
  }

  return (
    <section id="inicio" className="min-h-screen bg-stone-50 pt-20 text-slate-950">
      <div className="grid min-h-[calc(100vh-80px)] lg:grid-cols-[0.92fr_1.08fr]">
        <div id="registro" className="flex items-center px-6 py-12 md:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-xl">
            
            {/* Cabecera de marca */}
            <div className="mb-6">
              <p className="text-5xl font-black leading-none tracking-tight text-slate-950 md:text-7xl">KINASE</p>
              <p className="mt-2 text-sm font-black uppercase tracking-[0.28em] text-emerald-700">Academy</p>
            </div>

            {/* Texto de cabecera limpio y estético */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {formMode === "login" ? "Te damos la bienvenida de vuelta" : "Comienza tu entrenamiento académico"}
              </p>
              <h2 className="text-xl font-bold text-slate-700 mt-1">
                {formMode === "login" ? "Ingresa a tu panel de estudio" : "Completa tus datos de alumno"}
              </h2>
            </div>

            <form onSubmit={handleAuth} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              
              <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Inicia sesión con:</p>
              
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="mb-6 flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:bg-slate-100 shadow-sm"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <div className="relative mb-6 text-center">
                <span className="relative z-10 bg-white px-3 text-xs font-black text-slate-400 uppercase tracking-wider">
                  o usa tus credenciales
                </span>
                <div className="absolute inset-0 top-1/2 border-b border-slate-200" />
              </div>

              {/* Registro: Campo Nombre */}
              {formMode === "register" && (
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-bold text-slate-700">Nombre</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Cómo querés aparecer"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              )}

              {/* Campo Email */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-slate-700">Tu email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="estudiante@email.com"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 text-slate-900"
                />
              </div>

              {/* Campo de Contraseña Directo */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-bold text-slate-700">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-slate-950 px-5 py-3.5 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isLoading ? "Validando..." : formMode === "login" ? "Ingresar ahora" : "Crear mi cuenta gratis"}
              </button>

              {/* Selector inferior para alternar de pantalla */}
              <div className="mt-6 text-center text-sm font-medium text-slate-600">
                {formMode === "login" ? (
                  <>
                    ¿Aún no tienes cuenta?{" "}
                    <button
                      type="button"
                      onClick={() => toggleFormMode("register")}
                      className="font-bold text-emerald-700 underline hover:text-emerald-600"
                    >
                      Creémosla rápido aquí
                    </button>
                  </>
                ) : (
                  <>
                    ¿Ya tienes una cuenta creada?{" "}
                    <button
                      type="button"
                      onClick={() => toggleFormMode("login")}
                      className="font-bold text-slate-950 underline hover:text-slate-700"
                    >
                      Inicia sesión directo
                    </button>
                  </>
                )}
              </div>

              {/* Alertas dinámicas exactas */}
              {authStatus && (
                <p className={`mt-4 rounded-lg border p-3 text-sm font-bold leading-6 ${isError ? "border-red-200 bg-red-50 text-red-900" : "border-emerald-200 bg-emerald-50 text-emerald-900"}`}>
                  {authStatus}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="relative min-h-[580px] overflow-hidden bg-slate-950 px-6 py-12 text-white md:px-10 lg:px-16">
          <div className="absolute inset-0 study-library" />
          <div className="absolute inset-0 bg-slate-950/58" />
          <div className="relative z-10 grid h-full min-h-[520px] content-between gap-8">
            <div className="max-w-2xl">
              <h3 className="text-4xl font-black leading-tight md:text-5xl">Invierta en su aprendizaje y estudie con un plan.</h3>
            </div>
            <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
              <div className="rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">Pasos recomendados</p>
                <div className="space-y-3">
                  {nextActions.map((action, index) => (
                    <div key={action.title} className="grid grid-cols-[38px_1fr] gap-3 rounded-lg bg-white/10 p-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-300 text-sm font-black text-slate-950">{index + 1}</span>
                      <div>
                        <h4 className="font-black">{action.title}</h4>
                        <p className="text-sm leading-6 text-slate-200">{action.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-white/15 bg-white p-5 text-slate-950 shadow-2xl">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Plan semanal</p>
                    <h4 className="text-2xl font-black">Modo parcial</h4>
                  </div>
                  <span className="rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white">7 dias</span>
                </div>
                <div className="space-y-3">
                  {weeklyPlan.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-md border border-slate-200 bg-stone-50 p-3">
                      <span className="h-3 w-3 rounded-full bg-emerald-600" />
                      <span className="font-bold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="max-w-2xl rounded-lg border border-emerald-300/30 bg-emerald-300/15 p-5 backdrop-blur">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">Consejo rapido</p>
              <p className="text-xl font-bold leading-8">{studyTips[tipIndex]}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
