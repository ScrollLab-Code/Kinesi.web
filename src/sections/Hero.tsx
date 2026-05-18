import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-white to-blue-50 overflow-hidden"
    >
      
      {/* Background Glow */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-40"></div>

      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-40"></div>

      {/* Floating Cards */}
      <div className="hidden xl:block absolute left-6 top-52 bg-white shadow-xl border border-zinc-100 rounded-3xl p-5 backdrop-blur-xl">
        <p className="text-sm text-zinc-500 mb-2">
          Estudiantes ayudados
        </p>

        <h3 className="text-3xl font-bold text-zinc-900">
          +40
        </h3>
      </div>

      <div className="hidden xl:block absolute right-6 bottom-32 bg-white shadow-xl border border-zinc-100 rounded-3xl p-5 backdrop-blur-xl max-w-[240px]">
        <p className="text-sm text-zinc-500 mb-2">
          Seguimiento personalizado
        </p>

        <h3 className="text-xl font-semibold text-zinc-900 leading-snug">
          Técnicas de estudio + hábitos
        </h3>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl text-center relative z-10 pt-20"
      >
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-blue-600 font-medium mb-4"
        >
          Acompañamiento académico personalizado
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-zinc-900"
        >
          Descubrí una mejor forma de estudiar
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-zinc-600 text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          Técnicas de estudio, organización académica y acompañamiento personalizado para estudiantes universitarios.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          
          <a
            href="#diagnostico"
            className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
          >
            Hacer diagnóstico
          </a>

          <a
            href="#cursos"
            className="bg-white border border-zinc-200 px-8 py-4 rounded-full hover:bg-zinc-50 transition"
          >
            Ver cursos
          </a>

        </motion.div>

      </motion.div>

    </section>
  )
}