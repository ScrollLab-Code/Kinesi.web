import logo from "../assets/logo.svg"

type NavbarProps = {
  onLogout?: () => void
  isPremium?: boolean
  onPremiumClick?: () => void
}

export default function Navbar({ 
  onLogout, 
  isPremium = false, 
  onPremiumClick 
}: NavbarProps) {
  return (
    <>
      {/* Top bar - Medical Logo and session actions */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 py-3.5 px-6 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            {/* Enlarged logo 'agrandar host' */}
            <img 
              src={logo} 
              alt="KINASE ACADEMY Logo" 
              className="h-10 md:h-12 w-auto transition-all duration-300" 
            />
            {isPremium && (
              <span className="hidden sm:inline-block rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-600 animate-pulse">
                Miembro Premium VIP
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Premium action button */}
            {onPremiumClick && (
              <button
                type="button"
                onClick={onPremiumClick}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition border shadow-sm ${
                  isPremium
                    ? "bg-amber-500 border-amber-600 text-white hover:bg-amber-600"
                    : "bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-400 text-slate-900 hover:from-amber-600 hover:to-yellow-600"
                }`}
              >
                <span className="hidden xs:inline">{isPremium ? "Premium VIP" : "Premium"}</span>
              </button>
            )}

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
      <div className="h-20" /> {/* Top spacer - increased to 80px to prevent overlaps */}
    </>
  )
}
