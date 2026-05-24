import { motion } from "framer-motion"

type CoursesProps = {
  registered: boolean
}

const items = [
  {
    category: "Material comunitario",
    title: "Apuntes colaborativos",
    description: "Documentos creados por estudiantes, con ejemplos claros y estructura lista para estudiar.",
    price: "$8.500",
  },
  {
    category: "Tutoría",
    title: "Consulta entre pares",
    description: "Sesiones de apoyo ofrecidas por alumnos avanzados que ya pasaron la materia.",
    price: "$12.000",
  },
  {
    category: "Herramienta",
    title: "Kit de estudio comunitario",
    description: "Plantillas y prácticas pensadas por estudiantes para otros estudiantes.",
    price: "$10.000",
  },
  {
    category: "Plan",
    title: "Ruta de estudio personalizada",
    description: "Planes de estudio propuestos por la comunidad para mejorar tu organización.",
    price: "$14.000",
  },
]

export default function Courses({ registered }: CoursesProps) {
  return (
    <section id="marketplace" className="border-t border-slate-200 bg-[#eef8ff] py-28 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-5">Marketplace estudiantil</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
              Un espacio comunitario donde cada estudiante publica su recurso.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {registered
                ? "Encontrá apuntes, tutorías y planes creados por alumnos como vos. Cada publicación es una propuesta independiente que la comunidad comparte para ayudar a otros a avanzar."
                : "Primero registrate y desbloquea el marketplace. Después vas a poder ver los recursos, tutorías y propuestas creadas por estudiantes."}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">Comunidad activa</p>
            <h3 className="text-3xl font-semibold text-slate-900 mb-6">Publicá y comprá sin intermediarios</h3>
            <ul className="space-y-4 text-slate-600">
              <li className="rounded-3xl border border-slate-200 bg-slate-50 p-4">Recursos subidos por estudiantes de tu carrera.</li>
              <li className="rounded-3xl border border-slate-200 bg-slate-50 p-4">Tutorías hechas por compañeros con experiencia práctica.</li>
              <li className="rounded-3xl border border-slate-200 bg-slate-50 p-4">Ofertas abiertas para que encuentres lo que te sirve ya.</li>
            </ul>
            <a
              href="#unirse"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-sky-700 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-sky-600"
            >
              {registered ? 'Publicá tu recurso' : 'Registrate primero'}
            </a>
          </div>
        </div>

        {registered ? (
          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {items.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_40px_rgba(15,23,42,0.06)]"
              >
                <span className="text-xs uppercase tracking-[0.3em] text-sky-700">{item.category}</span>
                <h3 className="mt-4 text-3xl font-semibold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-8">{item.description}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-2xl font-semibold text-slate-900">{item.price}</span>
                  <a
                    href="#unirse"
                    className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-900 transition hover:bg-slate-200"
                  >
                    Consultar
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-14 text-center shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-4">Acceso bloqueado</p>
            <h3 className="text-3xl font-semibold text-slate-900 mb-4">El marketplace se desbloquea con tu registro</h3>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">
              Registrate gratis y accedé al espacio donde cada estudiante sube sus propias guías, tutorías y planes de estudio.
            </p>
            <a
              href="#unirse"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-slate-800"
            >
              Registro gratuito
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
