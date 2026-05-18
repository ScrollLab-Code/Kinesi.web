export default function Navbar() {
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-zinc-100 z-50">
      
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        <h1 className="text-2xl font-bold text-zinc-900">
          KINASE
        </h1>

        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-600">
          
          <a href="#inicio" className="hover:text-zinc-900 transition">
            Inicio
          </a>

          <a href="#diagnostico" className="hover:text-zinc-900 transition">
            Diagnóstico
          </a>

          <a href="#cursos" className="hover:text-zinc-900 transition">
            Cursos
          </a>

          <a href="#contacto" className="hover:text-zinc-900 transition">
            Contacto
          </a>

        </nav>

        <a
          href="#diagnostico"
          className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:scale-105 transition"
        >
          Empezar
        </a>

      </div>

    </header>
  )
}