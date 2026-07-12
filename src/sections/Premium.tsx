import { useState } from "react"
import { motion } from "framer-motion"

type PremiumProps = {
  isPremium: boolean
  onActivate: (code: string) => boolean
}

type Question = {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  reference: string
}

export default function Premium({ isPremium, onActivate }: PremiumProps) {
  const [activationCode, setActivationCode] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [simulatedCode, setSimulatedCode] = useState("")
  const [activePremiumTab, setActivePremiumTab] = useState<"banco" | "atlas" | "soporte" | "analisis">("banco")

  // Quiz game state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

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
      setErrorMessage("Código inválido. Asegúrate de copiarlo correctamente (ej. KINASE-PREMIUM-XXXXX).")
    }
  }

  const triggerPaymentSimulation = () => {
    const randomCodeSuffix = Math.floor(1000 + Math.random() * 9000).toString()
    const code = `KINASE-PREMIUM-${randomCodeSuffix}`
    setSimulatedCode(code)
    setShowPaymentModal(true)
    try {
      navigator.clipboard.writeText(code)
    } catch {
      // Ignorar fallo de portapapeles en ciertos navegadores locales
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
              💎 Kinase Premium
            </span>
            <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Desbloquea el Acceso Académico Total
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-350 leading-relaxed">
              Consigue herramientas premium de alto rendimiento clínico, creadas por médicos residentes y tutores de cátedra para garantizar tu regularidad y aprobación.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
            
            {/* Beneficios */}
            <div className="space-y-4">
              <h3 className="text-md font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                ¿Qué incluye tu habilitación Premium?
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 clinical-shadow space-y-2">
                  <span className="text-2xl">⚡</span>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">Banco de Preguntas Avanzado</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-normal">
                    Más de 1500 preguntas Choice y simulacros orales comentados basados en las cátedras de Anatomía, Histo y Fisiología.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 clinical-shadow space-y-2">
                  <span className="text-2xl">🧠</span>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">Atlas Interactivo 3D Completo</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-normal">
                    Accede a guías y modelos de preparados cadavéricos 3D con nomenclaturas y marcas clínicas reales.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 clinical-shadow space-y-2">
                  <span className="text-2xl">💬</span>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">Asesoría Médica Directa 24/7</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-normal">
                    Contacto instantáneo vía WhatsApp con tutores de medicina para resolver dudas urgentes antes de tus exámenes.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 clinical-shadow space-y-2">
                  <span className="text-2xl">📈</span>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">Predicciones Académicas con IA</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-normal">
                    Análisis inteligente que predice tus puntos débiles y te otorga recomendaciones personalizadas basadas en tus notas.
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
                    placeholder="ej. KINASE-PREMIUM-7749"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 text-center text-sm font-bold tracking-widest text-slate-800 dark:text-white uppercase"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-3 transition duration-200 shadow-md shadow-amber-500/10"
                >
                  🚀 Habilitar Acceso Premium
                </button>

                {errorMessage && (
                  <p className="text-xs text-rose-600 dark:text-rose-450 text-center font-bold">
                    ⚠️ {errorMessage}
                  </p>
                )}
              </form>

              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
                <span className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Simulación</span>
                <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-xs text-slate-500 leading-normal">
                  Puedes adquirir tu membresía simulando el flujo de pago sin costo real. Te daremos un código automático al instante.
                </p>

                <button
                  type="button"
                  onClick={triggerPaymentSimulation}
                  className="rounded-lg bg-emerald-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 transition duration-200 shadow-sm"
                >
                  💳 Simular Pago y Obtener Código
                </button>
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
                  ¡Pago Simulado Exitoso!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Hemos procesado tu pago de prueba y se ha enviado tu código de habilitación (simulación).
                </p>

                <div className="bg-slate-50 dark:bg-[#070a09] border border-slate-200 dark:border-[#1d3330] rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Tu código de habilitación
                  </span>
                  <span className="text-lg font-black text-emerald-800 dark:text-emerald-400 tracking-widest block select-all">
                    {simulatedCode}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  * El código se ha copiado en tu portapapeles. Pégalo en el campo de habilitación para desbloquear el contenido premium.
                </p>

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
        // VISTA: PREMIUM HABILITADO
        <div className="space-y-6">
          
          {/* Cabecera Premium */}
          <div className="rounded-2xl border border-amber-600 bg-gradient-to-br from-amber-600/10 to-amber-700/20 dark:from-[#2c1e0a] dark:to-[#170f05] p-5 flex flex-wrap items-center justify-between gap-4 clinical-shadow">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💎</span>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  Estudiante Activo Premium
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-amber-600 dark:text-amber-400">
                    VIP
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Acceso completo e ilimitado desbloqueado correctamente.
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Código de Activación: Activo
            </span>
          </div>

          {/* Navegación Interna Premium */}
          <div className="flex gap-2 border-b border-slate-200 dark:border-[#1d3330] pb-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActivePremiumTab("banco")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activePremiumTab === "banco"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-stone-50 border border-slate-200 text-slate-650 hover:bg-stone-100 dark:bg-[#0d1615] dark:border-[#1d3330] dark:text-emerald-450"
              }`}
            >
              ⚡ Banco de Preguntas
            </button>
            <button
              onClick={() => setActivePremiumTab("atlas")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activePremiumTab === "atlas"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-stone-50 border border-slate-200 text-slate-650 hover:bg-stone-100 dark:bg-[#0d1615] dark:border-[#1d3330] dark:text-emerald-450"
              }`}
            >
              🧠 Atlas 3D Preview
            </button>
            <button
              onClick={() => setActivePremiumTab("soporte")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activePremiumTab === "soporte"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-stone-50 border border-slate-200 text-slate-655 hover:bg-stone-100 dark:bg-[#0d1615] dark:border-[#1d3330] dark:text-emerald-455"
              }`}
            >
              💬 Asistencia 24/7
            </button>
            <button
              onClick={() => setActivePremiumTab("analisis")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activePremiumTab === "analisis"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-stone-50 border border-slate-200 text-slate-655 hover:bg-stone-100 dark:bg-[#0d1615] dark:border-[#1d3330] dark:text-emerald-455"
              }`}
            >
              📈 Predicciones IA
            </button>
          </div>

          {/* CONTENIDOS TABS */}
          <div className="glass-card rounded-2xl p-6 clinical-shadow min-h-[400px] flex flex-col justify-between">
            
            {/* TAB: BANCO DE PREGUNTAS (Quiz interactivo) */}
            {activePremiumTab === "banco" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-[#1d3330] pb-2">
                  <h4 className="font-bold text-md text-slate-900 dark:text-white">
                    Simulador Exclusivo Choice - Medicina
                  </h4>
                  <p className="text-xs text-slate-400">
                    Preguntas avanzadas justificadas para exámenes de regularidad.
                  </p>
                </div>

                {!quizCompleted ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-emerald-800 dark:text-emerald-400">
                        Pregunta {currentQuestionIndex + 1} de {quizQuestions.length}
                      </span>
                      <span className="text-slate-400">Score: {quizScore}</span>
                    </div>

                    <h5 className="text-sm font-bold text-slate-800 dark:text-white">
                      {quizQuestions[currentQuestionIndex].question}
                    </h5>

                    <div className="grid gap-2">
                      {quizQuestions[currentQuestionIndex].options.map((option, idx) => {
                        let btnStyle = "border-slate-200 bg-white hover:bg-stone-50 text-slate-700 dark:text-slate-300 dark:bg-[#0c1312]"
                        if (selectedOptionIndex !== null) {
                          if (idx === quizQuestions[currentQuestionIndex].correctIndex) {
                            btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                          } else if (idx === selectedOptionIndex) {
                            btnStyle = "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-450"
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
                          {selectedOptionIndex === quizQuestions[currentQuestionIndex].correctIndex ? "✅ ¡Respuesta Correcta!" : "❌ Respuesta Incorrecta"}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                          {quizQuestions[currentQuestionIndex].explanation}
                        </p>
                        <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-450">
                          📖 Referencia: {quizQuestions[currentQuestionIndex].reference}
                        </p>

                        <button
                          type="button"
                          onClick={handleNextQuestion}
                          className="mt-3 rounded-lg bg-emerald-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 transition"
                        >
                          {currentQuestionIndex < quizQuestions.length - 1 ? "Siguiente Pregunta" : "Finalizar Test"}
                        </button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <span className="text-4xl">🎉</span>
                    <h5 className="font-bold text-lg text-slate-900 dark:text-white">¡Test Completado!</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Has acertado <strong className="text-emerald-800 dark:text-emerald-400 text-sm">{quizScore}</strong> de <strong>{quizQuestions.length}</strong> preguntas.
                    </p>
                    <button
                      type="button"
                      onClick={resetQuiz}
                      className="rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-5 py-2.5 transition"
                    >
                      Intentar de nuevo
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: ATLAS 3D PREVIEW */}
            {activePremiumTab === "atlas" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-[#1d3330] pb-2">
                  <h4 className="font-bold text-md text-slate-900 dark:text-white">
                    Atlas de Disecciones 3D
                  </h4>
                  <p className="text-xs text-slate-400">
                    Modelados exclusivos en alta fidelidad y reconstrucciones clínicas.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 dark:border-[#1d3330] bg-stone-100 dark:bg-[#0c1312] p-4 flex flex-col justify-center items-center h-[250px] relative overflow-hidden">
                    <span className="text-4xl animate-bounce">💀</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white mt-2">Miembro Superior - Huesos</span>
                    <span className="text-[10px] text-slate-400 mt-1">Renderizado 3D Interactivo Activo</span>
                    
                    <div className="absolute bottom-3 right-3 rounded bg-emerald-800 text-white text-[8px] font-black uppercase px-2 py-0.5">
                      100% Cátedra
                    </div>
                  </div>

                  <div className="space-y-3 flex flex-col justify-center">
                    <h5 className="font-bold text-sm text-slate-800 dark:text-white">
                      Guía del Preparado Clínico: Hombro
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-medium">
                      En este visualizador premium, puedes rotar el miembro para identificar la clavícula, la escápula, el húmero y los ligamentos acromioclaviculares. Cada estructura posee una ventana con su irrigación e inervación.
                    </p>
                    <div className="rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 p-3 text-xs text-teal-850 dark:text-teal-400 font-semibold">
                      💡 Consejo: Utiliza la rueda del mouse para hacer zoom e identificar las inserciones del m. deltoides.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SOPORTE 24/7 */}
            {activePremiumTab === "soporte" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-[#1d3330] pb-2">
                  <h4 className="font-bold text-md text-slate-900 dark:text-white">
                    Soporte Médico y Tutorías Exclusivas
                  </h4>
                  <p className="text-xs text-slate-400">
                    Canal de comunicación directa con médicos residentes y ayudantes de cátedra.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-[#1d3330] p-4 bg-stone-50 dark:bg-[#070a09] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      Dr
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">Dr. Juan P. Giacomassi</h5>
                      <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-450 uppercase">Tutor de Turno Activo</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal font-medium">
                    "Hola. Envía tu captura de pantalla, preparado de atlas o mnemotecnia que no comprendas. Te contestaremos en menos de 15 minutos con un audio aclaratorio y el sustento bibliográfico exacto."
                  </p>

                  <a
                    href="https://wa.me/5491112345678"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold px-4 py-2 transition"
                  >
                    💬 Contactar Tutor por WhatsApp
                  </a>
                </div>
              </div>
            )}

            {/* TAB: ANALISIS PREDICCIONES IA */}
            {activePremiumTab === "analisis" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-[#1d3330] pb-2">
                  <h4 className="font-bold text-md text-slate-900 dark:text-white">
                    Predicciones de Rendimiento y Regularidad
                  </h4>
                  <p className="text-xs text-slate-400">
                    Análisis de tus resultados en simulacros y plan de estudio personalizado.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="border border-slate-200 dark:border-[#1d3330] rounded-xl p-4 text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Predicción de Aprobación</span>
                    <span className="text-2xl font-black text-emerald-800 dark:text-emerald-400 block">87%</span>
                    <span className="text-[9px] text-slate-500 block">Rango de confianza: Alto</span>
                  </div>

                  <div className="border border-slate-200 dark:border-[#1d3330] rounded-xl p-4 text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Materias de Enfoque</span>
                    <span className="text-sm font-bold text-rose-800 dark:text-rose-400 block">Fisiología Renal</span>
                    <span className="text-[9px] text-slate-500 block">Basado en tus últimos simulacros</span>
                  </div>

                  <div className="border border-slate-200 dark:border-[#1d3330] rounded-xl p-4 text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tiempo Estimado de Estudio</span>
                    <span className="text-2xl font-black text-amber-600 block">18 hs</span>
                    <span className="text-[9px] text-slate-500 block">Recomendado esta semana</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-[#1d3330] p-4 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs">
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1">🤖 Recomendación del Asesor IA:</h5>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    Has completado con éxito la identificación de preparados óseos de codo. Tu principal área de debilidad se sitúa en los mecanismos de retroalimentación de Fisiología Renal. Te aconsejamos realizar el simulacro interactivo de fisiología renal antes del examen parcial de este jueves.
                  </p>
                </div>
              </div>
            )}

            <div className="border-t border-slate-100 dark:border-[#1d3330] pt-4 mt-6 text-center text-[10px] text-slate-400">
              Kinase Premium • Diseñado para la excelencia médica • Acreditación VIP Activa
            </div>

          </div>

        </div>
      )}
    </div>
  )
}
