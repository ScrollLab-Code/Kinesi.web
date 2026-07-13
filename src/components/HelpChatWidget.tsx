import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type ChatOption = {
  label: string
  reply: string
}

export default function HelpChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeReply, setActiveReply] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")

  const options: ChatOption[] = [
    {
      label: "Guía de compra y acceso",
      reply: "Para adquirir nuestros cursos o activar tu cuenta Premium VIP, puedes ingresar tu código en la sección 'Premium VIP'. Si no tienes un código, puedes solicitarlo realizando el pago simulado o contactando a administración."
    },
    {
      label: "Apoyo al estudiante",
      reply: "En Kinase Academy creemos que las dificultades económicas no deben impedir tu educación médica. Ofrecemos becas del 50% al 100% y convenios para grupos. Escribe tu consulta abajo y un coordinador de admisiones te responderá por WhatsApp."
    },
    {
      label: "Soporte técnico y académico",
      reply: "¿Encontraste un error en los planificadores, flashcards o tienes una consulta sobre la bibliografía oficial? Escribe el detalle a continuación para contactar al equipo de soporte."
    }
  ]

  const handleOptionClick = (reply: string) => {
    setActiveReply(reply)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return

    const whatsappLink = `https://wa.me/5492996232195?text=${encodeURIComponent(
      `Hola! Vengo del chat de ayuda de Kinase. Mi consulta es: ${messageText.trim()}`
    )}`
    window.open(whatsappLink, "_blank", "noopener,noreferrer")
    setMessageText("")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="mb-4 w-[340px] rounded-2xl border border-slate-200 dark:border-[#1d3330] bg-white dark:bg-[#0c1312] shadow-xl overflow-hidden clinical-shadow"
          >
            {/* Header */}
            <div className="bg-slate-900 px-4 py-3.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-505 bg-emerald-500 animate-ping" />
                <div>
                  <h4 className="text-xs font-bold tracking-wide">Centro de Ayuda Kinase</h4>
                  <span className="text-[9px] text-slate-400 font-semibold block">Tutor de guardia en línea</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setActiveReply(null)
                }}
                className="text-slate-400 hover:text-white text-xs font-black transition"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto scrollbar-none">
              
              {/* Bot Message */}
              <div className="flex gap-2 items-start">
                <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[10px] shrink-0 text-emerald-800 dark:text-emerald-400 font-bold">
                  K
                </div>
                <div className="bg-slate-105 bg-stone-50 border border-slate-100 rounded-2xl rounded-tl-none p-3 text-[11px] leading-relaxed text-slate-700 font-medium">
                  Bienvenido a Kinase Academy. ¿En qué puedo ayudarte hoy?
                </div>
              </div>

              {/* Automated reply if active */}
              {activeReply && (
                <div className="flex gap-2 items-start animate-fadeIn">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[10px] shrink-0 text-emerald-800 dark:text-emerald-400 font-bold">
                    K
                </div>
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl rounded-tl-none p-3 text-[11px] leading-relaxed text-emerald-850 font-medium">
                    {activeReply}
                  </div>
                </div>
              )}

              {/* Preset buttons */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider mb-1">
                  Preguntas Frecuentes
                </span>
                {options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOptionClick(opt.reply)}
                    className="w-full text-left rounded-xl border border-slate-200 bg-white hover:bg-stone-50 p-2.5 text-[10px] font-bold text-slate-655 text-slate-700 transition"
                  >
                    💡 {opt.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Input Form for custom messages */}
            <form onSubmit={handleSendMessage} className="border-t border-slate-100 dark:border-[#1d3330] p-3 bg-stone-50/50 dark:bg-[#070b0a] flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Escribe tu consulta personalizada..."
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-600 dark:border-[#1d3330] dark:bg-[#0c1312] dark:text-white"
              />
              <button
                type="submit"
                className="rounded-lg bg-emerald-855 bg-emerald-800 hover:bg-slate-900 text-white font-bold text-xs px-3.5 py-1.5 transition"
              >
                Enviar
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-slate-900 hover:bg-emerald-800 text-white flex items-center justify-center shadow-lg transition duration-200 transform hover:scale-105 active:scale-95"
      >
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
        </svg>
      </button>
    </div>
  )
}
