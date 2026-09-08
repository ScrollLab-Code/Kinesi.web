import logoIcon from "../assets/logo_icon.jpg"

type NavbarProps = {
  onLogout?: () => void
  isPremium?: boolean
  onPremiumClick?: () => void
  onNavigate?: (sectionId: 'cursos' | 'mercado' | 'ayuda' | 'bienvenido' | 'premium') => void
}

export default function Navbar({ 
  onLogout, 
  isPremium = false, 
  onPremiumClick,
  onNavigate
}: NavbarProps) {
  return (
    <>
      {/* Gemini Notebook Style Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 py-3.5 px-6 sm:px-10 transition-all duration-200">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          
          {/* Logo */}
          <button 
            type="button"
            onClick={() => onNavigate ? onNavigate('bienvenido') : window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 text-left bg-transparent border-0 outline-none p-0 cursor-pointer group"
          >
            <img 
              src={logoIcon} 
              alt="Kinase Academy Logo" 
              className="h-8 w-8 object-contain rounded-lg border border-slate-200 bg-white p-0.5 shadow-xs group-hover:scale-105 transition" 
            />
            <div className="flex items-center gap-1.5 font-sans">
              <span className="text-base font-bold text-slate-900 tracking-tight">
                Kinase
              </span>
              <span className="text-base font-normal text-slate-600">
                Academy
              </span>
            </div>
            {isPremium && (
              <span className="hidden sm:inline-block rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                VIP
              </span>
            )}
          </button>

          {/* Central & Right Menu Links (Gemini Notebook Style) */}
          <div className="flex items-center gap-6 sm:gap-8 font-sans text-xs font-semibold">
            <button
              onClick={() => onNavigate ? onNavigate('bienvenido') : document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-900 border-b-2 border-slate-900 pb-0.5 cursor-pointer"
            >
              Descripción general
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('premium') : document.getElementById('premium')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-600 hover:text-slate-900 transition cursor-pointer hidden sm:inline-block"
            >
              Planes
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('mercado') : document.getElementById('mercado')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-600 hover:text-slate-900 transition cursor-pointer hidden md:inline-block"
            >
              Apuntes & Fuentes
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('ayuda') : document.getElementById('ayuda')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-600 hover:text-slate-900 transition cursor-pointer hidden md:inline-block"
            >
              Diagnóstico
            </button>

            {/* Action Pill Button */}
            {onLogout ? (
              <div className="flex items-center gap-3">
                {onPremiumClick && (
                  <button
                    type="button"
                    onClick={onPremiumClick}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                      isPremium
                        ? "bg-amber-50 border border-amber-200 text-amber-800"
                        : "bg-amber-500 text-white shadow-xs"
                    }`}
                  >
                    {isPremium ? "Miembro VIP" : "Hazte VIP ⭐"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-full border border-slate-300 bg-white px-4 py-1.5 font-bold text-slate-700 hover:bg-slate-100 text-xs shadow-xs cursor-pointer"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })}
                className="gemini-pill-btn text-xs py-2 px-5 cursor-pointer shadow-xs"
              >
                Probar Kinase Academy
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Spacer */}
      <div className="h-20" />
    </>
  )
}
