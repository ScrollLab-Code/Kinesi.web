export default function Features() {
  const features = [
    {
      title: "Organización académica",
      description:
        "Aprendé a administrar tus materias, tiempos y objetivos de forma eficiente.",
    },
    {
      title: "Técnicas de estudio",
      description:
        "Descubrí métodos personalizados para mejorar tu comprensión y retención.",
    },
    {
      title: "Acompañamiento personalizado",
      description:
        "Recibí ayuda y seguimiento adaptado a tu situación académica.",
    },
    {
      title: "Preparación para exámenes",
      description:
        "Planificá mejor tus parciales y finales con estrategias concretas.",
    },
  ]

  return (
    <section className="py-32 px-6 bg-white">
      
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-20">
          
          <p className="text-blue-600 font-medium mb-4">
            Beneficios
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">
            Todo lo que necesitás para mejorar académicamente
          </h2>

          <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
            Un enfoque pensado para estudiantes universitarios que buscan mejorar su rendimiento y hábitos de estudio.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-blue-50 border border-blue-100 rounded-3xl p-8 hover:scale-[1.02] transition"
            >
              <h3 className="text-2xl font-semibold text-zinc-900 mb-4">
                {feature.title}
              </h3>

              <p className="text-zinc-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}

        </div>

      </div>

    </section>
  )
}