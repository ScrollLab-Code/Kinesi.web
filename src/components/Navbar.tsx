import logo from "../assets/logo.svg"

type NavbarProps = {
  onLogout?: () => void
  darkMode: boolean
  toggleDarkMode: () => void
}

export default function Navbar({ onLogout, darkMode, toggleDarkMode }: NavbarProps) {
  return (
    <>
      {/* Top bar - Medical Logo and session actions */}
      <header className="fixed top-0 w-full bg-white/95 dark:bg-[#111c1a]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#1d3330] z-40 py-2.5 px-6 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <img src={logo} alt="KINASE ACADEMY Logo" className="h-8 md:h-9 w-auto dark:invert dark:brightness-200" />
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-[#0d1615] dark:hover:bg-[#152321] transition-colors border border-slate-200 dark:border-[#1d3330] text-slate-700 dark:text-emerald-400"
              aria-label="Alternar modo oscuro"
            >
              {darkMode ? (
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728A9 9 0 115.636 5.636m12.728 12.728L12 12" />
                </svg>
              ) : (
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

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
        </div>
      </header>

      {/* Spacers for fixed elements */}
      <div className="h-14" /> {/* Top spacer */}
    </>
  )
}
