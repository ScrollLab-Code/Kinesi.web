import { useMemo, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { motion } from "framer-motion"

type Resource = {
  id: number
  title: string
  subject: string
  faculty: string
  type: string
  level: string
  price: number
  seller: string
  sellerWhatsapp: string
  rating: number
  sales: number
  description: string
  includes: string[]
  delivery: string
  badge?: string
}

const resources: Resource[] = [
  {
    id: 1,
    title: "Resumen Completo de Anatomía Locomotor y Esplacnología",
    subject: "Anatomía",
    faculty: "Facultad de Medicina",
    type: "Apuntes",
    level: "1er Año",
    price: 3500,
    seller: "Martina G.",
    sellerWhatsapp: "5491133334444",
    rating: 5.0,
    sales: 142,
    description: "Apuntes limpios y ordenados según el programa oficial de la Cátedra 1. Ideal para repasar inserciones, relaciones anatómicas complejas y esquematizar el recorrido de arterias y nervios.",
    includes: [
      "Esquemas de plexo braquial y lumbosacro dibujados a mano",
      "Tablas comparativas de inserciones musculares",
      "Simulador de examen oral con preguntas típicas de mesa"
    ],
    delivery: "Descarga inmediata (PDF por WhatsApp)",
    badge: "Más vendido"
  },
  {
    id: 2,
    title: "Atlas de Preparados Histológicos Comentados",
    subject: "Histología",
    faculty: "Facultad de Medicina",
    type: "Guías",
    level: "1er Año",
    price: 2800,
    seller: "Joaquín M.",
    sellerWhatsapp: "5491133334445",
    rating: 4.9,
    sales: 98,
    description: "Guía fotográfica HD de preparados reales de microscopía óptica del práctico de la cátedra. Cada preparado tiene flechas señalando las estructuras clave y notas de diagnóstico diferencial.",
    includes: [
      "Fotografías microscópicas en alta definición",
      "Señalamiento interactivo de células y tejidos",
      "Tips para diferenciar preparados linfoideos y epitelios"
    ],
    delivery: "Enlace Drive enviado por WhatsApp",
    badge: "Recomendado"
  },
  {
    id: 3,
    title: "Banco de Preguntas & Respuestas: Fisiología Humana",
    subject: "Fisiología",
    faculty: "Facultad de Medicina",
    type: "Ejercicios",
    level: "2do Año",
    price: 3000,
    seller: "Sofía R.",
    sellerWhatsapp: "5491133334446",
    rating: 4.8,
    sales: 76,
    description: "Recopilación de 150 preguntas de opción múltiple explicadas paso a paso. Enfocado en biofísica de membranas, ciclo cardíaco, filtrado glomerular y control endocrino.",
    includes: [
      "150 preguntas con justificación fisiológica completa",
      "Desglose matemático de fórmulas (presión de filtración, clearance)",
      "Esquemas integradores de regulación hormonal"
    ],
    delivery: "PDF digital interactivo",
    badge: "Práctico"
  },
  {
    id: 4,
    title: "Flashcards de Farmacología Médica (Anki Pack)",
    subject: "Farmacología",
    faculty: "Facultad de Medicina",
    type: "Flashcards",
    level: "3er Año",
    price: 4200,
    seller: "Lucas V.",
    sellerWhatsapp: "5491133334447",
    rating: 5.0,
    sales: 210,
    description: "Mazo de más de 800 flashcards para Anki listas para importar. Cubre todos los grupos de fármacos (autónomo, cardiovascular, antibióticos, SNC) con su mecanismo de acción, efectos adversos y contraindicaciones.",
    includes: [
      "Archivo .apkg listo para importar en Anki (móvil y PC)",
      "Reglas mnemotécnicas para recordar clasificaciones",
      "Actualizado según las directrices de farmacoterapéutica"
    ],
    delivery: "Archivo APKG por WhatsApp o Email",
    badge: "Tendencia"
  },
  {
    id: 5,
    title: "Guía Rápida de Interpretación de Electrocardiogramas",
    subject: "Fisiología",
    faculty: "Facultad de Medicina",
    type: "Guías",
    level: "2do Año",
    price: 2000,
    seller: "Clara T.",
    sellerWhatsapp: "5491133334448",
    rating: 4.9,
    sales: 115,
    description: "Método de 6 pasos para leer de forma rápida y sistemática cualquier electrocardiograma de 12 derivaciones en el práctico o el final.",
    includes: [
      "Algoritmo secuencial de lectura del ECG",
      "Cálculo del eje eléctrico en menos de 10 segundos",
      "Gráficos vectoriales de arritmias frecuentes e infartos"
    ],
    delivery: "Descarga inmediata (PDF)",
    badge: "Fácil lectura"
  }
]

const categories = ["Todos", "Anatomía", "Histología", "Fisiología", "Farmacología"]
const types = ["Todos", "Apuntes", "Ejercicios", "Flashcards", "Guías"]

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price)

const createWhatsAppLink = (phone: string, message: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

const createPurchaseMessage = (resource: Resource) =>
  [
    "Hola, vengo desde la feria estudiantil de Kinase.",
    `Me interesa adquirir: ${resource.title}`,
    `Precio: ${formatPrice(resource.price)}`,
    `Vendedor: ${resource.seller}`,
  ].join("\n")

const createSellerRequestMessage = (sellerForm: {
  name: string
  contact: string
  resource: string
  career: string
}) =>
  [
    "Nueva propuesta de material de estudio para la feria Kinase.",
    `Nombre del proponente: ${sellerForm.name}`,
    `Contacto: ${sellerForm.contact}`,
    `Materia/Carrera: ${sellerForm.career}`,
    `Descripción del recurso: ${sellerForm.resource}`,
  ].join("\n")

export default function AcademicFair() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [activeType, setActiveType] = useState("Todos")
  const [query, setQuery] = useState("")
  const [selectedResource, setSelectedResource] = useState<Resource>(resources[0])
  const [savedIds, setSavedIds] = useState<number[]>([1, 2])
  const [sellerForm, setSellerForm] = useState({
    name: "",
    contact: "",
    resource: "",
    career: "",
  })
  const [sellerMessage, setSellerMessage] = useState("")

  const filteredResources = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase()

    return resources.filter((resource) => {
      const matchesCategory =
        activeCategory === "Todos" || resource.subject === activeCategory
      const matchesType = activeType === "Todos" || resource.type === activeType
      const searchableText =
        `${resource.title} ${resource.subject} ${resource.faculty} ${resource.description}`.toLowerCase()

      return (
        matchesCategory &&
        matchesType &&
        (!cleanQuery || searchableText.includes(cleanQuery))
      )
    })
  }, [activeCategory, activeType, query])

  const savedResources = resources.filter((resource) =>
    savedIds.includes(resource.id)
  )

  const toggleSaved = (id: number) => {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id]
    )
  }

  const selectResource = (resource: Resource) => {
    setSelectedResource(resource)
    document
      .getElementById("resource-detail")
      ?.scrollIntoView({ block: "start", behavior: "smooth" })
  }

  const handleSellerChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSellerForm({
      ...sellerForm,
      [event.target.name]: event.target.value,
    })
  }

  const submitSellerRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (
      !sellerForm.name ||
      !sellerForm.contact ||
      !sellerForm.resource ||
      !sellerForm.career
    ) {
      setSellerMessage("Por favor, completa todos los campos de contacto.")
      return
    }

    const requestMessage = createSellerRequestMessage(sellerForm)

    // Open WhatsApp securely to review material proposal
    const teamPhone = "5491133334449" // Demo central team number
    window.open(createWhatsAppLink(teamPhone, requestMessage), "_blank", "noopener,noreferrer")
    
    setSellerMessage("Propuesta generada. Se abrió WhatsApp para enviarla a los moderadores de Kinase.")
    setSellerForm({ name: "", contact: "", resource: "", career: "" })
  }

  return (
    <section id="feria" className="bg-stone-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
              Feria de Recursos de Medicina
            </p>
            <h2 className="text-3xl font-black leading-tight text-slate-950 md:text-4xl">
              Consigue y comparte guías, desgrabados y preparados anatómicos.
            </h2>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm leading-relaxed text-slate-600">
              Un catálogo seguro organizado por materias de la carrera. Cada apunte cuenta con la verificación de estudiantes avanzados que ya rindieron y aprobaron las asignaturas correspondientes.
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            [`${resources.length} Recursos`, "Disponibles para estudio"],
            ["5.0 ★", "Valoración media de alumnos"],
            ["Verificación", "Por tutores avanzados"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xl font-bold text-slate-900">{value}</p>
              <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.05em] text-slate-400">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar por materia, tema o autor del apunte..."
                  className="w-full rounded-lg border border-slate-200 bg-stone-50 px-4 py-2.5 outline-none focus:border-emerald-600 focus:bg-white text-sm"
                />
                <a
                  href="#solicitar-venta"
                  className="rounded-lg bg-emerald-800 px-5 py-2.5 text-center text-sm font-bold text-white transition hover:bg-slate-900 flex items-center justify-center"
                >
                  Proponer material
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold text-slate-500 mr-2">Materias:</span>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                      activeCategory === category
                        ? "bg-slate-900 text-white"
                        : "bg-stone-100 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2 items-center border-t border-slate-100 pt-3">
                <span className="text-xs font-semibold text-slate-500 mr-2">Formato:</span>
                {types.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveType(type)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      activeType === type
                        ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {filteredResources.map((resource, index) => (
                <motion.article
                  key={resource.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.2) }}
                  viewport={{ once: true }}
                  className={`rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md flex flex-col justify-between ${
                    selectedResource.id === resource.id
                      ? "border-emerald-600 ring-2 ring-emerald-50"
                      : "border-slate-200"
                  }`}
                >
                  <div>
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <span className="rounded bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          {resource.type}
                        </span>
                        {resource.badge && (
                          <span className="ml-1.5 rounded bg-amber-50 border border-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                            {resource.badge}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSaved(resource.id)}
                        className={`h-7 w-7 rounded-md border text-xs font-bold transition flex items-center justify-center ${
                          savedIds.includes(resource.id)
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-slate-200 bg-white text-slate-400 hover:text-slate-800"
                        }`}
                        aria-label="Marcar favorito"
                      >
                        ♥
                      </button>
                    </div>

                    <h3 className="mb-1 text-base font-bold leading-snug text-slate-900">
                      {resource.title}
                    </h3>
                    <p className="mb-3 text-xs leading-relaxed text-slate-500 line-clamp-3">
                      {resource.description}
                    </p>
                  </div>

                  <div>
                    <div className="mb-4 grid grid-cols-2 gap-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                      <div>Materia: <strong className="text-slate-800">{resource.subject}</strong></div>
                      <div>Año: <strong className="text-slate-800">{resource.level}</strong></div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400">{resource.rating} ★ ({resource.sales} ventas)</p>
                        <p className="text-base font-bold text-slate-950">
                          {formatPrice(resource.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => selectResource(resource)}
                        className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-800"
                      >
                        Detalles
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                <h3 className="text-base font-bold text-slate-800">
                  No hay materiales con este filtro.
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Prueba cambiando los criterios de materia o de formato de archivo.
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div
              id="resource-detail"
              className="scroll-mt-24 rounded-xl border border-slate-900 bg-slate-950 p-5 text-white shadow-sm"
            >
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                Ficha de Material
              </p>
              <h3 className="mb-2 text-lg font-bold">
                {selectedResource.title}
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-slate-300">
                {selectedResource.description}
              </p>

              <div className="mb-4 rounded-lg bg-white/5 border border-white/10 p-3.5 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Autor:</span>
                  <strong className="text-white">{selectedResource.seller}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Formato:</span>
                  <strong className="text-white">{selectedResource.delivery}</strong>
                </div>
                <div className="flex justify-between items-baseline pt-1.5 border-t border-white/10">
                  <span className="text-slate-400">Valor de contribución:</span>
                  <strong className="text-lg text-emerald-400">
                    {formatPrice(selectedResource.price)}
                  </strong>
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Contenido incluido:
                </p>
                <div className="space-y-1.5">
                  {selectedResource.includes.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={createWhatsAppLink(
                  selectedResource.sellerWhatsapp,
                  createPurchaseMessage(selectedResource)
                )}
                target="_blank"
                rel="noreferrer"
                className="block w-full rounded-lg bg-emerald-600 py-2.5 text-center text-xs font-bold text-white transition hover:bg-emerald-500"
              >
                Adquirir por WhatsApp
              </a>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="text-xs font-bold text-slate-700 mb-3">Guardados en esta sesión</h4>
              <div className="space-y-2">
                {savedResources.map((resource) => (
                  <button
                    key={resource.id}
                    type="button"
                    onClick={() => selectResource(resource)}
                    className="w-full rounded-lg border border-slate-100 bg-slate-50 p-2 text-left transition hover:border-emerald-500 flex justify-between items-center"
                  >
                    <div>
                      <span className="block text-xs font-bold text-slate-800 line-clamp-1">
                        {resource.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {resource.subject}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {formatPrice(resource.price)}
                    </span>
                  </button>
                ))}
                {savedResources.length === 0 && (
                  <p className="text-[11px] text-slate-500 p-2 text-center bg-slate-50 rounded-lg">
                    Agrega materiales usando el corazón para tener un acceso rápido aquí.
                  </p>
                )}
              </div>
            </div>

            <form
              id="solicitar-venta"
              onSubmit={submitSellerRequest}
              className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm"
            >
              <p className="mb-1 text-[10px] font-black uppercase tracking-wider text-emerald-800">
                Colaborar en la Feria
              </p>
              <h3 className="mb-2 text-sm font-bold text-slate-900">
                ¿Tienes resúmenes o desgrabados propios?
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-slate-600">
                Envía tus apuntes para revisión. Un tutor verificará la calidad académica y la organización del material antes de añadirlo a la feria.
              </p>
              <div className="space-y-2.5">
                <input
                  name="name"
                  value={sellerForm.name}
                  onChange={handleSellerChange}
                  placeholder="Tu nombre y apellido"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
                <input
                  name="contact"
                  value={sellerForm.contact}
                  onChange={handleSellerChange}
                  placeholder="Tu correo o celular"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
                <input
                  name="career"
                  value={sellerForm.career}
                  onChange={handleSellerChange}
                  placeholder="Materia (ej. Histología Cátedra 2)"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
                <input
                  name="resource"
                  value={sellerForm.resource}
                  onChange={handleSellerChange}
                  placeholder="Ej. Resumen del Segundo Parcial en PDF"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
              </div>
              {sellerMessage && (
                <p className="mt-3 rounded bg-white p-2.5 text-xs font-semibold text-emerald-800 border border-emerald-100">
                  {sellerMessage}
                </p>
              )}
              <button
                type="submit"
                className="mt-3 w-full rounded-lg bg-emerald-800 py-2 text-xs font-bold text-white transition hover:bg-slate-900"
              >
                Enviar Propuesta
              </button>
            </form>
          </aside>
        </div>
      </div>
    </section>
  )
}
