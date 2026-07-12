import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Features from './sections/Features'
import CommunityMarketplace from './sections/CommunityMarketplace'
import AcademicFair from './sections/AcademicFair'
import TestSection from './sections/TestSection'
import About from './sections/About'
import Courses from './sections/Courses'
import Testimonials from './sections/Testimonials'
import AnatomyExplorer from './sections/AnatomyExplorer'
import GymkanaSimulator from './sections/GymkanaSimulator'
import AcademicPlanner from './sections/AcademicPlanner'
import Welcome from './sections/Welcome'
import Premium from './sections/Premium'
import WeeklyPlanner from './sections/WeeklyPlanner'
import Flashcards from './sections/Flashcards'
import Footer from './components/Footer'
import { supabase } from './lib/supabase'

const accessKey = 'kinase_student_access'

const getStoredAccess = () => {
  try {
    return window.localStorage.getItem(accessKey) === 'true'
  } catch {
    return false
  }
}

const setStoredAccess = (value: boolean) => {
  try {
    if (value) {
      window.localStorage.setItem(accessKey, 'true')
    } else {
      window.localStorage.removeItem(accessKey)
    }
  } catch {
    // Local files and privacy modes can block storage
  }
}

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [localAccess, setLocalAccess] = useState(getStoredAccess)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [activeSection, setActiveSection] = useState<'bienvenido' | 'comunidad' | 'mercado' | 'explorador' | 'gymkana' | 'planificador' | 'ayuda' | 'cursos' | 'testimonios' | 'premium' | 'planificador_semanal' | 'flashcards' | 'publicas'>('bienvenido')

  // Premium state
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kinase_student_premium') === 'true'
    } catch {
      return false
    }
  })

  const handleActivatePremium = (code: string) => {
    const cleanCode = code.trim().toUpperCase()
    if (
      cleanCode.startsWith('KINASE-PREMIUM-') || 
      cleanCode === 'KINASE-FREE-VIP' || 
      cleanCode === 'KINASE-TIZIANO-PREMIUM' ||
      cleanCode === 'KINASE-ACTIVA-2026'
    ) {
      setIsPremium(true)
      try {
        localStorage.setItem('kinase_student_premium', 'true')
      } catch {
        // Blocked
      }
      return true
    }
    return false
  }

  // Dark mode states
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kinase_dark_mode') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    // Update theme class on HTML element
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem('kinase_dark_mode', String(darkMode))
    } catch {
      // Local storage can be blocked
    }
  }, [darkMode])

  useEffect(() => {
    let isMounted = true

    const finishLoading = () => {
      if (isMounted) {
        setIsCheckingSession(false)
      }
    }

    const loadingFallback = window.setTimeout(finishLoading, 1500)

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (isMounted) {
          setSession(data.session)
        }
      })
      .catch(() => {
        if (isMounted) {
          setSession(null)
        }
      })
      .finally(() => {
        window.clearTimeout(loadingFallback)
        finishLoading()
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      if (!isMounted) return

      setSession(activeSession)
      if (activeSession) {
        setStoredAccess(true)
        setLocalAccess(true)
      }
      setIsCheckingSession(false)
    })

    return () => {
      isMounted = false
      window.clearTimeout(loadingFallback)
      subscription.unsubscribe()
    }
  }, [])

  const unlockApp = () => {
    setStoredAccess(true)
    setLocalAccess(true)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setStoredAccess(false)
    setSession(null)
    setLocalAccess(false)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  if (isCheckingSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-50 dark:bg-[#090f0e] px-6 text-center transition-colors duration-300">
        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-800 dark:text-emerald-450 animate-pulse">
            Kinase Academy
          </p>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Cargando entorno médico...
          </h1>
        </div>
      </main>
    )
  }

  if (!session && !localAccess) {
    return (
      <main className="bg-stone-50 dark:bg-[#090f0e] min-h-screen transition-colors duration-300">
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
        />
        <Hero onAuthenticated={unlockApp} />
      </main>
    )
  }

  return (
    <main className={`min-h-screen pb-12 transition-colors duration-300 ${
      isPremium ? 'bg-[#030706] text-slate-100' : 'bg-stone-50/50 dark:bg-[#090f0e]'
    }`}>
      <Navbar 
        onLogout={signOut} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        isPremium={isPremium}
        onPremiumClick={() => setActiveSection('premium')}
      />

      <section
        id="inicio"
        className={`px-6 pb-12 pt-24 text-slate-900 transition-colors duration-300 border-b ${
          isPremium
            ? 'bg-gradient-to-r from-[#14120a] via-[#111c1a] to-[#0a1516] border-amber-500/35 text-white'
            : 'bg-white dark:bg-[#111c1a] border-slate-100 dark:border-[#1d3330]'
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <p className={`mb-2 text-xs font-black uppercase tracking-[0.2em] ${
            isPremium ? 'text-amber-500 animate-pulse' : 'text-emerald-800 dark:text-emerald-400'
          }`}>
            {isPremium ? '💎 Kinase Premium VIP Dashboard' : 'Panel del Estudiante'}
          </p>

          <h1 className={`max-w-3xl text-3xl font-black leading-tight md:text-5xl tracking-tight ${
            isPremium ? 'text-white' : 'text-slate-900 dark:text-white'
          }`}>
            {isPremium 
              ? 'Entorno Médico de Alto Rendimiento. Tienes acceso completo.' 
              : 'Estudia con método, comparte tus experiencias y aprueba con tranquilidad.'}
          </h1>
        </div>
      </section>

      {/* Dynamic Navigation Tabs */}
      <nav className={`sticky top-20 bg-white/95 dark:bg-[#111c1a]/95 backdrop-blur-md border-b px-6 py-3 z-30 shadow-sm transition-colors duration-300 ${
        isPremium ? 'border-amber-500/30' : 'border-slate-200 dark:border-[#1d3330]'
      }`}>
        <div className="mx-auto max-w-7xl flex gap-2 overflow-x-auto scrollbar-none">
          {(!isPremium
            ? [
                { id: 'bienvenido', label: '👋 Bienvenidos' },
                { id: 'mercado', label: '📚 Feria de Materiales' },
                { id: 'ayuda', label: '🩺 Diagnóstico & Coaching' },
                { id: 'cursos', label: '🎓 Tutorías Médicas' },
                { id: 'testimonios', label: '🗣️ Testimonios' },
                { id: 'premium', label: '💎 Premium VIP', isSpecial: true }
              ]
            : [
                { id: 'bienvenido', label: '👋 Bienvenidos' },
                { id: 'premium', label: '💎 Panel VIP', isSpecial: true },
                { id: 'comunidad', label: '💬 Muro de Experiencias' },
                { id: 'explorador', label: '💀 Explorador Anatómico' },
                { id: 'gymkana', label: '🎯 Simulador Gymkana' },
                { id: 'planificador', label: '📅 Planificador Inverso' },
                { id: 'planificador_semanal', label: '📅 Planificador Semanal' },
                { id: 'flashcards', label: '🧠 Flashcards VIP' },
                { id: 'publicas', label: '🌐 Secciones Públicas' }
              ]
          ).map(tab => {
            const isActive = activeSection === tab.id
            let activeStyle = 'bg-slate-900 text-white shadow-sm dark:bg-emerald-800'
            let inactiveStyle = 'bg-stone-50 border border-slate-200 text-slate-655 hover:bg-stone-100 dark:bg-[#0d1615] dark:border-[#1d3330] dark:text-emerald-455'

            if ('isSpecial' in tab && tab.isSpecial) {
              activeStyle = 'bg-amber-500 text-white shadow-sm'
              inactiveStyle = 'bg-amber-5/10 border border-amber-250/20 text-amber-600 hover:bg-amber-100/50 dark:bg-[#1a170f] dark:border-amber-900/30 dark:text-amber-400'
            }

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as typeof activeSection)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  isActive ? activeStyle : inactiveStyle
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Content Sections with AnimatePresence Page Transition */}
      <div className="min-h-[60vh] bg-stone-50/30 dark:bg-[#090f0e]/50 transition-colors duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {activeSection === 'bienvenido' && (
              <Welcome />
            )}

            {activeSection === 'comunidad' && (
              <CommunityMarketplace onOpenFair={() => setActiveSection('mercado')} />
            )}
            
            {activeSection === 'mercado' && (
              <AcademicFair />
            )}

            {activeSection === 'explorador' && (
              <AnatomyExplorer />
            )}

            {activeSection === 'gymkana' && (
              <GymkanaSimulator />
            )}

            {activeSection === 'planificador' && (
              <AcademicPlanner />
            )}

            {activeSection === 'planificador_semanal' && (
              <WeeklyPlanner />
            )}

            {activeSection === 'flashcards' && (
              <Flashcards />
            )}
            
            {activeSection === 'ayuda' && (
              <div className="space-y-6">
                <About />
                <TestSection />
              </div>
            )}
            
            {activeSection === 'cursos' && (
              <Courses />
            )}
            
            {activeSection === 'testimonios' && (
              <Testimonials />
            )}

            {activeSection === 'premium' && (
              <Premium isPremium={isPremium} onActivate={handleActivatePremium} />
            )}

            {activeSection === 'publicas' && (
              <div className="mx-auto max-w-7xl px-6 py-8 space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 dark:border-[#1d3330] pb-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    🌐 Secciones Públicas de la Academia
                  </h3>
                  <p className="text-xs text-slate-500">
                    Como miembro Premium VIP, sigues teniendo acceso completo a todos los recursos abiertos de Kinase.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <button
                    onClick={() => setActiveSection('mercado')}
                    className="glass-card rounded-2xl p-5 text-left border border-slate-200 hover:border-emerald-600 transition-all clinical-shadow space-y-2 cursor-pointer"
                  >
                    <span className="text-2xl">📚</span>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">Feria de Materiales</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">Apuntes, atlas y resúmenes cargados por alumnos.</p>
                  </button>
                  <button
                    onClick={() => setActiveSection('ayuda')}
                    className="glass-card rounded-2xl p-5 text-left border border-slate-200 hover:border-emerald-600 transition-all clinical-shadow space-y-2 cursor-pointer"
                  >
                    <span className="text-2xl">🩺</span>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">Diagnóstico & Coaching</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">Test vocacional y de regularidad sin costo.</p>
                  </button>
                  <button
                    onClick={() => setActiveSection('cursos')}
                    className="glass-card rounded-2xl p-5 text-left border border-slate-200 hover:border-emerald-600 transition-all clinical-shadow space-y-2 cursor-pointer"
                  >
                    <span className="text-2xl">🎓</span>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">Tutorías Médicas</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">Cursos intensivos dictados por residentes.</p>
                  </button>
                  <button
                    onClick={() => setActiveSection('testimonios')}
                    className="glass-card rounded-2xl p-5 text-left border border-slate-200 hover:border-emerald-600 transition-all clinical-shadow space-y-2 cursor-pointer"
                  >
                    <span className="text-2xl">🗣️</span>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">Testimonios</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">Experiencias y reviews de alumnos de medicina.</p>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Features />
      <Footer />
    </main>
  )
}

export default App
