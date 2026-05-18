import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Features from './sections/Features'
import TestSection from './sections/TestSection'
import About from './sections/About'
import Courses from './sections/Courses'
import Testimonials from './sections/Testimonials'
import Footer from './components/Footer'

function App() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <TestSection />
      <About />
      <Courses />
      <Testimonials />
      <Footer />
    </main>
  )
}

export default App