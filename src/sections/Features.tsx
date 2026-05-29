export default function FooterInfo() {
  return (
    <section className="bg-white px-6 py-10">
      <div className="mx-auto max-w-7xl border-t border-dashed border-slate-300 pt-8">

        <div className="grid gap-16 lg:grid-cols-3 text-sm text-slate-700">

          {/* SOPORTE */}
          <div className="space-y-8">

            <div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">
                Soporte
              </h3>

              <a
                href="mailto:Scrolllabti@gmail.com"
                className="block hover:text-emerald-700 transition"
              >
                Scrolllabti@gmail.com
              </a>

              <p className="mt-1 text-slate-500">
                Asunto: Soporte KINASE
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">
                Colaboraciones
              </h3>

              <a
                href="mailto:Scrolllabti@gmail.com"
                className="block hover:text-emerald-700 transition"
              >
                Scrolllabti@gmail.com
              </a>

              <p className="mt-1 text-slate-500">
                Asunto: Colaboraciones KINASE
              </p>

              <p className="mt-3 max-w-md leading-6 text-slate-600">
                Ideal para quienes quieren contribuir y dejar su huella en KINASE.
              </p>
            </div>

          </div>

          {/* DOCUMENTOS */}
          <div className="space-y-5">

            <h3 className="text-lg font-bold text-slate-900">
              Documentos
            </h3>

            <a
              href="/docs/preguntas-frecuentes.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-emerald-700 transition"
            >
              Preguntas frecuentes
            </a>

            <a
              href="/docs/documentacion.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-emerald-700 transition"
            >
              Documentación
            </a>

            <a
              href="/docs/politicas-kinase.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-emerald-700 transition"
            >
              Políticas KINASE
            </a>

          </div>

          {/* CONTACTOS */}
          <div className="space-y-5 lg:text-right">

            <h3 className="text-lg font-bold text-slate-900">
              Contactos
            </h3>

            <a
              href="https://instagram.com/scrolllab"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-emerald-700 transition"
            >
              Instagram — @Tizigiacomassi
            </a>

            <a
              href="https://instagram.com/kinase"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-emerald-700 transition"
            >
              Instagram — 
            </a>

            <a
              href="tel:+5492990000000"
              className="block hover:text-emerald-700 transition"
            >
              
            </a>

            <a
              href="tel:+5492991111111"
              className="block hover:text-emerald-700 transition"
            >
              
            </a>

          </div>

        </div>
      </div>
    </section>
  )
}