import { useState, useEffect } from "react"
import logo from "../assets/logo.svg"

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
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 py-2.5 px-6 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <img src={logo} alt="KINASE ACADEMY Logo" className="h-8 md:h-9 w-auto" />
          </div>
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
      <div className="h-14" /> {/* Top spacer */}
    </>
  )
}
