import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Features from './sections/Features'
import Courses from './sections/Courses'
import PaymentSchedule from './sections/PaymentSchedule'
import TestSection from './sections/TestSection'
import Testimonials from './sections/Testimonials'
import Footer from './components/Footer'

function App() {
  const [registered, setRegistered] = useState(false)

  return (
    <main className="bg-[#eff6ff] text-slate-900 overflow-hidden">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <PaymentSchedule onRegister={() => setRegistered(true)} registered={registered} />
      <Courses registered={registered} />
      {registered && <TestSection />}
      <Testimonials />
      <Footer />
    </main>
  )
}

export default App
