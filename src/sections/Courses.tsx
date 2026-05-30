import { motion } from "framer-motion"
import { useState } from "react"

const courses = [
  {
    title: "Gestion del tiempo",
    description: "Metodos y estructuras horarias diseñadas para organizar calendarios, maximizar el rendimiento por bloque y eliminar la procastinacion.",
    previousPrice: "$37.000",
    price: "$12.000",
    duration: "30 minutos",
    features: ["Metodos de gestión del tiempo", "Estructuración de horarios", "Técnicas anti-procrastinación"],
    badge: "Más popular",
    // 👇 PEGA AQUÍ TU LINK DE PAGO ASOCIADO A ESTE CURSO
    mpLink: "https://mpago.la/197rt9r" 
  },               
  {
    title: "Metodología de estudio",
    description: "Sesiones personalizadas para ordenar materias, detectar bloqueos y sostener una rutina de estudio realista.",
    previousPrice: "$30.500",
    price: "$15.000",
    duration: "1 hora",
    features: ["Plan semanal personalizado", "3 sesiones por semana", "Seguimiento de avance", "Corrección de hábitos"],
    badge: "Tendencia",
    mpLink: "https://mpago.la/tu_link_metodologia"
  },
  {
    title: "Regulacion emocional",
    description: "Anclaje emocional,revaluacion cognitiva, condicinamiento clasico y efecto primado",
    price: "$25.000",
    duration: "1 Hora, 30 minutos",
    features: ["Técnicas de regulación emocional", "Manejo de ansiedad y estrés académico", "Estrategias para mantener la motivación"],
    mpLink: "https://mpago.la/tu_link_regulacion"
  },
  {
    title: "Preparacion de estancia evaluativas",
    description: "Sesiones personalizadas para preparar exámenes y evaluaciones.",
    previousPrice: "$30.000",
    price: "$15.000",
    duration: "3 horas",
    features: ["Estrategias para preparar exámenes", "Técnicas de estudio efectivas", "Simulaciones de evaluaciones"],
    mpLink: "https://mpago.la/tu_link_examenes"
  },
  {
    title: "Procesamiento de bloqueos",
    description: "Sesiones personalizadas para ordenar materias, detectar bloqueos y sostener una rutina de estudio realista.",
    price: "$8.000",
    duration: "2 horas",
    features: ["Identificación de bloqueos académicos", "Técnicas para superar bloqueos mentales", "Estrategias para mantener la motivación"],
    badge: "interesante",
    mpLink: "https://mpago.la/tu_link_bloqueos"
  },
  {
    title: "ordenamiento de materias",
    description: "Sesiones personalizadas para organizar y estructurar las materias de estudio.",
    price: "$15.000",
    duration: "2 horas",
    features: ["Organización de materias", "Estructuración de horarios de estudio", "Técnicas para mantener la consistencia en el estudio"],
    mpLink: "https://mpago.la/tu_link_ordenamiento"
  },
  {
    title: "Soporte familiar",
    description: "Destinado para padres y familiares de estudiantes universitarios, este servicio ofrece orientación y estrategias para apoyar el proceso académico de sus hijos, fomentando un ambiente de estudio positivo y efectivo.",
    price: "...",
    duration: "2 horas",
    features: ["orientación para padres de estudiantes universitarios", "estrategias para apoyar el estudio desde casa", "fomento de hábitos de estudio saludables"],
    badge: "En desarrrollo",
  },
  {
    title: "Comunicacion y oratoria",
    description: "Desarrollo de hablidades blandas, oratoria específica para exposición para trabajos practicos y examenes.",
    price: "...",
    duration: "2 horas",
    features: ["Técnicas de comunicación efectiva", "Oratoria para presentaciones académicas", "Manejo de nervios y ansiedad"],
  },
  {
    title: "IA para el estudiante",
    description: "Darle la capacidad al estudiante estudiar inteligentemente entorno a las nuevas tecnologías.",
    price: "En desarrollo",
    duration: "...",
    features: ["Whatsapp para estudiantes", "Asistente de estudio personalizado directo de whatsapp", "Recomendaciones de recursos con IA", "Alertas de fechas importantes"],
    badge: "En desarrollo, proxima tendencia.",
  },
]

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)

  const handlePayment = (course: typeof courses[0], e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (course.mpLink) {
      // Abre el checkout oficial de Mercado Pago en otra pestaña de manera limpia
      window.open(course.mpLink, "_blank", "noopener,noreferrer")
    } else {
      // Si el curso está en desarrollo o requiere consulta, redirige a WhatsApp o tu sección de contacto
      window.open("https://wa.me/tu_numero_de_whatsapp?text=Hola! Quiero consultar por el servicio de " + course.title, "_blank")
    }
  }

  return (
    <section id="cursos" className="bg-stone-50 py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Servicios de ayuda académica
            </p>
            <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              Planes profesionales de tutoría y asesoramiento.
            </h2>
          </div>
          <p className="text-lg leading-8 text-slate-600">
            Elige el plan que se adapte a tu necesidad: desde sesiones puntuales hasta acompañamiento integral para todo el semestre.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {courses.map((course, index) => {
            const isPurchasable = course.price !== "..." && course.price !== "En desarrollo"

            return (
              <motion.article
                key={course.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                onClick={() => setSelectedCourse(selectedCourse === index ? null : index)}
                className={`rounded-xl border-2 p-7 shadow-sm transition cursor-pointer flex flex-col justify-between ${
                  selectedCourse === index
                    ? "border-emerald-600 bg-emerald-50 shadow-lg"
                    : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg"
                }`}
              >
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-lg font-black text-emerald-800">
                      {index + 1}
                    </span>
                    {course.badge && (
                      <span className="rounded-full bg-emerald-700 text-white px-3 py-1 text-xs font-bold">
                        {course.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 text-2xl font-black text-slate-950">
                    {course.title}
                  </h3>
                  <p className="mb-5 text-sm text-slate-600">
                    {course.duration}
                  </p>
                  <p className="mb-6 leading-7 text-slate-600 text-sm">
                    {course.description}
                  </p>

                  {selectedCourse === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-6 space-y-2 border-t border-emerald-200 pt-4"
                    >
                      <p className="text-xs font-bold uppercase text-emerald-700 mb-3">
                        Incluye:
                      </p>
                      {course.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold mt-1">✓</span>
                          <span className="text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-5 flex items-center justify-between gap-4 mt-auto">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      {isPurchasable ? "A partir de" : "Estado"}
                    </p>
                    <div className="flex items-baseline gap-3">
                      {course.previousPrice && isPurchasable && (
                        <span className="text-sm text-slate-500 line-through">
                          {course.previousPrice}
                        </span>
                      )}
                      <span className={`${isPurchasable ? "text-3xl font-black" : "text-lg font-bold text-slate-500"} text-slate-950`}>
                        {course.price}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handlePayment(course, e)}
                    className={`rounded-lg px-5 py-3 font-black text-white transition text-sm whitespace-nowrap shadow-sm ${
                      isPurchasable 
                        ? "bg-emerald-700 hover:bg-emerald-800" 
                        : "bg-slate-400 hover:bg-slate-500"
                    }`}
                  >
                    {isPurchasable ? "Pagar ahora" : "Consultar"}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
        
        {/* Sección del diagnóstico */}
        <div className="mt-16 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 p-8 text-center">
          <h3 className="mb-2 text-2xl font-black text-emerald-900">¿No estás seguro qué plan necesitas?</h3>
          <p className="mb-6 text-emerald-800">Realiza un diagnóstico gratuito y te recomendaremos el mejor plan para ti.</p>
          <a href="#diagnostico" className="inline-block rounded-lg bg-emerald-700 px-8 py-3 font-black text-white transition hover:bg-emerald-800">
            Diagnóstico gratis
          </a>
        </div>
      </div>
    </section>
  )
}