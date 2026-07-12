import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

type StudyBlock = {
  id: string
  day: string // "Lunes", "Martes", etc.
  subject: "Anatomía" | "Histología" | "Fisiología" | "General"
  topic: string
  timeStart: string
  timeEnd: string
  completed: boolean
}

export default function WeeklyPlanner() {
  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  const subjects = ["Anatomía", "Histología", "Fisiología", "General"]

  const [blocks, setBlocks] = useState<StudyBlock[]>(() => {
    try {
      const saved = localStorage.getItem("kinase_weekly_planner")
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn("Could not read weekly planner from localStorage", e)
    }

    // Default pre-populated schedule for medical students
    return [
      {
        id: "1",
        day: "Lunes",
        subject: "Anatomía",
        topic: "Plexo Braquial - Ramas terminales",
        timeStart: "09:00",
        timeEnd: "11:30",
        completed: false
      },
      {
        id: "2",
        day: "Martes",
        subject: "Histología",
        topic: "Tejido Conectivo y Células de Sostén",
        timeStart: "14:00",
        timeEnd: "16:00",
        completed: true
      },
      {
        id: "3",
        day: "Miércoles",
        subject: "Fisiología",
        topic: "Potencial de Acción Cardíaco",
        timeStart: "10:00",
        timeEnd: "12:00",
        completed: false
      },
      {
        id: "4",
        day: "Jueves",
        subject: "Anatomía",
        topic: "Simulacro de Codo (Gymkana)",
        timeStart: "16:00",
        timeEnd: "18:00",
        completed: false
      },
      {
        id: "5",
        day: "Viernes",
        subject: "Fisiología",
        topic: "Eje RAA (Renina-Angiotensina)",
        timeStart: "09:00",
        timeEnd: "11:00",
        completed: false
      }
    ]
  })

  const [activeDay, setActiveDay] = useState("Lunes")
  const [topic, setTopic] = useState("")
  const [subject, setSubject] = useState<StudyBlock["subject"]>("Anatomía")
  const [timeStart, setTimeStart] = useState("09:00")
  const [timeEnd, setTimeEnd] = useState("11:00")

  useEffect(() => {
    try {
      localStorage.setItem("kinase_weekly_planner", JSON.stringify(blocks))
    } catch (e) {
      console.error(e)
    }
  }, [blocks])

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    const newBlock: StudyBlock = {
      id: Math.random().toString(36).substring(2, 9),
      day: activeDay,
      subject,
      topic: topic.trim(),
      timeStart,
      timeEnd,
      completed: false
    }

    setBlocks(prev => [...prev, newBlock])
    setTopic("")
  }

  const handleDeleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id))
  }

  const toggleBlockCompleted = (id: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, completed: !b.completed } : b))
  }

  const getSubjectColor = (sub: StudyBlock["subject"]) => {
    switch (sub) {
      case "Anatomía": return "border-rose-400 bg-rose-50/40 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300"
      case "Fisiología": return "border-teal-400 bg-teal-50/40 dark:bg-teal-950/20 text-teal-800 dark:text-teal-300"
      case "Histología": return "border-amber-400 bg-amber-50/40 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300"
      default: return "border-slate-350 bg-slate-50/50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-[#1d3330] pb-2">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          📅 Planificador Semanal Clínico
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Distribuye tus materias y bloques de estudio por días para organizar tu semana médica.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Panel de carga */}
        <div className="glass-card rounded-2xl p-5 border border-amber-500/20 clinical-shadow space-y-4">
          <h4 className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider">
            Agregar Bloque de Estudio
          </h4>

          <form onSubmit={handleAddBlock} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Día Seleccionado</label>
              <select
                value={activeDay}
                onChange={e => setActiveDay(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500"
              >
                {daysOfWeek.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Materia</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value as StudyBlock["subject"])}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500"
                >
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Inicio</label>
                <input
                  type="time"
                  value={timeStart}
                  onChange={e => setTimeStart(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fin</label>
                <input
                  type="time"
                  value={timeEnd}
                  onChange={e => setTimeEnd(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2 transition"
                >
                  + Agregar Bloque
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tema a Estudiar</label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="ej. Sistema de conducción del corazón"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500"
              />
            </div>
          </form>
        </div>

        {/* Tablero Semanal */}
        <div className="space-y-4">
          {/* Navegación por Días */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 border-b border-slate-100 dark:border-[#1d3330]">
            {daysOfWeek.map(d => {
              const dayBlocks = blocks.filter(b => b.day === d)
              const completedCount = dayBlocks.filter(b => b.completed).length

              return (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                    activeDay === d
                      ? "bg-slate-900 text-white border-slate-900 dark:bg-amber-500 dark:border-amber-500"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-stone-50"
                  }`}
                >
                  {d}
                  {dayBlocks.length > 0 && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                      activeDay === d ? "bg-white/20 text-white" : "bg-stone-100 text-slate-500"
                    }`}>
                      {completedCount}/{dayBlocks.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Bloques del Día */}
          <div className="min-h-[250px] space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Plan para el {activeDay}
            </h4>

            {blocks.filter(b => b.day === activeDay).length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 dark:border-[#1d3330] p-12 text-center text-xs text-slate-400 dark:text-slate-500">
                No tienes bloques programados para el {activeDay}. ¡Crea uno para organizar tu día!
              </div>
            ) : (
              <div className="grid gap-3">
                <AnimatePresence initial={false}>
                  {blocks
                    .filter(b => b.day === activeDay)
                    .map(b => (
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`rounded-xl border p-4 flex items-center justify-between gap-4 transition-all duration-200 ${getSubjectColor(b.subject)} ${
                          b.completed ? "opacity-60 line-through text-slate-400" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Checkbox */}
                          <button
                            type="button"
                            onClick={() => toggleBlockCompleted(b.id)}
                            className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition shrink-0 ${
                              b.completed
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-slate-300 hover:border-amber-500"
                            }`}
                          >
                            {b.completed && (
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>

                          <div>
                            <span className="text-[10px] font-bold block opacity-70">
                              ⏱ {b.timeStart} hs - {b.timeEnd} hs | {b.subject}
                            </span>
                            <span className="text-xs font-bold block mt-0.5">{b.topic}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(b.id)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition p-1"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
