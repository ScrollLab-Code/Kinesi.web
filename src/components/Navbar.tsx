import { useState, useEffect } from "react"

type NavbarProps = {
  onLogout?: () => void
}

type NavItem = {
  id: string
  label: string
  icon: string
}

export default function Navbar({ onLogout }: NavbarProps) {
  const [activeSection, setActiveSection] = useState("inicio")

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
      {/* Top bar - Logo and logout */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-200 z-40 py-4 px-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-black tracking-wide text-slate-950">
            KINASE
          </h1>
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg bg-emerald-700 px-6 py-2.5 font-bold text-white transition hover:bg-emerald-800 text-sm"
            >
              Salir
            </button>
          ) : (
            <a
              href="#inicio"
              className="rounded-lg bg-emerald-700 px-6 py-2.5 font-bold text-white transition hover:bg-emerald-800 text-sm"
            >
              Acceso
            </a>
          )}
        </div>
      </header>

      
      {/* Spacers for fixed elements */}
      <div className="h-20" /> {/* Top spacer */}
      <div className="h-20" /> {/* Bottom spacer */}
    </>
  )
}
