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
const LOCAL_STORAGE_KEY = "kinase_community_posts_v1"

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

  // Helper to update state and persist changes to localStorage
  const updatePostsState = (newPosts: Post[] | ((prev: Post[]) => Post[])) => {
    setPosts(prev => {
      const next = typeof newPosts === "function" ? newPosts(prev) : newPosts
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoadingPosts(true)
      
      // Load local state first for instant persistence
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY)
      let initialLoadedPosts: Post[] = []
      if (localData) {
        try {
          initialLoadedPosts = JSON.parse(localData)
        } catch (e) {
          initialLoadedPosts = []
        }
      }

      const { data, error } = await supabase
        .from("community_posts")
        .select("id,title,body,tag,author,votes")
        .order("created_at", { ascending: false })

      if (error) {
        setPosts(initialLoadedPosts)
        setDatabaseMessage("Muro de Experiencias cargado (Modo Demo local).")
        setIsLoadingPosts(false)
        return
      }

      if (data) {
        // Merge Supabase entries with local storage states (retaining comments and local upvotes)
        const merged: Post[] = data.map((p: any) => {
          const matchedLocal = initialLoadedPosts.find(lp => lp.id === p.id)
          return {
            ...p,
            votes: matchedLocal ? Math.max(matchedLocal.votes, p.votes) : p.votes,
            commentsCount: matchedLocal ? matchedLocal.commentsCount : 0,
            commentsList: matchedLocal ? matchedLocal.commentsList : []
          }
        })
        
        // Retain strictly local posts that don't exist on remote db yet
        const strictlyLocal = initialLoadedPosts.filter(lp => !data.some((p: any) => p.id === lp.id))
        const finalPosts = [...strictlyLocal, ...merged]
        
        setPosts(finalPosts)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalPosts))
      } else {
        setPosts(initialLoadedPosts)
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
      // Fallback local save
      const simulatedPost: Post = {
        id: Date.now(),
        ...newPost,
        commentsCount: 0,
        commentsList: []
      }
      updatePostsState((current) => [simulatedPost, ...current])
      setDatabaseMessage("Tu experiencia se guardó localmente en el navegador.")
      setDraftTitle("")
      setDraftBody("")
    } else {
      const hydrated: Post = {
        ...data,
        commentsCount: 0,
        commentsList: []
      }
      updatePostsState((current) => [hydrated, ...current])
      setDatabaseMessage("¡Experiencia publicada con éxito!")
      setDraftTitle("")
      setDraftBody("")
    }
  }

  const handleLike = async (id: number) => {
    const post = posts.find((currentPost) => currentPost.id === id)
    if (!post) return

    const nextVotes = post.votes + 1

    // Optimistic local update (saves to localStorage instantly)
    updatePostsState((current) =>
      current.map((p) => (p.id === id ? { ...p, votes: nextVotes } : p))
    )

    if (id > 1000000000) return // Simulated local post

    const { error } = await supabase
      .from("community_posts")
      .update({ votes: nextVotes })
      .eq("id", id)

    if (error) {
      // Rollback
      updatePostsState((current) =>
        current.map((p) => (p.id === id ? { ...p, votes: post.votes } : p))
      )
    }
  }

  const addComment = (postId: number) => {
    const draftText = commentDrafts[postId] || ""
    const cleanText = draftText.trim()
    if (!cleanText) return

    updatePostsState((current) =>
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
        <div className="mb-10 glass-card rounded-2xl border border-teal-100 dark:border-[#1d3330] bg-gradient-to-br from-teal-50/30 to-emerald-50/10 dark:from-[#0a2622]/20 dark:to-transparent p-6 md:p-8 clinical-shadow">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">
            Muro de Experiencias Kinase
          </p>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            ¡Bienvenidos al espacio de cursada colectiva!
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-350 max-w-3xl">
            Te invitamos a compartir tus relatos reales de cursada, cómo aprobaste las materias filtro de tu facultad, tus técnicas de estudio médico preferidas y las cátedras que recomiendas. Puedes interactuar con tus compañeros dando likes y comentando las publicaciones para resolver dudas.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            {/* Formulario de publicación */}
            <div className="glass-card rounded-2xl p-5 clinical-shadow">
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
              {isLoadingPosts && posts.length === 0 && (
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
                  className="glass-card rounded-2xl p-5 clinical-shadow transition-all duration-300"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded bg-emerald-50 border border-emerald-100 px-2 py-0.5 font-bold text-emerald-855 text-emerald-800">
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
            <div className="rounded-2xl border border-teal-900 bg-gradient-to-br from-teal-950 to-emerald-950 dark:from-[#0a2622] dark:to-[#05110f] p-5 text-white clinical-shadow transition-all duration-300">
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