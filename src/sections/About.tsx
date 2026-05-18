import { motion } from "framer-motion"

export default function About() {
  return (
    <section className="py-32 px-6 bg-white">
      
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          
          <p className="text-blue-600 font-medium mb-4">
            Sobre el acompañamiento
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 leading-tight mb-8">
            Un enfoque humano y personalizado para estudiantes universitarios
          </h2>

          <p className="text-zinc-600 text-lg leading-relaxed mb-6">
            El objetivo de este acompañamiento es ayudarte a desarrollar mejores hábitos de estudio, organización académica y estrategias reales para mejorar tu rendimiento.
          </p>

          <p className="text-zinc-600 text-lg leading-relaxed mb-10">
            Cada estudiante tiene dificultades distintas, por eso el enfoque se adapta a las necesidades, objetivos y ritmo de cada persona.
          </p>

          <div className="flex flex-wrap gap-4">
            
            <div className="bg-blue-50 border border-blue-100 px-5 py-3 rounded-2xl">
              📚 Técnicas de estudio
            </div>

            <div className="bg-blue-50 border border-blue-100 px-5 py-3 rounded-2xl">
              ⏰ Organización académica
            </div>

            <div className="bg-blue-50 border border-blue-100 px-5 py-3 rounded-2xl">
              🧠 Hábitos y enfoque
            </div>

          </div>

        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative"
        >
          
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-[2.5rem] p-4 shadow-2xl">
            
            <div className="aspect-video rounded-[2rem] bg-white flex items-center justify-center text-zinc-400 text-lg">
              Video presentación
            </div>

          </div>

          {/* Floating Card */}
          <div className="absolute -bottom-8 -left-8 bg-white shadow-xl border border-zinc-100 rounded-3xl p-5 hidden md:block">
            
            <p className="text-sm text-zinc-500 mb-2">
              Mentorías personalizadas
            </p>

            <h3 className="text-xl font-bold text-zinc-900">
              Seguimiento 1 a 1
            </h3>

          </div>

        </motion.div>

      </div>

    </section>
  )
}