import { motion } from "framer-motion"
import videoPresentacion from "../assets/video presentacion.mp4"

export default function About() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
        >
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Acompañamiento
          </p>

          <h2 className="mb-6 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            No alcanza con contenido: el estudiante necesita seguimiento.
          </h2>

          <p className="mb-5 text-lg leading-8 text-slate-600">
            La propuesta comercial de Kinase es transformar dudas sueltas en un
            camino de mejora: diagnostico, plan semanal, metodologia de estudio
            y control de avance.
          </p>

          <p className="text-lg leading-8 text-slate-600">
            Por eso la web no solo muestra cursos. Invita a registrarse,
            participar en comunidad y contratar ayuda academica cuando el
            estudiante ya sabe que necesita apoyo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          className="rounded-lg border border-slate-200 bg-stone-50 p-3 shadow-sm"
        >
          <video
            controls
            className="aspect-video w-full rounded-md bg-black object-cover"
            src={videoPresentacion}
          >
            Tu navegador no soporta video en HTML5.
          </video>
        </motion.div>
      </div>
    </section>
  )
}
