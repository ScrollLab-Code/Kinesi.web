import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Features from './sections/Features'
import CommunityMarketplace from './sections/CommunityMarketplace'
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
    // Local files and some privacy modes can block storage; React state still works.
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
    <main>
      <Navbar onLogout={signOut} />

      <section
        id="inicio"
        className="bg-stone-50 px-6 pb-16 pt-32 text-slate-950"
      >
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Bienvenido
          </p>

          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            ¡ya sos parte de kinase! vamos camino hacia el exito.
          </h1>
        </div>
      </section>

      {/* Navigation Buttons */}
      <nav className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-40">
        <div className="mx-auto max-w-7xl flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSection('comunidad')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeSection === 'comunidad'
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-100 text-slate-950 hover:bg-gray-200'
            }`}
          >
            Comunidad
          </button>
          <button
            onClick={() => setActiveSection('mercado')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeSection === 'mercado'
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-100 text-slate-950 hover:bg-gray-200'
            }`}
          >
            Feria universitaria
          </button>
          <button
            onClick={() => setActiveSection('ayuda')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeSection === 'ayuda'
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-100 text-slate-950 hover:bg-gray-200'
            }`}
          >
            coaching Académico
          </button>
          <button
            onClick={() => setActiveSection('cursos')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeSection === 'cursos'
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-100 text-slate-950 hover:bg-gray-200'
            }`}
          >
            Cursos
          </button>
          <button
            onClick={() => setActiveSection('testimonios')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeSection === 'testimonios'
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-100 text-slate-950 hover:bg-gray-200'
            }`}
          >
            Testimonios
          </button>
        </div>
      </nav>

      {/* Content Sections */}
      <div className="min-h-screen">
        {activeSection === 'comunidad' && <CommunityMarketplace />}
        {activeSection === 'mercado' && <TestSection />}
        {activeSection === 'ayuda' && <About />}
        {activeSection === 'cursos' && <Courses />}
        {activeSection === 'testimonios' && <Testimonials />}
      </div>

      <Features />
      <Footer />
    </main>
  )
}

export default App
