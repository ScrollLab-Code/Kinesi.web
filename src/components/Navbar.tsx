import { useState, useEffect } from "react"

type NavbarProps = {
  onLogout?: () => void
}

export default function Navbar({ onLogout }: NavbarProps) {
  const [_activeSection, setActiveSection] = useState("inicio")

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["inicio", "comunidad", "diagnostico", "cursos"]
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Top bar - Medical Logo and session actions */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 py-3 px-6 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-lg font-black tracking-wider text-slate-900 flex items-center gap-1.5">
            <span className="text-emerald-800 text-xl">🩺</span> KINASE <span className="text-emerald-800 font-normal text-xs tracking-widest hidden sm:inline">ACADEMY</span>
          </h1>
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg bg-emerald-800 px-4 py-2 font-bold text-white transition hover:bg-slate-900 text-xs shadow-sm"
            >
              Cerrar Sesión
            </button>
          ) : (
            <a
              href="#inicio"
              className="rounded-lg bg-emerald-800 px-4 py-2 font-bold text-white transition hover:bg-slate-900 text-xs shadow-sm"
            >
              Acceso Estudiantil
            </a>
          )}
        </div>
      </header>

      {/* Spacers for fixed elements */}
      <div className="h-14" /> {/* Top spacer adjusted */}
    </>
  )
}
