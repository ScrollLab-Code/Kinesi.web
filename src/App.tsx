import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'

import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Features from './sections/Features'
import CommunityMarketplace from './sections/CommunityMarketplace'
import About from './sections/About'
import Courses from './sections/Courses'
import Testimonials from './sections/Testimonials'
import Footer from './components/Footer'
import CommunityFloatButton from './components/CommunityFloatButton'
import { Particulares } from './sections/Particulares'

import { supabase } from './lib/supabase'
import AcademicFair from './sections/AcademicFair'
import TestSection from './sections/TestSection'

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
    // ignore
  }
}

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [localAccess, setLocalAccess] = useState(getStoredAccess)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  const [activeSection, setActiveSection] = useState<
    'comunidad' | 'mercado' | 'ayuda' | 'cursos' | 'testimonios' | 'particulares'
  >('ayuda')

  useEffect(() => {
    let isMounted = true

    const finishLoading = () => {
      if (isMounted) {
        setIsCheckingSession(false)
      }
    }

    const loadingFallback = window.setTimeout(finishLoading, 1800)

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
        <div>
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Kinase
          </p>
          <h1 className="text-3xl font-black text-slate-950">
            Preparando tu espacio de estudio...
          </h1>
        </div>
      </main>
    )
  }

  if (!session && !localAccess) {
    return (
      <main>
        <Navbar />
        <Hero onAuthenticated={unlockApp} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 text-slate-950">
      <Navbar onLogout={signOut} />

      {activeSection === 'ayuda' && (
        <section
          id="inicio"
          className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 pb-24 pt-36 text-white"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-emerald-500 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
              Bienvenido a Kinase
            </p>

            <h1 className="max-w-5xl text-5xl font-black leading-tight md:text-7xl">
              La comunidad universitaria donde aprendés, compartís y crecés.
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Coaching académico, comunidad universitaria, marketplace de recursos
              y herramientas creadas para ayudarte a avanzar más rápido en la facultad.
            </p>
          </div>
        </section>
      )}

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto">

          <button
            onClick={() => setActiveSection('ayuda')}
            className={`rounded-xl px-5 py-3 font-black transition-all whitespace-nowrap ${
              activeSection === 'ayuda'
                ? 'bg-emerald-700 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Coaching Académico
          </button>

          <button
            onClick={() => setActiveSection('particulares')}
            className={`rounded-xl px-5 py-3 font-black transition-all whitespace-nowrap ${
              activeSection === 'particulares'
                ? 'bg-emerald-700 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Particulares
          </button>

          <button
            onClick={() => setActiveSection('comunidad')}
            className={`rounded-xl px-5 py-3 font-black transition-all whitespace-nowrap ${
              activeSection === 'comunidad'
                ? 'bg-emerald-700 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Comunidad
          </button>

          <button
            onClick={() => setActiveSection('mercado')}
            className={`rounded-xl px-5 py-3 font-black transition-all whitespace-nowrap ${
              activeSection === 'mercado'
                ? 'bg-emerald-700 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Feria Universitaria
          </button>

          <button
            onClick={() => setActiveSection('cursos')}
            className={`rounded-xl px-5 py-3 font-black transition-all whitespace-nowrap ${
              activeSection === 'cursos'
                ? 'bg-emerald-700 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Cursos
          </button>

          <button
            onClick={() => setActiveSection('testimonios')}
            className={`rounded-xl px-5 py-3 font-black transition-all whitespace-nowrap ${
              activeSection === 'testimonios'
                ? 'bg-emerald-700 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Testimonios
          </button>

        </div>
      </nav>

      <section className="w-full">

        {activeSection === 'ayuda' && (
          <div className="min-h-screen animate-in fade-in duration-300">
            <About /> 
            <CommunityFloatButton />
          </div>
        )}

        

        {activeSection === 'comunidad' && (
          <div className="min-h-screen bg-stone-50 animate-in fade-in duration-300">
            <CommunityMarketplace />
            <CommunityFloatButton />
          </div>
        )}
        
        
        {activeSection === 'particulares' && (
          <div className="min-h-screen bg-stone-50 animate-in fade-in duration-300">
            <Particulares />
            <CommunityFloatButton />
          </div>
        )}

        {activeSection === 'mercado' && (
          <div className="min-h-screen bg-stone-50 animate-in fade-in duration-300">
            <AcademicFair />
            <CommunityFloatButton />
          </div>
        )}

        {activeSection === 'cursos' && (
          <div className="min-h-screen animate-in fade-in duration-300">
            <TestSection />
            <Courses />
            <CommunityFloatButton />
          </div>
        )}
        
        {activeSection === 'testimonios' && (
          <div className="min-h-screen animate-in fade-in duration-300">
            <Testimonials />
            <CommunityFloatButton />
          </div>
        )}

      </section>

      <Features />
      <Footer />
    </main>
  )
}

export default App