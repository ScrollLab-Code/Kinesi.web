import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"

type QuestionOption = {
  text: string
  points: number
}

type Question = {
  question: string
  options: QuestionOption[]
}

const questions: Question[] = [
  {
    question: "1. ¿Cómo gestionas el gran volumen de material teórico y práctico en la semana?",
    options: [
      { text: "No tengo planificación; leo lo que puedo día a día de forma reactiva.", points: 1 },
      { text: "Intento seguir el cronograma oficial de la cátedra pero siempre me atraso.", points: 2 },
      { text: "Planifico mis lecturas pero me cuesta mantener repasos de temas pasados.", points: 3 },
      { text: "Tengo un cronograma al día y aplico repetición espaciada sistemáticamente.", points: 4 },
    ],
  },
  {
    question: "2. ¿Cuál es tu método principal de retención e incorporación de conceptos complejos?",
    options: [
      { text: "Lectura pasiva de libros, resúmenes ajenos y subrayado tradicional.", points: 1 },
      { text: "Relectura reiterada de apuntes y realización de resúmenes escritos a mano.", points: 2 },
      { text: "Uso de flashcards digitales y autoevaluaciones de forma intermitente.", points: 3 },
      { text: "Integración de esquemas activos, repaso espaciado y explicación de conceptos en voz alta.", points: 4 },
    ],
  },
  {
    question: "3. ¿Cómo te desenvuelves al exponer un tema técnico complejo en una evaluación o examen oral?",
    options: [
      { text: "Me bloqueo por la ansiedad y me cuesta estructurar la exposición.", points: 1 },
      { text: "Conozco la teoría pero me falta vocabulario técnico y fluidez al hablar.", points: 2 },
      { text: "Expongo de forma aceptable si me guían con preguntas, pero me cuesta iniciar solo.", points: 3 },
      { text: "Describo con orden lógico, seguridad y terminología exacta.", points: 4 },
    ],
  },
  {
    question: "4. ¿Cuál es tu nivel habitual de estrés y agotamiento durante la cursada?",
    options: [
      { text: "Alto estrés, problemas de sueño y dificultad para concentrarme por burnout.", points: 1 },
      { text: "Pánico antes de los prácticos semanales pero logro controlarlo para aprobar.", points: 2 },
      { text: "Estrés y cansancio normales antes de entregas, pero mantengo el equilibrio.", points: 3 },
      { text: "Tranquilo y motivado; balanceo bien el estudio con el descanso real.", points: 4 },
    ],
  },
  {
    question: "5. ¿Con qué frecuencia realizas simulacros de examen bajo condiciones reales?",
    options: [
      { text: "Nunca; suelo evaluar mi conocimiento recién el día del examen oficial.", points: 1 },
      { text: "Hago simulacros o resuelvo parciales pasados únicamente el día anterior.", points: 2 },
      { text: "Resuelvo simulacros con frecuencia pero sin controlar estrictamente el tiempo.", points: 3 },
      { text: "Realizo autoevaluaciones cronometradas al terminar cada unidad importante.", points: 4 },
    ],
  },
]

type Lead = {
  name: string
  lastname: string
  email: string
  phone: string
  difficulty: string
  resultStatus: "Rojo" | "Amarillo" | "Verde"
  score: number
  answers: string
}

const createAcademicHelpMessage = (lead: Lead) =>
  [
    "Nuevo Diagnóstico Semáforo (Kinase Academy)",
    `Nombre: ${lead.name} ${lead.lastname}`,
    `Email: ${lead.email}`,
    `WhatsApp: ${lead.phone}`,
    `Dificultad de Estudio: ${lead.difficulty}`,
    `Semáforo: [${lead.resultStatus}] (Puntaje: ${lead.score}/20)`,
    `Respuestas: ${lead.answers}`,
  ].join("\n")

const createAcademicHelpWhatsAppLink = (message: string) => {
  return `https://wa.me/5492996232195?text=${encodeURIComponent(message)}`
}

export default function TestSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<QuestionOption | null>(null)
  const [scores, setScores] = useState<number[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [finished, setFinished] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [sent, setSent] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    difficulty: "",
  })

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const nextQuestion = () => {
    if (!selectedOption) return

    setScores((prev) => [...prev, selectedOption.points])
    setAnswers((prev) => [...prev, selectedOption.text])

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
    } else {
      setFinished(true)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion === 0) return
    setCurrentQuestion((current) => current - 1)
    
    // Remove last scores and answers
    setScores((prev) => prev.slice(0, -1))
    setAnswers((prev) => prev.slice(0, -1))
    setSelectedOption(null)
  }

  const totalScore = scores.reduce((sum, current) => sum + current, 0)

  const getSemaphoreStatus = (): {
    status: "Rojo" | "Amarillo" | "Verde"
    title: string
    description: string
    colorClass: string
    bgLight: string
    borderClass: string
  } => {
    if (totalScore <= 10) {
      return {
        status: "Rojo",
        title: "Semáforo Rojo: Riesgo Académico Alto / Urgente",
        description: "Tu nivel de desorganización del volumen de estudio, la falta de simulacros regulares y la alta carga de ansiedad oral indican un riesgo crítico de recursada. Necesitas asistencia urgente para cambiar el método de estudio de inmediato.",
        colorClass: "bg-rose-600",
        bgLight: "bg-rose-50 border-rose-200 text-rose-800",
        borderClass: "border-rose-300"
      }
    }
    if (totalScore <= 15) {
      return {
        status: "Amarillo",
        title: "Semáforo Amarillo: Riesgo Académico Medio / Alerta",
        description: "Estás dedicando tiempo y esfuerzo, pero careces de un método activo de memorización a largo plazo o sufres fallos de oratoria frente al docente. Con un plan estructurado y simulacros orales periódicos puedes estabilizar tu rendimiento y asegurar la cursada.",
        colorClass: "bg-amber-500",
        bgLight: "bg-amber-50 border-amber-200 text-amber-800",
        borderClass: "border-amber-300"
      }
    }
    return {
      status: "Verde",
      title: "Semáforo Verde: Rendimiento Estable y Optimizable",
      description: "Tus hábitos de estudio y tu balance semanal son buenos. Puedes optimizar tu rendimiento incorporando flashcards de Anki de nivel avanzado, simulacros cronometrados de examen integrador y técnicas de oratoria para apuntar al promedio de excelencia (9-10).",
      colorClass: "bg-emerald-600",
      bgLight: "bg-emerald-50 border-emerald-250 text-emerald-800",
      borderClass: "border-emerald-300"
    }
  }

  const result = getSemaphoreStatus()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()

    if (
      !formData.name ||
      !formData.lastname ||
      !formData.email ||
      !formData.phone ||
      !formData.difficulty
    ) {
      setSubmitError("Completa todos los campos antes de enviar.")
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    const lead: Lead = {
      name: formData.name,
      lastname: formData.lastname,
      email: formData.email,
      phone: formData.phone,
      difficulty: formData.difficulty,
      resultStatus: result.status,
      score: totalScore,
      answers: answers.map((ans, index) => `P${index + 1}: ${ans}`).join("; "),
    }

    try {
      const message = createAcademicHelpMessage(lead)
      window.open(
        createAcademicHelpWhatsAppLink(message),
        "_blank",
        "noopener,noreferrer"
      )
      setSent(true)
    } catch (error) {
      setSubmitError("No se pudo enviar el diagnóstico.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sent) {
    return (
      <section id="diagnostico" className="bg-emerald-50/20 py-12 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-850">
              ✓
            </div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
              Diagnóstico Recibido
            </p>

            <h2 className="mb-3 text-2xl font-bold text-slate-900">
              Devolución en Proceso
            </h2>

            <p className="mb-6 text-xs leading-relaxed text-slate-500">
              El tutor de Kinase Academy ya recibió el resultado de tu semáforo [{result.status}] y tus respuestas. Te contactaremos vía WhatsApp para acordar una entrevista corta de 15 minutos sin cargo.
            </p>

            <a
              href="#inicio"
              className="inline-block rounded-lg bg-slate-900 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </section>
    )
  }

  if (showForm) {
    return (
      <section id="diagnostico" className="bg-stone-50 py-12 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 text-center">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
                Coordinar Análisis de Semáforo
              </p>

              <h2 className="text-2xl font-bold text-slate-900">
                Completa tu Ficha Estudiantil
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Necesitamos tus datos para vincular tus resultados al tutor médico que realizará la devolución.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-650 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-655 mb-1">Apellido</label>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Tu apellido"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-655 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="ej. estudiante@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-655 mb-1">Celular / WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="ej. +54 9 11 1234 5678"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-655 mb-1">Dificultad principal en tu estudio</label>
                <input
                  type="text"
                  name="difficulty"
                  placeholder="Ej. Falta de tiempo, organización, ansiedad en orales, etc."
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
              </div>

              {submitError && (
                <p className="rounded bg-rose-50 border border-rose-100 p-2 text-xs text-rose-700">
                  {submitError}
                </p>
              )}

              <div className="grid gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-emerald-800 py-2.5 text-xs font-bold text-white transition hover:bg-slate-900 disabled:bg-slate-300"
                >
                  {isSubmitting ? "Enviando..." : "Enviar por WhatsApp"}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-800"
                >
                  Atrás
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  }

  if (finished) {
    return (
      <section id="diagnostico" className="bg-stone-50 py-12 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              
              {/* Semáforo Visual Layout */}
              <div className="mb-4">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Estado de Semáforo</p>
                <div className="flex gap-4 bg-slate-900 px-4 py-2.5 rounded-full shadow-inner border border-slate-800">
                  <div className={`h-8 w-8 rounded-full transition-all duration-300 ${result.status === "Rojo" ? "bg-rose-600 shadow-[0_0_12px_#e11d48]" : "bg-rose-950/40"}`} />
                  <div className={`h-8 w-8 rounded-full transition-all duration-300 ${result.status === "Amarillo" ? "bg-amber-500 shadow-[0_0_12px_#f59e0b]" : "bg-amber-950/40"}`} />
                  <div className={`h-8 w-8 rounded-full transition-all duration-300 ${result.status === "Verde" ? "bg-emerald-500 shadow-[0_0_12px_#10b981]" : "bg-emerald-950/40"}`} />
                </div>
              </div>

              <h2 className="mb-2 text-xl font-bold text-slate-950">
                {result.title}
              </h2>
              
              <div className={`rounded-lg border px-4 py-3 text-xs text-left mb-6 leading-relaxed ${result.bgLight}`}>
                {result.description}
              </div>
            </div>

            <div className="mb-6 bg-slate-50 p-4 rounded-lg text-left border border-slate-100 text-xs">
              <p className="font-bold text-slate-700 mb-2">Desglose de Puntuación:</p>
              <p className="text-slate-500 mb-3">Obtuviste un puntaje de <strong>{totalScore}/20</strong>. Las respuestas indican necesidades en:</p>
              <div className="space-y-1.5">
                {answers.map((answer, idx) => (
                  <div key={idx} className="flex gap-1.5 items-start text-slate-600">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>P{idx+1}: {answer}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="w-full rounded-lg bg-emerald-800 py-2.5 text-xs font-bold text-white transition hover:bg-slate-900 animate-pulse"
              >
                Solicitar Plan de Acción Personalizado (Gratis)
              </button>
              <button
                onClick={() => {
                  setScores([])
                  setAnswers([])
                  setCurrentQuestion(0)
                  setFinished(false)
                  setSelectedOption(null)
                }}
                className="w-full rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-800"
              >
                Volver a Hacer el Test
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="diagnostico" className="bg-stone-50 py-12 px-6 border-b border-slate-100">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
            Diagnóstico de Desempeño
          </p>

          <h2 className="text-2xl font-bold text-slate-950">
            Test de Rendimiento Académico
          </h2>

          <p className="text-xs text-slate-500 mt-1 font-sans">
            5 preguntas clave diseñadas para evaluar tu nivel de riesgo académico en medicina.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Progress */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-semibold text-slate-500">
                Pregunta {currentQuestion + 1} de {questions.length}
              </span>
              <span className="font-bold text-emerald-800">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-700 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h3 className="mb-5 text-sm font-bold leading-relaxed text-slate-900">
            {question.question}
          </h3>

          <div className="grid gap-2 mb-6">
            {question.options.map((option) => (
              <button
                key={option.text}
                type="button"
                onClick={() => setSelectedOption(option)}
                className={`rounded-lg border p-3 text-left text-xs font-medium transition ${
                  selectedOption?.text === option.text
                    ? "border-emerald-700 bg-emerald-50/50 text-slate-950 font-bold"
                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/10"
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 transition hover:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <button
              onClick={nextQuestion}
              disabled={!selectedOption}
              className="rounded-lg bg-emerald-800 py-2 text-xs font-bold text-white transition hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
