import type { FC } from "react"

type NavbarProps = {
  onLogout?: () => void
}

const Navbar: FC<NavbarProps> = ({ onLogout }) => {
  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <h1 className="text-2xl font-black tracking-wide text-slate-950">
            KINASE
          </h1>

          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-black text-white transition hover:bg-emerald-800"
            >
              Salir
            </button>
          ) : (
            <a
              href="#inicio"
              className="rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-black text-white transition hover:bg-emerald-800"
            >
              Acceso
            </a>
          )}
        </div>
      </header>

      {/* spacer */}
      <div className="h-24" />
    </>
  )
}

export default Navbar