export default function Courses() {
  const whatsappNumber = "5492996232195"
  const message = "Hola! Quiero consultar por las tutorías y los próximos cursos de Kinase Academy."
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <section id="cursos" className="bg-stone-50 py-20 px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm space-y-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-800">
            📚
          </div>
          
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800">Kinase Academy</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Próximamente Cursos</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Estamos diseñando programas interactivos de alta intensidad para el ciclo biomédico basados en la bibliografía oficial de las cátedras.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6 max-w-sm mx-auto space-y-4">
            <p className="text-xs text-slate-650 text-slate-650 text-slate-600 leading-normal">
              ¿Necesitas apoyo particular inmediato o deseas reservar una vacante para las tutorías personalizadas? Contáctanos de forma directa.
            </p>
            
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-855 bg-emerald-800 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-slate-900 shadow-sm"
            >
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.283 3.507 8.491-.002 6.66-5.338 11.997-11.95 11.997-2.008-.002-3.98-.51-5.751-1.474L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.117-2.884-6.978C16.59 1.899 14.116.874 11.48.874c-5.438 0-9.862 4.42-9.866 9.865-.001 1.745.485 3.326 1.449 4.825l-.985 3.597 3.68-.965zm12.355-6.2c-.33-.166-1.957-.965-2.254-1.074-.297-.108-.514-.163-.73.163-.217.327-.84.842-1.03 1.059-.19.217-.38.244-.71.079-.33-.166-1.393-.513-2.656-1.64-1-.893-1.676-1.997-1.873-2.33-.196-.33-.02-.508.145-.671.148-.147.33-.38.495-.57.165-.188.22-.32.33-.535.11-.217.055-.407-.028-.571-.082-.165-.73-1.76-.999-2.414-.263-.638-.527-.55-.73-.56-.197-.01-.424-.012-.65-.012-.226 0-.594.085-.905.424-.311.339-1.187 1.161-1.187 2.83 0 1.67 1.218 3.284 1.388 3.51.17.227 2.4 3.666 5.812 5.14.81.35 1.443.56 1.936.717.814.258 1.556.222 2.141.135.652-.097 1.956-.8 2.232-1.57.276-.77.276-1.43.195-1.569-.081-.14-.297-.223-.628-.39z"/>
              </svg>
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
