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
      {/* Top bar - Medical Logo and session actions */}
      <header className="fixed top-0 w-full bg-[#fbf9f5]/90 dark:bg-[#091211]/90 backdrop-blur-md border-b border-[#e7e3db] dark:border-[#1c2c29] z-40 py-3.5 px-6 transition-colors duration-300">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          
          {/* Logo - links to home */}
          <button 
            type="button"
            onClick={() => onNavigate ? onNavigate('bienvenido') : window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 text-left bg-transparent border-0 outline-none p-0 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <img 
                src={logoIcon} 
                alt="KINASE Logo Mark" 
                className="h-9 w-9 md:h-10 md:w-10 object-contain rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-0.5 shadow-sm group-hover:scale-105 transition duration-200" 
              />
              <div className="flex flex-col justify-center leading-none">
                <span className="text-sm md:text-base font-black uppercase tracking-[0.16em] text-slate-900 dark:text-white font-sans">
                  Kinase
                </span>
                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.38em] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                  Academy
                </span>
              </div>
            </div>
            {isPremium && (
              <span className="hidden sm:inline-block rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                ⭐ Premium VIP
              </span>
            )}
          </button>

          {/* Central Menu */}
          <div className="hidden md:flex items-center gap-6 font-sans">
            <button
              onClick={() => onNavigate ? onNavigate('bienvenido') : document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
            >
              Inicio
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('mercado') : document.getElementById('mercado')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
            >
              Apuntes & Recursos
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('cursos') : document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
            >
              Tutorías
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('ayuda') : document.getElementById('ayuda')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
            >
              Diagnóstico
            </button>
          </div>

          {/* Action Zone (Right) */}
          <div className="flex items-center gap-3">
            {onLogout ? (
              <>
                {onPremiumClick && (
                  <button
                    type="button"
                    onClick={onPremiumClick}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isPremium
                        ? "bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300"
                        : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                    }`}
                  >
                    <span>{isPremium ? "Miembro VIP" : "Acceso VIP ⭐"}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f1918] px-3.5 py-1.5 font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-[#1a2c28] text-xs shadow-sm cursor-pointer"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-xl bg-[#0e2723] hover:bg-slate-900 dark:bg-emerald-800 dark:hover:bg-emerald-700 px-4 py-2 font-bold text-white transition text-xs shadow-sm cursor-pointer"
                >
                  Ingresar
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Spacers for fixed header */}
      <div className="h-20" />
    </>
  )
}
