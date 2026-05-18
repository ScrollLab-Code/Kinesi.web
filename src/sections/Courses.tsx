import { motion } from "framer-motion"

const courses = [
  {
    title: "Técnicas de estudio",
    description:
      "Aprendé métodos prácticos para mejorar comprensión, memoria y rendimiento académico.",
    price: "$25.000",
  },

  {
    title: "Organización universitaria",
    description:
      "Planificación académica, manejo del tiempo y hábitos para evitar procrastinar.",
    price: "$18.000",
  },

  {
    title: "Preparación para finales",
    description:
      "Estrategias intensivas para preparar exámenes parciales y finales de manera eficiente.",
    price: "$30.000",
  },
]

export default function Courses() {
  return (
    <section
      id="cursos"
      className="py-32 px-6 bg-gradient-to-b from-white to-blue-50"
    >
      
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-20">
          
          <p className="text-blue-600 font-medium mb-4">
            Cursos y mentorías
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">
            Recursos pensados para mejorar tu rendimiento académico
          </h2>

          <p className="text-zinc-600 text-lg max-w-2xl mx-auto">
            Accedé a mentorías y cursos diseñados para estudiantes universitarios que buscan mejorar sus hábitos y resultados.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2rem] border border-zinc-100 shadow-lg p-8 hover:-translate-y-2 transition"
            >
              
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-6">
                📘
              </div>

              <h3 className="text-2xl font-bold text-zinc-900 mb-4">
                {course.title}
              </h3>

              <p className="text-zinc-600 leading-relaxed mb-8">
                {course.description}
              </p>

              <div className="flex items-center justify-between">
                
                <span className="text-2xl font-bold text-zinc-900">
                  {course.price}
                </span>

                <button className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:scale-105 transition">
                  Ver más
                </button>

              </div>

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  )
}