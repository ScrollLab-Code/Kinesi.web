import { useState } from "react"
import type { FormEvent } from "react"


type Task = {
  id: string
  day: string
  title: string
  details: string
  completed: boolean
}

export default function AcademicPlanner() {
  const [examDate, setExamDate] = useState("")
  const [subject, setSubject] = useState("Anatomía")
  const [studyHours, setStudyHours] = useState(3)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isGenerated, setIsGenerated] = useState(false)

  const handleGeneratePlan = (e: FormEvent) => {
    e.preventDefault()
    if (!examDate || !subject) return

    const today = new Date()
    const target = new Date(examDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) {
      alert("La fecha del examen debe ser posterior al día de hoy.")
      return
    }

    // Generate weekly Inverse plan tasks based on diffDays
    const generatedTasks: Task[] = []
    const weeksRemaining = Math.ceil(diffDays / 7)

    for (let i = weeksRemaining; i >= 1; i--) {
      const daysUntilWeek = i * 7
      generatedTasks.push(
        {
          id: `w-${i}-t1`,
          day: `Semana ${weeksRemaining - i + 1} (Faltan ${daysUntilWeek} días)`,
          title: `Lectura y Estructura - Unidad ${weeksRemaining - i + 1}`,
          details: `Leer la bibliografía oficial, marcar inserciones, resumir esquemas de la unidad. Bloque de estudio estimado: ${studyHours} horas.`,
          completed: false
        },
        {
          id: `w-${i}-t2`,
          day: `Semana ${weeksRemaining - i + 1} (Faltan ${daysUntilWeek} días)`,
          title: `Repaso Activo & Anki`,
          details: `Revisar flashcards de Anki de la unidad correspondiente y hacer esquemas mudos a mano alzada.`,
          completed: false
        },
        {
          id: `w-${i}-t3`,
          day: `Semana ${weeksRemaining - i + 1} (Faltan ${daysUntilWeek} días)`,
          title: `Simulación Oral / Práctica`,
          details: `Describir preparados frente al espejo o grabarte explicando la correlación clínica por 15 minutos.`,
          completed: false
        }
      )
    }

    // Add final week intensive prep tasks
    generatedTasks.push(
      {
        id: "final-t1",
        day: "Últimos 3 días previos",
        title: "Simulacro Integrador Completo",
        details: "Resolver 2 exámenes o gymkanas pasadas de la cátedra bajo tiempo de reloj real.",
        completed: false
      },
      {
        id: "final-t2",
        day: "Día previo al examen",
        title: "Fijación y Descanso Mental",
        details: "Repaso ligero de dudas pendientes por 2 horas. Dormir un mínimo de 7 horas reales. Evitar cafeína excesiva.",
        completed: false
      }
    )

    setTasks(generatedTasks)
    setIsGenerated(true)
  }

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    )
  }

  return (
    <section className="bg-stone-50 py-12 px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
            Coaching de Regularidad
          </p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Planificador Inverso de Estudio
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            En medicina, planificamos desde la fecha del examen hacia atrás. Ingresa tus datos para estructurar tus semanas de forma estratégica.
          </p>
        </div>

        {/* Setup Form */}
        {!isGenerated ? (
          <form onSubmit={handleGeneratePlan} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-655 mb-1.5">Materia a rendir</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                >
                  <option value="Anatomía">Anatomía</option>
                  <option value="Histología">Histología</option>
                  <option value="Fisiología">Fisiología</option>
                  <option value="Biología Celular">Biología Celular</option>
                  <option value="Química & Biofísica">Química & Biofísica</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-655 mb-1.5">Fecha del examen</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-655 mb-1.5">Horas diarias de estudio disponibles</label>
              <input
                type="number"
                min="1"
                max="16"
                value={studyHours}
                onChange={(e) => setStudyHours(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-800 py-2.5 text-xs font-bold text-white transition hover:bg-slate-900 shadow-sm"
            >
              Generar Plan Inverso de Regularidad
            </button>
          </form>
        ) : (
          /* Render Generated Calendar List */
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Planificación para:</span>
                <h4 className="font-bold text-slate-900 mt-0.5">{subject} ({examDate})</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsGenerated(false)}
                className="rounded border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-600 hover:border-slate-800 transition"
              >
                Cambiar Ajustes
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`rounded-xl border p-4 shadow-sm transition flex gap-3 items-start bg-white ${
                    task.completed ? "border-emerald-100 bg-emerald-50/10" : "border-slate-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-800 focus:ring-emerald-700 cursor-pointer shrink-0"
                  />
                  <div className="text-xs">
                    <span className="rounded bg-stone-100 border border-slate-200 px-2 py-0.5 text-[9px] font-bold text-slate-500 uppercase">
                      {task.day}
                    </span>
                    <h4 className={`font-bold mt-1.5 ${task.completed ? "text-slate-400 line-through" : "text-slate-900"}`}>
                      {task.title}
                    </h4>
                    <p className={`mt-0.5 leading-relaxed text-slate-500`}>
                      {task.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
