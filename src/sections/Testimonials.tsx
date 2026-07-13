import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { motion } from "framer-motion"
import { supabase } from "../lib/supabase"

const initialTestimonials: Testimonial[] = []

type Testimonial = {
  name: string
  career: string
  text: string
}

const LOCAL_STORAGE_KEY_TESTIMONIALS = "kinase_testimonials_v1"

export default function Testimonials() {
  const [showForm, setShowForm] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY_TESTIMONIALS)
    if (local) {
      try {
        const parsed = JSON.parse(local)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      } catch {
        return initialTestimonials
      }
    }
    return initialTestimonials
  })
  
  const [formData, setFormData] = useState({
    name: "",
    career: "",
    email: "",
    testimonial: "",
  })
  const [isSending, setIsSending] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [responseMessage, setResponseMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch testimonials from Supabase database
  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error

        if (data && data.length > 0) {
          const mapped = data.map((item: { 
            name?: string | null
            career?: string | null
            text?: string | null
            testimonial?: string | null 
          }) => {
            let displayText = item.text || item.testimonial || ""
            const emailMarkerIndex = displayText.indexOf("[EMAIL_CONTACT:")
            if (emailMarkerIndex !== -1) {
              displayText = displayText.substring(0, emailMarkerIndex).trim()
            }
            return {
              name: item.name || "Alumno Anónimo",
              career: item.career || "Estudiante de Medicina",
              text: displayText
            }
          })
          setTestimonials(mapped)
        }
      } catch (err) {
        console.warn("No se pudieron cargar los testimonios desde Supabase. Usando respaldo local:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError("")
    setResponseMessage("")

    if (!formData.name || !formData.career || !formData.testimonial) {
      setSubmitError("Completa tu nombre, carrera/materia y testimonio para enviar.")
      return
    }

    setIsSending(true)

    const newTestimonial: Testimonial = {
      name: formData.name,
      career: formData.career,
      text: formData.testimonial,
    }

    // 1. Persist to Supabase Database
    let dbSuccess = false
    const finalText = formData.email.trim()
      ? `${formData.testimonial}\n\n[EMAIL_CONTACT:${formData.email.trim()}]`
      : formData.testimonial

    try {
      const { error: dbError } = await supabase
        .from("testimonials")
        .insert([
          {
            name: formData.name,
            career: formData.career,
            text: finalText
          }
        ])

      if (dbError) throw dbError
      dbSuccess = true
    } catch (err) {
      console.warn("Could not save to Supabase 'testimonials' table. Falling back to local storage:", err)
    }

    // 2. Dispatch email notification as backup
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          career: formData.career,
          testimonial: formData.testimonial,
          email: formData.email || undefined,
          phone: "No aplica",
        }),
      })
    } catch (err) {
      console.warn("Email API notification error:", err)
    }

    // 3. Update local state
    setTestimonials((prev) => {
      const next = [newTestimonial, ...prev]
      localStorage.setItem(LOCAL_STORAGE_KEY_TESTIMONIALS, JSON.stringify(next))
      return next
    })

    if (dbSuccess) {
      setResponseMessage("¡Gracias por tu testimonio! Se ha guardado de forma permanente en la base de datos.")
    } else {
      setResponseMessage("¡Gracias! Tu testimonio se ha registrado localmente (Demostración de Respaldo).")
    }

    setFormData({ name: "", career: "", email: "", testimonial: "" })
    setShowForm(false)
    setIsSending(false)
  }

  return (
    <section id="testimonios" className="bg-white py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
            Historias de Éxito
          </p>

          <h2 className="text-3xl font-black leading-tight text-slate-955 md:text-4xl">
            La promesa es simple: cursar con estrategia, aprobar sin caos.
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Conoce cómo otros compañeros lograron superar las materias filtro del ciclo biomédico utilizando el método de organización y las herramientas de Kinase.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-xs text-slate-400">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-emerald-800 border-t-transparent mr-2 align-middle"></span>
            Cargando testimonios...
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={`${testimonial.name}-${index}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-xl border border-slate-200 bg-stone-50/50 p-6 flex flex-col justify-between"
              >
                <p className="mb-5 text-sm leading-relaxed text-slate-600 italic">
                  "{testimonial.text}"
                </p>

                <div>
                  <h3 className="text-sm font-bold text-slate-950">{testimonial.name}</h3>
                  <p className="text-xs text-slate-500">{testimonial.career}</p>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-2xl border border-slate-200 bg-emerald-50/30 p-6 max-w-3xl mx-auto shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-black uppercase tracking-wider text-emerald-800">
                Tu opinión nos impulsa
              </p>
              <h3 className="text-lg font-bold text-slate-955">
                ¿Kinase te ayudó a destrabar una materia?
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 shrink-0"
            >
              {showForm ? "Ocultar" : "Dejar testimonio"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mt-6 border-t border-slate-100 pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold text-slate-600">Nombre y Apellido</span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600"
                    placeholder="Tu nombre completo"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-600">Carrera / Materia Aprobada</span>
                  <input
                    name="career"
                    value={formData.career}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600"
                    placeholder="Ej: Medicina (UBA) - Aprobé Anatomía"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold text-slate-600">Email (Opcional - No se publica)</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600"
                    placeholder="tuemail@correo.com"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-bold text-slate-600">Tu Testimonio</span>
                <textarea
                  name="testimonial"
                  value={formData.testimonial}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 resize-none"
                  placeholder="Cuéntanos cómo te ayudó Kinase en tu cursada..."
                  required
                />
              </label>

              {submitError && (
                <p className="text-xs font-semibold text-rose-600">
                  {submitError}
                </p>
              )}

              {responseMessage && (
                <p className="text-xs font-semibold text-emerald-800">
                  {responseMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="w-full rounded-lg bg-emerald-800 hover:bg-slate-900 text-white font-bold text-xs py-2 transition disabled:opacity-50"
              >
                {isSending ? "Guardando testimonio..." : "Enviar Testimonio"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
