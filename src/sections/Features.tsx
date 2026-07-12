export default function Features() {
  const featuresList = [
    {
      title: "Muro de Experiencias",
      description: "Espacios de cursada donde consultar, debatir y compartir cómo superaron otros alumnos las materias filtro.",
      svgIcon: (
        <svg className="h-7 w-7 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      )
    },
    {
      title: "Feria de Materiales",
      description: "Atlas fotográficos comentados, flashcards de Anki listas para importar y desgrabados recomendados por tutores.",
      svgIcon: (
        <svg className="h-7 w-7 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4 1.253" />
        </svg>
      )
    },
    {
      title: "Coaching & Seguimiento",
      description: "Diagnóstico condicional (Semáforo de Riesgo), planificación inversa y simulacros de examen oral uno a uno.",
      svgIcon: (
        <svg className="h-7 w-7 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Acceso Seguro",
      description: "Ingreso verificado mediante OTP por correo o celular, además de integración directa con Google OAuth.",
      svgIcon: (
        <svg className="h-7 w-7 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ]

  return (
    <section className="bg-white py-20 px-6 border-t border-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
            Qué ofrece Kinase
          </p>
          <h2 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl tracking-tight">
            Una plataforma diseñada para que el estudiante avance realmente.
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Combinamos comunidad colaborativa, catálogo de materiales verificados y tutoría médica individual.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuresList.map((feature) => (
            <article
              key={feature.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-emerald-300 flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100">
                  {feature.svgIcon}
                </div>
                <h3 className="mb-1 text-sm font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
