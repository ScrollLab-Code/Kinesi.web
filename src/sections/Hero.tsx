import { useState } from "react"
import type { FormEvent } from "react"
import { supabase } from "../lib/supabase"
import logoIcon from "../assets/logo_icon.jpg"

type HeroProps = {
  onAuthenticated?: () => void
}

export default function Hero({ onAuthenticated }: HeroProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [accessMode, setAccessMode] = useState<"email" | "phone">("email")
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [authStatus, setAuthStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const activateLocalAccess = (message: string) => {
    onAuthenticated?.()
    setAuthStatus(message)
    setShowAuthModal(false)
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
    <div id="inicio" className="bg-white text-slate-900 font-sans min-h-screen">
      
      {/* ------------------------------------------------------------------ */}
      {/* HERO TOP SECTION (Exact Gemini Notebook Style)                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="pt-16 pb-20 px-6 max-w-5xl mx-auto text-center space-y-8">
        
        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
          Entiende sobre <br />
          <span className="text-gradient-gemini">cualquier materia</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Es tu socio de investigación y razonamiento médico. Está basado en la información en la que confías y se creó para ayudarte a aprobar.
        </p>

        {/* Black Pill CTA Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="gemini-pill-btn text-sm sm:text-base py-3.5 px-9 cursor-pointer shadow-md"
          >
            Probar Kinase Academy
          </button>
        </div>

        {/* Section Divider Subtitle */}
        <div className="pt-16 sm:pt-24 border-b border-slate-100 pb-8">
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tu compañero de estudio e investigación potenciado por IA
          </h2>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FEATURE SHOWCASE SECTIONS (2 Columns: Left Text, Right Dark Card)   */}
      {/* ------------------------------------------------------------------ */}
      <section className="max-w-6xl mx-auto px-6 py-12 space-y-24">
        
        {/* Feature 1: Sube tus fuentes */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-4 max-w-md">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-xl text-slate-800">
              👤
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Sube tus fuentes de cátedra
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Sube archivos PDF, sitios web, videos de YouTube, archivos de audio, documentos de Google, presentaciones de Google y mucho más. Pídele a Kinase que explique conceptos complejos en términos simples, proporcione ejemplos reales y refuerce tu comprensión.
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 italic pt-2">
              Aprende más rápido y en profundidad.
            </p>
          </div>

          {/* Dark Card Mockup 1 */}
          <div className="gemini-dark-card p-6 sm:p-8 text-white space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-mono text-slate-400">Fuentes de Estudio</span>
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                +3 Documentos Activos
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-[#12151f] p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                <span className="text-amber-400 text-base">📘</span>
                <div>
                  <p className="font-bold text-slate-200">LIT 300 Anatomía Latarjet</p>
                  <p className="text-[10px] text-slate-400">Tomo 1 - Miembro Superior & Sistema Nervioso</p>
                </div>
              </div>
              <div className="bg-[#12151f] p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                <span className="text-rose-400 text-base">📕</span>
                <div>
                  <p className="font-bold text-slate-200">Guyton & Hall Fisiología Médica</p>
                  <p className="text-[10px] text-slate-400">Capítulo 14 - Potenciales de Acción</p>
                </div>
              </div>
              <div className="bg-[#12151f] p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                <span className="text-red-400 text-base">🎥</span>
                <div>
                  <p className="font-bold text-slate-200">Clase Teórica Histología Ross</p>
                  <p className="text-[10px] text-slate-400">Tejido Epitelial y Conectivo Especializado</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111726] border border-sky-900/50 rounded-xl p-4 text-xs text-sky-200 leading-relaxed font-sans">
              💡 <strong>Kinase Responde:</strong> "El nervio radial (C5-C8) discurre por el canal de torsión del húmero acompañado por la arteria braquial profunda..."
            </div>
          </div>
        </div>

        {/* Feature 2: Estadísticas e información instantáneas */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-4 max-w-md lg:order-2">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-xl text-slate-800">
              ⚡
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Estadísticas e información instantáneas
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Con todas tus fuentes en su lugar, Kinase se pone a trabajar y se convierte en un experto en la información que más te interesa. Genera guías de estudio, cuadros sinópticos y autoevaluaciones con un solo clic.
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 italic pt-2">
              Presenta temas con confianza.
            </p>
          </div>

          {/* Dark Card Mockup 2 */}
          <div className="gemini-dark-card p-6 sm:p-8 text-white space-y-6 lg:order-1 relative overflow-hidden">
            
            {/* Floating Sticker */}
            <div className="absolute top-4 right-4 bg-pink-300 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full rotate-3 shadow-lg border border-pink-400">
              INSTANT STUDY GUIDE!
            </div>

            <div className="space-y-3">
              <div className="w-full bg-[#12151f] border border-slate-800 rounded-full px-4 py-2.5 flex items-center gap-2 text-slate-400 text-xs font-mono">
                <span>+ Add note or prompt...</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[#141b2d] hover:bg-[#1e2942] border border-slate-800 rounded-2xl p-3.5 text-left text-xs font-bold text-slate-200 transition cursor-pointer flex items-center gap-2"
                >
                  <span>🎓</span> Study guide
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[#141b2d] hover:bg-[#1e2942] border border-slate-800 rounded-2xl p-3.5 text-left text-xs font-bold text-slate-200 transition cursor-pointer flex items-center gap-2"
                >
                  <span>📑</span> Briefing doc
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[#141b2d] hover:bg-[#1e2942] border border-slate-800 rounded-2xl p-3.5 text-left text-xs font-bold text-slate-200 transition cursor-pointer flex items-center gap-2"
                >
                  <span>💬</span> FAQ
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[#141b2d] hover:bg-[#1e2942] border border-slate-800 rounded-2xl p-3.5 text-left text-xs font-bold text-slate-200 transition cursor-pointer flex items-center gap-2"
                >
                  <span>📈</span> Timeline
                </button>
              </div>

              <div className="bg-[#121722] border border-slate-800 rounded-xl p-3.5 text-xs text-amber-300 font-mono flex items-center gap-2">
                <span>📋</span> Ulysses & Medical Case Analysis: 18 chapters ready
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Ve la fuente, no solo la respuesta */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-4 max-w-md">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-xl text-slate-800">
              ✳️
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Ve la fuente, no solo la respuesta
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Confía en cada respuesta gracias a que Kinase proporciona referencias claras de su trabajo y te muestra las citas exactas de tus fuentes, libros de texto y desgrabados oficiales de cátedra.
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 italic pt-2">
              Verificabilidad total en cada concepto.
            </p>
          </div>

          {/* Dark Card Mockup 3 */}
          <div className="gemini-dark-card p-6 sm:p-8 text-white space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="text-base">📄</span>
              <span className="text-sm font-bold text-slate-100">Sources Breakdown</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#12151f] border border-slate-800">
                <span className="text-amber-400">🟨 LIT 300 Study Guide</span>
                <span className="text-[10px] text-slate-400">Page 142</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#12151f] border border-slate-800">
                <span className="text-red-400">📕 LIT 300 Joyce</span>
                <span className="text-[10px] text-slate-400">Page 89</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#12151f] border border-slate-800">
                <span className="text-sky-400">▶️ Ulysses Themes</span>
                <span className="text-[10px] text-slate-400">12:45 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 4: Escucha y aprende sobre la marcha */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-4 max-w-md lg:order-2">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-xl text-slate-800">
              🎙️
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Escucha y aprende sobre la marcha
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Nuestra función Resumen de audio puede convertir tus fuentes en conversaciones de "Análisis en profundidad" atractivas con un solo clic. Escuchá tus temas de estudio mientras viajás a la facultad.
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 italic pt-2">
              Repaso activo en formato podcast.
            </p>
          </div>

          {/* Dark Card Mockup 4 */}
          <div className="gemini-dark-card p-6 sm:p-8 text-white space-y-6 lg:order-1 relative overflow-hidden bg-gradient-to-br from-[#071318] via-[#091a1d] to-[#080a12]">
            
            <div className="absolute top-4 right-4 bg-yellow-300 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full -rotate-2 shadow-lg">
              CREATE AUDIO STUDY GUIDES
            </div>

            <div className="pt-6 pb-2 text-center space-y-4">
              <div className="inline-flex items-center gap-3 bg-[#0d2a2f] border border-teal-500/40 rounded-full px-5 py-2.5 text-teal-300 text-sm font-bold shadow-lg">
                <span className="h-3 w-3 rounded-full bg-teal-400 animate-pulse"></span>
                Audio Overview Player
              </div>
              <div className="flex justify-center items-center gap-1.5 h-12 pt-2">
                <span className="w-1 bg-teal-400 h-6 animate-pulse rounded-full"></span>
                <span className="w-1 bg-teal-400 h-10 animate-pulse delay-75 rounded-full"></span>
                <span className="w-1 bg-teal-300 h-4 animate-pulse delay-150 rounded-full"></span>
                <span className="w-1 bg-teal-400 h-12 animate-pulse rounded-full"></span>
                <span className="w-1 bg-teal-300 h-7 animate-pulse delay-100 rounded-full"></span>
                <span className="w-1 bg-teal-400 h-9 animate-pulse delay-200 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3-COLUMN FEATURE GRID ("Cómo usan las personas Kinase")            */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-slate-50/70 border-t border-slate-100 py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Cómo usan las personas Kinase Academy
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Column 1 */}
            <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                🎓
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Potencia tu estudio
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sube grabaciones de clases, capítulos de libros de texto y trabajos de investigación. Pídele a Kinase que explique conceptos complejos en términos simples, proporcione ejemplos reales y refuerce tu comprensión.
              </p>
              <p className="text-xs font-semibold text-slate-400 italic pt-2">
                Aprende más rápido y en profundidad.
              </p>
            </div>

            {/* Column 2 */}
            <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
                📑
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Organiza tu pensamiento
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sube tu material de referencia y permite que Kinase cree un esquema de presentación optimizado, con puntos clave y pruebas de respaldo para rendir tus exámenes orales.
              </p>
              <p className="text-xs font-semibold text-slate-400 italic pt-2">
                Presenta temas con confianza.
              </p>
            </div>

            {/* Column 3 */}
            <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                💡
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Elabora nuevas respuestas
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sube notas de intercambio de ideas, investigación de parciales pasados y desgrabados. Pídele a Kinase que identifique preguntas frecuentes de los docentes y anticipe la evaluación.
              </p>
              <p className="text-xs font-semibold text-slate-400 italic pt-2">
                Desbloquea tu potencial creativo.
              </p>
            </div>

          </div>

          {/* Bottom CTA */}
          <div className="text-center pt-6">
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="gemini-pill-btn text-sm py-3 px-8 cursor-pointer shadow-sm"
            >
              Comenzar ahora con Kinase Academy
            </button>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* AUTH REGISTRATION MODAL (NotebookLM Style Floating Modal)         */}
      {/* ------------------------------------------------------------------ */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="notebook-hero-card rounded-2xl p-6 sm:p-8 text-left max-w-md w-full relative shadow-2xl">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <img src={logoIcon} alt="Kinase Logo" className="h-6 w-6 rounded-md" />
              <span className="font-bold text-slate-900 text-base">Acceder a Kinase Academy</span>
            </div>

            <form onSubmit={createAccount} className="space-y-4">
              
              <button
                type="button"
                onClick={signInWithGoogle}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 transition shadow-xs cursor-pointer"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuar con Google
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="px-3 text-[11px] font-bold text-slate-400 uppercase">o con tu cuenta</span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>

              <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setAccessMode("email")}
                  className={`rounded-lg py-1.5 text-xs font-bold transition ${
                    accessMode === "email"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setAccessMode("phone")}
                  className={`rounded-lg py-1.5 text-xs font-bold transition ${
                    accessMode === "phone"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Celular
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Tu nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="ej. Martina"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none transition focus:border-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none transition focus:border-slate-800 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-950 py-3 text-xs font-bold text-white transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "Ingresando..." : "Ingresar a Kinase"}
              </button>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => activateLocalAccess("Modo Demo activado.")}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 transition underline underline-offset-4 cursor-pointer"
                >
                  Probar en Modo Demo (sin registro) →
                </button>
              </div>

              {authStatus && (
                <p className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-medium text-emerald-800 text-center">
                  {authStatus}
                </p>
              )}

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
