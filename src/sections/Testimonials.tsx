import { useState, type ChangeEvent, type FormEvent } from "react"
import { motion } from "framer-motion"

const initialTestimonials = [
  {
    name: "Martina",
    career: "Medicina",
    text: "Me ayudo a ordenar los parciales y a estudiar con menos ansiedad. La diferencia fue tener un plan y alguien que lo revise.",
  },
 
]

type Testimonial = {
  name: string
  career: string
  text: string
}

export default function Testimonials() {
  const [showForm, setShowForm] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [formData, setFormData] = useState({
    name: "",
    career: "",
    email: "",
    testimonial: "",
  })
  const [isSending, setIsSending] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [responseMessage, setResponseMessage] = useState("")

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
      setSubmitError("Completa tu nombre, carrera y testimonio para enviar.")
      return
    }

    setIsSending(true)

    try {
      const response = await fetch("/api/send-email", {
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

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data?.error || "Error al enviar el testimonio.")
      }

      setTestimonials((prev) => [
        {
          name: formData.name,
          career: formData.career,
          text: formData.testimonial,
        },
        ...prev,
      ])
      setResponseMessage(
        "Gracias por tu testimonio. Ya lo recibimos y lo publicaremos pronto."
      )
      setFormData({ name: "", career: "", email: "", testimonial: "" })
      setShowForm(false)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar tu testimonio en este momento."
      )
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section id="testimonios" className="bg-white py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Historias de estudiantes
          </p>

          <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            La promesa es simple: estudiar mejor, con menos caos.
          </h2>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Queremos que tus compañeros también puedan ver lo que se puede lograr. Dejá tu testimonio directo desde la web y ayudá a que más estudiantes encuentren el apoyo que necesitan.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={`${testimonial.name}-${index}`}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="rounded-lg border border-slate-200 bg-stone-50 p-7"
            >
              <p className="mb-7 text-lg leading-8 text-slate-700">
                "{testimonial.text}"
              </p>

              <h3 className="font-black text-slate-950">{testimonial.name}</h3>
              <p className="text-slate-500">{testimonial.career}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-slate-200 bg-emerald-50 p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
                Dejá tu testimonio
              </p>
              <h3 className="text-3xl font-black text-slate-950">
                Compartí tu experiencia directamente desde la web.
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {showForm ? "Ocultar formulario" : "Quiero dejar mi testimonio"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-900">Nombre</span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                    placeholder="Tu nombre"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-900">Carrera o materia</span>
                  <input
                    name="career"
                    value={formData.career}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                    placeholder="Ej: Medicina, Abogacía, Matemática"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Email (opcional)</span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                  placeholder="Tu email"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Tu testimonio</span>
                <textarea
                  name="testimonial"
                  value={formData.testimonial}
                  onChange={handleChange}
                  rows={5}
                  className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                  placeholder="Contanos cómo te ayudó Kinase"
                />
              </label>

              {submitError && (
                <div className="rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-700">
                  {submitError}
                </div>
              )}

              {responseMessage && (
                <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm text-emerald-900">
                  {responseMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending ? "Enviando..." : "Enviar testimonio"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
