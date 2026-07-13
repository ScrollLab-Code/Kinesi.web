import { useState } from "react"
import { motion } from "framer-motion"

type PremiumProps = {
  isPremium: boolean
  onActivate: (code: string) => boolean
  onDeactivate?: () => void
}

type Question = {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  reference: string
}

export default function Premium({ isPremium, onActivate, onDeactivate }: PremiumProps) {
  const [activationCode, setActivationCode] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [simulatedCode, setSimulatedCode] = useState("")

  // Quiz game state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  // Countdown timer simulation
  const daysLeft = 12
  
  const quizQuestions: Question[] = [
    {
      id: 1,
      question: "¿Qué nervio perfora al músculo coracobraquial (el nervio perforado de Casserius)?",
      options: ["Nervio mediano", "Nervio musculocutáneo", "Nervio cubital", "Nervio radial"],
      correctIndex: 1,
      explanation: "El nervio musculocutáneo perfora al coracobraquial y luego discurre entre el bíceps braquial y el músculo braquial anterior, inervando a todos los flexores del compartimento anterior del brazo.",
      reference: "Latarjet - Ruiz Liard, Tomo 1, Capítulo de Nervios del Miembro Superior"
    },
    {
      id: 2,
      question: "¿Cuál es el principal elemento óseo que pasa por el surco epitrócleo-olecraniano en el codo?",
      options: ["Nervio radial", "Arteria colateral cubital", "Nervio cubital", "Arteria braquial profunda"],
      correctIndex: 2,
      explanation: "El nervio cubital pasa por la cara posterior de la articulación del codo, discurriendo por el surco cubital (canal epitrócleo-olecraniano) antes de ingresar al antebrazo.",
      reference: "Latarjet - Ruiz Liard, Tomo 1, Anatomía de Codo"
    },
    {
      id: 3,
      question: "En el ciclo cardíaco, ¿cuál es el evento fisiológico inmediato que ocurre tras el cierre de las válvulas auriculoventriculares?",
      options: ["Llenado rápido ventricular", "Eyección rápida ventricular", "Contracción isovolumétrica", "Relajación isovolumétrica"],
      correctIndex: 2,
      explanation: "La contracción isovolumétrica comienza inmediatamente después del cierre de las válvulas AV (primer ruido cardíaco) y dura hasta que la presión de los ventrículos supera la presión aórtica y pulmonar, abriendo las válvulas semilunares.",
      reference: "Fisiología Médica de Guyton & Hall, Unidad de Fisiología Cardiovascular"
    },
    {
      id: 4,
      question: "¿Cuál de las siguientes hormonas es el principal regulador de la reabsorción de agua libre en el túbulo colector renal?",
      options: ["Aldosterona", "Angiotensina II", "Hormona antidiurética (ADH / Vasopresina)", "Péptido natriurético auricular"],
      correctIndex: 2,
      explanation: "La ADH aumenta la permeabilidad al agua del conducto colector renal al inducir la inserción de canales de acuaporina-2 en las membranas apicales de las células principales.",
      reference: "Fisiología Médica de Guyton & Hall, Regulación Renal de la Osmolaridad"
    },
    {
      id: 5,
      question: "¿Cuál de las siguientes estructuras anatómicas delimita el canal del pulso en la muñeca lateralmente?",
      options: ["Tendón del músculo flexor cubital del carpo", "Tendón del músculo braquiorradial (supinador largo)", "Tendón del flexor radial del carpo (palmar mayor)", "Arteria radial"],
      correctIndex: 1,
      explanation: "El canal del pulso radial está delimitado lateralmente por el tendón del supinador largo (braquiorradial) y medialmente por el tendón del palmar mayor (flexor radial del carpo). La arteria radial viaja dentro del canal.",
      reference: "Latarjet - Ruiz Liard, Anatomía del Antebrazo y Muñeca"
    }
  ]

  const handleNextQuestion = () => {
    if (selectedOptionIndex === quizQuestions[currentQuestionIndex].correctIndex) {
      setQuizScore(prev => prev + 1)
    }

    setSelectedOptionIndex(null)
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedOptionIndex(null)
    setQuizScore(0)
    setQuizCompleted(false)
  }

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
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">Simulador de Gymkana</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-normal">
                    Ponte a prueba con simulacros prácticos cronometrados con reconocimiento de estructuras.
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
        <div className="space-y-8">
          
          {/* Welcome Banner */}
          <div className="rounded-2xl border border-amber-500 bg-gradient-to-br from-[#1c180d] to-[#0c1815] p-6 text-white clinical-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
            
            <div className="space-y-1 z-10">
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-500">
                VIP Academic Environment
              </span>
              <h3 className="text-2xl font-black tracking-tight">
                ¡Bienvenido a tu Cockpit Médico de Alto Rendimiento!
              </h3>
              <p className="text-xs text-slate-355 leading-relaxed max-w-2xl font-medium">
                Tienes acceso total desbloqueado. Utiliza las pestañas del menú superior para navegar entre el Muro, el Simulador de Gymkana, tus planificadores y tu Creador de Hábitos.
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
              <span className="text-[10px] text-emerald-455 block font-semibold">Quedan {daysLeft} días</span>
            </div>
          </div>

          {/* Grid de widgets */}
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            
            {/* Banco de Choice Premium */}
            <div className="glass-card rounded-2xl p-6 border border-amber-500/35 clinical-shadow space-y-4">
              <div className="border-b border-slate-100 dark:border-[#1d3330] pb-2 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Autoevaluación Choice - Nivel Cátedra
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Preguntas avanzadas justificadas para exámenes orales y prácticos.
                  </p>
                </div>
                <span className="rounded bg-emerald-800/10 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:text-emerald-400">
                  Activo
                </span>
              </div>

              {!quizCompleted ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-600 dark:text-amber-400">
                      Pregunta {currentQuestionIndex + 1} de {quizQuestions.length}
                    </span>
                    <span className="text-slate-400">Puntaje: {quizScore}</span>
                  </div>

                  <h5 className="text-xs md:text-sm font-bold text-slate-800 dark:text-white leading-relaxed">
                    {quizQuestions[currentQuestionIndex].question}
                  </h5>

                  <div className="grid gap-2">
                    {quizQuestions[currentQuestionIndex].options.map((option, idx) => {
                      let btnStyle = "border-slate-200 bg-white hover:bg-stone-50 text-slate-700 dark:text-slate-350 dark:bg-[#0c1312]"
                      if (selectedOptionIndex !== null) {
                        if (idx === quizQuestions[currentQuestionIndex].correctIndex) {
                          btnStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                        } else if (idx === selectedOptionIndex) {
                          btnStyle = "border-rose-500 bg-rose-50/50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-450"
                        } else {
                          btnStyle = "border-slate-200 bg-white opacity-40 text-slate-400"
                        }
                      }

                      return (
                        <button
                          key={option}
                          onClick={() => selectedOptionIndex === null && setSelectedOptionIndex(idx)}
                          disabled={selectedOptionIndex !== null}
                          className={`w-full rounded-xl border p-3.5 text-xs text-left font-semibold transition ${btnStyle}`}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>

                  {selectedOptionIndex !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-slate-50 dark:bg-[#0d1615] border border-slate-200 dark:border-[#1d3330] p-4 text-xs space-y-2"
                    >
                      <p className="font-bold text-slate-900 dark:text-white">
                        {selectedOptionIndex === quizQuestions[currentQuestionIndex].correctIndex ? "¡Respuesta Correcta!" : "Respuesta Incorrecta"}
                      </p>
                      <p className="text-slate-650 dark:text-slate-400 leading-relaxed font-medium">
                        {quizQuestions[currentQuestionIndex].explanation}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-455">
                        Referencia: {quizQuestions[currentQuestionIndex].reference}
                      </p>

                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="mt-3 rounded-lg bg-emerald-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 transition"
                      >
                        {currentQuestionIndex < quizQuestions.length - 1 ? "Siguiente Pregunta" : "Finalizar Autoevaluación"}
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <h5 className="font-bold text-lg text-slate-900 dark:text-white">Simulador Completado</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Has acertado <strong className="text-emerald-800 dark:text-emerald-400 text-sm">{quizScore}</strong> de <strong>{quizQuestions.length}</strong> preguntas.
                  </p>
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-5 py-2.5 transition"
                  >
                    Reiniciar Test Choice
                  </button>
                </div>
              )}
            </div>

            {/* Columna Derecha: AI Feedback & Asesor */}
            <div className="space-y-6">
              
              {/* Asesor IA Widget */}
              <div className="glass-card rounded-2xl p-5 border border-amber-500/35 clinical-shadow space-y-3">
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-amber-500">
                  AI Academic Coach
                </span>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white mt-1">Recomendación Clínica Personalizada</h4>
                
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Hemos analizado tus bloques del <strong>Planificador Semanal</strong>. Tu mayor foco de estudio esta semana corresponde a la anatomía del Miembro Superior. Te sugerimos realizar la <strong>Gymkana de Codo y Antebrazo</strong> para afianzar el reconocimiento antes de tu clase de repaso de este viernes.
                </p>
                <div className="rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 p-3 text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold leading-relaxed">
                  Tip del Tutor: En miembro superior, asocia cada accidente óseo siempre con el músculo que se inserta allí para no memorizar en vano.
                </div>
              </div>

              {/* Quick stats tracker */}
              <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-[#1d3330] clinical-shadow">
                <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                  Tus Estadísticas VIP
                </h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="border border-slate-100 dark:border-[#1d3330] rounded-xl p-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Horas de Estudio</span>
                    <span className="text-xl font-black text-emerald-800 dark:text-emerald-400 block mt-1">24 hs</span>
                    <span className="text-[9px] text-slate-500 block">Esta semana</span>
                  </div>

                  <div className="border border-slate-100 dark:border-[#1d3330] rounded-xl p-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Mnemotecnias</span>
                    <span className="text-xl font-black text-amber-600 block mt-1">12 activas</span>
                    <span className="text-[9px] text-slate-500 block">En tus notas</span>
                  </div>
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
