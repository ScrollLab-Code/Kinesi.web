import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Note = {
  id: string
  title: string
  content: string
  category: "Anatomía" | "Histología" | "Fisiología" | "General"
  createdAt: string
}

type Announcement = {
  id: string
  title: string
  date: string
  content: string
  tag: string
  tagColor: string
}

export default function Welcome() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem("kinase_student_notes")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [noteCategory, setNoteCategory] = useState<Note["category"]>("General")
  const [showFullHistory, setShowFullHistory] = useState(false)

  // Save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("kinase_student_notes", JSON.stringify(notes))
    } catch (e) {
      console.error("No se pudieron guardar las notas en localStorage", e)
    }
  }, [notes])

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteContent.trim()) return

    const newNote: Note = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      title: noteTitle.trim() || "Nota sin título",
      content: noteContent,
      category: noteCategory,
      createdAt: new Date().toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      })
    }

    setNotes(prev => [newNote, ...prev])
    setNoteTitle("")
    setNoteContent("")
    setNoteCategory("General")
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  const announcements: Announcement[] = [
    {
      id: "1",
      title: "🩺 Clase de Repaso: Plexo Braquial e Irrigación del Miembro Superior",
      date: "Hoy, 20:00 hs",
      content: "Clase interactiva en vivo por Meet con tutores médicos. Resolveremos dudas de Latarjet y anatomía topográfica aplicada. ¡Trae tus apuntes y preguntas!",
      tag: "Anatomía",
      tagColor: "bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-950/40 dark:border-teal-900 dark:text-teal-400"
    },
    {
      id: "2",
      title: "📚 Desgrabados de Fisiología Renal & Cardiovascular Actualizados",
      date: "Hace 2 días",
      content: "Ya están disponibles en la Feria de Materiales los últimos apuntes y resúmenes corregidos por docentes sobre contracción cardíaca y filtración glomerular.",
      tag: "Fisiología",
      tagColor: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400"
    },
    {
      id: "3",
      title: "🎯 Lanzamiento: Simulador Gymkana de Codo y Antebrazo",
      date: "Hace 4 días",
      content: "Ponte a prueba con el simulador práctico de reconocimiento de accidentes óseos, nervios y tendones basado en los exámenes de cátedra.",
      tag: "Simulador",
      tagColor: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400"
    }
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* COLUMNA IZQUIERDA: Bienvenido, Avisos e Historia */}
        <div className="space-y-8">
          
          {/* Tarjeta de Bienvenida */}
          <div className="rounded-2xl border border-emerald-900 bg-gradient-to-br from-emerald-850 to-emerald-950 dark:from-[#0a2622] dark:to-[#05110f] p-6 text-white clinical-shadow">
            <span className="rounded-full bg-emerald-700/60 border border-emerald-500/30 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
              Panel de Bienvenida
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
              ¡Te damos la bienvenida a la activación académica!
            </h2>
            <p className="mt-2 text-sm text-slate-100 leading-relaxed">
              Kinase Academy es el catalizador que activa tu potencial. Un espacio libre de competencia destructiva, diseñado para brindarte metodologías y contención en las materias más exigentes de medicina.
            </p>
          </div>

          {/* Sección de Avisos */}
          <div className="glass-card rounded-2xl p-6 clinical-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d3330] pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                📢 Tablón de Avisos y Novedades
              </h3>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Actualizaciones del Curso
              </span>
            </div>

            <div className="space-y-4">
              {announcements.map(announcement => (
                <div 
                  key={announcement.id} 
                  className="rounded-xl border border-slate-200/60 dark:border-[#1d3330]/60 p-4 hover:bg-stone-50/50 dark:hover:bg-[#0c1312]/30 transition-all duration-300"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className={`rounded px-2.5 py-0.5 text-[9px] font-bold border ${announcement.tagColor}`}>
                      {announcement.tag}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                      {announcement.date}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {announcement.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                    {announcement.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Historia de Kinase */}
          <div className="glass-card rounded-2xl p-6 clinical-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d3330] pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                🧬 La Historia de Kinase Academy
              </h3>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Nuestros Orígenes
              </span>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-350 space-y-3 leading-relaxed">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Sí, somos una academia. Pero ¿qué significa eso realmente?
              </p>
              <p>
                Para Platón, la academia original no era un aula con bancos y exámenes; era un jardín donde los amigos se sentaban de igual a igual a charlar, a cuestionar y a aprender unos de otros. No existía la competencia ni el tener que memorizar cosas de memoria en soledad. Era, simplemente, un refugio donde el conocimiento se compartía y se disfrutaba en comunidad.
              </p>
              <p>
                Mi nombre es Tiziano. Tengo 20 años y soy de <strong>Picún Leufú</strong>, un pueblo arraigado en el corazón de la provincia del Neuquén. Hoy me encuentro en la ciudad de Cipolletti, Río Negro, cursando el ciclo biomédico en la Facultad de Ciencias Médicas, habiendo dejado atrás los dos años del ciclo introductorio. Pero para entender por qué estoy acá y por qué nace este proyecto, hace falta mirar un poco hacia atrás...
              </p>

              <AnimatePresence>
                {showFullHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden space-y-3 pt-3 border-t border-slate-100 dark:border-[#1d3330]"
                  >
                    <p>
                      Mi camino nunca fue una línea recta ni un trayecto simple; estuvo marcado, desde la escuela primaria, por una cultura del esfuerzo absoluto. Siempre fui de los que se obsesionaban con que un afiche para una exposición quedara perfecto, de los que buscaban aprender a tocar un instrumento de la mejor manera posible, y de los que entendían que la comunicación con los compañeros no era un detalle menor, sino la base para cuidar el compañerismo.
                    </p>
                    <p>
                      Al llegar a la secundaria, intensifiqué ese enfoque. Sabía, intuía, que en esos años se estaba forjando la llave que abriría las puertas de mi futuro. Y así fue. Hoy puedo decir que <strong>mi presente es el futuro que construí</strong>, y desde esa certeza comprendí que la preparación más importante no era memorizar datos, sino <strong>aprender a aprender</strong>.
                    </p>
                    <p>
                      Existe un mito arraigado en el inconsciente colectivo: nos dicen que medicina es difícil, que ingeniería es difícil, que abogacía es difícil. Sin embargo, con el tiempo entendí que cualquier carrera es, en esencia, accesible. El verdadero obstáculo no está en los libros, en los programas de estudio o en la complejidad de los textos; el verdadero desafío habita en nosotros mismos. Está en nuestra actitud, en nuestra resiliencia, en las ganas que le imprimimos a cada día y en cómo gestionamos la frustración.
                    </p>
                    <p>
                      Aprender a aprender es un arte que nadie nos enseña. En mi caso, la brecha fue evidente desde el primer día de facultad. Yo egresé de la secundaria con el título de <strong>Perito Mercantil</strong>. Mi día a día consistía en dibujar libros diarios, balancear activos y pasivos, y proyectar la contabilidad de una empresa. De un momento a otro, el escenario cambió de forma radical: pasé de calcular números comerciales a tener que comprender los mecanismos moleculares y las funciones más complejas del cuerpo humano.
                    </p>
                    <p>
                      Al principio de la cursada, en mi primer año, caí en el lugar común del autoengaño. Mi primera excusa ante la dificultad fue el clásico: <em>“Lo que pasa es que esto no lo vi en mi secundaria”</em>. Pero las excusas no salvan vidas, ni aprueban parciales, ni construyen profesionales. Había que cambiar la mentalidad.
                    </p>
                    <p>
                      Es a partir de esa vivencia personal que decidí fundar <strong>Kinase Academy</strong>. Nace de la necesidad de crear un espacio donde todos los estudiantes tengamos acceso a las herramientas que realmente necesitamos para sobrevivir y disfrutar de la vida universitaria; esas herramientas metodológicas y de contención que son vitales, pero que ninguna institución nos brinda de manera formal.
                    </p>
                    <blockquote className="border-l-4 border-emerald-600 bg-stone-50 dark:bg-[#070a09] p-3 rounded-r-lg my-4">
                      <p className="font-bold text-slate-800 dark:text-slate-100">
                        ¿Por qué Kinase?
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">
                        El nombre no es una elección al azar. Una cinasa (kinase) es una enzima esencial en la biología humana. Su función principal es la fosforilación: transfiere grupos fosfato a otras moléculas o proteínas. Mediante este proceso, la enzima tiene el poder de activar o desactivar vías metabólicas completas, dependiendo de lo que el cuerpo requiera en ese instante.
                      </p>
                    </blockquote>
                    <p>
                      <strong>Kinase Academy es, precisamente, esa enzima en la vida del estudiante.</strong> Somos el catalizador que activa tu potencial. Es un espacio diseñado para vos, amigo querido, amiga querida, que sé perfectamente lo que se siente necesitar planificar ese parcial o ese examen final tan crucial, pero encontrarte con la mente bloqueada, sintiendo que las horas no alcanzan o que ya no sabés cómo avanzar. Nuestro objetivo es brindarte las estrategias de organización y los métodos de estudio para que te resulten cómodos, dinámicos y humanos.
                    </p>
                    <p>
                      La esencia fundamental de Kinase Academy va mucho más allá de un método de estudio; busca generar una revolución cultural dentro de la facultad. Queremos <strong>romper definitivamente con el dogma de la competencia destructiva</strong>.
                    </p>
                    <p>
                      Nos han hecho creer que el compañero de banco es un rival, que los cupos son limitados y que el éxito se mide pisando al de al lado. Pero los estudiantes somos un solo bloque. Si bien existen momentos específicos en la vida donde la competencia es inevitable, tengo la profunda convicción de que <strong>el estudio y el conocimiento son construcciones colectivas</strong>. Nadie se salva solo, y menos en una carrera que tiene como fin último cuidar de la vida de los demás.
                    </p>
                    <p>
                      Kinase nació para demostrar que el compañerismo y el apoyo mutuo son las mejores herramientas de aprendizaje. Esto es una red de contención, un faro en los momentos de estrés y una comunidad académica real, horizontal y empática.
                    </p>
                    <p className="font-bold text-emerald-800 dark:text-emerald-400">
                      Kinase es para todos los estudiantes de medicina de la Argentina. Kinase es comunidad académica. Bienvenidos a la activación.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setShowFullHistory(!showFullHistory)}
                className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-slate-900 dark:text-emerald-450 dark:hover:text-emerald-350 transition-colors"
              >
                {showFullHistory ? "Ver menos" : "Leer historia completa..."}
                <svg
                  className={`h-4 w-4 transform transition-transform duration-200 ${showFullHistory ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: Anotador Kinase */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 clinical-shadow space-y-4 sticky top-36">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d3330] pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                📝 Anotador Kinase
              </h3>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Tus Notas
              </span>
            </div>

            {/* Formulario de Notas */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  placeholder="Título de la nota..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={noteCategory}
                  onChange={e => setNoteCategory(e.target.value as Note["category"])}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 text-xs text-slate-700 dark:text-slate-200"
                >
                  <option value="General">📂 General</option>
                  <option value="Anatomía">💀 Anatomía</option>
                  <option value="Histología">🔬 Histología</option>
                  <option value="Fisiología">⚡ Fisiología</option>
                </select>

                <button
                  type="submit"
                  className="rounded-lg bg-emerald-800 hover:bg-slate-900 text-white font-bold text-xs transition duration-200 py-2"
                >
                  + Agregar Nota
                </button>
              </div>

              <div>
                <textarea
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  placeholder="Escribe tus recordatorios, mnemotecnias o apuntes aquí..."
                  rows={4}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 text-xs resize-none"
                />
              </div>
            </form>

            {/* Listado de Notas */}
            <div className="border-t border-slate-100 dark:border-[#1d3330] pt-4">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
                Notas Guardadas ({notes.length})
              </h4>

              {notes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-[#1d3330] p-6 text-center text-xs text-slate-400 dark:text-slate-500">
                  No hay notas guardadas. ¡Crea tu primera mnemotecnia o apunte de estudio!
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                  <AnimatePresence initial={false}>
                    {notes.map(note => {
                      let catColor = "border-slate-300 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                      if (note.category === "Anatomía") catColor = "border-rose-300 bg-rose-50/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300"
                      if (note.category === "Histología") catColor = "border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300"
                      if (note.category === "Fisiología") catColor = "border-teal-300 bg-teal-50/50 dark:bg-teal-950/20 text-teal-800 dark:text-teal-300"

                      return (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`rounded-xl border p-3 flex flex-col justify-between transition-all duration-200 ${catColor}`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <h5 className="font-bold text-xs truncate max-w-[150px]">
                                {note.title}
                              </h5>
                              <button
                                type="button"
                                onClick={() => handleDeleteNote(note.id)}
                                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-0.5"
                                title="Eliminar nota"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-[11px] leading-normal whitespace-pre-wrap font-medium">
                              {note.content}
                            </p>
                          </div>
                          <div className="flex items-center justify-between border-t border-slate-200/40 dark:border-slate-800/40 pt-1.5 mt-2 text-[9px] font-medium opacity-70">
                            <span>{note.category}</span>
                            <span>{note.createdAt}</span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
