import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "../lib/supabase"

type Comment = {
  author: string
  text: string
  created_at: string
}

type Post = {
  id: number
  title: string
  body: string
  tag: string
  author: string
  votes: number
  commentsCount: number
  commentsList: Comment[]
}

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

  // State to track which post has its comments expanded and its comment input draft
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<number | null>(null)
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({})

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoadingPosts(true)
      const { data, error } = await supabase
        .from("community_posts")
        .select("id,title,body,tag,author,votes")
        .order("created_at", { ascending: false })

      if (error) {
        // Fallback to empty list as requested by user to keep it clean, showing only welcome message
        setPosts([])
        setDatabaseMessage("Muro de Experiencias cargado (Modo Demo).")
        setIsLoadingPosts(false)
        return
      }

      if (data) {
        // Hydrate posts with simulated comments list
        const hydrated: Post[] = data.map((p: any) => ({
          ...p,
          commentsCount: 0,
          commentsList: []
        }))
        setPosts(hydrated)
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
      votes: 0,
    }

    const { data, error } = await supabase
      .from("community_posts")
      .insert([newPost])
      .select("id,title,body,tag,author,votes")
      .single()

    if (error) {
      // Secure local state simulation
      const simulatedPost: Post = {
        id: Date.now(),
        ...newPost,
        commentsCount: 0,
        commentsList: []
      }
      setPosts((current) => [simulatedPost, ...current])
      setDatabaseMessage("Tu experiencia se publicó localmente en el navegador.")
      setDraftTitle("")
      setDraftBody("")
    } else {
      const hydrated: Post = {
        ...data,
        commentsCount: 0,
        commentsList: []
      }
      setPosts((current) => [hydrated, ...current])
      setDatabaseMessage("¡Experiencia publicada con éxito!")
      setDraftTitle("")
      setDraftBody("")
    }
  }

  const handleLike = async (id: number) => {
    const post = posts.find((currentPost) => currentPost.id === id)
    if (!post) return

    const nextVotes = post.votes + 1

    // Optimistic Update
    setPosts((current) =>
      current.map((p) => (p.id === id ? { ...p, votes: nextVotes } : p))
    )

    if (id > 1000000000) return // local post, skip remote call

    const { error } = await supabase
      .from("community_posts")
      .update({ votes: nextVotes })
      .eq("id", id)

    if (error) {
      setPosts((current) =>
        current.map((p) => (p.id === id ? { ...p, votes: post.votes } : p))
      )
    }
  }

  const addComment = (postId: number) => {
    const draftText = commentDrafts[postId] || ""
    const cleanText = draftText.trim()
    if (!cleanText) return

    setPosts((current) =>
      current.map((post) => {
        if (post.id === postId) {
          const updatedComments = [
            ...post.commentsList,
            {
              author: "Tú (Estudiante)",
              text: cleanText,
              created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
          return {
            ...post,
            commentsList: updatedComments,
            commentsCount: updatedComments.length
          }
        }
        return post
      })
    )

    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }))
  }

  return (
    <section id="comunidad" className="bg-stone-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        
        {/* Welcome and encouragement banner */}
        <div className="mb-10 rounded-2xl border border-teal-150 bg-gradient-to-br from-teal-50 to-emerald-50/50 p-6 md:p-8 shadow-sm">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
            Muro de Experiencias Kinase
          </p>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            ¡Bienvenidos al espacio de cursada colectiva!
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-650 text-slate-600 max-w-3xl">
            Te invitamos a compartir tus relatos reales de cursada, cómo aprobaste las materias filtro de tu facultad, tus técnicas de estudio médico preferidas y las cátedras que recomiendas. Puedes interactuar con tus compañeros dando likes y comentando las publicaciones para resolver dudas.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            {/* Formulario de publicación */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3.5 text-sm font-bold text-slate-800">Comparte tu experiencia en Kinase y tu Facultad</h3>
              {databaseMessage && (
                <p className="mb-4 rounded-lg bg-emerald-50 border border-emerald-100 p-2.5 text-xs font-semibold text-emerald-800">
                  {databaseMessage}
                </p>
              )}

              <div className="space-y-3">
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  placeholder="Título de la experiencia: Ej. Mi cursada de Anatomía en Cátedra 2"
                  className="w-full rounded-lg border border-slate-200 bg-stone-50 px-3 py-2 text-xs outline-none focus:border-emerald-600 focus:bg-white"
                  maxLength={120}
                />
                
                <textarea
                  value={draftBody}
                  onChange={(event) => setDraftBody(event.target.value)}
                  placeholder="Escribe aquí tu consejo, anécdota o lo que te sirvió de Kinase..."
                  className="min-h-20 w-full resize-none rounded-lg border border-slate-200 bg-stone-50 p-3 text-xs outline-none focus:border-emerald-600 focus:bg-white"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
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
                    className="rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-900"
                  >
                    Publicar en el Muro
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
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    activeTag === tag
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-650 hover:text-slate-900"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Feed de Experiencias */}
            <div className="space-y-4">
              {isLoadingPosts && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-xs font-bold text-slate-400">
                  Cargando publicaciones...
                </div>
              )}

              {!isLoadingPosts && filteredPosts.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 text-xs leading-relaxed">
                  Aún no hay publicaciones en esta categoría. ¡Aprovecha la oportunidad para compartir la primera experiencia en Kinase y tu facultad!
                </div>
              )}

              {filteredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded bg-emerald-50 border border-emerald-100 px-2 py-0.5 font-bold text-emerald-850">
                      {post.tag}
                    </span>
                    <span>Compartido por <strong>{post.author}</strong></span>
                  </div>

                  <h3 className="mb-2 text-base font-bold text-slate-900">
                    {post.title}
                  </h3>
                  
                  <p className="mb-4 text-xs leading-relaxed text-slate-600 whitespace-pre-line">
                    {post.body}
                  </p>

                  <div className="flex gap-4 items-center text-xs font-semibold text-slate-500 pt-3 border-t border-slate-100">
                    {/* Like button styled with heart */}
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 hover:text-rose-600 transition"
                    >
                      <span>❤️</span>
                      <span>Me gusta ({post.votes})</span>
                    </button>

                    <button 
                      onClick={() => setExpandedCommentsPostId(expandedCommentsPostId === post.id ? null : post.id)}
                      className="flex items-center gap-1 hover:text-emerald-850 transition"
                    >
                      <span>💬</span>
                      <span>Comentarios ({post.commentsCount})</span>
                    </button>
                  </div>

                  {/* Interactive Comments Drawer */}
                  {expandedCommentsPostId === post.id && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 bg-stone-50/50 p-3 rounded-lg">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Comentarios</p>
                      
                      {post.commentsList.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No hay comentarios todavía. Deja tu aporte abajo.</p>
                      ) : (
                        <div className="space-y-2.5 max-h-40 overflow-y-auto">
                          {post.commentsList.map((c, idx) => (
                            <div key={idx} className="text-xs">
                              <span className="font-bold text-slate-700">{c.author}: </span>
                              <span className="text-slate-600">{c.text}</span>
                              <span className="block text-[9px] text-slate-400 mt-0.5">{c.created_at}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 items-center pt-2">
                        <input
                          type="text"
                          value={commentDrafts[post.id] || ""}
                          onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Añade tu respuesta o duda..."
                          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={() => addComment(post.id)}
                          className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800"
                        >
                          Comentar
                        </button>
                      </div>
                    </div>
                  )}

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

              <button
                type="button"
                onClick={onOpenFair}
                className="block w-full rounded-lg bg-teal-600 py-2.5 text-center text-xs font-bold text-white transition hover:bg-teal-500"
              >
                Explorar Feria Médica
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}