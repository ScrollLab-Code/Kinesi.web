import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden px-6 pt-28 bg-[#eff6ff] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,223,255,0.25),transparent_25%)]" />
      <div className="absolute inset-x-0 top-24 h-[420px] bg-[radial-gradient(circle,_rgba(145,206,255,0.18),transparent_55%)]" />
      <div className="absolute left-0 top-0 h-56 w-1/3 bg-gradient-to-r from-sky-200/70 to-transparent blur-3xl" />
      <div className="absolute right-0 bottom-0 h-64 w-1/2 bg-gradient-to-l from-slate-200/50 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center text-center py-24">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-8"
        >
          Acompañante académico para estudiantes
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1 }}
          className="text-[4rem] md:text-[6.5rem] leading-[0.92] font-black uppercase tracking-[-0.05em] text-slate-900"
        >
          KINASE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2 }}
          className="mt-8 max-w-3xl text-xl md:text-2xl leading-tight text-slate-600"
        >
          Estudio con compañía, guía y herramientas reales para que cada alumno pueda avanzar con seguridad y foco.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.35 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <a
            href="#que-es"
            className="rounded-full border border-slate-300 bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-900 transition hover:bg-slate-50"
          >
            Conocer más
          </a>
          <a
            href="#unirse"
            className="rounded-full bg-sky-700 px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-sky-600"
          >
            Registrarme
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-4 text-slate-500/70">
        <span className="text-xs uppercase tracking-[0.35em]">Scroll</span>
        <span className="h-16 w-[1px] bg-slate-300/30" />
      </div>
    </section>
  )
}
