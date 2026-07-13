import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "../lib/supabase"

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
  link?: string
}

const defaultAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Clase de Repaso: Plexo Braquial e Irrigación del Miembro Superior",
    date: "Hoy, 20:00 hs",
    content: "Clase interactiva en vivo por Meet con tutores médicos. Resolveremos dudas de Latarjet y anatomía topográfica aplicada. ¡Trae tus apuntes y preguntas!",
    tag: "Anatomía",
    tagColor: "bg-teal-50 border-teal-200 text-teal-800"
  },
  {
    id: "2",
    title: "Desgrabados de Fisiología Renal & Cardiovascular Actualizados",
    date: "Hace 2 días",
    content: "Ya están disponibles en la Feria de Materiales los últimos apuntes y resúmenes corregidos por docentes sobre contracción cardíaca y filtración glomerular.",
    tag: "Fisiología",
    tagColor: "bg-blue-50 border-blue-200 text-blue-800"
  }
]

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
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true)

  // Admin / Add announcement states
  const [showAnnounceForm, setShowAnnounceForm] = useState(false)
  const [announceTitle, setAnnounceTitle] = useState("")
  const [announceContent, setAnnounceContent] = useState("")
  const [announceTag, setAnnounceTag] = useState("General")
  const [announceLink, setAnnounceLink] = useState("")

  // Save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("kinase_student_notes", JSON.stringify(notes))
    } catch (e) {
      console.error("No se pudieron guardar las notas en localStorage", e)
    }
  }, [notes])

  // Fetch announcements from Supabase
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoadingAnnouncements(true)
      try {
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error

        if (data && data.length > 0) {
          const mapped: Announcement[] = data.map((item: { 
            id: string | number
            title?: string | null
            content?: string | null
            tag?: string | null
            created_at?: string | null
            link?: string | null
            url?: string | null 
          }) => {
            let tagColor = "bg-emerald-50 border-emerald-200 text-emerald-800"
            const tagLower = (item.tag || "").toLowerCase()
            if (tagLower.includes("anat")) {
              tagColor = "bg-teal-50 border-teal-200 text-teal-800"
            } else if (tagLower.includes("fisi")) {
              tagColor = "bg-blue-50 border-blue-200 text-blue-800"
            } else if (tagLower.includes("hist")) {
              tagColor = "bg-amber-50 border-amber-200 text-amber-800"
            }

            const dateVal = item.created_at
              ? new Date(item.created_at).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit"
                })
              : "Reciente"

            return {
              id: String(item.id),
              title: item.title || "Aviso sin título",
              date: dateVal,
              content: item.content || "",
              tag: item.tag || "General",
              tagColor,
              link: item.link || item.url || undefined
            }
          })
          setAnnouncements(mapped)
        } else {
          setAnnouncements(defaultAnnouncements)
        }
      } catch (err) {
        console.warn("No se pudieron cargar los avisos de la base de datos (usando avisos de respaldo local):", err)
        setAnnouncements(defaultAnnouncements)
      } finally {
        setIsLoadingAnnouncements(false)
      }
    }

    fetchAnnouncements()
  }, [])

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

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!announceTitle.trim() || !announceContent.trim()) return

    const newAnnData = {
      title: announceTitle.trim(),
      content: announceContent.trim(),
      tag: announceTag.trim() || "General",
      link: announceLink.trim() || null
    }

    try {
      const { data, error } = await supabase
        .from("announcements")
        .insert([newAnnData])
        .select()

      if (error) throw error

      if (data && data.length > 0) {
        const dateVal = new Date().toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        })
        const newLocal: Announcement = {
          id: String(data[0].id),
          title: data[0].title || newAnnData.title,
          content: data[0].content || newAnnData.content,
          date: dateVal,
          tag: data[0].tag || newAnnData.tag,
          tagColor: "bg-emerald-50 border-emerald-200 text-emerald-800",
          link: data[0].link || newAnnData.link || undefined
        }
        setAnnouncements(prev => [newLocal, ...prev])
      }
    } catch (err) {
      console.warn("Could not insert announcement to Supabase, fallback to local state:", err)
      const newLocal: Announcement = {
        id: Math.random().toString(36).substring(2, 9),
        title: newAnnData.title,
        content: newAnnData.content,
        date: "Reciente",
        tag: newAnnData.tag,
        tagColor: "bg-emerald-50 border-emerald-200 text-emerald-800",
        link: newAnnData.link || undefined
      }
      setAnnouncements(prev => [newLocal, ...prev])
    }

    setAnnounceTitle("")
    setAnnounceContent("")
    setAnnounceTag("General")
    setAnnounceLink("")
    setShowAnnounceForm(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* COLUMNA IZQUIERDA: Bienvenido, Avisos e Historia */}
        <div className="space-y-8">
          
          {/* Tarjeta de Bienvenida */}
          <div className="rounded-2xl border border-emerald-900 bg-gradient-to-br from-emerald-850 to-emerald-950 p-6 text-white clinical-shadow">
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
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  Tablón de Avisos y Novedades
                </h3>
                <button
                  onClick={() => setShowAnnounceForm(!showAnnounceForm)}
                  className="rounded-lg bg-slate-900 hover:bg-slate-955 text-white font-bold text-[10px] px-2.5 py-1 transition"
                >
                  {showAnnounceForm ? "Cancelar" : "+ Publicar Aviso"}
                </button>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Actualizaciones del Curso
              </span>
            </div>

            {/* Formulario de Carga de Avisos */}
            {showAnnounceForm && (
              <form onSubmit={handleAddAnnouncement} className="rounded-xl border border-slate-200 bg-stone-50/50 p-4 space-y-3.5 animate-fadeIn">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Título</label>
                    <input
                      type="text"
                      value={announceTitle}
                      onChange={e => setAnnounceTitle(e.target.value)}
                      placeholder="Título del aviso..."
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Materia / Tag</label>
                    <select
                      value={announceTag}
                      onChange={e => setAnnounceTag(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-600 text-slate-700"
                    >
                      <option value="General">General</option>
                      <option value="Anatomía">Anatomía</option>
                      <option value="Histología">Histología</option>
                      <option value="Fisiología">Fisiología</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Enlace del Anuncio (URL)</label>
                  <input
                    type="url"
                    value={announceLink}
                    onChange={e => setAnnounceLink(e.target.value)}
                    placeholder="https://ejemplo.com/recurso"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Contenido del Aviso</label>
                  <textarea
                    value={announceContent}
                    onChange={e => setAnnounceContent(e.target.value)}
                    placeholder="Escribe el contenido detallado del aviso aquí..."
                    rows={3}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-800 hover:bg-slate-900 text-white font-bold text-xs py-2 transition"
                >
                  Publicar en Tablón
                </button>
              </form>
            )}

            <div className="space-y-4">
              {isLoadingAnnouncements ? (
                <div className="text-center py-6 text-xs text-slate-450">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-emerald-800 border-t-transparent mr-2 align-middle"></span>
                  Cargando avisos...
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No hay avisos disponibles.
                </div>
              ) : (
                announcements.map(announcement => {
                  const hasLink = !!announcement.link
                  return (
                    <div 
                      key={announcement.id} 
                      onClick={() => {
                        if (announcement.link) {
                          window.open(announcement.link, "_blank")
                        }
                      }}
                      className={`rounded-xl border p-4 transition-all duration-300 ${
                        hasLink 
                          ? "border-emerald-500/40 bg-emerald-50/5 cursor-pointer hover:border-emerald-600 hover:bg-emerald-50/20" 
                          : "border-slate-200/60 hover:bg-stone-50/50"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className={`rounded px-2.5 py-0.5 text-[9px] font-bold border ${announcement.tagColor}`}>
                          {announcement.tag}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {announcement.date}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between gap-2">
                        <span>{announcement.title}</span>
                        {hasLink && (
                          <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-100/65 px-1.5 py-0.5 rounded shrink-0">
                            🔗 Enlace Externo
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {announcement.content}
                      </p>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Historia de Kinase */}
          <div className="glass-card rounded-2xl p-6 clinical-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                La Historia de Kinase Academy
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Nuestros Orígenes
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p className="font-semibold text-slate-800">
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
                    className="overflow-hidden space-y-3 pt-3 border-t border-slate-100"
                  >
                    <p>
                      Mi camino nunca fue una línea recta ni un trayecto simple; estuvo marcado, desde la escuela primaria, por una cultura del esfuerzo absoluto. Siempre fui de los que se obsesionaban con que un afiche para una exposición quedara perfecto, de los que buscaban aprender a tocar un instrumento de la mejor manera posible, y de los que entendían que la comunicación con los compañeros no era un detalle menor, sino la base para cuidar el compañerismo.
                    </p>
                    <p>
                      Al llegar a la secundaria, intensifiqué ese enfoque. Sabía, intuía, que en esos años se estaba forjando la llave que abriría las puertas de mi futuro. And thus it was. Hoy puedo decir que <strong>mi presente es el futuro que construí</strong>, y desde esa certeza comprendí que la preparación más importante no era memorizar datos, sino <strong>aprender a aprender</strong>.
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
                    <blockquote className="border-l-4 border-emerald-600 bg-stone-50 p-3 rounded-r-lg my-4">
                      <p className="font-bold text-slate-800">
                        ¿Por qué Kinase?
                      </p>
                      <p className="text-slate-600 mt-1">
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
                    <p className="font-bold text-emerald-800">
                      Kinase es para todos los estudiantes de medicina de la Argentina. Kinase es comunidad académica. Bienvenidos a la activación.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setShowFullHistory(!showFullHistory)}
                className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-slate-900 transition-colors"
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
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Anotador Kinase
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 text-xs text-slate-700"
                >
                  <option value="General">General</option>
                  <option value="Anatomía">Anatomía</option>
                  <option value="Histología">Histología</option>
                  <option value="Fisiología">Fisiología</option>
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
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-500 mb-3">
                Notas Guardadas ({notes.length})
              </h4>

              {notes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                  No hay notas guardadas. ¡Crea tu primera mnemotecnia o apunte de estudio!
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                  <AnimatePresence initial={false}>
                    {notes.map(note => {
                      let catColor = "border-slate-300 bg-slate-50 text-slate-655"
                      if (note.category === "Anatomía") catColor = "border-rose-300 bg-rose-50/50 text-rose-800"
                      if (note.category === "Histología") catColor = "border-amber-300 bg-amber-50/50 text-amber-800"
                      if (note.category === "Fisiología") catColor = "border-teal-300 bg-teal-50/50 text-teal-800"

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
                                className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
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
                          <div className="flex items-center justify-between border-t border-slate-200/40 pt-1.5 mt-2 text-[9px] font-medium opacity-70">
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
