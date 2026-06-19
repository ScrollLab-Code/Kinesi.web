import { motion } from "framer-motion"
import videoPresentacion from "../assets/video presentacion.mp4"

export default function About() {
  return (
    <section id="ayuda" className="bg-gradient-to-br from-white via-slate-50 to-emerald-50 py-24 px-6">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
        >
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Por qué Kinase
          </p>

          <h2 className="mb-6 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            El contenido no lo es todo. El apoyo real transforma resultados.
          </h2>

          <p className="mb-5 text-lg leading-8 text-slate-600">
            Muchos estudiantes tienen acceso a contenido infinito. El problema real es no saber por dónde empezar, perder consistencia o quedarse solo cuando se traba una materia.
          </p>

          <p className="mb-5 text-lg leading-8 text-slate-600">
            Kinase también suma un espacio para particulares: mentorías one‑on‑one, tutorías por materia y un plan de estudio adaptado a tus tiempos. Esto te ayuda a avanzar con seguridad, aun cuando las parciales se acercan.
          </p>

          <p className="mb-6 text-lg leading-8 text-slate-600">
            Por eso Kinase combina tres cosas:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-2xl">💬</div>
              <div>
                <h4 className="font-black text-slate-950 mb-1">Comunidad real</h4>
                <p className="text-slate-600">Foro donde otros estudiantes responden y apoyan.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 text-2xl">📚</div>
              <div>
                <h4 className="font-black text-slate-950 mb-1">Feria academica</h4>
                <p className="text-slate-600">Por y para estudiantes.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 text-2xl">📊</div>
              <div>
                <h4 className="font-black text-slate-950 mb-1">Seguimiento personalizado</h4>
                <p className="text-slate-600">Diagnóstico, plan semanal y control de avance.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 text-2xl">🧑‍🏫</div>
              <div>
                <h4 className="font-black text-slate-950 mb-1">Clases particulares</h4>
                <p className="text-slate-600">Tutorías individuales para resolver dudas, practicar ejercicios clave y preparar parciales con foco en tus necesidades.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          className="rounded-2xl border-2 border-emerald-300 bg-white p-4 shadow-xl overflow-hidden"
        >
          <video
            controls
            className="aspect-video w-full rounded-xl bg-black object-cover"
            src={videoPresentacion}
          >
            Tu navegador no soporta video en HTML5.
          </video>
          <div className="mt-6 p-4 bg-emerald-50 rounded-lg text-center">
            <p className="text-sm text-slate-700">
              <span className="font-black text-emerald-700">Mira cómo funciona</span> la plataforma y conoce nuestro método de acompañamiento.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
