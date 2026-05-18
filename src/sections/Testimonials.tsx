import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Martina",
    career: "Medicina",
    text: "Me ayudó muchísimo a organizarme para los parciales. Sentí mucho más control y confianza al estudiar.",
  },

  {
    name: "Tomás",
    career: "Ingeniería",
    text: "Aprendí técnicas de estudio que nunca había usado y mejoré muchísimo mi rendimiento académico.",
  },

  {
    name: "Lucía",
    career: "Abogacía",
    text: "El acompañamiento personalizado me ayudó a dejar de procrastinar y estudiar con más constancia.",
  },
]

export default function Testimonials() {
  return (
    <section className="py-32 px-6 bg-white">
      
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-20">
          
          <p className="text-blue-600 font-medium mb-4">
            Testimonios
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">
            Estudiantes que mejoraron su forma de estudiar
          </h2>

          <p className="text-zinc-600 text-lg max-w-2xl mx-auto">
            Experiencias reales de estudiantes que trabajaron sus hábitos, organización y rendimiento académico.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-blue-50 border border-blue-100 rounded-[2rem] p-8 shadow-lg"
            >
              
              <div className="flex gap-1 mb-6 text-yellow-400 text-xl">
                ⭐ ⭐ ⭐ ⭐ ⭐
              </div>

              <p className="text-zinc-700 leading-relaxed mb-8 text-lg">
                “{testimonial.text}”
              </p>

              <div>
                <h3 className="font-bold text-zinc-900 text-lg">
                  {testimonial.name}
                </h3>

                <p className="text-zinc-500">
                  {testimonial.career}
                </p>
              </div>

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  )
}