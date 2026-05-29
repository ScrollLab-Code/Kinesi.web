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
  // Aquí irán tus recursos de Supabase o manuales en el futuro
]

const categories = ["Todos", "Medicina", "Ingenieria", "Derecho", "Organizacion"]
const types = ["Todos", "Apuntes", "Ejercicios", "Plantillas", "Finales", "Mapas"]
const teamWhatsAppLink =
  "https://chat.whatsapp.com/LBElkQFM83KAeytkBYFfU9?s=sh&p=a&mlu=3"

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
    "Hola, vengo desde la feria universitaria de Kinase.",
    `Quiero comprar: ${resource.title}`,
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
    "Nueva solicitud para subir material a la feria universitaria.",
    `Nombre: ${sellerForm.name}`,
    `Contacto: ${sellerForm.contact}`,
    `Carrera o materia: ${sellerForm.career}`,
    `Recurso: ${sellerForm.resource}`,
  ].join("\n")

const createTeamWhatsAppLink = (message: string) => {
  if (teamWhatsAppLink.includes("https://chat.whatsapp.com/2942543208")) {
    return `https://chat.whatsapp.com/2942543208?s=sh&p=a&mlu=3&text=${encodeURIComponent(message)}`
  }
  return teamWhatsAppLink
}

export default function AcademicFair() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [activeType, setActiveType] = useState("Todos")
  const [query, setQuery] = useState("")
  
  // Solución TypeScript: Inicializa en null ya que la lista empieza vacía
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [savedIds, setSavedIds] = useState<number[]>([1, 3])
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
      ?.scrollIntoView({ block: "start", behavior: "auto" })
  }

  const handleSellerChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSellerForm({
      ...sellerForm,
      [event.target.name]: event.target.value,
    })
  }

  const submitSellerRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (
      !sellerForm.name ||
      !sellerForm.contact ||
      !sellerForm.resource ||
      !sellerForm.career
    ) {
      setSellerMessage("Completa todos los campos para mandar la solicitud.")
      return
    }

    const requestMessage = createSellerRequestMessage(sellerForm)

    try {
      await navigator.clipboard?.writeText(requestMessage)
    } catch {
      // Evita bloqueos en navegadores estrictos
    }

    window.open(createTeamWhatsAppLink(requestMessage), "_blank", "noopener,noreferrer")
    setSellerMessage("Solicitud generada. Se abrio WhatsApp para enviarla al equipo.")
    setSellerForm({ name: "", contact: "", resource: "", career: "" })
  }

  return (
    <section id="feria" className="bg-stone-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Feria universitaria
            </p>
            <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              Compra, vende y descubre recursos academicos creados por estudiantes.
            </h2>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-lg leading-8 text-slate-600">
              Un mercado para recursos academicos. Y/O para general(objetos(elementos escolares, mates, termos, vasos termicos, etc)) Cada publicacion muestra carrera, nivel,
              vendedor, entregables y compra directa por WhatsApp.
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            ["1", "recursos destacados"],
            ["5/5", "promedio de valoracion"],
            ["+2", "entregas entre estudiantes"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-3xl font-black text-slate-950">{value}</p>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
          <div>
            <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar por materia, carrera o recurso..."
                  className="w-full rounded-lg border border-slate-200 bg-stone-50 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
                <a
                  href="#solicitar-venta"
                  className="rounded-lg bg-emerald-700 px-5 py-3 text-center font-black text-white transition hover:bg-slate-950"
                >
                  Solicitar revision
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                      activeCategory === category
                        ? "bg-slate-950 text-white"
                        : "bg-stone-100 text-slate-600 hover:text-slate-950"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveType(type)}
                    className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
                      activeType === type
                        ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {filteredResources.map((resource, index) => (
                <motion.article
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  viewport={{ once: true }}
                  className={`rounded-lg border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                    selectedResource?.id === resource.id
                      ? "border-emerald-500"
                      : "border-slate-200"
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-black uppercase tracking-[0.08em] text-emerald-800">
                        {resource.type}
                      </span>
                      {resource.badge && (
                        <span className="ml-2 rounded-md bg-amber-50 px-2 py-1 text-xs font-black uppercase tracking-[0.08em] text-amber-800">
                          {resource.badge}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSaved(resource.id)}
                      className={`h-9 w-9 rounded-lg border text-sm font-black transition ${
                        savedIds.includes(resource.id)
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-200 bg-white text-slate-500 hover:text-slate-950"
                      }`}
                      aria-label="Guardar recurso"
                    >
                      +
                    </button>
                  </div>

                  <h3 className="mb-2 text-xl font-black leading-snug text-slate-950">
                    {resource.title}
                  </h3>
                  <p className="mb-4 text-sm leading-6 text-slate-600">
                    {resource.description}
                  </p>

                  <div className="mb-5 grid gap-2 text-sm text-slate-600">
                    <div className="flex justify-between gap-3">
                      <span>Carrera</span>
                      <strong className="text-right text-slate-950">
                        {resource.subject}
                      </strong>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Nivel</span>
                      <strong className="text-right text-slate-950">
                        {resource.level}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500">
                        {resource.rating} valoracion - {resource.sales} ventas
                      </p>
                      <p className="text-2xl font-black text-slate-950">
                        {formatPrice(resource.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectResource(resource)}
                      className="rounded-lg bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
                    >
                      Ver / comprar
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
                <h3 className="text-xl font-black text-slate-950">
                  No encontramos recursos con esos filtros.
                </h3>
                <p className="mt-2 text-slate-600">
                  Prueba otra materia o publica una solicitud para que la
                  comunidad suba ese material.
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* Validación: Renderiza la ficha solo si hay un recurso seleccionado */}
            {selectedResource ? (
              <div
                id="resource-detail"
                className="scroll-mt-28 rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-sm"
              >
                <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
                  Ficha del recurso
                </p>
                <h3 className="mb-3 text-2xl font-black">
                  {selectedResource.title}
                </h3>
                <p className="mb-5 leading-7 text-slate-300">
                  {selectedResource.description}
                </p>

                <div className="mb-5 rounded-lg border border-slate-700 bg-slate-900 p-4">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <span className="text-slate-400">Vendedor</span>
                    <strong>{selectedResource.seller}</strong>
                  </div>
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <span className="text-slate-400">Entrega</span>
                    <strong className="text-right">{selectedResource.delivery}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">Precio</span>
                    <strong className="text-xl text-emerald-300">
                      {formatPrice(selectedResource.price)}
                    </strong>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="mb-3 text-sm font-black uppercase tracking-[0.12em] text-slate-400">
                    Incluye
                  </p>
                  <div className="space-y-2">
                    {selectedResource.includes?.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                        <span>{item}</span>
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
                  className="block rounded-lg bg-emerald-600 px-5 py-3 text-center font-black text-white transition hover:bg-emerald-500"
                >
                  Comprar por WhatsApp
                </a>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-sm font-bold text-slate-500">
                  Selecciona un recurso de la lista para ver el detalle y comprarlo.
                </p>
              </div>
            )}

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-black text-slate-950">
                Guardados para revisar
              </h3>
              <div className="space-y-3">
                {savedResources.map((resource) => (
                  <button
                    key={resource.id}
                    type="button"
                    onClick={() => selectResource(resource)}
                    className="w-full rounded-lg border border-slate-200 bg-stone-50 p-3 text-left transition hover:border-emerald-400"
                  >
                    <span className="block text-sm font-black text-slate-950">
                      {resource.title}
                    </span>
                    <span className="text-sm text-slate-500">
                      {formatPrice(resource.price)}
                    </span>
                  </button>
                ))}
                {savedResources.length === 0 && (
                  <p className="rounded-lg bg-stone-50 p-3 text-sm text-slate-600">
                    Guarda recursos con el boton + para compararlos despues.
                  </p>
                )}
              </div>
            </div>

            <form
              id="solicitar-venta"
              onSubmit={submitSellerRequest}
              className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm"
            >
              <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-emerald-800">
                Quiero vender
              </p>
              <h3 className="mb-4 text-xl font-black text-slate-950">
                Genera una solicitud para que el equipo revise tu material.
              </h3>
              <p className="mb-4 text-sm leading-6 text-emerald-900">
                No se publica nada automaticamente. La solicitud se manda por
                WhatsApp para que los socios la aprueben antes de subirla.
              </p>
              <div className="space-y-3">
                <input
                  name="name"
                  value={sellerForm.name}
                  onChange={handleSellerChange}
                  placeholder="Nombre"
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
                <input
                  name="contact"
                  value={sellerForm.contact}
                  onChange={handleSellerChange}
                  placeholder="Email o WhatsApp"
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
                <input
                  name="career"
                  value={sellerForm.career}
                  onChange={handleSellerChange}
                  placeholder="Carrera o materia"
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
                <input
                  name="resource"
                  value={sellerForm.resource}
                  onChange={handleSellerChange}
                  placeholder="Que recurso queres vender"
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              {sellerMessage && (
                <p className="mt-4 rounded-lg bg-white p-3 text-sm font-bold text-emerald-800">
                  {sellerMessage}
                </p>
              )}
              <button
                type="submit"
                className="mt-4 w-full rounded-lg bg-emerald-700 py-3 font-black text-white transition hover:bg-slate-950"
              >
                Enviar solicitud
              </button>
            </form>
          </aside>
        </div>
      </div>
    </section>
  )
}