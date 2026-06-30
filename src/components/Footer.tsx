export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-400">
          © {new Date().getFullYear()} Kinase Academy. Todos los derechos reservados.
        </div>
        <div className="flex flex-wrap justify-center gap-6 font-semibold text-slate-500">
          <a href="#terminos" className="hover:text-emerald-850 hover:underline">Términos de Servicio</a>
          <a href="#privacidad" className="hover:text-emerald-850 hover:underline">Política de Privacidad</a>
          <a href="#conducta" className="hover:text-emerald-850 hover:underline">Código de Conducta Académica</a>
          <a href="#soporte" className="hover:text-emerald-850 hover:underline">Soporte Técnico & RLS</a>
        </div>
      </div>
    </footer>
  )
}
