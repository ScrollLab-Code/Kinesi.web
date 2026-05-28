import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { supabase } from "../lib/supabase"

const questions = [
  {
    question: "Que es lo que mas te cuesta al estudiar?",
    options: [
      "Organizarme",
      "Concentrarme",
      "Dejar todo para ultimo momento",
      "Entender los temas",
    ],
  },
  {
    question: "Cuantas horas estudias por dia aproximadamente?",
    options: ["Menos de 1 hora", "1 a 2 horas", "3 a 5 horas", "Mas de 5 horas"],
  },
  {
    question: "Como llegas normalmente a un examen?",
    options: ["Muy nervioso", "Desorganizado", "Normal", "Seguro"],
  },
  {
    question: "Que te gustaria comprar o recibir?",
    options: [
      "Mentoria personalizada",
      "Plan de estudio",
      "Preparacion de parcial",
      "Recursos y plantillas",
    ],
  },
]

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

    if (text.includes("Organizarme") || text.includes("Desorganizado")) {
      return {
        title: "Tu primer salto esta en la organizacion academica",
        description:
          "Necesitas un plan simple, prioridades claras y seguimiento para no repartir energia en temas que no mueven la nota.",
      }
    }

    if (text.includes("Concentrarme") || text.includes("ultimo momento")) {
      return {
        title: "La constancia esta frenando tu rendimiento",
        description:
          "Con bloques de estudio, control de avance y una rutina realista podes salir del ciclo de estudiar a ultimo momento.",
      }
    }

    return {
      title: "Tenes margen para mejorar con una estrategia personalizada",
      description:
        "La plataforma puede ayudarte a combinar comunidad, recursos y acompañamiento experto segun tu carrera y tus examenes.",
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
      const { error } = await supabase.from("leads").insert([lead])

      if (error) throw error

      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lead),
      })

      const emailResult = await emailResponse.json()

      if (!emailResponse.ok) {
        throw new Error(
          emailResult.error ||
            "El lead se guardo, pero no se pudo enviar el email."
        )
      }

      setSent(true)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar el diagnostico. Revisa Supabase y proba otra vez."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sent) {
    return (
      <section id="diagnostico" className="bg-gradient-to-br from-emerald-50 to-emerald-100 py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border-2 border-emerald-300 bg-white p-8 md:p-12 text-center shadow-lg">
            <div className="mb-6 text-6xl">✓</div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Diagnóstico completo
            </p>

            <h2 className="mb-4 text-4xl font-black text-slate-950">
              Tu análisis académico está listo.
            </h2>

            <p className="mb-8 text-lg leading-8 text-slate-600">
              En las próximas horas nuestro equipo revisará tu diagnóstico y te contactará con una propuesta personalizada de acompañamiento.
            </p>

            <div className="space-y-3 text-left bg-emerald-50 p-6 rounded-xl mb-8">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                <span className="text-slate-700"><strong>Confirmaremos</strong> tu email</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬</span>
                <span className="text-slate-700"><strong>Te contactaremos</strong> por WhatsApp</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span className="text-slate-700"><strong>Haremos</strong> una consulta inicial gratuita</span>
              </div>
            </div>

            <a
              href="#inicio"
              className="inline-block rounded-lg bg-emerald-700 px-8 py-3 font-black text-white transition hover:bg-emerald-800"
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
      <section id="diagnostico" className="bg-stone-50 py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border-2 border-emerald-300 bg-white p-8 md:p-10 shadow-lg">
            <div className="mb-8 text-center">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
                Información de contacto
              </p>

              <h2 className="mb-4 text-4xl font-black text-slate-950">
                Convierte tu diagnóstico en un plan real.
              </h2>

              <p className="text-slate-600">
                Completa tus datos para recibir una propuesta personalizada de acompañamiento académico.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white p-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Apellido</label>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Tu apellido"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white p-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white p-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Celular</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+54 9 11 0000 0000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white p-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Carrera o materia principal</label>
                <input
                  type="text"
                  name="career"
                  placeholder="Ej: Ingeniería en Sistemas, Medicina, etc."
                  value={formData.career}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white p-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              {submitError && (
                <p className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700 font-bold">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-emerald-700 py-4 font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400 mb-3"
              >
                {isSubmitting ? "Enviando diagnóstico..." : "Enviar diagnóstico"}
              </button>
              
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full rounded-lg border-2 border-slate-300 py-4 font-bold text-slate-700 transition hover:border-slate-950"
              >
                Volver
              </button>
            </form>
          </div>
        </div>
      </section>
    )
  }

  if (finished) {
    return (
      <section id="diagnostico" className="bg-gradient-to-br from-white via-emerald-50 to-emerald-100 py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border-2 border-emerald-300 bg-white p-8 md:p-12 shadow-xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <span className="text-4xl">🎯</span>
            </div>

            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Resultado del diagnóstico
            </p>

            <h2 className="mb-5 text-4xl font-black leading-tight text-slate-950">
              {result.title}
            </h2>

            <p className="mb-10 text-lg leading-8 text-slate-600">
              {result.description}
            </p>

            <div className="mb-10 bg-emerald-50 p-6 rounded-xl text-left border border-emerald-200">
              <p className="text-sm font-bold text-emerald-700 mb-4">🔍 Basado en tu análisis:</p>
              <div className="space-y-2">
                {answers.slice(0, 2).map((answer, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700">
                    <span className="text-emerald-600">•</span>
                    <span className="text-sm">{answer}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="inline-block rounded-lg bg-emerald-700 px-8 py-4 font-black text-white transition hover:bg-emerald-800 mb-3"
            >
              Recibir propuesta personalizada
            </button>
            
            <div className="mt-6 text-sm text-slate-500">
              <p>Si prefieres, puedes explorar nuestros <a href="#cursos" className="text-emerald-700 font-bold hover:underline">planes de acompañamiento</a></p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="diagnostico" className="bg-stone-50 py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Evaluación personalizada
          </p>

          <h2 className="mb-4 text-4xl font-black text-slate-950 md:text-5xl">
            Descubre qué tipo de ayuda necesitas.
          </h2>

          <p className="text-slate-600">
            4 preguntas para analizar tu situación académica y recomendarte el plan perfecto.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-emerald-300 bg-white p-8 md:p-10 shadow-lg">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-600">
                Pregunta {currentQuestion + 1} de {questions.length}
              </span>
              <span className="text-sm font-black text-emerald-700">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <h3 className="mb-8 text-2xl font-black leading-snug text-slate-950 md:text-3xl">
            {question.question}
          </h3>

          {/* Options */}
          <div className="grid gap-3 mb-10">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelected(option)}
                className={`rounded-lg border-2 p-4 text-left font-bold transition ${
                  selected === option
                    ? "border-emerald-600 bg-emerald-50 text-slate-950 shadow-md"
                    : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/30"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="rounded-lg border-2 border-slate-300 bg-white py-3 font-bold text-slate-700 transition hover:border-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>

            <button
              onClick={nextQuestion}
              disabled={!selected}
              className="rounded-lg bg-emerald-700 py-3 font-black text-white transition hover:bg-emerald-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
