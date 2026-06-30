import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Features from './sections/Features'
import CommunityMarketplace from './sections/CommunityMarketplace'
import AcademicFair from './sections/AcademicFair'
import TestSection from './sections/TestSection'
import About from './sections/About'
import Courses from './sections/Courses'
import Testimonials from './sections/Testimonials'
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
  const [activeSection, setActiveSection] = useState<'comunidad' | 'mercado' | 'ayuda' | 'cursos' | 'testimonios'>('comunidad')

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

  if (isCheckingSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-50 px-6 text-center">
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
      <main className="bg-stone-50 min-h-screen">
        <Navbar />
        <Hero onAuthenticated={unlockApp} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50/50 pb-12">
      <Navbar onLogout={signOut} />

      <section
        id="inicio"
        className="bg-white border-b border-slate-100 px-6 pb-12 pt-24 text-slate-900"
      >
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
            Panel del Estudiante
          </p>

          <h1 className="max-w-3xl text-3xl font-black leading-tight text-slate-900 md:text-5xl tracking-tight">
            Estudia con método, comparte tus experiencias y aprueba con tranquilidad.
          </h1>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="sticky top-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3 z-30 shadow-sm">
        <div className="mx-auto max-w-7xl flex gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSection('comunidad')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'comunidad'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-stone-50 border border-slate-200 text-slate-650 text-slate-600 hover:bg-stone-100'
            }`}
          >
            Muro de Experiencias
          </button>
          <button
            onClick={() => setActiveSection('mercado')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'mercado'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-stone-50 border border-slate-200 text-slate-650 text-slate-600 hover:bg-stone-100'
            }`}
          >
            Feria de Materiales
          </button>
          <button
            onClick={() => setActiveSection('ayuda')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'ayuda'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-stone-50 border border-slate-200 text-slate-650 text-slate-600 hover:bg-stone-100'
            }`}
          >
            Diagnóstico & Coaching
          </button>
          <button
            onClick={() => setActiveSection('cursos')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'cursos'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-stone-50 border border-slate-200 text-slate-650 text-slate-600 hover:bg-stone-100'
            }`}
          >
            Tutorías Médicas
          </button>
          <button
            onClick={() => setActiveSection('testimonios')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'testimonios'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-stone-50 border border-slate-200 text-slate-650 text-slate-600 hover:bg-stone-100'
            }`}
          >
            Testimonios
          </button>
        </div>
      </nav>

      {/* Content Sections */}
      <div className="min-h-[60vh] bg-stone-50/30">
        {activeSection === 'comunidad' && (
          <CommunityMarketplace onOpenFair={() => setActiveSection('mercado')} />
        )}
        
        {activeSection === 'mercado' && (
          <AcademicFair />
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
      </div>

      <Features />
      <Footer />
    </main>
  )
}

export default App
