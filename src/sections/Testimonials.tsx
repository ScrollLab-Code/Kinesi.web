import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Martina",
    career: "Medicina",
    text: "Me ayudo a ordenar los parciales y a estudiar con menos ansiedad. La diferencia fue tener un plan y alguien que lo revise.",
  },
  {
    name: "Tomas",
    career: "Ingenieria",
    text: "Use el foro para dudas puntuales y despues contrate una mentoria para preparar matematica. Llegue mucho mas firme.",
  },
  {
    name: "Lucia",
    career: "Abogacia",
    text: "El seguimiento me saco de estudiar todo a ultimo momento. Ahora se que hacer cada semana.",
  },
]

export default function Testimonials() {
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
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
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
      </div>
    </section>
  )
}
