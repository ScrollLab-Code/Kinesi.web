export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#inicio" className="text-lg font-semibold tracking-[0.2em] uppercase text-slate-900">
          KINASE
        </a>

        <nav className="hidden items-center gap-10 text-sm text-slate-600 md:flex">
          <a href="#que-es" className="hover:text-slate-900 transition">
            Qué es
          </a>
          <a href="#como-funciona" className="hover:text-slate-900 transition">
            Cómo funciona
          </a>
          <a href="#unirse" className="hover:text-slate-900 transition">
            Registro
          </a>
          <a href="#marketplace" className="hover:text-slate-900 transition">
            Marketplace
          </a>
        </nav>

        <a
          href="#unirse"
          className="rounded-full border border-transparent bg-sky-700 px-5 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-sky-600"
        >
          Unirse
        </a>
      </div>
    </header>
  )
}
