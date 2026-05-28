import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "../lib/supabase"
supabase.from('community_posts').select('id,title,body,tag,author,votes,comments').order('created_at', { ascending: false }).then(({ data, error }) => {
  if (error) {
    console.error("Error fetching posts:", error)
  } else {
    console.log("Fetched posts:", data)
  } 
type Post = {
  id: number
  title: string
  body: string
  tag: string
  author: string
  votes: number
  comments: number
}

const initialPosts: Post[] = []
const tags = ["Todos", "Medicina", "Ingenieria", "Recursos"]

type CommunityMarketplaceProps = {
  onOpenFair?: () => void
}

export default function CommunityMarketplace({ onOpenFair }: CommunityMarketplaceProps) {
  const [activeTag, setActiveTag] = useState("Todos")
  const [posts, setPosts] = useState(initialPosts)
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
          "El foro esta en modo demo hasta crear la tabla community_posts en Supabase."
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
      data: { user },
    } = await supabase.auth.getUser()

    const newPost = {
      title: cleanDraft,
      body: "Nueva duda publicada por un estudiante. La comunidad puede responder, votar y pedir apoyo experto.",
      tag: "Recursos",
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
        "No se pudo guardar en Supabase. Revisa la tabla community_posts y sus politicas RLS."
      )
      setPosts((current) => [{ id: Date.now(), ...newPost }, ...current])
    } else {
      setPosts((current) => [data, ...current])
      setDatabaseMessage("")
    }

    setDraft("")
    setActiveTag("Todos")
  }

  const upvote = async (id: number) => {
    const post = posts.find((currentPost) => currentPost.id === id)
    if (!post) return

    const nextVotes = post.votes + 1

    setPosts((current) =>
      current.map((post) =>
        post.id === id ? { ...post, votes: nextVotes } : post
      )
    )

    const { error } = await supabase
      .from("community_posts")
      .update({ votes: nextVotes })
      .eq("id", id)

    if (error) {
      setDatabaseMessage(
        "El voto se ve en pantalla, pero Supabase no lo guardo. Revisa permisos de update."
      )
    }
  }

  return (
    <section id="comunidad" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Comunidad
            </p>

            <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              Un espacio para compartir dudas, recursos y ayudarnos entre estudiantes.
            </h2>
          </div>

          <p className="text-lg leading-8 text-slate-600">
            El estudiante entra por una duda, conversa con otros, descubre
            recursos utiles y encuentra ayuda academica personalizada cuando
            necesita avanzar mas rapido.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="mb-5 rounded-lg border border-slate-200 bg-stone-50 p-4">
              {databaseMessage && (
                <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-900">
                  {databaseMessage}
                </p>
              )}

              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Publica una duda: materia, parcial, tema trabado o recurso que estas buscando..."
                className="min-h-28 w-full resize-none rounded-lg border border-slate-200 bg-white p-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveTag(tag)}
                      className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                        activeTag === tag
                          ? "bg-slate-950 text-white"
                          : "bg-white text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={publishPost}
                  className="rounded-lg bg-emerald-700 px-5 py-3 font-black text-white transition hover:bg-slate-950"
                >
                  Publicar
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {isLoadingPosts && (
                <div className="rounded-lg border border-slate-200 bg-white p-5 font-bold text-slate-500">
                  Cargando publicaciones desde Supabase...
                </div>
              )}

              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-[64px_1fr] gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col items-center rounded-lg bg-slate-100 py-3">
                    <button
                      type="button"
                      onClick={() => upvote(post.id)}
                      className="text-lg font-black text-slate-600 hover:text-emerald-700"
                      aria-label="Votar publicacion"
                    >
                      ^
                    </button>
                    <span className="text-lg font-black text-slate-950">
                      {post.votes}
                    </span>
                  </div>

                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span className="rounded-md bg-emerald-50 px-2 py-1 font-bold text-emerald-800">
                        {post.tag}
                      </span>
                      <span>Publicado por {post.author}</span>
                    </div>

                    <h3 className="mb-2 text-xl font-black text-slate-950">
                      {post.title}
                    </h3>

                    <p className="mb-4 leading-7 text-slate-600">{post.body}</p>

                    <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-500">
                      <button className="hover:text-slate-950">
                        {post.comments} comentarios
                      </button>
                      <button className="hover:text-slate-950">Guardar</button>
                      <button className="hover:text-slate-950">
                        Pedir experto
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
                Feria universitaria
              </p>

              <h3 className="mb-3 text-2xl font-black">
                Los mejores recursos de la comunidad, listos para comprar o vender.
              </h3>

              <p className="mb-6 leading-7 text-slate-300">
                Apuntes, guias, plantillas y simulacros creados por estudiantes.
                Entra a la feria para filtrar por carrera, guardar favoritos y
                postular tu propio material.
              </p>

              <div className="mb-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-slate-900 p-3">
                  <p className="text-xl font-black text-emerald-300">6</p>
                  <p className="text-xs text-slate-400">recursos</p>
                </div>
                <div className="rounded-lg bg-slate-900 p-3">
                  <p className="text-xl font-black text-emerald-300">4.8</p>
                  <p className="text-xs text-slate-400">rating</p>
                </div>
                <div className="rounded-lg bg-slate-900 p-3">
                  <p className="text-xl font-black text-emerald-300">190+</p>
                  <p className="text-xs text-slate-400">ventas</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenFair}
                className="block w-full rounded-lg bg-emerald-600 px-5 py-3 text-center font-black text-white transition hover:bg-emerald-500"
              >
                Abrir feria
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
