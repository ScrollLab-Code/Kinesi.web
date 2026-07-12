import { useState } from "react"

type SubjectInput = {
  id: string
  name: string
  difficulty: number // 1 to 5
}

type PriorityLevel = "cuspide" | "medio" | "base"

export default function HabitCreator() {
  // Step 1: Subjects state
  const [subjects, setSubjects] = useState<SubjectInput[]>([
    { id: "sub-1", name: "Anatomía", difficulty: 1 },
    { id: "sub-2", name: "Fisiología", difficulty: 2 },
    { id: "sub-3", name: "Histología", difficulty: 3 },
    { id: "sub-4", name: "Embriología", difficulty: 4 },
    { id: "sub-5", name: "Biología Celular", difficulty: 5 }
  ])

  // Step 2: Priority levels state (mapping subject IDs to levels)
  const [priorityMap, setPriorityMap] = useState<Record<string, PriorityLevel>>({
    "sub-1": "cuspide",
    "sub-2": "medio",
    "sub-3": "medio",
    "sub-4": "base",
    "sub-5": "base"
  })

  // Step 3: Form state
  const [goal, setGoal] = useState<"Parcial" | "Cursada">("Parcial")
  const [hasAcademicSupport, setHasAcademicSupport] = useState(false)

  // Step 4: Output plan state
  const [isGenerated, setIsGenerated] = useState(false)
  const [generatedHabits, setGeneratedHabits] = useState<string[]>([])
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, string[]>>({})

  // Dynamic color mapper based on difficulty
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "#FF4D4D" // Rojo
      case 2: return "#FF944D" // Naranja
      case 3: return "#FFD11A" // Amarillo
      case 4: return "#A3E635" // Verde Claro
      case 5: return "#4ADE80" // Verde
      default: return "#cbd5e1"
    }
  }

  const handleSubjectNameChange = (id: string, name: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, name } : s))
  }

  const handleSubjectDifficultyChange = (id: string, difficulty: number) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, difficulty } : s))
  }

  const handlePriorityChange = (subjectId: string, level: PriorityLevel) => {
    // Check constraints: Cuspide can only have 1 subject
    if (level === "cuspide") {
      const existingCuspide = Object.keys(priorityMap).find(key => priorityMap[key] === "cuspide")
      if (existingCuspide) {
        // Swap or move existing cuspide to base/medio
        setPriorityMap(prev => ({
          ...prev,
          [existingCuspide]: prev[subjectId] || "base",
          [subjectId]: "cuspide"
        }))
        return
      }
    }
    setPriorityMap(prev => ({
      ...prev,
      [subjectId]: level
    }))
  }

  const generatePlan = () => {
    // 1. Generate habits list
    const habits: string[] = []
    
    if (goal === "Parcial") {
      habits.push("Priorizar bloques de simulacros de examen cronometrados (enfoque práctico).")
      habits.push("Realizar dos repasos activos diarios de mnemotecnias clínicas.")
    } else {
      habits.push("Priorizar repasos diarios de contenidos teóricos dictados en la cursada.")
      habits.push("Elaborar resúmenes sintéticos al finalizar cada jornada lectiva.")
    }

    // Check subjects with difficulty 1 or 2 for tutoring alerts if academic support is checked
    if (hasAcademicSupport) {
      subjects.forEach(sub => {
        if (sub.difficulty === 1 || sub.difficulty === 2) {
          habits.push(`Alerta de tutoría académica recomendada para la materia: ${sub.name} (Nivel de dificultad crítico).`)
        }
      })
    }

    // 2. Generate weekly schedule (Lunes a Viernes)
    const schedule: Record<string, string[]> = {}
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]

    // Find the cuspide subject
    const cuspideId = Object.keys(priorityMap).find(key => priorityMap[key] === "cuspide")
    const cuspideSubject = subjects.find(s => s.id === cuspideId)
    
    // Find other subjects grouped by levels
    const medioSubjects = subjects.filter(s => priorityMap[s.id] === "medio")
    const baseSubjects = subjects.filter(s => priorityMap[s.id] === "base")

    days.forEach(day => {
      const blocks: string[] = []

      // Constraint: Cuspide subject (especially if Difficulty is 1/Rojo) must occupy the first study blocks of the day
      if (cuspideSubject) {
        blocks.push(`08:00 - 10:00: ${cuspideSubject.name} (Prioridad Cúspide)`)
      } else {
        blocks.push("08:00 - 10:00: Bloque de Estudio Libre")
      }

      // Middle level subjects in the middle block
      if (medioSubjects.length > 0) {
        const sub = medioSubjects[days.indexOf(day) % medioSubjects.length]
        blocks.push(`10:00 - 12:00: ${sub.name} (Prioridad Media)`)
      } else {
        blocks.push("10:00 - 12:00: Bloque de Estudio Libre")
      }

      // Base level subjects in the afternoon block
      if (baseSubjects.length > 0) {
        const sub = baseSubjects[days.indexOf(day) % baseSubjects.length]
        blocks.push(`14:00 - 16:00: ${sub.name} (Prioridad Base)`)
      } else {
        blocks.push("14:00 - 16:00: Bloque de Repaso General")
      }

      schedule[day] = blocks
    })

    setGeneratedHabits(habits)
    setWeeklySchedule(schedule)
    setIsGenerated(true)
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-8">
      <div className="border-b border-slate-200 dark:border-[#1d3330] pb-3">
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          Creador de Hábitos y Calendario Académico
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Planificador metódico secuencial para la organización del ciclo de estudio.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        
        {/* COLUMNA IZQUIERDA: Configuración (Pasos 1 a 3) */}
        <div className="space-y-6">
          
          {/* PASO 1: Carga de Datos */}
          <div className="glass-card rounded-2xl p-5 clinical-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d3330] pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-250">
                Paso 1: Definición de Materias y Dificultad
              </h4>
              <span className="text-[10px] text-slate-400 font-semibold">5 Materias Obligatorias</span>
            </div>

            <div className="space-y-3">
              {subjects.map(sub => (
                <div key={sub.id} className="flex items-center gap-3">
                  {/* Color indicator indicator */}
                  <div 
                    className="h-4.5 w-4.5 rounded shrink-0 border border-black/10 transition-colors duration-300"
                    style={{ backgroundColor: getDifficultyColor(sub.difficulty) }}
                  />

                  {/* Name Input */}
                  <input
                    type="text"
                    value={sub.name}
                    onChange={e => handleSubjectNameChange(sub.id, e.target.value)}
                    placeholder="Nombre de la materia..."
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 outline-none text-xs"
                    required
                  />

                  {/* Difficulty selector */}
                  <select
                    value={sub.difficulty}
                    onChange={e => handleSubjectDifficultyChange(sub.id, Number(e.target.value))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none text-slate-700 dark:text-slate-300"
                  >
                    <option value={1}>Dificultad 1 (Rojo)</option>
                    <option value={2}>Dificultad 2 (Naranja)</option>
                    <option value={3}>Dificultad 3 (Amarillo)</option>
                    <option value={4}>Dificultad 4 (Verde Claro)</option>
                    <option value={5}>Dificultad 5 (Verde)</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* PASO 2: Triángulo de Prioridades */}
          <div className="glass-card rounded-2xl p-5 clinical-shadow space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-250 border-b border-slate-100 dark:border-[#1d3330] pb-2">
              Paso 2: Triángulo de Prioridades
            </h4>

            {/* Pyramid visual structure */}
            <div className="flex flex-col items-center py-2 space-y-2">
              {/* Level 1: Cuspide */}
              <div className="w-[140px] border border-amber-500/30 bg-amber-500/5 rounded-t-lg p-2.5 text-center relative">
                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 block mb-1">CÚSPIDE</span>
                <select
                  value={Object.keys(priorityMap).find(key => priorityMap[key] === "cuspide") || ""}
                  onChange={e => handlePriorityChange(e.target.value, "cuspide")}
                  className="w-full bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] outline-none text-slate-800"
                >
                  <option value="" disabled>Seleccionar...</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Level 2: Medio */}
              <div className="w-[240px] border border-slate-300 bg-slate-100/10 dark:bg-slate-900/10 p-2.5 text-center flex gap-2">
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-slate-500 block mb-1">MEDIO (Slot 1)</span>
                  <select
                    value={subjects.filter(s => priorityMap[s.id] === "medio")[0]?.id || ""}
                    onChange={e => handlePriorityChange(e.target.value, "medio")}
                    className="w-full bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] outline-none text-slate-800"
                  >
                    <option value="" disabled>Seleccionar...</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-slate-500 block mb-1">MEDIO (Slot 2)</span>
                  <select
                    value={subjects.filter(s => priorityMap[s.id] === "medio")[1]?.id || ""}
                    onChange={e => handlePriorityChange(e.target.value, "medio")}
                    className="w-full bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] outline-none text-slate-800"
                  >
                    <option value="" disabled>Seleccionar...</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Level 3: Base */}
              <div className="w-[340px] border border-slate-350 bg-slate-100/10 dark:bg-slate-900/10 rounded-b-lg p-2.5 text-center flex gap-2">
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-slate-500 block mb-1">BASE (Slot 1)</span>
                  <select
                    value={subjects.filter(s => priorityMap[s.id] === "base")[0]?.id || ""}
                    onChange={e => handlePriorityChange(e.target.value, "base")}
                    className="w-full bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] outline-none text-slate-800"
                  >
                    <option value="" disabled>Seleccionar...</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-slate-500 block mb-1">BASE (Slot 2)</span>
                  <select
                    value={subjects.filter(s => priorityMap[s.id] === "base")[1]?.id || ""}
                    onChange={e => handlePriorityChange(e.target.value, "base")}
                    className="w-full bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] outline-none text-slate-800"
                  >
                    <option value="" disabled>Seleccionar...</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* PASO 3: Condicionales de Hábitos */}
          <div className="glass-card rounded-2xl p-5 clinical-shadow space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-250 border-b border-slate-100 dark:border-[#1d3330] pb-2">
              Paso 3: Parámetros y Condicionales de Hábitos
            </h4>

            <div className="space-y-4">
              {/* Question A */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-350 mb-1.5">
                  Pregunta A: ¿Cuál es el objetivo de estudio inmediato?
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="goal"
                      value="Parcial"
                      checked={goal === "Parcial"}
                      onChange={() => setGoal("Parcial")}
                      className="accent-amber-500"
                    />
                    Preparar un examen parcial (simulacros)
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="goal"
                      value="Cursada"
                      checked={goal === "Cursada"}
                      onChange={() => setGoal("Cursada")}
                      className="accent-amber-500"
                    />
                    Mantener al día la cursada (repasos)
                  </label>
                </div>
              </div>

              {/* Question B */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-350 mb-1.5">
                  Pregunta B: ¿Requiere acompañamiento académico docente en tutorías?
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={hasAcademicSupport}
                    onChange={e => setHasAcademicSupport(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  Sí, deseo recibir alertas de tutorías en materias críticas (Dificultad Rojo/Naranja).
                </label>
              </div>

              <button
                onClick={generatePlan}
                className="w-full rounded-lg bg-slate-900 dark:bg-amber-500 hover:bg-slate-950 dark:hover:bg-amber-600 text-white font-bold text-xs py-2.5 transition mt-2 shadow-sm"
              >
                Generar Calendario y Plan de Hábitos
              </button>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: Resultados (Paso 4) */}
        <div>
          <div className="glass-card rounded-2xl p-6 clinical-shadow space-y-6 min-h-[500px]">
            <div className="border-b border-slate-100 dark:border-[#1d3330] pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-250">
                Paso 4: Plan de Trabajo Generado
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Calendario semanal y hábitos sugeridos en base a tus prioridades.
              </p>
            </div>

            {!isGenerated ? (
              <div className="h-[400px] flex items-center justify-center text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-[#1d3330] rounded-xl p-8">
                Configura los pasos 1, 2 y 3 y haz clic en "Generar Calendario" para desplegar la planificación.
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Lista de Habitos */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Hábitos y Directivas Prioritarias
                  </h5>
                  <ul className="space-y-2">
                    {generatedHabits.map((habit, idx) => {
                      const isAlert = habit.includes("Alerta de tutoría")
                      return (
                        <li 
                          key={idx} 
                          className={`text-xs p-3 rounded-lg border leading-relaxed font-medium ${
                            isAlert 
                              ? "border-rose-300 bg-rose-50/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300"
                              : "border-slate-200 bg-stone-50/50 dark:bg-slate-900/20 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {habit}
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* Prototipo de Agenda Semanal */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Prototipo de Agenda Semanal (Lunes a Viernes)
                  </h5>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {Object.keys(weeklySchedule).map(day => (
                      <div key={day} className="rounded-xl border border-slate-250 dark:border-[#1d3330] p-3.5 space-y-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block border-b border-slate-100 dark:border-[#1d3330]/40 pb-1.5">
                          {day}
                        </span>
                        
                        <div className="space-y-1.5">
                          {weeklySchedule[day].map((block, idx) => {
                            const isCuspide = block.includes("Prioridad Cúspide")
                            return (
                              <div 
                                key={idx} 
                                className={`text-[11px] p-2 rounded border font-semibold flex justify-between items-center ${
                                  isCuspide 
                                    ? "border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-300"
                                    : "border-slate-200 bg-white text-slate-600 dark:bg-[#0c1312]"
                                }`}
                              >
                                <span>{block}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
