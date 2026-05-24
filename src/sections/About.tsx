import { motion } from "framer-motion"

export default function About() {
  return (
    <section id="que-es" className="relative overflow-hidden border-t border-slate-200 bg-white py-28 px-6">
      <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-sky-100 blur-3xl" />
      <div className="absolute left-0 bottom-10 h-64 w-64 rounded-full bg-slate-100 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-20 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-5">
              Qué es KINASE
            </p>

            <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight max-w-3xl">
              Un espacio de estudio acompañado, pensado para quienes necesitan avanzar con claridad.
            </h2>

            <p className="mt-8 max-w-2xl text-lg leading-9 text-slate-600">
              Aquí no vendemos cursos genéricos: ofrecemos acompañamiento académico con foco en tu estilo, tu ritmo y tu realidad de estudiante.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                "Guía personalizada",
                "Test de perfil real",
                "Recursos seleccionados",
              ].map((item) => (
                <div key={item} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-[2.5rem] border border-slate-200 bg-slate-50 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500 mb-4">Experiencia</p>
              <h3 className="text-3xl font-semibold text-slate-900 leading-tight">
                Tu compañero de estudio, no otra plataforma fría.
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-slate-700">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500 mb-3">Humanizado</p>
                <p className="text-lg text-slate-900">Acompañamos tu proceso con sentido y feedback real.</p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-slate-700">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500 mb-3">Claro</p>
                <p className="text-lg text-slate-900">Sin ruido, sin promesas vacías, solo pasos para mejorar tu estudio.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
