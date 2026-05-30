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
}

const tags = ["Todos", "Medicina", "Ingenieria", "Recursos"]

export default function CommunityMarketplace() {
  const [activeTag, setActiveTag] = useState("Todos")
  const [posts, setPosts] = useState<Post[]>([])
  const [draft, setDraft] = useState("")
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
        setDatabaseMessage(
          "El foro está en modo demo hasta crear la tabla community_posts en Supabase."
        )
        setIsLoadingPosts(false)
        return
      }

      if (data?.length) {
        setPosts(data)
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
    const cleanDraft = draft.trim()
    if (!cleanDraft) return

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const user = session?.user

    const newPost = {
      title: cleanDraft,
      body: "Nueva duda publicada por un estudiante. La comunidad puede responder, votar y pedir apoyo experto.",
      tag: activeTag === "Todos" ? "Recursos" : activeTag,
      author:
        user?.user_metadata?.name ||
        user?.email ||
        user?.phone ||
        "Nuevo estudiante",
      votes: 1,
      comments: 0,
    }

    const { data, error } = await supabase
      .from("community_posts")
      .insert([newPost])
      .select("id,title,body,tag,author,votes,comments")
      .single()

    if (error) {
      setDatabaseMessage(
        "No se pudo guardar en Supabase. Revisa la tabla community_posts y sus políticas RLS."
      )
    } else {
      setPosts((current) => [data, ...current])
      setDatabaseMessage("")
      setDraft("")
      setActiveTag("Todos")
    }
  }

  const upvote = async (id: number) => {
    const post = posts.find((p) => p.id === id)
    if (!post) return

    const nextVotes = post.votes + 1

    setPosts((current) =>
      current.map((p) => (p.id === id ? { ...p, votes: nextVotes } : p))
    )

    const { error } = await supabase
      .from("community_posts")
      .update({ votes: nextVotes })
      .eq("id", id)

    if (error) {
      setDatabaseMessage(
        "El voto falló en el servidor. Revisa los permisos UPDATE en Supabase."
      )
      setPosts((current) =>
        current.map((p) => (p.id === id ? { ...p, votes: post.votes } : p))
      )
    }
  }

  return (
    <section
      id="comunidad"
      className="min-h-screen bg-gradient-to-b from-stone-50 to-white px-6 py-24"
    >
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-14">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Comunidad
          </p>
          <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            Un espacio para compartir dudas, recursos y ayudarnos entre estudiantes.
          </h2>
        </div>

        {/* Crear publicación */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          {databaseMessage && (
            <p className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900">
              {databaseMessage}
            </p>
          )}

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Publica una duda: parcial, materia, tema complicado o recurso..."
            className="min-h-32 w-full resize-none rounded-2xl border border-slate-200 bg-stone-50 p-5 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={publishPost}
              className="rounded-2xl bg-emerald-700 px-6 py-3 font-black text-white transition hover:scale-[1.02] hover:bg-slate-950"
            >
              Publicar duda
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                activeTag === tag
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {isLoadingPosts && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 font-bold text-slate-500 shadow-sm">
              Cargando publicaciones...
            </div>
          )}

          {!isLoadingPosts && filteredPosts.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              No hay publicaciones todavía.
            </div>
          )}

          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              viewport={{ once: true }}
              className="grid grid-cols-[70px_1fr] gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              {/* Votos */}
              <div className="flex flex-col items-center rounded-2xl bg-slate-100 py-4">
                <button
                  type="button"
                  onClick={() => upvote(post.id)}
                  className="text-xl font-black text-slate-600 transition hover:text-emerald-700"
                >
                  ▲
                </button>
                <span className="text-xl font-black text-slate-950">
                  {post.votes}
                </span>
              </div>

              {/* Contenido */}
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span className="rounded-xl bg-emerald-50 px-3 py-1 font-black text-emerald-700">
                    {post.tag}
                  </span>
                  <span>Publicado por {post.author}</span>
                </div>

                <h3 className="mb-3 text-2xl font-black text-slate-950">
                  {post.title}
                </h3>

                <p className="mb-5 leading-7 text-slate-600">{post.body}</p>

                <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500">
                  <button className="hover:text-slate-950">
                    {post.comments} comentarios
                  </button>
                  <button className="hover:text-slate-950">Guardar</button>
                  <button className="hover:text-slate-950">Pedir experto</button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
