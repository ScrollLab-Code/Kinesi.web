import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type FAQItem = {
  question: string
  answer: string
}

type FAQCategory = {
  title: string
  items: FAQItem[]
}

export default function FAQ() {
  const categories: FAQCategory[] = [
    {
      title: "Tu Carrera en Kinase Academy",
      items: [
        {
          question: "¿Cómo acompaña Kinase mi desarrollo a lo largo de la carrera?",
          answer: "Kinase Academy no se limita a enseñarte una materia aislada. Nuestro enfoque institucional te brinda herramientas de planificación a largo plazo, hábitos de estudio de alto rendimiento y habilidades de oratoria técnica que te acompañarán desde el primer año hasta tus prácticas pre-profesionales y exámenes de residencia."
        },
        {
          question: "¿Los contenidos están actualizados según las cátedras vigentes?",
          answer: "Sí, todos los recursos, resúmenes de la feria y metodologías se revisan continuamente y se alinean a las guías de estudio y bibliografías oficiales de las cátedras biomédicas más exigentes."
        }
      ]
    },
    {
      title: "Gestión de cuenta y pagos",
      items: [
        {
          question: "¿Cómo realizo la compra o reserva de un turno de acompañamiento?",
          answer: "Puedes reservar sesiones individuales de acompañamiento desde la sección 'Acompañamiento', seleccionando el día y la hora corriente que prefieras. El pago se procesa de manera ágil y la reserva se confirma directamente por WhatsApp para mantener contacto directo con tu tutor asignado."
        },
        {
          question: "¿Puedo cancelar o reprogramar una reserva?",
          answer: "Sí, puedes coordinar cambios de horario directamente con el tutor asignado a través de WhatsApp con hasta 24 horas de antelación sin costos adicionales."
        }
      ]
    },
    {
      title: "Beneficios Premium",
      items: [
        {
          question: "¿Qué incluye la cuenta Premium VIP de Kinase Academy?",
          answer: "Los miembros VIP obtienen acceso ilimitado al planificador inverso y semanal para exámenes finales, el generador interactivo de flashcards con repetición espaciada y el creador de hábitos enfocado en evitar el burnout. Además, cuentan con soporte de prioridad y acceso prioritario a todas las herramientas académicas."
        }
      ]
    },
    {
      title: "Apoyo al estudiante",
      items: [
        {
          question: "¿Cuáles son las políticas de becas y convenios grupales?",
          answer: "Ofrecemos un programa de asistencia financiera para aquellos estudiantes con dificultades económicas comprobables. También disponemos de convenios grupales con descuentos para cohortes o centros de estudiantes. Si necesitas postularte, puedes iniciar la consulta desde nuestro chat de soporte flotante."
        }
      ]
    }
  ]

  const [expandedIndex, setExpandedIndex] = useState<string | null>(null)

  const toggleItem = (catIndex: number, itemIndex: number) => {
    const key = `${catIndex}-${itemIndex}`
    setExpandedIndex(expandedIndex === key ? null : key)
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-10 font-sans">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">
          Soporte Informativo
        </span>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Preguntas Frecuentes
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Respuestas institucionales y metodológicas para organizar tu cursada.
        </p>
      </div>

      <div className="space-y-6">
        {categories.map((category, catIdx) => (
          <div key={catIdx} className="space-y-2">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
              {category.title}
            </h4>
            <div className="border border-slate-200 dark:border-[#1d3330] rounded-xl overflow-hidden bg-white dark:bg-[#0c1312] divide-y divide-slate-100 dark:divide-[#1d3330]">
              {category.items.map((item, itemIdx) => {
                const key = `${catIdx}-${itemIdx}`
                const isExpanded = expandedIndex === key

                return (
                  <div key={itemIdx} className="transition-colors duration-150">
                    <button
                      type="button"
                      onClick={() => toggleItem(catIdx, itemIdx)}
                      className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 hover:bg-stone-50/50 dark:hover:bg-slate-900/20"
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                        {item.question}
                      </span>
                      <span className="text-slate-400 shrink-0 text-sm font-semibold select-none">
                        {isExpanded ? "−" : "+"}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-4 pt-1 text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
