import { useState } from "react"
import { anatomyData, type Layer, type AnatomyPart } from "../data/anatomyData"

export default function AnatomyExplorer() {
  const [activeLayer, setActiveLayer] = useState<Layer>("skeletal")
  const [hoveredPart, setHoveredPart] = useState<AnatomyPart | null>(null)
  const [selectedPart, setSelectedPart] = useState<AnatomyPart>(anatomyData[0])

  // Quiz Mode States
  const [quizMode, setQuizMode] = useState(false)
  const [quizTarget, setQuizTarget] = useState<AnatomyPart | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizTotal, setQuizTotal] = useState(0)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)

  const startQuiz = () => {
    setQuizMode(true)
    generateNewTarget(activeLayer)
    setQuizScore(0)
    setQuizTotal(0)
    setFeedbackMessage("Localiza la estructura indicada haciendo clic en el brazo.")
    setLastCorrect(null)
  }

  const generateNewTarget = (layer: Layer) => {
    const layerParts = anatomyData.filter(part => part.layer === layer)
    const randomIndex = Math.floor(Math.random() * layerParts.length)
    setQuizTarget(layerParts[randomIndex])
  }

  const handlePartClick = (part: AnatomyPart) => {
    if (quizMode) {
      if (quizTarget && part.id === quizTarget.id) {
        setQuizScore(prev => prev + 1)
        setLastCorrect(true)
        setFeedbackMessage(`¡Correcto! Identificaste ${part.name} con éxito.`)
      } else {
        setLastCorrect(false)
        setFeedbackMessage(`Incorrecto. Eso era ${part.name}. Buscabas ${quizTarget?.name}.`)
      }
      setQuizTotal(prev => prev + 1)
      
      setTimeout(() => {
        generateNewTarget(activeLayer)
        setLastCorrect(null)
      }, 2000)
    } else {
      setSelectedPart(part)
    }
  }

  return (
    <section id="explorador" className="bg-stone-50 py-12 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
              Mesa de Disección Virtual - Libro de Referencia: Latarjet
            </p>
            <h2 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl tracking-tight">
              Explorador Anatómico Interactivo
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">
            Alterna entre las distintas capas estructurales del miembro superior basadas estrictamente en la Nomenclatura del tratado de Anatomía Humana de Latarjet - Ruiz Liard.
          </p>
        </div>

        {/* Control de Capas */}
        <div className="mb-6 flex flex-wrap gap-2 justify-between items-center border-b border-slate-200 dark:border-[#1d3330] pb-4">
          <div className="flex gap-2">
            {[
              { id: "skeletal", label: "💀 Capa Ósea" },
              { id: "muscular", label: "💪 Capa Muscular" },
              { id: "neurovascular", label: "⚡ Capa Neurovascular" }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveLayer(tab.id as Layer)
                  setQuizMode(false)
                  setHoveredPart(null)
                  const firstOfLayer = anatomyData.find(p => p.layer === tab.id)
                  if (firstOfLayer) setSelectedPart(firstOfLayer)
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  activeLayer === tab.id
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-655 hover:bg-stone-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={quizMode ? () => setQuizMode(false) : startQuiz}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
              quizMode 
                ? "bg-rose-600 text-white hover:bg-rose-700" 
                : "bg-slate-900 text-white hover:bg-emerald-800 dark:bg-emerald-850"
            }`}
          >
            {quizMode ? "Cancelar Autoevaluación" : "🎯 Iniciar Quiz Legendario"}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          
          <div className="relative rounded-2xl border border-slate-200 dark:border-[#1d3330] bg-white p-6 shadow-sm flex items-center justify-center min-h-[450px]">
            
            {quizMode && quizTarget && (
              <div className="absolute top-4 left-4 right-4 bg-slate-900 text-white p-3.5 rounded-xl flex justify-between items-center text-xs shadow-md border border-slate-800 z-10">
                <div>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Identificar estructura:</p>
                  <h4 className="text-sm font-bold mt-0.5">{quizTarget.name}</h4>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold">{quizScore} / {quizTotal}</span>
                  <p className="text-[9px] text-slate-400">Puntuación</p>
                </div>
              </div>
            )}

            {!quizMode && hoveredPart && (
              <div className="absolute top-4 left-4 bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                🔍 {hoveredPart.name}
              </div>
            )}

            <svg 
              className="w-full max-w-[280px] h-auto drop-shadow-sm select-none"
              viewBox="0 0 200 400" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M30 40 C35 15, 120 12, 125 40 C130 70, 160 120, 165 170 C170 210, 120 380, 110 390 C100 400, 75 400, 65 380 C55 350, 45 220, 35 170 C28 120, 25 70, 30 40 Z" 
                fill="#f1f5f9" 
                className="transition-colors dark:fill-[#0d1615]" 
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {activeLayer === "skeletal" && (
                <>
                  {/* Clavicula */}
                  <path 
                    d="M45 42 Q80 25 115 42" 
                    strokeWidth="12" 
                    strokeLinecap="round"
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "clavicula" || selectedPart.id === "clavicula") ? "stroke-emerald-600" : "stroke-slate-300 dark:stroke-slate-700"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[0])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[0])}
                  />
                  {/* Escapula */}
                  <path 
                    d="M36 55 L32 95 L72 90 Z" 
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "escapula" || selectedPart.id === "escapula") ? "fill-emerald-600" : "fill-slate-300 dark:fill-slate-700"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[1])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[1])}
                  />
                  {/* Humero */}
                  <line 
                    x1="80" y1="75" x2="105" y2="190" 
                    strokeWidth="14" 
                    strokeLinecap="round"
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "humero" || selectedPart.id === "humero") ? "stroke-emerald-600" : "stroke-slate-300 dark:stroke-slate-700"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[2])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[2])}
                  />
                  {/* Radio */}
                  <line 
                    x1="108" y1="210" x2="114" y2="340" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "radio" || selectedPart.id === "radio") ? "stroke-emerald-600" : "stroke-slate-300 dark:stroke-slate-700"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[3])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[3])}
                  />
                  {/* Cubito */}
                  <line 
                    x1="93" y1="210" x2="84" y2="340" 
                    strokeWidth="6" 
                    strokeLinecap="round"
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "cubito" || selectedPart.id === "cubito") ? "stroke-emerald-600" : "stroke-slate-300 dark:stroke-slate-700"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[4])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[4])}
                  />
                  {/* Huesos del Carpo Fila Proximal (represented as circular group bottom right) */}
                  <circle 
                    cx="100" cy="358" r="8"
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "carpo" || selectedPart.id === "carpo") ? "fill-emerald-600" : "fill-slate-400 dark:fill-slate-600"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[5])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[5])}
                  />
                  {/* Huesos del Carpo Fila Distal */}
                  <circle 
                    cx="112" cy="365" r="7"
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "carpo_distal" || selectedPart.id === "carpo_distal") ? "fill-emerald-600" : "fill-slate-400 dark:fill-slate-600"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[6])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[6])}
                  />
                </>
              )}

              {activeLayer === "muscular" && (
                <>
                  {/* Deltoides */}
                  <path 
                    d="M38 46 C45 46, 68 85, 68 85 C68 85, 95 80, 105 70 C108 55, 95 44, 95 44 Z" 
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "deltoides" || selectedPart.id === "deltoides") ? "fill-emerald-600" : "fill-slate-400/80 dark:fill-slate-800"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[7])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[7])}
                  />
                  {/* Biceps */}
                  <path 
                    d="M68 95 C75 95, 88 160, 88 175 C82 180, 68 180, 62 165 C58 145, 60 115, 68 95 Z" 
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "biceps" || selectedPart.id === "biceps") ? "fill-emerald-600" : "fill-slate-400/80 dark:fill-slate-800"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[8])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[8])}
                  />
                  {/* Coracobraquial (deep muscle guide line) */}
                  <line 
                    x1="65" y1="80" x2="72" y2="130"
                    strokeWidth="4"
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "coracobraquial" || selectedPart.id === "coracobraquial") ? "stroke-emerald-600" : "stroke-slate-500/50"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[9])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[9])}
                  />
                  {/* Braquial Anterior */}
                  <path 
                    d="M64 150 L84 155 L78 190 Z"
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "braquial" || selectedPart.id === "braquial") ? "fill-emerald-600" : "fill-slate-500/60 dark:fill-slate-800/80"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[10])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[10])}
                  />
                  {/* Triceps */}
                  <path 
                    d="M84 95 C88 95, 114 150, 114 175 C108 180, 100 180, 95 170 C90 160, 82 125, 84 95 Z" 
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "triceps" || selectedPart.id === "triceps") ? "fill-emerald-600" : "fill-slate-400/80 dark:fill-slate-800"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[11])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[11])}
                  />
                  {/* Braquiorradial */}
                  <path 
                    d="M102 210 C108 220, 115 280, 112 320 C105 320, 98 290, 95 245 C94 225, 96 215, 102 210 Z" 
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "braquiorradial" || selectedPart.id === "braquiorradial") ? "fill-emerald-600" : "fill-slate-400/80 dark:fill-slate-800"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[12])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[12])}
                  />
                </>
              )}

              {activeLayer === "neurovascular" && (
                <>
                  {/* Arteria Braquial */}
                  <path 
                    d="M74 72 L94 205 L82 345" 
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    className={`cursor-pointer fill-none transition-all ${
                      (hoveredPart?.id === "arteria_braquial" || selectedPart.id === "arteria_braquial") ? "stroke-red-500" : "stroke-red-800/40"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[13])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[13])}
                  />
                  {/* Arteria Radial */}
                  <path 
                    d="M94 205 Q115 290 112 355" 
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className={`cursor-pointer fill-none transition-all ${
                      (hoveredPart?.id === "arteria_radial" || selectedPart.id === "arteria_radial") ? "stroke-red-500" : "stroke-red-800/40"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[14])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[14])}
                  />
                  {/* Arteria Cubital */}
                  <path 
                    d="M94 205 Q78 280 82 355" 
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className={`cursor-pointer fill-none transition-all ${
                      (hoveredPart?.id === "arteria_cubital" || selectedPart.id === "arteria_cubital") ? "stroke-red-500" : "stroke-red-800/40"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[15])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[15])}
                  />
                  {/* Nervio Radial */}
                  <path 
                    d="M84 72 L112 180 L108 345" 
                    strokeWidth="3"
                    strokeLinecap="round"
                    className={`cursor-pointer fill-none transition-all ${
                      (hoveredPart?.id === "nervio_radial" || selectedPart.id === "nervio_radial") ? "stroke-yellow-400" : "stroke-yellow-700/30"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[16])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[16])}
                  />
                  {/* Nervio Mediano */}
                  <path 
                    d="M70 72 L86 195 L95 345" 
                    strokeWidth="3"
                    strokeLinecap="round"
                    className={`cursor-pointer fill-none transition-all ${
                      (hoveredPart?.id === "nervio_mediano" || selectedPart.id === "nervio_mediano") ? "stroke-yellow-400" : "stroke-yellow-700/30"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[17])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[17])}
                  />
                  {/* Nervio Cubital */}
                  <path 
                    d="M62 72 L68 190 L75 345" 
                    strokeWidth="3"
                    strokeLinecap="round"
                    className={`cursor-pointer fill-none transition-all ${
                      (hoveredPart?.id === "nervio_cubital" || selectedPart.id === "nervio_cubital") ? "stroke-yellow-400" : "stroke-yellow-700/30"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[18])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[18])}
                  />
                  {/* Nervio Musculocutaneo */}
                  <path 
                    d="M70 72 Q60 110 65 145" 
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className={`cursor-pointer fill-none transition-all ${
                      (hoveredPart?.id === "nervio_musculocutaneo" || selectedPart.id === "nervio_musculocutaneo") ? "stroke-yellow-400" : "stroke-yellow-700/30"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[19])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[19])}
                  />
                </>
              )}
            </svg>

            {quizMode && lastCorrect !== null && (
              <div className={`absolute bottom-4 left-4 right-4 p-3 rounded-lg text-xs font-bold text-white text-center shadow-md ${
                lastCorrect ? "bg-emerald-600" : "bg-rose-600"
              }`}>
                {feedbackMessage}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-[#1d3330] bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">Tratado: {selectedPart.sourceBook}</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedPart.name}</h3>
              </div>

              <div className="space-y-3.5 text-xs text-slate-650 text-slate-600 leading-normal">
                <div>
                  <span className="block font-bold text-slate-800">Descripción detallada:</span>
                  <p className="mt-1 text-slate-500">{selectedPart.details}</p>
                </div>

                {selectedPart.origin && (
                  <div>
                    <span className="block font-bold text-slate-800">Origen anatómico:</span>
                    <p className="mt-0.5 text-slate-500">{selectedPart.origin}</p>
                  </div>
                )}

                {selectedPart.insertion && (
                  <div>
                    <span className="block font-bold text-slate-800">Inserción ósea / distal:</span>
                    <p className="mt-0.5 text-slate-500">{selectedPart.insertion}</p>
                  </div>
                )}

                {selectedPart.innervation && (
                  <div>
                    <span className="block font-bold text-slate-800">Inervación principal:</span>
                    <p className="mt-0.5 text-slate-500">{selectedPart.innervation}</p>
                  </div>
                )}

                {selectedPart.irrigation && (
                  <div>
                    <span className="block font-bold text-slate-800">Irrigación principal:</span>
                    <p className="mt-0.5 text-slate-500">{selectedPart.irrigation}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-stone-50/50 p-3 rounded-lg border border-slate-100 text-[10px] text-slate-400 leading-normal">
              📖 <strong>Referencia Latarjet:</strong> Anatomía descriptiva y topográfica del miembro superior.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
