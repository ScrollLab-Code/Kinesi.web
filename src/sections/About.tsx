import { motion } from "framer-motion"
import videoPresentacion from "../assets/video presentacion.mp4"
import FAQ from "../components/FAQ"

export default function About() {
  return (
    <section id="ayuda" className="bg-white py-16 px-6 border-b border-slate-100">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
            Metodología Kinase
          </p>

          <h2 className="mb-5 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
            Estudiar medicina no es memorizar mil hojas. Es saber priorizar.
          </h2>

          <p className="mb-4 text-sm leading-relaxed text-slate-650 text-slate-600">
            Muchos alumnos encaran Anatomía o Fisiología intentando leer de corrido tomos enteros. El resultado suele ser quedarse sin tiempo, perder regularidad o paralizarse en el examen práctico frente al preparado.
          </p>

          <p className="mb-4 text-sm leading-relaxed text-slate-650 text-slate-600">
            Nuestro sistema combina material verificado (feria), resolución colectiva de dudas de cursada (muro de experiencias) y coaching individual para planificar tu semana. Así llegas al parcial con repasos activos y simulacros orales hechos.
          </p>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-lg">🩺</div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Enfoque Clínico y Práctico</h4>
                <p className="text-xs text-slate-500">Orientación directa sobre qué material priorizar según la cátedra asignada.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-lg">📅</div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Planificación Semanal Inversa</h4>
                <p className="text-xs text-slate-500">Establecemos hitos claros de lectura para que no te quedes atrás en los cronogramas oficiales.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-lg">🗣️</div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Simulacros de Examen Oral</h4>
                <p className="text-xs text-slate-500">Prácticas de oratoria técnica para convencer al tribunal docente con fluidez y rigor científico.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm overflow-hidden"
        >
          <video
            controls
            className="aspect-video w-full rounded-lg bg-black object-cover"
            src={videoPresentacion}
          >
            Tu navegador no soporta video en HTML5.
          </video>
          <div className="mt-4 p-3 bg-emerald-50/50 rounded-lg text-center border border-emerald-100">
            <p className="text-xs text-slate-700">
              <span className="font-bold text-emerald-800">Conoce el método:</span> visualiza cómo organizamos tu espacio de estudio y el seguimiento uno a uno.
            </p>
          </div>
        </motion.div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="mt-16 border-t border-slate-100 pt-10">
        <FAQ />
      </div>
    </section>
  )
}
