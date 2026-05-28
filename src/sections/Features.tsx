const features = [
  {
    title: "Foros por materia",
    description:
      "Espacios para preguntar, responder y ordenar dudas por carrera, examen o tema puntual.",
    icon: "💬",
    color: "blue",
  },
  {
    title: "Feria académica",
    description:
      "Mentorías, packs de estudio, preparación de parciales y recursos comprables desde la misma plataforma.",
    
    color: "green",
  },
  {
    title: "Acompañamiento personalizado",
    description:
      "Diagnóstico, plan de acción y seguimiento real para mejorar resultados en cada materia.",
    icon: "📊",
    color: "purple",
  },
  
]

export default function Features() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Qué ofrece Kinase
          </p>

          <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            Una plataforma diseñada para que el estudiante avance realmente.
          </h2>
          
          <p className="mt-4 text-lg text-slate-600">
            Combinamos comunidad, feria académica y tutoría personalizada en un solo lugar.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-xl border border-slate-200 bg-gradient-to-br from-white to-stone-50 p-7 shadow-sm transition hover:shadow-lg hover:border-emerald-300"
            >
              <div className="mb-4 text-5xl">{feature.icon}</div>

              <h3 className="mb-2 text-lg font-black text-slate-950 group-hover:text-emerald-700 transition">
                {feature.title}
              </h3>

              <p className="text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
