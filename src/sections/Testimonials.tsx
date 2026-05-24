import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Martina",
    career: "Medicina",
    text: "Con KINASE me sentí acompañada. El apoyo me dio más claridad para organizar los parciales.",
  },
  {
    name: "Tomás",
    career: "Ingeniería",
    text: "No es un curso más: es una guía real para estudiar con método y sin sentirme solo.",
  },
  {
    name: "Lucía",
    career: "Abogacía",
    text: "El test me ayudó a entender mi forma de aprender y la tutoría me dio confianza.",
  },
]

export default function Testimonials() {
  return (
    <section className="border-t border-slate-200 bg-white py-28 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-5">Testimonios</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
            Estudiantes que sintieron el acompañamiento.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
            >
              <div className="mb-6 flex gap-2 text-amber-500 text-xl">⭐⭐⭐⭐⭐</div>
              <p className="text-slate-700 leading-relaxed mb-8">“{testimonial.text}”</p>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{testimonial.name}</h3>
                <p className="text-slate-500">{testimonial.career}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
