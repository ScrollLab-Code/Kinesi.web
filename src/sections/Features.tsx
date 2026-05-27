const features = [
  {
    title: "Foros por materia",
    description:
      "Espacios para preguntar, responder y ordenar dudas por carrera, examen o tema puntual.",
  },
  {
    title: "Marketplace academico",
    description:
      "Mentorias, packs de estudio, preparacion de parciales y recursos comprables desde la misma plataforma.",
  },
  {
    title: "Ayuda personalizada",
    description:
      "El cliente vende acompañamiento real: diagnostico, plan de accion y seguimiento para mejorar resultados.",
  },
  {
    title: "Perfil de estudiante",
    description:
      "Registro con email, celular o Google para guardar publicaciones, compras, objetivos y progreso.",
  },
]

export default function Features() {
  return (
    <section className="bg-stone-50 py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Producto educativo
          </p>

          <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            La plataforma esta pensada para que el estudiante vuelva todos los dias.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300"
            >
              <h3 className="mb-3 text-xl font-black text-slate-950">
                {feature.title}
              </h3>

              <p className="leading-7 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
