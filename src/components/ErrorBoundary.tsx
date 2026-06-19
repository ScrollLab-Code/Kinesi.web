import { Component, type ErrorInfo, type ReactNode } from "react"

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-stone-50 px-6 py-24 text-slate-950">
          <div className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white p-10 shadow-lg">
            <h1 className="mb-4 text-3xl font-black text-rose-700">Ocurrió un error</h1>
            <p className="mb-6 text-lg leading-8 text-slate-700">
              Algo falló al cargar la aplicación. Actualizá la página o volvé en unos minutos.
            </p>
            <pre className="whitespace-pre-wrap rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
              {this.state.error?.message}
            </pre>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
