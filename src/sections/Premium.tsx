import { useState } from "react"
import lopezRossetti from "../assets/lopez_rossetti.jpg"

type PremiumProps = {
  isPremium: boolean
  onActivate: (code: string) => boolean
  onDeactivate?: () => void
}

export default function Premium({ isPremium, onActivate, onDeactivate }: PremiumProps) {
  const [activationCode, setActivationCode] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [simulatedCode, setSimulatedCode] = useState("")

  // Countdown timer simulation
  const daysLeft = 12

  const handleActivationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    if (!activationCode.trim()) return

    const success = onActivate(activationCode.trim())
    if (!success) {
      setErrorMessage("Código inválido. Usa KINASE-FREE-VIP para entrar sin pagar.")
    }
  }

  const triggerPaymentSimulation = () => {
    setSimulatedCode("KINASE-FREE-VIP")
    setShowPaymentModal(true)
    try {
      navigator.clipboard.writeText("KINASE-FREE-VIP")
    } catch (e) {
      console.warn("Could not copy code to clipboard", e)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {!isPremium ? (
        // VISTA: NO PREMIUM (Bloqueado)
        <div className="space-y-8">
          
          {/* Hero Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Kinase Premium VIP
            </span>
            <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Desbloquea tu Entorno Médico de Alto Rendimiento
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-350 leading-relaxed">
              Transforma tu forma de estudiar medicina con acceso ilimitado a simuladores, planificadores y herramientas exclusivas diseñadas por tutores de cátedra.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
            
            {/* Beneficios */}
            <div className="space-y-4">
              <h3 className="text-md font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Contenido VIP para Habilitar:
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 clinical-shadow space-y-2">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">Muro de Experiencias (Foro)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-normal">
                    Comparte y lee reviews reales de exámenes de alumnos de cátedra.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 clinical-shadow space-y-2">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">Flashcards VIP Autoevaluables</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-normal">
                    Fichas con repetición espaciada y modo de visualización interactiva.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 clinical-shadow space-y-2">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">Creador de Hábitos VIP</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-normal">
                    Planificador secuencial interactivo con distribución lógica de estudio semanal.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 clinical-shadow space-y-2">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">Doble Planificación Académica</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-normal">
                    Planificador Inverso para exámenes finales y Planificador Semanal interactivo.
                  </p>
                </div>
              </div>
            </div>

            {/* Activador */}
            <div className="glass-card rounded-2xl p-6 border-2 border-dashed border-amber-500/40 dark:border-amber-500/20 clinical-shadow space-y-5">
              <div className="text-center space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Habilitación de Cuenta</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ingresa tu código de activación para desbloquear el contenido exclusivo.
                </p>
              </div>

              <form onSubmit={handleActivationSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={activationCode}
                    onChange={e => setActivationCode(e.target.value)}
                    placeholder="ej. KINASE-FREE-VIP"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 text-center text-sm font-bold tracking-widest text-slate-800 dark:text-white uppercase"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-3 transition duration-200 shadow-md"
                >
                  Habilitar Acceso Premium VIP
                </button>

                {errorMessage && (
                  <p className="text-xs text-rose-600 dark:text-rose-450 text-center font-bold">
                    {errorMessage}
                  </p>
                )}
              </form>

              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
                <span className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Acceso Rápido</span>
                <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-xs text-slate-500 leading-normal">
                  Puedes ingresar gratis usando el código provisto por la academia o simular el pago al instante.
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={triggerPaymentSimulation}
                    className="rounded-lg bg-emerald-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 transition duration-200 shadow-sm"
                  >
                    Obtener Código Premium Gratis
                  </button>
                  <p className="text-[10px] font-bold text-slate-400">
                    Código de habilitación: <span className="text-emerald-800 dark:text-emerald-450 font-black">KINASE-FREE-VIP</span>
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Modal de Simulación de Pago */}
          {showPaymentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="glass-card rounded-2xl p-6 max-w-md w-full text-center space-y-4 border border-emerald-500/30 clinical-shadow">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-800 dark:text-emerald-400 text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  ¡Habilitación Obtenida!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Copia el código provisto a continuación para activar tu cuenta Premium VIP gratis de inmediato.
                </p>

                <div className="bg-slate-50 dark:bg-[#070a09] border border-slate-200 dark:border-[#1d3330] rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Tu código de habilitación
                  </span>
                  <span className="text-lg font-black text-emerald-800 dark:text-emerald-400 tracking-widest block select-all">
                    {simulatedCode}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActivationCode(simulatedCode)
                    setShowPaymentModal(false)
                  }}
                  className="w-full rounded-lg bg-emerald-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 transition"
                >
                  Pegar Código y Habilitar
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        // VISTA: PREMIUM ACTIVADO (Entorno VIP Cockpit Dashboard)
        <div className="space-y-8 animate-fadeIn">
          
          {/* Welcome Banner */}
          <div className="rounded-2xl border border-amber-500 bg-gradient-to-br from-[#1c180d] to-[#0c1815] p-6 text-white clinical-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
            <div className="space-y-1 z-10">
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-500">
                VIP Academic Environment
              </span>
              <h3 className="text-2xl font-black tracking-tight">
                ¡Bienvenido a tu Cockpit Médico de Alto Rendimiento!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl font-medium">
                Tienes acceso total desbloqueado. Utiliza las pestañas del menú superior para navegar entre las herramientas premium de planificación, flashcards y hábitos.
              </p>
              {onDeactivate && (
                <button
                  onClick={onDeactivate}
                  className="mt-3 inline-block rounded border border-red-500/20 bg-red-800/10 hover:bg-red-800/20 px-3 py-1.5 text-[10px] font-bold text-red-400 transition"
                >
                  Volver a Versión Gratuita (Desactivar Premium)
                </button>
              )}
            </div>

            <div className="bg-[#1b1c1d]/60 border border-slate-700 rounded-xl p-3.5 shrink-0 z-10">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Próximo Examen de Cátedra</span>
              <span className="text-lg font-black text-amber-500 block">Final de Anatomía</span>
              <span className="text-[10px] text-emerald-400 block font-semibold">Quedan {daysLeft} días</span>
            </div>
          </div>

          {/* Grid de Contenido Desarmado y Espacioso */}
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            
            {/* Columna Izquierda: Explicación de beneficios y simplificación de estudio */}
            <div className="glass-card rounded-2xl p-6 border border-amber-500/35 clinical-shadow space-y-6 bg-white">
              <div>
                <h4 className="font-extrabold text-lg text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3">
                  ¿Cómo te beneficia este Panel VIP y cómo simplifica tu estudio?
                </h4>
                <p className="text-xs text-slate-500 mt-2">
                  El entorno VIP está diseñado para remover los obstáculos organizativos y cognitivos de la carrera de medicina.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Estructuración y Planificación Activa</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      Usa el <strong>Planificador Inverso</strong> para fijar tus fechas de examen final y dejar que la app divida las unidades del programa de forma lógica en base a los días restantes, simplificando la distribución semanal.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Estudio por Repetición Espaciada</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      Las <strong>Flashcards VIP</strong> te permiten repasar mnemotecnias, preparados histológicos y clasificaciones de fármacos de manera interactiva, ahorrando horas de lectura improductiva.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Creador de Hábitos Lógico</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      Evita el agotamiento cerebral. Nuestro organizador restringe la cantidad de materias a estudiar por día según tu disponibilidad de horas reales, permitiéndote fijar metas realistas y medibles.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-[11px] text-slate-600 leading-relaxed font-semibold">
                💡 En resumen: Este panel centraliza el método estratégico de aprobación, eliminando la necesidad de planificar a mano o improvisar el repaso antes de un examen oral.
              </div>
            </div>

            {/* Columna Derecha: Mensaje de estudio tranquilo y Soporte vía WhatsApp */}
            <div className="space-y-4 font-sans">
              
              <div className="glass-card rounded-2xl p-6 border border-emerald-500/35 clinical-shadow space-y-4 bg-white animate-fadeIn">
                <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-805 text-emerald-800">
                  Estudio Tranquilo y Enfocado
                </span>
                
                <h4 className="font-bold text-sm text-slate-900 mt-1">
                  Tu tranquilidad es el pilar de tu aprendizaje
                </h4>

                <div className="space-y-3">
                  <img 
                    src={lopezRossetti} 
                    alt="Encuentro con el Dr. Daniel López Rossetti" 
                    className="w-full h-auto max-h-[280px] rounded-xl object-cover border border-slate-200 shadow-sm transition hover:scale-[1.01]"
                    loading="lazy"
                  />
                  <p className="text-[11px] leading-relaxed text-slate-500 italic bg-stone-50 p-2.5 rounded-lg border border-slate-105 border-slate-100 font-medium">
                    "En mi encuentro con el Dr. Daniel López Rossetti, una voz de gran autoridad y prestigio médico, me dejó una enseñanza fundamental que hoy define la filosofía de Kinase: <strong>hacer las cosas con tranquilidad</strong>."
                  </p>
                </div>
                
                <p className="text-xs text-slate-655 text-slate-600 leading-relaxed font-medium">
                  La carrera de medicina es de largo aliento. Estudiar con calma, constancia y una estrategia clara reduce el estrés y aumenta la retención cognitiva. No se trata de memorizar sin descanso, sino de estructurar la información con serenidad para conectar la teoría con la práctica clínica real.
                </p>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Si te sientes abrumado con la materia o necesitas ayuda personalizada para organizar tus tiempos, solicita asistencia de nuestros tutores.
                  </p>

                  <a
                    href="https://wa.me/5492996232195?text=Hola,%20vengo%20del%20Panel%20VIP%20de%20Kinase.%20Necesito%20ayuda%20u%20orientación%20con%20mis%20estudios."
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-lg bg-emerald-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 text-center transition shadow-sm"
                  >
                    💬 Solicitar ayuda
                  </a>
                </div>
              </div>

            </div>

          </div>

          <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800">
            Kinase Premium VIP Cockpit • Diseñado para la Excelencia Estudiantil Médica
          </div>

        </div>
      )}
    </div>
  )
}
