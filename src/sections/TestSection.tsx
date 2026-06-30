import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"


const questions = [
  {
    question: "¿Qué es lo que más te cuesta al estudiar Anatomía, Histología o Fisiología?",
    options: [
      "Organizar la gran cantidad de páginas y apuntes",
      "Memorizar detalles y preparados prácticos",
      "Expresarme con fluidez y vocabulario técnico en el examen oral",
      "Mantener el ritmo de lectura del cronograma semanal",
    ],
  },
  {
    question: "¿Cuántas horas promedio le dedicas al estudio de medicina por día?",
    options: ["Menos de 2 horas", "2 a 4 horas", "5 a 7 horas", "Más de 7 horas"],
  },
  {
    question: "¿Cómo llegas normalmente a una mesa de examen oral o práctico?",
    options: [
      "Muy nervioso, con miedo a quedarme en blanco en el preparado",
      "Desorganizado, con temas importantes sin leer del todo",
      "Con dudas en la correlación clínica o fisiológica",
      "Seguro del vocabulario y los esquemas clave",
    ],
  },
  {
    question: "¿Qué tipo de apoyo académico crees que destrabaría tu rendimiento?",
    options: [
      "Simulacros uno a uno de examen oral con tutores avanzados",
      "Plan de estudio semanal y seguimiento de avance",
      "Resúmenes validados, atlas explicados y flashcards Anki",
      "Mentoría integral y control de hábitos",
    ],
  },
]

type Lead = {
  name: string
  lastname: string
  email: string
  phone: string
  career: string
  result: string
  answers: string
}

const createAcademicHelpMessage = (lead: Lead) =>
  [
    "Nueva solicitud de ayuda académica (Kinase Medicina).",
    `Nombre: ${lead.name} ${lead.lastname}`,
    `Email: ${lead.email}`,
    `WhatsApp: ${lead.phone}`,
    `Carrera/Materia: ${lead.career}`,
    `Diagnóstico: ${lead.result}`,
    `Respuestas detalladas: ${lead.answers}`,
  ].join("\n")

const createAcademicHelpWhatsAppLink = (message: string) => {
  return `https://wa.me/5491133334449?text=${encodeURIComponent(message)}`
}

export default function TestSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selected, setSelected] = useState("")
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
    career: "",
  })

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const nextQuestion = () => {
    if (!selected) return

    const updatedAnswers = [...answers, selected]
    setAnswers(updatedAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelected("")
    } else {
      setFinished(true)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion === 0) return
    setCurrentQuestion((current) => current - 1)
    setSelected("")
  }

  const generateResult = () => {
    const text = answers.join(" ")

    if (text.includes("Organizar la gran cantidad") || text.includes("Desorganizado")) {
      return {
        title: "Tu prioridad es el Ordenamiento y Planificación del Volumen",
        description:
          "En medicina, leer todo de corrido no funciona. Necesitas un cronograma inverso que divida el atlas y la teoría en bloques manejables con hitos claros por semana.",
      }
    }

    if (text.includes("preparados prácticos") || text.includes("nervioso, con miedo")) {
      return {
        title: "Necesitas Entrenamiento Práctico y Manejo de la Ansiedad",
        description:
          "El pánico en el preparado o el microscopio se resuelve con simulacros bajo presión. Debes practicar describir la muestra de adentro hacia afuera, con orden histológico u anatómico.",
      }
    }

    return {
      title: "Tu foco debe estar en la Integración y la Oratoria Médica",
      description:
        "Rendir oral requiere precisión en la terminología médica. Te beneficiarás de simulaciones individuales para pulir la argumentación y la seguridad frente al docente.",
    }
  }

  const result = generateResult()

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
      !formData.career
    ) {
      setSubmitError("Completa todos los campos antes de enviar.")
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    const lead = {
      name: formData.name,
      lastname: formData.lastname,
      email: formData.email,
      phone: formData.phone,
      career: formData.career,
      result: result.title,
      answers: answers.join(", "),
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
      setSubmitError("Ocurrió un error al intentar enviar tu diagnóstico.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sent) {
    return (
      <section id="diagnostico" className="bg-emerald-50/50 py-12 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-800">
              ✓
            </div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
              Diagnóstico Enviado
            </p>

            <h2 className="mb-3 text-2xl font-bold text-slate-900 font-sans">
              Tu análisis preliminar está listo
            </h2>

            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              Se abrió la ventana de comunicación de WhatsApp. Un tutor de medicina evaluará tu situación particular para coordinar una entrevista de acompañamiento sin cargo.
            </p>

            <div className="space-y-2.5 text-left bg-stone-50 p-4 rounded-lg mb-6 border border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span className="text-slate-700">Recibiremos tus respuestas de cursada.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span className="text-slate-700">Analizaremos la cátedra y tus bloqueos habituales.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span className="text-slate-700">Coordinaremos una llamada de 15 minutos.</span>
              </div>
            </div>

            <a
              href="#inicio"
              className="inline-block rounded-lg bg-emerald-850 border border-slate-900 px-6 py-2.5 text-xs font-bold text-slate-900 transition hover:bg-slate-100"
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
                Información de Cursada
              </p>

              <h2 className="text-2xl font-bold text-slate-900">
                Coordinar Devolución del Test
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Completa tus datos de contacto para enviarle tu diagnóstico al tutor de medicina.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ej. Martín"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Apellido</label>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Ej. Gómez"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Ej. martin@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Celular / WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Ej. +54 9 11 1234 5678"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Materia o Cátedra que estás cursando</label>
                <input
                  type="text"
                  name="career"
                  placeholder="Ej. Anatomía Cátedra II - Fmed"
                  value={formData.career}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20"
                />
              </div>

              {submitError && (
                <p className="rounded bg-rose-50 border border-rose-100 p-2.5 text-xs font-semibold text-rose-700">
                  {submitError}
                </p>
              )}

              <div className="grid gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-emerald-800 py-2.5 text-xs font-bold text-white transition hover:bg-slate-900 disabled:bg-slate-400"
                >
                  {isSubmitting ? "Generando link..." : "Enviar Diagnóstico por WhatsApp"}
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
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-center">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 text-lg">
              🎯
            </div>

            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
              Tu Perfil de Aprendizaje
            </p>

            <h2 className="mb-2 text-xl font-bold text-slate-950">
              {result.title}
            </h2>

            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              {result.description}
            </p>

            <div className="mb-6 bg-slate-50 p-4 rounded-lg text-left border border-slate-100 text-xs">
              <p className="font-bold text-emerald-800 mb-2">Respuestas analizadas:</p>
              <div className="space-y-1">
                {answers.map((answer, idx) => (
                  <div key={idx} className="flex gap-1.5 items-start text-slate-600">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>{answer}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="w-full rounded-lg bg-emerald-800 py-2.5 text-xs font-bold text-white transition hover:bg-slate-900"
              >
                Solicitar Entrevista con Tutor
              </button>
              <button
                onClick={() => {
                  setAnswers([])
                  setCurrentQuestion(0)
                  setFinished(false)
                  setSelected("")
                }}
                className="w-full rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-800"
              >
                Recomenzar Cuestionario
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="diagnostico" className="bg-stone-50 py-12 px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
            Autoevaluación de Cursada
          </p>

          <h2 className="text-2xl font-bold text-slate-950">
            Diagnóstico de Desempeño
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            4 preguntas rápidas diseñadas por médicos y tutores de Kinase para identificar tus puntos débiles.
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
                className="h-full rounded-full bg-emerald-855 transition-all duration-300 bg-emerald-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h3 className="mb-5 text-base font-bold leading-snug text-slate-900">
            {question.question}
          </h3>

          <div className="grid gap-2 mb-6">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelected(option)}
                className={`rounded-lg border p-3 text-left text-xs font-medium transition ${
                  selected === option
                    ? "border-emerald-700 bg-emerald-50/50 text-slate-950 font-bold"
                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/10"
                }`}
              >
                {option}
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
              disabled={!selected}
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
