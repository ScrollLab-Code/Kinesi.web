import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "../lib/supabase"

type Post = {
  id: number
  title: string
  body: string
  tag: string
  author: string
  votes: number
  comments: number
  created_at?: string
}

const initialPosts: Post[] = [
  {
    id: -1,
    title: "Anatomía I - Cátedra 1: Mi método para aprobar locomotor y esplacno",
    body: "Para locomotor, el secreto es dibujar las ramas de la arteria subclavia y el plexo braquial una y otra vez. Para esplacnología, usen el atlas de Netter pero complementen sí o sí con preparados reales del museo. ¡No le tengan miedo al examen oral, vayan con seguridad!",
    tag: "Anatomía",
    author: "Martina G.",
    votes: 48,
    comments: 12,
  },
  {
    id: -2,
    title: "Cómo sobrevivir al integrador de Histología y Embriología",
    body: "No traten de memorizar solo la teoría de los textos. Relacionen cada preparado con su función fisiológica. Recomiendo las flashcards digitales de preparados y esquemas de glándulas. En el examen siempre toman diagnóstico de preparados linfoideos.",
    tag: "Histología",
    author: "Joaquín M.",
    votes: 35,
    comments: 8,
  },
  {
    id: -3,
    title: "Fisiología: Entender el gráfico presión-volumen cardíaco",
    body: "Si entienden el ciclo cardíaco paso a paso, tienen media materia adentro. Recomiendo estudiar del Guyton para la base y repasar con simulacros de opción múltiple. Las clases de coaching de Kinase me ordenaron las últimas 3 semanas antes del final.",
    tag: "Fisiología",
    author: "Sofía R.",
    votes: 52,
    comments: 15,
  }
]

const tags = ["Todos", "Anatomía", "Histología", "Fisiología", "Química & Biofísica", "Biología Celular"]

type AcademicTestimonialsProps = {
  onOpenFair?: () => void
}

export default function CommunityMarketplace({ onOpenFair }: AcademicTestimonialsProps) {
  const [activeTag, setActiveTag] = useState("Todos")
  const [posts, setPosts] = useState<Post[]>([])
  const [draftTitle, setDraftTitle] = useState("")
  const [draftBody, setDraftBody] = useState("")
  const [draftTag, setDraftTag] = useState("Anatomía")
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [databaseMessage, setDatabaseMessage] = useState("")

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoadingPosts(true)
      const { data, error } = await supabase
        .from("community_posts")
        .select("id,title,body,tag,author,votes,comments")
        .order("created_at", { ascending: false })

      if (error) {
        // Fallback to rich mock data if supabase table doesn't exist
        setPosts(initialPosts)
        setDatabaseMessage("Mostrando experiencias destacadas de la comunidad (Modo Demo).")
        setIsLoadingPosts(false)
        return
      }

      if (data && data.length > 0) {
        setPosts([...data, ...initialPosts])
      } else {
        setPosts(initialPosts)
      }
      setDatabaseMessage("")
      setIsLoadingPosts(false)
    }
    loadPosts()
  }, [])

  const filteredPosts = useMemo(() => {
    if (activeTag === "Todos") return posts
    return posts.filter((post) => post.tag === activeTag)
  }, [activeTag, posts])

  const publishPost = async () => {
    const cleanTitle = draftTitle.trim()
    const cleanBody = draftBody.trim()
    if (!cleanTitle || !cleanBody) return

    const { data: { user } } = await supabase.auth.getUser()
    
    const newPost = {
      title: cleanTitle,
      body: cleanBody,
      tag: draftTag,
      author: user?.user_metadata?.name || user?.email?.split('@')[0] || "Estudiante de Medicina",
      votes: 1,
      comments: 0,
    }

    const { data, error } = await supabase
      .from("community_posts")
      .insert([newPost])
      .select("id,title,body,tag,author,votes,comments")
      .single()

    if (error) {
      // In case of error (e.g. Supabase connection), simulate adding to local state securely
      const simulatedPost: Post = {
        id: Date.now(),
        ...newPost
      }
      setPosts((current) => [simulatedPost, ...current])
      setDatabaseMessage("Tu experiencia se guardó localmente (Modo Demo sin conexión).")
      setDraftTitle("")
      setDraftBody("")
    } else {
      setPosts((current) => [data, ...current])
      setDatabaseMessage("¡Experiencia publicada con éxito!")
      setDraftTitle("")
      setDraftBody("")
    }
  }

  const upvote = async (id: number) => {
    const post = posts.find((currentPost) => currentPost.id === id)
    if (!post) return

    const nextVotes = post.votes + 1

    // 1. Optimistic Update
    setPosts((current) =>
      current.map((p) => (p.id === id ? { ...p, votes: nextVotes } : p))
    )

    if (id < 0) {
      // Demo post, stay local
      return
    }

    const { error } = await supabase
      .from("community_posts")
      .update({ votes: nextVotes })
      .eq("id", id)

    // 2. Rollback on error
    if (error) {
      setDatabaseMessage("No se pudo registrar el voto en el servidor.")
      setPosts((current) =>
        current.map((p) => (p.id === id ? { ...p, votes: post.votes } : p))
      )
    }
  }

  return (
    <section id="comunidad" className="bg-stone-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
              Experiencias y Logros de Cursada
            </p>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Cómo superaron otros estudiantes de medicina las materias filtro.
            </h2>
          </div>
          <p className="text-base text-slate-600 leading-relaxed">
            Un espacio colaborativo donde compartir consejos reales de cátedras, técnicas de estudio anatómico, prácticos de microscopía y recomendaciones de material de estudio.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            {/* Formulario de publicación */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-slate-900">Comparte tu experiencia de examen o cursada</h3>
              {databaseMessage && (
                <p className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800">
                  {databaseMessage}
                </p>
              )}

              <div className="space-y-3">
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  placeholder="Título: Ej. Mi experiencia rindiendo el final de Bioquímica"
                  className="w-full rounded-lg border border-slate-200 bg-stone-50 px-4 py-2.5 outline-none focus:border-emerald-600 focus:bg-white text-sm"
                  maxLength={120}
                />
                
                <textarea
                  value={draftBody}
                  onChange={(event) => setDraftBody(event.target.value)}
                  placeholder="Detalla tu experiencia: qué cátedra fue, qué temas tomaron, qué libros o apuntes usaste y tus consejos para otros compañeros..."
                  className="min-h-24 w-full resize-none rounded-lg border border-slate-200 bg-stone-50 p-4 outline-none focus:border-emerald-600 focus:bg-white text-sm"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Materia:</span>
                    <select
                      value={draftTag}
                      onChange={(e) => setDraftTag(e.target.value)}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-600"
                    >
                      {tags.filter(t => t !== "Todos").map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={publishPost}
                    className="rounded-lg bg-emerald-800 px-5 py-2 text-sm font-bold text-white transition hover:bg-slate-900"
                  >
                    Publicar testimonio
                  </button>
                </div>
              </div>
            </div>

            {/* Barra de Filtros */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    activeTag === tag
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Feed de Experiencias */}
            <div className="space-y-4">
              {isLoadingPosts && posts.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm font-bold text-slate-400">
                  Cargando experiencias...
                </div>
              )}

              {!isLoadingPosts && filteredPosts.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 text-sm">
                  No hay testimonios en esta materia todavía. ¡Sé el primero en compartir!
                </div>
              )}

              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.2) }}
                  viewport={{ once: true }}
                  className="grid grid-cols-[54px_1fr] gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 py-2.5 h-fit border border-slate-100">
                    <button
                      type="button"
                      onClick={() => upvote(post.id)}
                      className="text-xs font-black text-slate-400 hover:text-emerald-700 transition"
                      aria-label="Votar útil"
                    >
                      ▲
                    </button>
                    <span className="text-sm font-bold text-slate-800 mt-1">
                      {post.votes}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Útil</span>
                  </div>

                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-md bg-emerald-50 border border-emerald-100 px-2 py-0.5 font-bold text-emerald-800">
                        {post.tag}
                      </span>
                      <span>Compartido por <strong>{post.author}</strong></span>
                    </div>

                    <h3 className="mb-2 text-base font-bold text-slate-900">
                      {post.title}
                    </h3>
                    <p className="mb-3 text-sm leading-relaxed text-slate-600 whitespace-pre-line">{post.body}</p>

                    <div className="flex gap-4 text-xs font-semibold text-slate-400">
                      <span className="text-slate-500">{post.comments} comentarios</span>
                      <button className="hover:text-emerald-700 transition">Guardar</button>
                      <button className="hover:text-emerald-700 transition" onClick={onOpenFair}>Buscar material relacionado</button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
            <div className="rounded-xl border border-teal-900 bg-teal-950 p-5 text-white shadow-sm">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-teal-300">
                Feria de Materiales
              </p>
              <h3 className="mb-2 text-lg font-bold">
                ¿Buscás resúmenes o preparados específicos?
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-slate-200">
                Estudiantes avanzados subieron sus atlas anotados, flashcards de Anki y desgrabados de teóricos listos para descargar.
              </p>

              <div className="mb-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-teal-900/60 p-2.5">
                  <p className="text-lg font-bold text-teal-300">12</p>
                  <p className="text-[10px] text-slate-300">Atlas & Guías</p>
                </div>
                <div className="rounded-lg bg-teal-900/60 p-2.5">
                  <p className="text-lg font-bold text-teal-300">4.9</p>
                  <p className="text-[10px] text-slate-300">Valoración</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenFair}
                className="block w-full rounded-lg bg-teal-600 py-2.5 text-center text-xs font-bold text-white transition hover:bg-teal-500"
              >
                Explorar Feria Médica
              </button>
            </div>
            
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Consejos de Ciberseguridad</h4>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Para tu tranquilidad, toda la información compartida es auditada. No compartas datos personales sensibles como contraseñas, documentos de identidad o información bancaria directa en las publicaciones.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}