import { useState } from "react"

type Layer = "skeletal" | "muscular" | "neurovascular"

type AnatomyPart = {
  id: string
  name: string
  layer: Layer
  details: string
  origin?: string
  insertion?: string
  irrigation?: string
  innervation?: string
}

const anatomyData: AnatomyPart[] = [
  // Skeletal Layer
  {
    id: "clavicula",
    name: "Clavícula",
    layer: "skeletal",
    details: "Hueso largo con forma de 'S' itálica que conecta el miembro superior al tronco.",
    origin: "Extremo esternal se articula con el manubrio del esternón.",
    insertion: "Extremo acromial se articula con el acromion de la escápula.",
  },
  {
    id: "escapula",
    name: "Escápula (Omóplato)",
    layer: "skeletal",
    details: "Hueso plano, triangular, situado en la parte posterior y superior del tórax.",
    origin: "Fosa supraespinosa, infraespinosa y subescapular.",
    insertion: "Se articula con la cabeza del húmero en la cavidad glenoidea.",
  },
  {
    id: "humero",
    name: "Húmero",
    layer: "skeletal",
    details: "Hueso más largo y grande del miembro superior. Se articula con la escápula y los huesos del antebrazo.",
    origin: "Cabeza del húmero, cuello anatómico y quirúrgico, troquíter y troquín.",
    insertion: "Epífisis distal (cóndilo y tróclea) se articula con radio y cúbito.",
  },
  {
    id: "radio",
    name: "Radio",
    layer: "skeletal",
    details: "Hueso lateral del antebrazo (lado del pulgar). Participa activamente en la pronosupinación.",
    origin: "Cabeza del radio se articula con la cúpula radial y el cúbito.",
    insertion: "Apófisis estiloides del radio se articula con los huesos del carpo.",
  },
  {
    id: "cubito",
    name: "Cúbito (Ulna)",
    layer: "skeletal",
    details: "Hueso medial del antebrazo, paralelo al radio.",
    origin: "Olécranon y apófisis coronoides.",
    insertion: "Cabeza del cúbito y apófisis estiloides en la porción distal.",
  },
  // Muscular Layer
  {
    id: "deltoides",
    name: "Músculo Deltoides",
    layer: "muscular",
    details: "Músculo triangular que recubre la articulación del hombro. Principal abductor del brazo.",
    origin: "Clavícula (tercio lateral), acromion y espina de la escápula.",
    insertion: "Tuberosidad deltoidea del húmero (V deltoidea).",
    innervation: "Nervio axilar (C5-C6).",
  },
  {
    id: "biceps",
    name: "Músculo Bíceps Braquial",
    layer: "muscular",
    details: "Músculo de la región anterior del brazo con dos cabezas (larga y corta). Principal flexor y supinador del antebrazo.",
    origin: "Cabeza corta: apófisis coracoides; Cabeza larga: tubérculo supraglenoideo de la escápula.",
    insertion: "Tuberosidad del radio y aponeurosis bicipital.",
    innervation: "Nervio musculocutáneo (C5-C6).",
  },
  {
    id: "triceps",
    name: "Músculo Tríceps Braquial",
    layer: "muscular",
    details: "Único músculo de la región posterior del brazo con tres cabezas. Principal extensor del antebrazo.",
    origin: "Cabeza larga: tubérculo infraglenoideo; Cabeza lateral y medial: caras posteriores del húmero.",
    insertion: "Olécranon del cúbito.",
    innervation: "Nervio radial (C6-C8).",
  },
  {
    id: "braquiorradial",
    name: "Músculo Braquiorradial",
    layer: "muscular",
    details: "Músculo superficial de la región lateral del antebrazo. Flexor del antebrazo sobre el brazo.",
    origin: "Cresta supracondílea lateral del húmero.",
    insertion: "Cara lateral de la apófisis estiloides del radio.",
    innervation: "Nervio radial (C5-C7).",
  },
  // Neurovascular Layer
  {
    id: "arteria_braquial",
    name: "Arteria Braquial (Humeral)",
    layer: "neurovascular",
    details: "Principal tronco arterial del brazo, continuación de la arteria axilar.",
    irrigation: "Irriga toda la musculatura anterior y posterior del brazo mediante ramas profundas.",
  },
  {
    id: "nervio_radial",
    name: "Nervio Radial",
    layer: "neurovascular",
    details: "Nervio del fascículo posterior del plexo braquial. Inerva los extensores del brazo y antebrazo.",
    innervation: "Provee inervación motora al tríceps, braquiorradial y extensores del carpo.",
  },
  {
    id: "nervio_mediano",
    name: "Nervio Mediano",
    layer: "neurovascular",
    details: "Nervio formado por la unión de fascículos lateral y medial del plexo braquial. Pasa por el túnel carpiano.",
    innervation: "Inerva los músculos pronadores y la mayoría de los flexores del compartimento anterior del antebrazo.",
  },
  {
    id: "nervio_cubital",
    name: "Nervio Cubital (Ulnar)",
    layer: "neurovascular",
    details: "Nervio que transcurre medialmente por el canal epitrócleo-olecraniano (codo).",
    innervation: "Inerva músculos intrínsecos de la mano y flexor común profundo de los dedos.",
  }
]

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
      
      // Delay next question slightly
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
              Mesa de Disección Virtual
            </p>
            <h2 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl tracking-tight">
              Explorador Anatómico Interactivo
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">
            Alterna entre las distintas capas estructurales del miembro superior. Coloca el cursor para ver inserciones y vasos, o activa el modo de autoevaluación para simular una mesa de examen práctico.
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
                  // Select first item of new layer as default
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

        {/* Main Canvas and Details Layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          
          {/* Interactive SVG Canvas */}
          <div className="relative rounded-2xl border border-slate-200 dark:border-[#1d3330] bg-white p-6 shadow-sm flex items-center justify-center min-h-[450px]">
            
            {/* Banner status info in quiz mode */}
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

            {/* Hover card status indicator */}
            {!quizMode && hoveredPart && (
              <div className="absolute top-4 left-4 bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                🔍 {hoveredPart.name}
              </div>
            )}

            {/* Vector Arm Drawing */}
            <svg 
              className="w-full max-w-[280px] h-auto drop-shadow-sm select-none"
              viewBox="0 0 200 400" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer arm skin background guide path */}
              <path 
                d="M30 40 C35 15, 120 12, 125 40 C130 70, 160 120, 165 170 C170 210, 120 380, 110 390 C100 400, 75 400, 65 380 C55 350, 45 220, 35 170 C28 120, 25 70, 30 40 Z" 
                fill="#f1f5f9" 
                className="transition-colors dark:fill-[#0d1615]" 
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Dynamic SVGs based on layer */}
              {activeLayer === "skeletal" && (
                <>
                  {/* Clavicula path */}
                  <path 
                    d="M45 42 Q80 25 115 42" 
                    strokeWidth="12" 
                    strokeLinecap="round"
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "clavicula" || selectedPart.id === "clavicula") ? "stroke-emerald-600" : "stroke-slate-350 stroke-slate-300 dark:stroke-slate-700"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[0])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[0])}
                  />
                  {/* Escapula */}
                  <path 
                    d="M36 55 L32 95 L72 90 Z" 
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "escapula" || selectedPart.id === "escapula") ? "fill-emerald-600" : "fill-slate-350 fill-slate-300 dark:fill-slate-700"
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
                      (hoveredPart?.id === "humero" || selectedPart.id === "humero") ? "stroke-emerald-600" : "stroke-slate-350 stroke-slate-300 dark:stroke-slate-700"
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
                      (hoveredPart?.id === "radio" || selectedPart.id === "radio") ? "stroke-emerald-600" : "stroke-slate-350 stroke-slate-300 dark:stroke-slate-700"
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
                      (hoveredPart?.id === "cubito" || selectedPart.id === "cubito") ? "stroke-emerald-600" : "stroke-slate-350 stroke-slate-300 dark:stroke-slate-700"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[4])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[4])}
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
                    onMouseEnter={() => setHoveredPart(anatomyData[5])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[5])}
                  />
                  {/* Biceps */}
                  <path 
                    d="M68 95 C75 95, 88 160, 88 175 C82 180, 68 180, 62 165 C58 145, 60 115, 68 95 Z" 
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "biceps" || selectedPart.id === "biceps") ? "fill-emerald-600" : "fill-slate-400/80 dark:fill-slate-800"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[6])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[6])}
                  />
                  {/* Triceps */}
                  <path 
                    d="M84 95 C88 95, 114 150, 114 175 C108 180, 100 180, 95 170 C90 160, 82 125, 84 95 Z" 
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "triceps" || selectedPart.id === "triceps") ? "fill-emerald-600" : "fill-slate-400/80 dark:fill-slate-800"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[7])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[7])}
                  />
                  {/* Braquiorradial */}
                  <path 
                    d="M102 210 C108 220, 115 280, 112 320 C105 320, 98 290, 95 245 C94 225, 96 215, 102 210 Z" 
                    className={`cursor-pointer transition-all ${
                      (hoveredPart?.id === "braquiorradial" || selectedPart.id === "braquiorradial") ? "fill-emerald-600" : "fill-slate-400/80 dark:fill-slate-800"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[8])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[8])}
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
                    onMouseEnter={() => setHoveredPart(anatomyData[9])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[9])}
                  />
                  {/* Nervio Radial */}
                  <path 
                    d="M84 72 L112 180 L108 345" 
                    strokeWidth="3"
                    strokeLinecap="round"
                    className={`cursor-pointer fill-none transition-all ${
                      (hoveredPart?.id === "nervio_radial" || selectedPart.id === "nervio_radial") ? "stroke-yellow-400" : "stroke-yellow-700/30"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[10])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[10])}
                  />
                  {/* Nervio Mediano */}
                  <path 
                    d="M70 72 L86 195 L95 345" 
                    strokeWidth="3"
                    strokeLinecap="round"
                    className={`cursor-pointer fill-none transition-all ${
                      (hoveredPart?.id === "nervio_mediano" || selectedPart.id === "nervio_mediano") ? "stroke-yellow-400" : "stroke-yellow-700/30"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[11])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[11])}
                  />
                  {/* Nervio Cubital */}
                  <path 
                    d="M62 72 L68 190 L75 345" 
                    strokeWidth="3"
                    strokeLinecap="round"
                    className={`cursor-pointer fill-none transition-all ${
                      (hoveredPart?.id === "nervio_cubital" || selectedPart.id === "nervio_cubital") ? "stroke-yellow-400" : "stroke-yellow-700/30"
                    }`}
                    onMouseEnter={() => setHoveredPart(anatomyData[12])}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(anatomyData[12])}
                  />
                </>
              )}
            </svg>

            {/* Quiz visual indicator for validation */}
            {quizMode && lastCorrect !== null && (
              <div className={`absolute bottom-4 left-4 right-4 p-3 rounded-lg text-xs font-bold text-white text-center shadow-md ${
                lastCorrect ? "bg-emerald-600" : "bg-rose-600"
              }`}>
                {feedbackMessage}
              </div>
            )}
          </div>

          {/* Technical anatomy info side-panel */}
          <aside className="rounded-xl border border-slate-200 dark:border-[#1d3330] bg-white p-5 shadow-sm space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Capa seleccionada</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedPart.name}</h3>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 leading-normal">
              <div>
                <span className="block font-bold text-slate-800">Descripción técnica:</span>
                <p className="mt-1 text-slate-500">{selectedPart.details}</p>
              </div>

              {selectedPart.origin && (
                <div>
                  <span className="block font-bold text-slate-800">Orígenes / Inserción proximal:</span>
                  <p className="mt-0.5 text-slate-500">{selectedPart.origin}</p>
                </div>
              )}

              {selectedPart.insertion && (
                <div>
                  <span className="block font-bold text-slate-800">Inserciones / Inserción distal:</span>
                  <p className="mt-0.5 text-slate-500">{selectedPart.insertion}</p>
                </div>
              )}

              {selectedPart.innervation && (
                <div>
                  <span className="block font-bold text-slate-800">Inervación:</span>
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

            <div className="bg-stone-50/50 p-3 rounded-lg border border-slate-100 text-[10px] text-slate-400 leading-normal">
              💡 <strong>Tip de Anatomía:</strong> Recuerda que en los exámenes prácticos (gymkanas) suelen colocar alfileres de distintos colores para diferenciar arterias de nervios del canal bicipital.
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
