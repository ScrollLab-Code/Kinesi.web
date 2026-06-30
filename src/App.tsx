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
  const [activeSection, setActiveSection] = useState<'comunidad' | 'mercado' | 'explorador' | 'gymkana' | 'planificador' | 'ayuda' | 'cursos' | 'testimonios'>('comunidad')

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
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Hero onAuthenticated={unlockApp} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50/50 dark:bg-[#090f0e] pb-12 transition-colors duration-300">
      <Navbar onLogout={signOut} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <section
        id="inicio"
        className="bg-white dark:bg-[#111c1a] border-b border-slate-100 dark:border-[#1d3330] px-6 pb-12 pt-24 text-slate-900 transition-colors duration-300"
      >
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">
            Panel del Estudiante
          </p>

          <h1 className="max-w-3xl text-3xl font-black leading-tight text-slate-900 dark:text-white md:text-5xl tracking-tight">
            Estudia con método, comparte tus experiencias y aprueba con tranquilidad.
          </h1>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="sticky top-14 bg-white/95 dark:bg-[#111c1a]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#1d3330] px-6 py-3 z-30 shadow-sm transition-colors duration-300">
        <div className="mx-auto max-w-7xl flex gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSection('comunidad')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'comunidad'
                ? 'bg-slate-900 text-white shadow-sm dark:bg-emerald-800'
                : 'bg-stone-50 border border-slate-200 text-slate-600 hover:bg-stone-100 dark:bg-[#0d1615] dark:border-[#1d3330] dark:text-emerald-450'
            }`}
          >
            Muro de Experiencias
          </button>
          <button
            onClick={() => setActiveSection('mercado')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'mercado'
                ? 'bg-slate-900 text-white shadow-sm dark:bg-emerald-800'
                : 'bg-stone-50 border border-slate-200 text-slate-650 hover:bg-stone-100 dark:bg-[#0d1615] dark:border-[#1d3330] dark:text-emerald-455'
            }`}
          >
            Feria de Materiales
          </button>
          <button
            onClick={() => setActiveSection('explorador')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'explorador'
                ? 'bg-slate-900 text-white shadow-sm dark:bg-emerald-800'
                : 'bg-stone-50 border border-slate-200 text-slate-655 hover:bg-stone-100 dark:bg-[#0d1615] dark:border-[#1d3330] dark:text-emerald-455'
            }`}
          >
            💀 Explorador Anatómico
          </button>
          <button
            onClick={() => setActiveSection('gymkana')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'gymkana'
                ? 'bg-slate-900 text-white shadow-sm dark:bg-emerald-800'
                : 'bg-stone-50 border border-slate-200 text-slate-655 hover:bg-stone-100 dark:bg-[#0d1615] dark:border-[#1d3330] dark:text-emerald-455'
            }`}
          >
            🎯 Simulador Gymkana
          </button>
          <button
            onClick={() => setActiveSection('planificador')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'planificador'
                ? 'bg-slate-900 text-white shadow-sm dark:bg-emerald-800'
                : 'bg-stone-50 border border-slate-200 text-slate-655 hover:bg-stone-100 dark:bg-[#0d1615] dark:border-[#1d3330] dark:text-emerald-455'
            }`}
          >
            📅 Planificador Inverso
          </button>
          <button
            onClick={() => setActiveSection('ayuda')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'ayuda'
                ? 'bg-slate-900 text-white shadow-sm dark:bg-emerald-800'
                : 'bg-stone-50 border border-slate-200 text-slate-655 hover:bg-stone-100 dark:bg-[#0d1615] dark:border-[#1d3330] dark:text-emerald-455'
            }`}
          >
            Diagnóstico & Coaching
          </button>
          <button
            onClick={() => setActiveSection('cursos')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'cursos'
                ? 'bg-slate-900 text-white shadow-sm dark:bg-emerald-800'
                : 'bg-stone-50 border border-slate-200 text-slate-655 hover:bg-stone-100 dark:bg-[#0d1615] dark:border-[#1d3330] dark:text-emerald-455'
            }`}
          >
            Tutorías Médicas
          </button>
          <button
            onClick={() => setActiveSection('testimonios')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'testimonios'
                ? 'bg-slate-900 text-white shadow-sm dark:bg-emerald-800'
                : 'bg-stone-50 border border-slate-200 text-slate-655 hover:bg-stone-100 dark:bg-[#0d1615] dark:border-[#1d3330] dark:text-emerald-455'
            }`}
          >
            Testimonios
          </button>
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
          </motion.div>
        </AnimatePresence>
      </div>

      <Features />
      <Footer />
    </main>
  )
}

export default App
