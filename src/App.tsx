import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Features from './sections/Features'
import AcademicFair from './sections/AcademicFair'
import TestSection from './sections/TestSection'
import About from './sections/About'
import Courses from './sections/Courses'
import Testimonials from './sections/Testimonials'
import AcademicPlanner from './sections/AcademicPlanner'
import Welcome from './sections/Welcome'
import Premium from './sections/Premium'
import WeeklyPlanner from './sections/WeeklyPlanner'
import Flashcards from './sections/Flashcards'
import HabitCreator from './sections/HabitCreator'
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
  const [activeSection, setActiveSection] = useState<'bienvenido' | 'cuadro_sinoptico' | 'mercado' | 'planificador' | 'ayuda' | 'cursos' | 'testimonios' | 'premium' | 'planificador_semanal' | 'flashcards' | 'publicas' | 'habit_creator'>('bienvenido')

  // Premium state
  const [isPremium, setIsPremium] = useState<boolean>(false)

  const handleActivatePremium = (code: string) => {
    const cleanCode = code.trim().toUpperCase()
    if (
      cleanCode.startsWith('KINASE-PREMIUM-') || 
      cleanCode === 'KINASE-FREE-VIP' || 
      cleanCode === 'KINASE-TIZIANO-PREMIUM' ||
      cleanCode === 'KINASE-ACTIVA-2026'
    ) {
      setIsPremium(true)
      if (session) {
        supabase.auth.updateUser({
          data: { is_premium: true }
        }).catch(e => {
          console.warn("Could not update premium metadata in Supabase:", e)
        })
      } else {
        try {
          localStorage.setItem('kinase_student_premium_local', 'true')
        } catch {
          // Blocked
        }
      }
      return true
    }
    return false
  }

  // Force light mode on mount
  useEffect(() => {
    try {
      window.document.documentElement.classList.remove('dark')
      localStorage.setItem('kinase_dark_mode', 'false')
    } catch {
      // Storage blocked
    }
  }, [])

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
          if (data.session) {
            const hasPremium = data.session.user?.user_metadata?.is_premium === true
            setIsPremium(hasPremium)
          } else {
            const localPrem = localStorage.getItem('kinase_student_premium_local') === 'true'
            setIsPremium(localPrem)
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setSession(null)
          setIsPremium(false)
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
        const hasPremium = activeSession.user?.user_metadata?.is_premium === true
        setIsPremium(hasPremium)
      } else {
        const localPrem = localStorage.getItem('kinase_student_premium_local') === 'true'
        setIsPremium(localPrem)
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
    setIsPremium(false)
  }

  const handleDeactivatePremium = () => {
    setIsPremium(false)
    if (session) {
      supabase.auth.updateUser({
        data: { is_premium: false }
      }).catch(e => {
        console.warn("Could not deactivate premium in Supabase metadata:", e)
      })
    } else {
      try {
        localStorage.setItem('kinase_student_premium_local', 'false')
      } catch {
        // Storage blocked
      }
    }
    setActiveSection('bienvenido')
  }

  if (isCheckingSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-50 px-6 text-center transition-colors duration-300">
        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-800 animate-pulse">
            Kinase Academy
          </p>
          <h1 className="text-xl font-bold text-slate-800">
            Cargando entorno médico...
          </h1>
        </div>
      </main>
    )
  }

  if (!session && !localAccess) {
    return (
      <main className="bg-stone-50 min-h-screen transition-colors duration-300">
        <Navbar />
        <Hero onAuthenticated={unlockApp} />
      </main>
    )
  }

  return (
    <main className={`min-h-screen pb-12 transition-colors duration-300 ${
      isPremium ? 'bg-[#fcfbf9] text-slate-900' : 'bg-stone-50/50'
    }`}>
      <Navbar 
        onLogout={signOut} 
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
                { id: 'bienvenido', label: 'Bienvenidos' },
                { id: 'mercado', label: 'Feria de Materiales' },
                { id: 'ayuda', label: 'Diagnóstico & Coaching' },
                { id: 'cursos', label: 'Acompañamiento' },
                { id: 'testimonios', label: 'Testimonios' },
                { id: 'premium', label: 'Premium VIP', isSpecial: true }
              ]
            : [
                { id: 'bienvenido', label: 'Bienvenidos' },
                { id: 'premium', label: 'Panel VIP', isSpecial: true },
                { id: 'cuadro_sinoptico', label: 'Creador de Cuadro Sinóptico' },
                { id: 'planificador', label: 'Planificador Inverso' },
                { id: 'planificador_semanal', label: 'Planificador Semanal' },
                { id: 'flashcards', label: 'Flashcards VIP' },
                { id: 'habit_creator', label: 'Creador de Habitos' },
                { id: 'publicas', label: 'Secciones Públicas' }
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

            {activeSection === 'cuadro_sinoptico' && (
              <section className="bg-stone-50 px-6 py-16">
                <div className="mx-auto max-w-3xl text-center space-y-6">
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                    Herramienta en Desarrollo
                  </span>
                  <h2 className="text-3xl font-black text-slate-950 leading-tight">
                    Creador de Cuadros Sinópticos
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Esta sección está siendo construida para permitir a los estudiantes de medicina generar de forma interactiva y automatizada cuadros sinópticos y mapas jerárquicos a partir de textos de estudio.
                  </p>
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 bg-white/50 text-slate-500 text-xs">
                    ⚡ Próximamente: Ingresa tus apuntes de Anatomía o Fisiología y obtén un esquema estructurado visual con relaciones lógicas inmediatas para facilitar tu repaso oral.
                  </div>
                </div>
              </section>
            )}
            
            {activeSection === 'mercado' && (
              <AcademicFair />
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

            {activeSection === 'habit_creator' && (
              <HabitCreator />
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
              <Premium 
                isPremium={isPremium} 
                onActivate={handleActivatePremium} 
                onDeactivate={handleDeactivatePremium} 
              />
            )}

            {activeSection === 'publicas' && (
              <div className="mx-auto max-w-7xl px-6 py-8 space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 dark:border-[#1d3330] pb-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Secciones Públicas de la Academia
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
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">Feria de Materiales</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">Apuntes, atlas y resúmenes cargados por alumnos.</p>
                  </button>
                  <button
                    onClick={() => setActiveSection('ayuda')}
                    className="glass-card rounded-2xl p-5 text-left border border-slate-200 hover:border-emerald-600 transition-all clinical-shadow space-y-2 cursor-pointer"
                  >
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">Diagnóstico & Coaching</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">Test vocacional y de regularidad sin costo.</p>
                  </button>
                  <button
                    onClick={() => setActiveSection('cursos')}
                    className="glass-card rounded-2xl p-5 text-left border border-slate-200 hover:border-emerald-600 transition-all clinical-shadow space-y-2 cursor-pointer"
                  >
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">Tutorías Médicas</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">Cursos intensivos dictados por residentes.</p>
                  </button>
                  <button
                    onClick={() => setActiveSection('testimonios')}
                    className="glass-card rounded-2xl p-5 text-left border border-slate-200 hover:border-emerald-600 transition-all clinical-shadow space-y-2 cursor-pointer"
                  >
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
