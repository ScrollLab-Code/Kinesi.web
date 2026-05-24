const features = [
  {
    title: "Registro rápido",
    description: "Completa tus datos y accede a un espacio privado para tu estudio.",
  },
  {
    title: "Análisis de perfil",
    description: "Responde preguntas pensadas para entender cómo aprendés mejor.",
  },
  {
    title: "Recomendaciones reales",
    description: "Recibí sugerencias de estudio adaptadas a tu situación y materia.",
  },
  {
    title: "Apoyo continuo",
    description: "Seguimiento pensado para acompañarte durante tus parciales y finales.",
  },
]

export default function Features() {
  return (
    <section id="como-funciona" className="border-t border-slate-200 bg-slate-50 py-28 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-5">Cómo funciona</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
            Un proceso simple que te acompaña desde el registro hasta el perfil.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <div key={index} className="rounded-[2rem] border border-slate-200 bg-white p-8 transition hover:-translate-y-1 shadow-sm">
              <span className="text-sm uppercase tracking-[0.28em] text-slate-500">Paso {index + 1}</span>
              <h3 className="mt-5 text-2xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-4 text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
