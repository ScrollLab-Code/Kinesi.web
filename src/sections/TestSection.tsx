import { motion } from "framer-motion"
import { useState } from "react"

type Option = {
  label: string
  score: number
}

const questions = [
  {
    question: "¿Qué hacés cuando no entendés un tema?",
    options: [
      { label: "Lo releo muchas veces", score: 0 },
      { label: "Busco videos y resúmenes", score: 1 },
      { label: "Pregunto a alguien cercano", score: 2 },
      { label: "Lo dejo para después", score: 4 },
    ],
  },
  {
    question: "¿Cómo es tu ritmo de estudio?",
    options: [
      { label: "Rutina fija y constante", score: 0 },
      { label: "Estudio cuando tengo tiempo", score: 2 },
      { label: "Mejor en bloques largos", score: 3 },
      { label: "Procrastino hasta último momento", score: 5 },
    ],
  },
  {
    question: "¿Qué buscás más en un curso premium?",
    options: [
      { label: "Claridad y estructura", score: 0 },
      { label: "Tutor personalizado", score: 1 },
      { label: "Material visual y ejemplos", score: 2 },
      { label: "Resultados rápidos", score: 3 },
    ],
  },
  {
    question: "Tu ambiente ideal de estudio es...",
    options: [
      { label: "Silencio y foco total", score: 0 },
      { label: "Música leve y orden", score: 1 },
      { label: "Gym académico con material", score: 2 },
      { label: "Trabajo con presión de tiempo", score: 4 },
    ],
  },
  {
    question: "En un examen, tu desafío principal es...",
    options: [
      { label: "Mantener la consistencia", score: 0 },
      { label: "No perder tiempo", score: 1 },
      { label: "Entender la teoría profunda", score: 2 },
      { label: "Controlar el estrés", score: 4 },
    ],
  },
]

const profileMap = [
  {
    maxScore: 6,
    title: "Explorador Analítico",
    strengths: "Comprensión conceptual y pensamiento crítico.",
    weaknesses: "Constancia y organización de tiempo.",
    recommendation: "Define una rutina diaria y acompaña con tutorías puntuales.",
  },
  {
    maxScore: 12,
    title: "Estratega Disciplinado",
    strengths: "Autonomía y capacidad de adaptación.",
    weaknesses: "Flexibilidad frente a nuevos desafíos.",
    recommendation: "Implementá ciclos Pomodoro y revisiones semanales.",
  },
  {
    maxScore: 999,
    title: "Creador Resiliente",
    strengths: "Resiliencia y soluciones prácticas.",
    weaknesses: "Gestión del estrés y planificación clara.",
    recommendation: "Combina un plan estructurado con mentorías semanales.",
  },
]

function getProfile(score: number) {
  return profileMap.find((item) => score <= item.maxScore) ?? profileMap[profileMap.length - 1]
}

export default function TestSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selected, setSelected] = useState<Option | null>(null)
  const [answers, setAnswers] = useState<Option[]>([])
  const [finished, setFinished] = useState(false)
  const [finalScore, setFinalScore] = useState<number | null>(null)

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + (finished ? 1 : 0)) / questions.length) * 100
  const score = finalScore ?? answers.reduce((sum, answer) => sum + answer.score, 0)
  const profile = getProfile(score)

  const nextQuestion = () => {
    if (!selected) return
    const nextAnswers = [...answers, selected]
    setAnswers(nextAnswers)
    setSelected(null)

    if (currentQuestion >= questions.length - 1) {
      setFinalScore(nextAnswers.reduce((sum, answer) => sum + answer.score, 0))
      setFinished(true)
      return
    }

    setCurrentQuestion(currentQuestion + 1)
  }

  const restart = () => {
    setCurrentQuestion(0)
    setSelected(null)
    setAnswers([])
    setFinished(false)
    setFinalScore(null)
  }

  return (
    <section id="perfil" className="border-t border-slate-200 bg-[#eff6ff] py-28 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-5">
            Análisis de Perfil Académico
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
            Un test inteligente, no un conjunto de preguntas al azar.
          </h2>
        </div>

        <div className="mb-8 rounded-full bg-slate-200 p-1">
          <div
            className="h-2 rounded-full bg-sky-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {finished ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_40px_120px_rgba(15,23,42,0.08)]"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-5">
              Tu perfil
            </p>
            <h3 className="text-4xl font-semibold text-slate-900 mb-6">
              {profile.title}
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 mb-3">Fortalezas</p>
                <p className="text-slate-700">{profile.strengths}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 mb-3">Debilidades</p>
                <p className="text-slate-700">{profile.weaknesses}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 mb-3">Recomendación</p>
                <p className="text-slate-700">{profile.recommendation}</p>
              </div>
            </div>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={restart}
                className="rounded-full border border-slate-200 bg-slate-50 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-900 transition hover:bg-slate-100"
              >
                Volver a comenzar
              </button>
              <a
                href="#unirse"
                className="rounded-full bg-sky-700 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-sky-600"
              >
                Acceder a KINASE
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_40px_120px_rgba(15,23,42,0.08)]"
          >
            <div className="mb-10 flex flex-col gap-3 text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm uppercase tracking-[0.3em]">Pregunta {currentQuestion + 1} de {questions.length}</span>
              <p className="text-sm uppercase tracking-[0.2em] text-sky-600">Perfil académico</p>
            </div>

            <h3 className="text-3xl font-semibold text-slate-900 mb-8">
              {question.question}
            </h3>

            <div className="grid gap-4">
              {question.options.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setSelected(option)}
                  className={`rounded-[1.75rem] border px-6 py-5 text-left transition ${
                    selected?.label === option.label
                      ? "border-sky-300 bg-sky-100 text-slate-900"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={nextQuestion}
                className="rounded-full bg-sky-700 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!selected}
              >
                {currentQuestion === questions.length - 1 ? "Ver resultado" : "Siguiente pregunta"}
              </button>
              <p className="text-sm text-slate-500">
                {question.options.length} opciones inteligentes, una sola respuesta útil.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
