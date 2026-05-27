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
      <section id="diagnostico" className="bg-white py-24 px-6">
        <div className="mx-auto max-w-3xl rounded-lg border border-emerald-200 bg-emerald-50 p-8 text-center">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Solicitud enviada
          </p>

          <h2 className="mb-4 text-4xl font-black text-slate-950">
            Ya tenemos tu diagnostico academico.
          </h2>

          <p className="text-lg leading-8 text-slate-600">
            El siguiente paso comercial es contactar al estudiante con una
            propuesta de acompañamiento, mentoria o pack de estudio segun su
            necesidad.
          </p>
        </div>
      </section>
    )
  }

  if (showForm) {
    return (
      <section id="diagnostico" className="bg-white py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border border-slate-200 bg-stone-50 p-6 md:p-8">
            <div className="mb-8 text-center">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
                Ultimo paso
              </p>

              <h2 className="mb-4 text-4xl font-black text-slate-950">
                Recibi una propuesta de ayuda academica.
              </h2>

              <p className="text-lg leading-8 text-slate-600">
                Dejanos tus datos para convertir tu diagnostico en un plan
                accionable.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-slate-200 bg-white p-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Apellido"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-slate-200 bg-white p-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-slate-200 bg-white p-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Celular"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-slate-200 bg-white p-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <input
                type="text"
                name="career"
                placeholder="Carrera o materia principal"
                value={formData.career}
                onChange={handleChange}
                required
                className="mt-4 w-full rounded-lg border border-slate-200 bg-white p-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              />

              {submitError && (
                <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-lg bg-slate-950 py-4 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Enviando..." : "Enviar diagnostico"}
              </button>
            </form>
          </div>
        </div>
      </section>
    )
  }

  if (finished) {
    return (
      <section id="diagnostico" className="bg-white py-24 px-6">
        <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-stone-50 p-6 text-center md:p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Resultado del diagnostico
          </p>

          <h2 className="mb-5 text-4xl font-black leading-tight text-slate-950">
            {result.title}
          </h2>

          <p className="mb-8 text-lg leading-8 text-slate-600">
            {result.description}
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-slate-950 px-7 py-4 font-black text-white transition hover:bg-emerald-700"
          >
            Quiero recibir ayuda personalizada
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="diagnostico" className="bg-white py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Diagnostico academico
          </p>

          <h2 className="mb-4 text-4xl font-black text-slate-950 md:text-5xl">
            Detecta que ayuda necesita cada estudiante.
          </h2>

          <p className="text-lg leading-8 text-slate-600">
            Este flujo convierte interes en una oportunidad concreta de venta
            para mentorias, recursos y acompañamiento.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-stone-50 p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between text-sm font-bold">
            <span className="text-slate-500">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-emerald-700">{Math.round(progress)}%</span>
          </div>

          <div className="mb-8 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-700 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h3 className="mb-7 text-2xl font-black leading-snug text-slate-950 md:text-3xl">
            {question.question}
          </h3>

          <div className="grid gap-3">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelected(option)}
                className={`rounded-lg border p-4 text-left font-bold transition ${
                  selected === option
                    ? "border-emerald-700 bg-emerald-50 text-slate-950"
                    : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              onClick={prevQuestion}
              className="rounded-lg border border-slate-200 bg-white py-4 font-bold text-slate-700 transition hover:border-slate-950"
            >
              Volver
            </button>

            <button
              onClick={nextQuestion}
              className="rounded-lg bg-slate-950 py-4 font-black text-white transition hover:bg-emerald-700"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
