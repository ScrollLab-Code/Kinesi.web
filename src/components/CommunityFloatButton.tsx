import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function CommunityFloatButton() {
  const communityLink = "https://chat.whatsapp.com/LJGOAAmIui4Eme9TUCNllP"
  
  // Estado para controlar si mostramos el globito de texto o no
  const [showBubble, setShowBubble] = useState(false)

  useEffect(() => {
    // Revisamos si en la memoria del navegador ya dice que el usuario vio el mensaje
    const hasSeenBubble = localStorage.getItem("has_seen_community_bubble")
    
    if (!hasSeenBubble) {
      // Si nunca lo vio, esperamos un segundo y le mostramos el globito
      const timer = setTimeout(() => {
        setShowBubble(true)
        // Guardamos inmediatamente en la memoria que YA lo vio para la próxima vez
        localStorage.setItem("has_seen_community_bubble", "true")
      }, 1200)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-none">
      
      {/* AnimatePresence permite que el globito aparezca con animación suave */}
      <AnimatePresence>
        {showBubble && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 10, x: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-xl pointer-events-auto max-w-[220px] relative"
          >
            {/* Botón chiquito para cerrar el cartel manualmente si molesta */}
            <button 
              onClick={() => setShowBubble(false)}
              className="absolute top-1 right-2 text-slate-400 hover:text-slate-600 text-xs font-bold pointer-events-auto"
            >
              ×
            </button>

            <p className="text-xs font-black text-slate-950 pr-2">
              ¡Súmate a la comunidad! 🚀
            </p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-tight">
              Enterate de novedades de la web, Grupos de estudio y más.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* El botón circular de WhatsApp SIEMPRE se queda visible */}
      <motion.a
        href={communityLink}
        target="_blank"
        rel="noreferrer"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
        aria-label="Unirse a la comunidad"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="h-7 w-7"
        >
          <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 14.434 14.434 0 0 0 5.234-1.103.75.75 0 0 0 .366-.648c0-3.008-1.993-5.555-4.75-6.413a5.261 5.261 0 0 1 1.134 3.197l-.25.105c-.172.072-.361.127-.55.163Z" />
        </svg>
      </motion.a>

    </div>
  )
}