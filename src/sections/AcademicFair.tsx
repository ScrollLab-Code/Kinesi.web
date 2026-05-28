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

const resources: Resource[] = []

const categories = [
  "Todos",
  "Medicina",
  "Ingenieria",
  "Derecho",
  "Organizacion",
]

const types = [
  "Todos",
  "Apuntes",
  "Ejercicios",
  "Plantillas",
  "Finales",
  "Mapas",
]

const teamWhatsApp =
  "5492942344488"

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price)

const createWhatsAppLink = (
  phone: string,
  message: string
) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

const createPurchaseMessage = (
  resource: Resource
) =>
  [
    "Hola, vengo desde la feria universitaria de Kinase.",
    `Quiero comprar: ${resource.title}`,
    `Precio: ${formatPrice(resource.price)}`,
    `Vendedor: ${resource.seller}`,
  ].join("\n")

const createSellerRequestMessage = (
  sellerForm: {
    name: string
    contact: string
    resource: string
    career: string
  }
) =>
  [
    "🎓 NUEVA PUBLICACIÓN PARA LA FERIA",
    "",
    `👤 Nombre: ${sellerForm.name}`,
    `📱 Contacto: ${sellerForm.contact}`,
    `🏫 Carrera/Materia: ${sellerForm.career}`,
    `📚 Recurso: ${sellerForm.resource}`,
    "",
    "✅ Revisar publicación",
  ].join("\n")

export default function AcademicFair() {
  const [activeCategory, setActiveCategory] =
    useState("Todos")

  const [activeType, setActiveType] =
    useState("Todos")

  const [query, setQuery] = useState("")

  const [selectedResource, setSelectedResource] =
    useState<Resource | null>(
      resources.length > 0 ? resources[0] : null
    )

  const [savedIds, setSavedIds] = useState<
    number[]
  >([])

  const [sellerForm, setSellerForm] =
    useState({
      name: "",
      contact: "",
      resource: "",
      career: "",
    })

  const [sellerMessage, setSellerMessage] =
    useState("")

  const filteredResources = useMemo(() => {
    const cleanQuery = query
      .trim()
      .toLowerCase()

    return resources.filter((resource) => {
      const matchesCategory =
        activeCategory === "Todos" ||
        resource.subject === activeCategory

      const matchesType =
        activeType === "Todos" ||
        resource.type === activeType

      const searchableText =
        `${resource.title} ${resource.subject} ${resource.faculty} ${resource.description}`.toLowerCase()

      return (
        matchesCategory &&
        matchesType &&
        (!cleanQuery ||
          searchableText.includes(cleanQuery))
      )
    })
  }, [activeCategory, activeType, query])

  const savedResources = resources.filter(
    (resource) =>
      savedIds.includes(resource.id)
  )

  const toggleSaved = (id: number) => {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter(
            (savedId) => savedId !== id
          )
        : [...current, id]
    )
  }

  const selectResource = (
    resource: Resource
  ) => {
    setSelectedResource(resource)

    document
      .getElementById("resource-detail")
      ?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      })
  }

  const handleSellerChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSellerForm({
      ...sellerForm,
      [event.target.name]:
        event.target.value,
    })
  }

  const submitSellerRequest = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (
      !sellerForm.name ||
      !sellerForm.contact ||
      !sellerForm.resource ||
      !sellerForm.career
    ) {
      setSellerMessage(
        "Completa todos los campos."
      )
      return
    }

    const message =
      createSellerRequestMessage(
        sellerForm
      )

    window.open(
      `https://wa.me/${teamWhatsApp}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    )

    setSellerMessage(
      "Solicitud enviada correctamente."
    )

    setSellerForm({
      name: "",
      contact: "",
      resource: "",
      career: "",
    })
  }

  return (
    <section
      id="feria"
      className="bg-stone-50 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">

          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Feria universitaria
            </p>

            <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              Compra, vende y descubre recursos académicos.
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg leading-8 text-slate-600">
              Marketplace universitario para
              apuntes, finales, ejercicios,
              plantillas, objetos y materiales
              estudiantiles.
            </p>
          </div>

        </div>

        {/* STATS */}

        <div className="mb-10 grid gap-4 md:grid-cols-3">

          {[
            ["+500", "estudiantes"],
            ["4.9", "valoración"],
            ["24/7", "comunidad"],
          ].map(([value, label]) => (

            <div
              key={label}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-3xl font-black text-slate-950">
                {value}
              </p>

              <p className="mt-1 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                {label}
              </p>
            </div>

          ))}

        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_390px]">

          {/* IZQUIERDA */}

          <div>

            {/* FILTROS */}

            <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="grid gap-3 lg:grid-cols-[1fr_auto]">

                <input
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Buscar recurso..."
                  className="w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />

                <a
                  href="#solicitar-venta"
                  className="rounded-2xl bg-emerald-700 px-5 py-3 text-center font-black text-white transition hover:bg-slate-950"
                >
                  Publicar recurso
                </a>

              </div>

              <div className="mt-5 flex flex-wrap gap-2">

                {categories.map((category) => (

                  <button
                    key={category}
                    onClick={() =>
                      setActiveCategory(category)
                    }
                    className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                      activeCategory === category
                        ? "bg-slate-950 text-white"
                        : "bg-stone-100 text-slate-600"
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
                    onClick={() =>
                      setActiveType(type)
                    }
                    className={`rounded-xl border px-4 py-2 text-sm font-black transition ${
                      activeType === type
                        ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {type}
                  </button>

                ))}

              </div>

            </div>

            {/* RESOURCES */}

            {filteredResources.length === 0 ? (

              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                <h3 className="text-2xl font-black text-slate-950">
                  Todavía no hay publicaciones
                </h3>

                <p className="mt-3 text-slate-600">
                  Los estudiantes podrán subir
                  recursos, apuntes y materiales
                  próximamente.
                </p>

              </div>

            ) : (

              <div className="grid gap-5 md:grid-cols-2">

                {filteredResources.map(
                  (resource, index) => (

                    <motion.article
                      key={resource.id}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.04,
                      }}
                      viewport={{ once: true }}
                      className={`rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                        selectedResource?.id ===
                        resource.id
                          ? "border-emerald-500"
                          : "border-slate-200"
                      }`}
                    >

                      <div className="mb-4 flex items-start justify-between">

                        <span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-emerald-800">
                          {resource.type}
                        </span>

                        <button
                          onClick={() =>
                            toggleSaved(resource.id)
                          }
                          className={`h-10 w-10 rounded-xl border font-black transition ${
                            savedIds.includes(
                              resource.id
                            )
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-200"
                          }`}
                        >
                          +
                        </button>

                      </div>

                      <h3 className="mb-2 text-2xl font-black text-slate-950">
                        {resource.title}
                      </h3>

                      <p className="mb-5 text-sm leading-6 text-slate-600">
                        {resource.description}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-200 pt-4">

                        <div>
                          <p className="text-xs font-bold text-slate-500">
                            {resource.rating} ★
                          </p>

                          <p className="text-2xl font-black text-slate-950">
                            {formatPrice(
                              resource.price
                            )}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            selectResource(
                              resource
                            )
                          }
                          className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
                        >
                          Ver
                        </button>

                      </div>

                    </motion.article>

                  )
                )}

              </div>

            )}

          </div>

          {/* SIDEBAR */}

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            {/* DETAIL */}

            <div
              id="resource-detail"
              className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm"
            >

              {!selectedResource ? (

                <div className="py-10 text-center">

                  <p className="text-2xl font-black">
                    No hay recursos seleccionados
                  </p>

                  <p className="mt-3 text-slate-400">
                    Cuando haya publicaciones,
                    aparecerán acá.
                  </p>

                </div>

              ) : (

                <>

                  <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
                    Recurso seleccionado
                  </p>

                  <h3 className="mb-3 text-3xl font-black">
                    {selectedResource.title}
                  </h3>

                  <p className="mb-5 leading-7 text-slate-300">
                    {
                      selectedResource.description
                    }
                  </p>

                  <div className="mb-5 rounded-2xl border border-slate-700 bg-slate-900 p-4">

                    <div className="mb-3 flex justify-between">
                      <span className="text-slate-400">
                        Vendedor
                      </span>

                      <strong>
                        {
                          selectedResource.seller
                        }
                      </strong>
                    </div>

                    <div className="mb-3 flex justify-between">
                      <span className="text-slate-400">
                        Entrega
                      </span>

                      <strong>
                        {
                          selectedResource.delivery
                        }
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        Precio
                      </span>

                      <strong className="text-xl text-emerald-300">
                        {formatPrice(
                          selectedResource.price
                        )}
                      </strong>
                    </div>

                  </div>

                  <a
                    href={createWhatsAppLink(
                      selectedResource.sellerWhatsapp,
                      createPurchaseMessage(
                        selectedResource
                      )
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-2xl bg-emerald-600 px-5 py-4 text-center font-black text-white transition hover:bg-emerald-500"
                  >
                    Comprar por WhatsApp
                  </a>

                </>

              )}

            </div>

            {/* FORM */}

            <form
              id="solicitar-venta"
              onSubmit={submitSellerRequest}
              className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm"
            >

              <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
                Quiero vender
              </p>

              <h3 className="mb-4 text-2xl font-black text-slate-950">
                Publicar un recurso
              </h3>

              <div className="space-y-3">

                <input
                  name="name"
                  value={sellerForm.name}
                  onChange={handleSellerChange}
                  placeholder="Nombre"
                  className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 outline-none focus:border-emerald-600"
                />

                <input
                  name="contact"
                  value={sellerForm.contact}
                  onChange={handleSellerChange}
                  placeholder="WhatsApp o email"
                  className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 outline-none focus:border-emerald-600"
                />

                <input
                  name="career"
                  value={sellerForm.career}
                  onChange={handleSellerChange}
                  placeholder="Carrera o materia"
                  className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 outline-none focus:border-emerald-600"
                />

                <input
                  name="resource"
                  value={sellerForm.resource}
                  onChange={handleSellerChange}
                  placeholder="Qué querés vender"
                  className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 outline-none focus:border-emerald-600"
                />

              </div>

              {sellerMessage && (
                <p className="mt-4 rounded-2xl bg-white p-3 text-sm font-bold text-emerald-800">
                  {sellerMessage}
                </p>
              )}

              <button
                type="submit"
                className="mt-5 w-full rounded-2xl bg-emerald-700 py-4 font-black text-white transition hover:bg-slate-950"
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