import { motion } from "framer-motion"
import { useState } from "react"

const courses = [
  {
    title: "Gestión de Volumen de Estudio",
    description:
      "Técnicas de planificación específicas para manejar la carga teórica masiva de Anatomía, Histología y Fisiología en simultáneo sin saturarte.",
    previousPrice: "$30.000",
    price: "$12.000",
    duration: "1 sesión integradora (1h 30m)",
    features: ["Organización de cronograma de lecturas", "Estructuración de repasos periódicos", "Método de estudio por capas"],
    badge: "Más popular",
  },
  {
    title: "Método de Estudio Activo para Medicina",
    description:
      "Aprende a usar Active Recall y Repetición Espaciada adaptada a las materias de medicina. Configuración de mazos de Anki y resúmenes activos.",
    previousPrice: "$35.000",
    price: "$15.000",
    duration: "Taller práctico (2 horas)",
    features: ["Configuración avanzada de Anki", "Creación de tarjetas eficientes", "Estrategia de autoevaluación continua"],
    badge: "Recomendado",
  },
  {
    title: "Regulación Emocional y Ansiedad Pre-Examen",
    description:
      "Herramientas psicológicas y conductuales para afrontar la presión del examen oral (Anatomía) y los exámenes de opción múltiple con tiempo limitado.",
    price: "$10.000",
    duration: "Sesión grupal o individual (1h 15m)",
    features: ["Manejo del pánico escénico en el examen oral", "Técnicas de respiración y enfoque cognitivo", "Prácticas de simulacro de mesa evaluadora"],
  },
  {
    title: "Preparación de Exámenes Orales (Anatomía)",
    description:
      "Simulacros uno a uno frente a tutores avanzados. Práctica de exposición fluida usando preparados anatómicos y vocabulario médico preciso.",
    previousPrice: "$40.000",
    price: "$18.000",
    duration: "Mentoría personalizada (1h 30m)",
    features: ["Simulación de mesa de examen real", "Feedback inmediato de vocabulario y precisión", "Recomendaciones de postura y manejo del tiempo"],
    badge: "Premium",
  },
  {
    title: "Desbloqueo Académico y Orientación de Cátedra",
    description: "Para estudiantes trabados en parciales o finales de materias filtro. Análisis del método de estudio fallido y plan de contingencia rápido.",
    price: "$8.000",
    duration: "Consultoría diagnóstica (1 hora)",
    features: ["Detección de errores conceptuales y metodológicos", "Plan de 7 días para recuperar el ritmo", "Guía de recursos de apoyo específicos"],
  },
  {
    title: "Organización del Ciclo Clínico",
    description: "Orientación para alumnos que ingresan al hospital. Cómo balancear guardias, teóricos, rotaciones y horas de sueño de forma saludable.",
    price: "$15.000",
    duration: "Mentoría individual (1 hora)",
    features: ["Plan de estudio adaptado al internado", "Optimización de tiempos muertos en el hospital", "Material de apoyo para semiología clínica"],
    badge: "Clínico",
  }
]

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)

  return (
    <section id="cursos" className="bg-stone-50 py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
              Acompañamiento Académico Especializado
            </p>

            <h2 className="text-3xl font-black leading-tight text-slate-950 md:text-4xl">
              Mentorías y sesiones intensivas para medicina.
            </h2>
          </div>

          <p className="text-base leading-relaxed text-slate-600">
            En medicina, el contenido es enorme pero la clave del éxito está en el método, la oratoria y el manejo de la ansiedad. Elige la sesión que necesitas para destrabar tu cursada.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <motion.article
              key={course.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              viewport={{ once: true }}
              onClick={() => setSelectedCourse(selectedCourse === index ? null : index)}
              className={`rounded-xl border p-5 shadow-sm transition cursor-pointer flex flex-col justify-between ${
                selectedCourse === index
                  ? "border-emerald-600 bg-emerald-50/40 shadow-md"
                  : "border-slate-200 bg-white hover:border-emerald-400 hover:shadow-md"
              }`}
            >
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100/75 text-xs font-black text-emerald-950">
                    0{index + 1}
                  </span>
                  {course.badge && (
                    <span className="rounded-full bg-emerald-800 text-white px-2.5 py-0.5 text-[10px] font-bold">
                      {course.badge}
                    </span>
                  )}
                </div>

                <h3 className="mb-1 text-lg font-bold text-slate-950">
                  {course.title}
                </h3>

                <p className="mb-3 text-xs font-semibold text-slate-400">
                  Duración: {course.duration}
                </p>

                <p className="mb-4 text-xs leading-relaxed text-slate-500">
                  {course.description}
                </p>

                {selectedCourse === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-4 space-y-1.5 border-t border-emerald-100 pt-3.5"
                  >
                    <p className="text-[10px] font-bold uppercase text-emerald-800 mb-2">
                      Lo que obtendrás:
                    </p>
                    {course.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold text-xs">✓</span>
                        <span className="text-xs text-slate-600 leading-normal">{feature}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3 mt-4">
                <div>
                  <p className="text-[10px] text-slate-400">Valor único</p>
                  <div className="flex items-baseline gap-2">
                    {course.previousPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {course.previousPrice}
                      </span>
                    )}

                    <span className="text-xl font-bold text-slate-950">
                      {course.price}
                    </span>
                  </div>
                </div>

                <a
                  href="#diagnostico"
                  className="rounded-lg bg-emerald-800 px-4 py-2 font-bold text-white transition hover:bg-slate-900 text-xs"
                >
                  Reservar
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-teal-50 border border-teal-100 p-6 text-center max-w-2xl mx-auto shadow-sm">
          <h3 className="mb-1 text-lg font-bold text-teal-950">
            ¿No sabés qué método necesitás?
          </h3>
          <p className="mb-4 text-xs text-slate-600">
            Realiza el test diagnóstico de forma gratuita. Un tutor senior analizará tus respuestas y te recomendará la mejor estrategia para rendir.
          </p>
          <a
            href="#diagnostico"
            className="inline-block rounded-lg bg-emerald-800 px-6 py-2.5 font-bold text-white transition hover:bg-slate-900 text-xs"
          >
            Realizar Diagnóstico Gratis
          </a>
        </div>
      </div>
    </section>
  )
}
