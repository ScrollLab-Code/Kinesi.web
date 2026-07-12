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
    today.setHours(0, 0, 0, 0)
    const target = new Date(examDate)
    target.setHours(0, 0, 0, 0)
    
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) {
      alert("La fecha del examen debe ser posterior al día de hoy.")
      return
    }

    const generatedTasks: Task[] = []

    if (diffDays <= 7) {
      // Day-by-day planning since the exam is very close
      for (let d = diffDays; d >= 1; d--) {
        let title: string
        let details: string
        
        if (d === 1) {
          title = "Día previo: Fijación ligera y descanso mental"
          details = `Repaso muy liviano de esquemas y fórmulas clave. Dormir al menos 8 horas para asegurar rendimiento cognitivo. Horas estimadas: 2 horas.`
        } else if (d === 2) {
          title = "2 días antes: Simulacro integrado final"
          details = `Simular examen de cátedra completo de ${subject} cronometrado sin ver apuntes.`
        } else if (d === 3) {
          title = "3 días antes: Autoevaluación práctica intensiva"
          details = `Repasar preparados de anatomía o esquemas de fisiología complejos usando flashcards.`
        } else {
          title = `Faltan ${d} días: Consolidación del temario`
          details = `Lectura veloz de temas pendientes y resolución de dudas con compañeros o apuntes oficiales de ${subject}. Bloque estimado: ${studyHours} horas.`
        }

        generatedTasks.push({
          id: `d-${d}`,
          day: `Faltan ${d} días`,
          title,
          details,
          completed: false
        })
      }
    } else {
      // Weekly planning backward
      const weeksRemaining = Math.floor(diffDays / 7)
      const remainingDays = diffDays % 7

      if (remainingDays > 0) {
        generatedTasks.push({
          id: `w-prep`,
          day: `Semana de Inicio (Faltan ${diffDays} días)`,
          title: `Fase de diagnóstico y mapeo inicial`,
          details: `Mapear temas débiles del programa de ${subject} y organizar resúmenes. Horas estimadas: ${studyHours * remainingDays} horas.`,
          completed: false
        })
      }

      for (let w = weeksRemaining; w >= 1; w--) {
        const daysRemainingForWeek = w * 7
        let title: string
        let details: string

        if (w === 1) {
          title = "Semana final: Integración y simulaciones orales"
          details = `Repaso general cruzado de todo el programa de ${subject}. Explicar preparados en voz alta. Horas recomendadas diarias: ${studyHours} horas.`
        } else if (w === 2) {
          title = "Semana 2: Ejercitación Choice y esquemas mudos"
          details = `Resolver cuestionarios avanzados de cátedra y practicar rellenado de esquemas anatómicos.`
        } else {
          title = `Semana ${weeksRemaining - w + 1}: Lectura profunda e inserciones`
          details = `Lectura de la bibliografía de cátedra recomendada de ${subject} para los temas troncales.`
        }

        generatedTasks.push({
          id: `w-${w}`,
          day: `Semana ${weeksRemaining - w + 1} (Faltan ${daysRemainingForWeek} días)`,
          title,
          details,
          completed: false
        })
      }

      // Add final intensive prep tasks only for weekly schedule
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
    }

    setTasks(generatedTasks)
    setIsGenerated(true)
  }

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    )
  }

  const downloadPdf = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Por favor habilita las ventanas emergentes (pop-ups) para descargar el PDF.")
      return
    }

    const tasksHtml = tasks
      .map(
        t => `
        <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
          <h3 style="margin: 0; font-size: 14px; color: #1e293b;">${t.day}</h3>
          <h4 style="margin: 5px 0; font-size: 12px; color: #0f766e;">${t.title}</h4>
          <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.4;">${t.details}</p>
        </div>
      `
      )
      .join("")

    printWindow.document.write(`
      <html>
        <head>
          <title>Planificación Inversa - ${subject}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #334155; }
            h1 { font-size: 18px; border-bottom: 2px solid #0f766e; padding-bottom: 10px; margin-bottom: 20px; color: #0f766e; }
            .header-info { font-size: 11px; color: #64748b; margin-bottom: 25px; }
            .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>Planificación Inversa de Estudio: ${subject}</h1>
          <div class="header-info">
            Generado por Kinase Academy &bull; Fecha del examen: ${examDate} &bull; Horas de estudio: ${studyHours} horas diarias
          </div>
          <div>
            ${tasksHtml}
          </div>
          <div class="footer">
            Kinase Academy &bull; Entorno de Rendimiento Clínico Académico
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
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
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap gap-2 justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Planificación para:</span>
                <h4 className="font-bold text-slate-900 mt-0.5">{subject} ({examDate})</h4>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={downloadPdf}
                  className="rounded border border-emerald-600 bg-emerald-800 hover:bg-slate-900 px-3 py-1.5 font-bold text-white transition"
                >
                  Descargar PDF
                </button>
                <button
                  type="button"
                  onClick={() => setIsGenerated(false)}
                  className="rounded border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-600 hover:border-slate-800 transition"
                >
                  Cambiar Ajustes
                </button>
              </div>
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
