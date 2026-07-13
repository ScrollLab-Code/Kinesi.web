import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"

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

// Emptied for production as requested, wait for future uploads with user
const resources: Resource[] = []

const createWhatsAppLink = (phone: string, message: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

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
  const [sellerForm, setSellerForm] = useState({
    name: "",
    contact: "",
    resource: "",
    career: "",
  })
  const [sellerMessage, setSellerMessage] = useState("")

  const handleSellerChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const teamPhone = "5492996232195" // Demo central team number
    window.open(createWhatsAppLink(teamPhone, requestMessage), "_blank", "noopener,noreferrer")
    
    setSellerMessage("Propuesta generada. Se abrió WhatsApp para enviarla a los moderadores de Kinase.")
    setSellerForm({ name: "", contact: "", resource: "", career: "" })
  }

  return (
    <section id="feria" className="bg-stone-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        
        {/* Encabezado Principal */}
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
              Feria de Recursos de Medicina
            </p>
            <h2 className="text-3xl font-black leading-tight text-slate-955 md:text-4xl">
              Consigue y comparte guías, desgrabados y preparados anatómicos.
            </h2>
          </div>

          <div className="glass-card rounded-2xl p-5 clinical-shadow">
            <p className="text-sm leading-relaxed text-slate-600">
              Un catálogo seguro organizado por materias de la carrera. Cada apunte contará con la verificación de estudiantes avanzados que ya rindieron y aprobaron las asignaturas correspondientes.
            </p>
          </div>
        </div>

        {/* Indicadores de Estado */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            [`${resources.length} Recursos`, "Disponibles para estudio"],
            ["Fase Inicial", "Esperando propuestas"],
            ["Verificación", "Por tutores avanzados"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="glass-card rounded-2xl p-5 clinical-shadow transition-all duration-300"
            >
              <p className="text-xl font-bold text-slate-900">{value}</p>
              <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.05em] text-slate-400">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Contenedor Principal de la Sección en Desarrollo */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          
          {/* Columna Izquierda: Información de la Feria y Cartel de Desarrollo */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-amber-500 bg-amber-50/40 p-6 text-slate-800 clinical-shadow">
              <div className="flex items-center gap-2">
                <span className="animate-pulse h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                  Sección en Desarrollo - Esperando Propuestas
                </span>
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900">
                La Feria de Materiales Académicos está preparándose para ti
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Estamos en la fase inicial de recolección y control de calidad de apuntes, desgrabados y atlas de preparados. Pronto habilitaremos la visualización del catálogo completo de recursos verificados para tus cursadas.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 clinical-shadow space-y-4 bg-white/50">
              <h3 className="text-base font-bold text-slate-900">¿De qué trata esta sección?</h3>
              <p className="text-xs leading-relaxed text-slate-600">
                La <strong>Feria de Materiales</strong> es una biblioteca digital y colaborativa exclusiva para la comunidad de medicina. El objetivo es centralizar recursos académicos de alta calidad específicos de las distintas cátedras (como Anatomía, Histología y Fisiología).
              </p>
              <p className="text-xs leading-relaxed text-slate-600">
                Aquí podrás acceder a:
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pl-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-700 shrink-0" />
                  <span><strong>Apuntes limpios y esquemas:</strong> Con resúmenes de plexos y relaciones anatómicas difíciles de entender.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-700 shrink-0" />
                  <span><strong>Atlas de Histología:</strong> Guías prácticas con fotos en alta definición de preparados reales comentados.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-700 shrink-0" />
                  <span><strong>Bancos de preguntas:</strong> Evaluaciones de opción múltiple con justificación completa explicadas paso a paso.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-700 shrink-0" />
                  <span><strong>Mazo de Flashcards (Anki):</strong> Mazos de repaso diseñados específicamente para retener farmacología e histología mediante repetición espaciada.</span>
                </li>
              </ul>
              <p className="text-xs leading-relaxed text-slate-600 pt-3 border-t border-slate-100">
                Cada material es auditado por estudiantes que ya aprobaron la materia con notas sobresalientes, garantizando que el contenido sea preciso, ordenado y útil para tu cursada.
              </p>
            </div>
          </div>

          {/* Columna Derecha: Formulario de Propuesta */}
          <div>
            <form
              id="solicitar-venta"
              onSubmit={submitSellerRequest}
              className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-6 clinical-shadow space-y-4 bg-white"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  Proponer tu material
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  ¿Tienes apuntes, atlas propios o flashcards digitales que te sirvieron para aprobar? Compártelos con la comunidad de Kinase y ayuda a tus compañeros.
                </p>
              </div>

              <div className="space-y-3.5">
                <label className="block">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Nombre Completo</span>
                  <input
                    name="name"
                    value={sellerForm.name}
                    onChange={handleSellerChange}
                    placeholder="Ej: Sofía Pérez"
                    className="mt-1.5 w-full rounded-lg border border-slate-250 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                    required
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Contacto (Teléfono/Email)</span>
                    <input
                      name="contact"
                      value={sellerForm.contact}
                      onChange={handleSellerChange}
                      placeholder="Ej: +54 9 11..."
                      className="mt-1.5 w-full rounded-lg border border-slate-250 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Materia / Cátedra</span>
                    <input
                      name="career"
                      value={sellerForm.career}
                      onChange={handleSellerChange}
                      placeholder="Ej: Anatomía Cát. 1"
                      className="mt-1.5 w-full rounded-lg border border-slate-250 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                      required
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Descripción del Material</span>
                  <textarea
                    name="resource"
                    value={sellerForm.resource}
                    onChange={handleSellerChange}
                    rows={4}
                    placeholder="Describe qué contiene tu material, el formato (PDF, Drive, Anki) y cómo ayuda a estudiar..."
                    className="mt-1.5 w-full rounded-lg border border-slate-250 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600 resize-none"
                    required
                  />
                </label>
              </div>

              {sellerMessage && (
                <p className="text-xs font-semibold text-emerald-800">
                  {sellerMessage}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 transition"
              >
                Enviar Propuesta a los Moderadores
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
