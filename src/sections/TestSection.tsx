import { useState } from "react"
import { supabase } from "../lib/supabase"

const questions = [
  {
    question: "¿Qué sentís que más te dificulta al estudiar?",
    options: [
      "📚 Organizarme",
      "🧠 Concentrarme",
      "⏳ Dejar todo para último momento",
      "😵 Entender los temas",
    ],
  },

  {
    question: "¿Cuántas horas estudiás por día aproximadamente?",
    options: [
      "Menos de 1 hora",
      "1 a 2 horas",
      "3 a 5 horas",
      "Más de 5 horas",
    ],
  },

  {
    question: "¿Cómo te sentís antes de un examen?",
    options: [
      "😰 Muy nervioso",
      "😵 Desorganizado",
      "😐 Normal",
      "😎 Seguro",
    ],
  },

  {
    question: "¿Qué tan seguido procrastinás?",
    options: [
      "Todos los días",
      "Muy seguido",
      "A veces",
      "Casi nunca",
    ],
  },

  {
    question: "¿Qué te gustaría mejorar?",
    options: [
      "📈 Mis notas",
      "📚 Mi organización",
      "🧠 Mi comprensión",
      "⏰ Mi constancia",
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

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    career: "",
  })

  const question = questions[currentQuestion]

  const progress =
    ((currentQuestion + 1) / questions.length) * 100

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
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelected("")
    }
  }

  const generateResult = () => {
    const text = answers.join(" ")

    if (
      text.includes("Organizarme") ||
      text.includes("Desorganizado")
    ) {
      return {
        title:
          "Tu principal desafío parece ser la organización académica",

        description:
          "Detectamos dificultades relacionadas con la planificación, distribución del tiempo y constancia en el estudio.",
      }
    }

    if (
      text.includes("Concentrarme") ||
      text.includes("Muy seguido")
    ) {
      return {
        title:
          "La concentración y constancia están afectando tu rendimiento",

        description:
          "Tu diagnóstico muestra dificultades para mantener hábitos de estudio sostenidos y evitar distracciones.",
      }
    }

    return {
      title:
        "Tenés potencial académico para mejorar rápidamente",

      description:
        "Con una estrategia personalizada y acompañamiento adecuado podrías optimizar muchísimo tu rendimiento.",
    }
  }

  const result = generateResult()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement>
  ) => {
    e?.preventDefault()

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
      const { error } = await supabase
        .from("leads")
        .insert([lead])

      if (error) {
        throw error
      }

      fetch("/api/send-email", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(lead),
      }).catch((error) => {
        console.log(error)
      })

      setShowForm(false)
    } catch (error) {
      console.log(error)
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar el diagnostico. Revisá Supabase y probá otra vez."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // FORMULARIO
  if (showForm) {
    return (
      <section
        id="diagnostico"
        className="py-32 px-6 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="max-w-3xl mx-auto">

          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-blue-100 p-10 md:p-14">

            <div className="text-center mb-12">

              <p className="text-blue-600 font-medium mb-4">
                Último paso
              </p>

              <h2 className="text-4xl font-bold text-zinc-900 mb-6">
                Recibí tu orientación personalizada
              </h2>

              <p className="text-zinc-600 text-lg">
                Dejanos tus datos para recibir acompañamiento académico.
              </p>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-5 rounded-2xl border border-zinc-200 outline-none focus:border-blue-500"
              />

              <input
                type="text"
                name="lastname"
                placeholder="Apellido"
                value={formData.lastname}
                onChange={handleChange}
                required
                className="w-full p-5 rounded-2xl border border-zinc-200 outline-none focus:border-blue-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-5 rounded-2xl border border-zinc-200 outline-none focus:border-blue-500"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-5 rounded-2xl border border-zinc-200 outline-none focus:border-blue-500"
              />

            </div>

            <input
              type="text"
              name="career"
              placeholder="Carrera universitaria"
              value={formData.career}
              onChange={handleChange}
              required
              className="w-full mt-5 p-5 rounded-2xl border border-zinc-200 outline-none focus:border-blue-500"
            />

            {submitError && (
              <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                {submitError}
              </p>
            )}

            <button
              onClick={() => void handleSubmit()}
              disabled={isSubmitting}
              className="w-full mt-8 bg-blue-600 text-white py-5 rounded-2xl font-semibold text-lg hover:scale-[1.01] transition disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:hover:scale-100"
            >
              {isSubmitting
                ? "Enviando..."
                : "Enviar diagnóstico"}
            </button>

          </div>

        </div>
      </section>
    )
  }

  // RESULTADO
  if (finished) {
    return (
      <section
        id="diagnostico"
        className="py-32 px-6 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="max-w-3xl mx-auto">

          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-blue-100 p-10 md:p-14 text-center">

            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
              🧠
            </div>

            <p className="text-blue-600 font-medium mb-4">
              Resultado del diagnóstico
            </p>

            <h2 className="text-4xl font-bold text-zinc-900 mb-6 leading-tight">
              {result.title}
            </h2>

            <p className="text-zinc-600 text-lg leading-relaxed mb-10">
              {result.description}
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 mt-10">

              <h3 className="text-2xl font-bold text-zinc-900 mb-4">
                ¿Querés mejorar tu rendimiento académico?
              </h3>

              <p className="text-zinc-600 mb-8 leading-relaxed">
                Podemos ayudarte con un acompañamiento personalizado, técnicas de estudio y seguimiento académico adaptado a tu situación.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-[1.02] transition"
              >
                Quiero recibir ayuda personalizada
              </button>

            </div>

          </div>

        </div>
      </section>
    )
  }

  // TEST
  return (
    <section
      id="diagnostico"
      className="py-32 px-6 bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-14">

          <p className="text-blue-600 font-medium mb-4">
            Diagnóstico académico
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">
            Descubrí cómo mejorar tu rendimiento académico
          </h2>

          <p className="text-zinc-600 text-lg">
            Respondé unas preguntas rápidas y obtené una orientación personalizada.
          </p>

        </div>

        <div className="bg-white rounded-[2.5rem] border border-blue-100 shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-8 md:p-12">

          <div className="flex items-center justify-between mb-5">

            <span className="text-zinc-500 text-sm">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>

            <span className="text-blue-600 font-medium text-sm">
              {Math.round(progress)}%
            </span>

          </div>

          <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden mb-12">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h3 className="text-3xl font-bold text-zinc-900 mb-10 leading-snug">
            {question.question}
          </h3>

          <div className="flex flex-col gap-4">

            {question.options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelected(option)}
                className={`
                  text-left
                  p-6
                  rounded-3xl
                  border
                  transition-all
                  duration-200
                  cursor-pointer

                  ${
                    selected === option
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-zinc-200 hover:border-blue-400 hover:bg-blue-50"
                  }
                `}
              >
                <span className="text-lg font-medium text-zinc-800">
                  {option}
                </span>
              </button>
            ))}

          </div>

          <div className="flex items-center gap-4 mt-10">

            <button
              onClick={prevQuestion}
              className="w-full py-4 rounded-2xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition"
            >
              Volver
            </button>

            <button
              onClick={nextQuestion}
              className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold hover:scale-[1.01] transition"
            >
              Continuar
            </button>

          </div>

        </div>

      </div>
    </section>
  )
}
