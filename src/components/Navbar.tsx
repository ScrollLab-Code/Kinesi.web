type NavbarProps = {
  onLogout?: () => void
}

export default function Navbar({ onLogout }: NavbarProps) {
  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-xl md:text-2xl font-black tracking-wide text-slate-950">
          KINASE
        </h1>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a href="#inicio" className="hover:text-slate-950 transition">
            Inicio
          </a>

          <a href="#comunidad" className="hover:text-slate-950 transition">
            Comunidad
          </a>

          <a href="#marketplace" className="hover:text-slate-950 transition">
            Marketplace
          </a>

          <a href="#diagnostico" className="hover:text-slate-950 transition">
            Diagnostico
          </a>

          <a href="#cursos" className="hover:text-slate-950 transition">
            Ayuda academica
          </a>
        </nav>

        {onLogout ? (
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg bg-slate-950 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
          >
            Salir
          </button>
        ) : (
          <a
            href="#registro"
            className="rounded-lg bg-slate-950 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
          >
            Crear cuenta
          </a>
        )}
      </div>
    </header>
  )
}
