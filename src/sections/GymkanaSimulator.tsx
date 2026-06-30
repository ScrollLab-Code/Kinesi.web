import { useState, useEffect } from "react"
import { motion } from "framer-motion"

type Stage = {
  id: number
  image: string
  title: string
  pointerLocation: string
  correctAnswers: string[]
  hint: string
}

const stages: Stage[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
    title: "Identificación Histológica Muestra A",
    pointerLocation: "Señala la hilera de células epiteliales cúbicas con núcleos redondos centrales.",
    correctAnswers: ["epitelio simple cubico", "epitelio cubico simple", "epitelio cubico"],
    hint: "Observa la forma de los núcleos y la cantidad de capas celulares que recubren el conducto."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=800&q=80",
    title: "Identificación Anatómica Muestra B",
    pointerLocation: "Señala el vaso que discurre medial al bíceps y desciende por el canal bicipital interno.",
    correctAnswers: ["arteria braquial", "arteria humeral", "braquial", "humeral"],
    hint: "Es la continuación directa del tronco axilar después del borde inferior del redondo mayor."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1579154204601-01588f351166?auto=format&fit=crop&w=800&q=80",
    title: "Identificación Histológica Muestra C",
    pointerLocation: "Señala la estructura encapsulada con abundantes nódulos linfoides y senos subcapsulares.",
    correctAnswers: ["ganglio linfatico", "ganglio", "linfatico"],
    hint: "Es un órgano linfoide secundario intercalado en el trayecto de los vasos linfáticos."
  }
]

export default function GymkanaSimulator() {
  const [currentStage, setCurrentStage] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(30)
  const [isFinished, setIsFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [answersLog, setAnswersLog] = useState<{ stage: string; user: string; correct: boolean }[]>([])

  const stage = stages[currentStage]

  // Timer loop
  useEffect(() => {
    if (isFinished) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNextStage(true) // Time out acts as submitting wrong answer
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentStage, isFinished])

  const handleNextStage = (timedOut = false) => {
    const cleanAnswer = userAnswer.trim().toLowerCase()
    const isCorrect = !timedOut && stage.correctAnswers.some(ans => cleanAnswer.includes(ans))

    if (isCorrect) setScore(prev => prev + 1)

    setAnswersLog(prev => [
      ...prev,
      {
        stage: stage.title,
        user: timedOut ? "Tiempo agotado" : userAnswer,
        correct: isCorrect
      }
    ])

    setUserAnswer("")
    setShowHint(false)
    setTimeLeft(30)

    if (currentStage < stages.length - 1) {
      setCurrentStage(prev => prev + 1)
    } else {
      setIsFinished(true)
    }
  }

  const getSemaphore = () => {
    const pct = (score / stages.length) * 100
    if (pct <= 40) return { status: "Rojo", label: "Insuficiente - Repasar Prácticos", color: "bg-rose-600 shadow-[0_0_12px_#e11d48]" }
    if (pct <= 80) return { status: "Amarillo", label: "Aprobado - Refinar Nombres", color: "bg-amber-500 shadow-[0_0_12px_#f59e0b]" }
    return { status: "Verde", label: "Excelente - Promedio Sobresaliente", color: "bg-emerald-500 shadow-[0_0_12px_#10b981]" }
  }

  const result = getSemaphore()

  if (isFinished) {
    return (
      <section className="bg-stone-50 py-12 px-6">
        <div className="mx-auto max-w-xl">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-center">
            
            {/* Visual Traffic Light Indicator */}
            <div className="mb-4 flex flex-col items-center">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Resultado Final Gymkana</p>
              <div className="flex gap-4 bg-slate-900 px-4 py-2.5 rounded-full border border-slate-800 shadow-inner">
                <div className={`h-8 w-8 rounded-full ${result.status === "Rojo" ? result.color : "bg-rose-950/40"}`} />
                <div className={`h-8 w-8 rounded-full ${result.status === "Amarillo" ? result.color : "bg-amber-950/40"}`} />
                <div className={`h-8 w-8 rounded-full ${result.status === "Verde" ? result.color : "bg-emerald-950/40"}`} />
              </div>
              <h3 className="text-sm font-bold text-slate-950 mt-3">{result.label}</h3>
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Simulación Finalizada</h2>
            <p className="text-xs text-slate-500 mb-6">
              Aprobaste <strong>{score} de {stages.length}</strong> preparados anatómicos del circuito cronometrado.
            </p>

            <div className="mb-6 bg-slate-50 p-4 rounded-lg text-left border border-slate-100 text-xs space-y-2">
              <p className="font-bold text-slate-700">Detalle de respuestas:</p>
              {answersLog.map((log, index) => (
                <div key={index} className="flex justify-between items-center text-xs py-1 border-b border-slate-200 last:border-b-0">
                  <span className="text-slate-600 font-semibold">{log.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono italic">"{log.user}"</span>
                    <span className={`font-bold ${log.correct ? "text-emerald-700" : "text-rose-600"}`}>
                      {log.correct ? "Correcto" : "Incorrecto"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setCurrentStage(0)
                setUserAnswer("")
                setTimeLeft(30)
                setIsFinished(false)
                setScore(0)
                setAnswersLog([])
              }}
              className="w-full rounded-lg bg-emerald-800 py-2.5 text-xs font-bold text-white transition hover:bg-slate-900"
            >
              Reiniciar Simulación de Examen
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-stone-50 py-12 px-6">
      <div className="mx-auto max-w-2xl">
        
        {/* Header Status */}
        <div className="mb-6 flex justify-between items-center bg-slate-900 text-white p-3.5 rounded-xl text-xs border border-slate-800 shadow-md">
          <div>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Circuito de Examen:</p>
            <h4 className="font-bold mt-0.5">Estación {currentStage + 1} de {stages.length}</h4>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${
              timeLeft <= 8 ? "bg-rose-600 text-white animate-pulse" : "bg-slate-800 text-emerald-400"
            }`}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
          </div>
        </div>

        {/* Prepared Slide Canvas */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-slate-100 bg-black aspect-video flex items-center justify-center">
            <img 
              src={stage.image} 
              alt={stage.title} 
              className="w-full h-full object-cover opacity-90"
            />
            {/* Visual exam Pin/Pointer overlay indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="h-4.5 w-4.5 rounded-full border-2 border-white bg-rose-600 animate-ping absolute" />
              <div className="h-4.5 w-4.5 rounded-full border-2 border-white bg-rose-600 shadow-lg relative z-10 flex items-center justify-center text-[8px] text-white font-bold">
                A
              </div>
              <div className="w-0.5 h-8 bg-rose-600 shadow-md transform translate-y-0.5" />
            </div>
          </div>

          <div className="text-xs space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">{stage.title}</h3>
            <p className="text-slate-500 leading-normal bg-stone-50 p-2.5 rounded-lg border border-slate-100">
              📍 <strong>Consigna:</strong> Escribe la nomenclatura oficial de la estructura indicada por el alfiler <strong>"A"</strong>.
            </p>
          </div>

          {/* Form action input */}
          <div className="space-y-3 pt-2">
            <input 
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Ej. arteria braquial (sin acentos)"
              className="w-full rounded-lg border border-slate-200 bg-stone-50 px-4 py-2.5 outline-none focus:border-emerald-600 focus:bg-white text-xs font-semibold text-slate-800"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userAnswer.trim()) handleNextStage()
              }}
            />

            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setShowHint(true)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:border-slate-800 transition"
              >
                Pista (Ver Referencia)
              </button>
              <button 
                onClick={() => handleNextStage()}
                disabled={!userAnswer.trim()}
                className="rounded-lg bg-emerald-800 px-5 py-2 text-xs font-bold text-white transition hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                Confirmar Estación
              </button>
            </div>

            {showHint && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg leading-relaxed"
              >
                💡 <strong>Pista Académica:</strong> {stage.hint}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
