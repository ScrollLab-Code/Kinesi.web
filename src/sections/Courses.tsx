import { motion } from "framer-motion"

const courses = [
  {
    title: "Acompañamiento academico 1 a 1",
    description:
      "Sesiones personalizadas para ordenar materias, detectar bloqueos y sostener una rutina de estudio posible.",
    price: "$30.000",
  },
  {
    title: "Metodo de estudio intensivo",
    description:
      "Tecnicas de comprension, memoria activa, repaso espaciado y practica para parciales o finales.",
    price: "$25.000",
  },
  {
    title: "Organizacion universitaria",
    description:
      "Planificacion semanal, calendario de entregas, objetivos medibles y control de procrastinacion.",
    price: "$18.000",
  },
]

export default function Courses() {
  return (
    <section id="cursos" className="bg-stone-50 py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Venta central
            </p>

            <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              La comunidad atrae estudiantes; la ayuda academica genera valor.
            </h2>
          </div>

          <p className="text-lg leading-8 text-slate-600">
            Cada servicio esta presentado como una solucion concreta para el
            dolor principal del estudiante: no saber por donde empezar, perder
            constancia o llegar tarde a los examenes.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {courses.map((course, index) => (
            <motion.article
              key={course.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm"
            >
              <span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-lg font-black text-emerald-800">
                {index + 1}
              </span>

              <h3 className="mb-4 text-2xl font-black text-slate-950">
                {course.title}
              </h3>

              <p className="mb-8 leading-7 text-slate-600">
                {course.description}
              </p>

              <div className="flex items-center justify-between gap-4">
                <span className="text-2xl font-black text-slate-950">
                  {course.price}
                </span>

                <a
                  href="#diagnostico"
                  className="rounded-lg bg-slate-950 px-5 py-3 font-black text-white transition hover:bg-emerald-700"
                >
                  Quiero esto
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
