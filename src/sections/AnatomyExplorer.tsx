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
  sourceBook?: string
}

const anatomyData: AnatomyPart[] = [
  // Skeletal Layer (Base: Latarjet - Ruiz Liard)
  {
    id: "clavicula",
    name: "Clavícula",
    layer: "skeletal",
    details: "Hueso largo en forma de 'S' itálica que se extiende horizontalmente entre el esternón y la escápula. Presenta dos caras (superior e inferior), dos bordes (anterior y posterior) y dos extremos (esternal y acromial).",
    origin: "Extremo esternal se articula con la escotadura clavicular del esternón y el primer cartílago costal.",
    insertion: "Extremo acromial se articula con la carilla articular del acromion.",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "escapula",
    name: "Escápula (Omóplato)",
    layer: "skeletal",
    details: "Hueso plano y triangular localizado en la parte posterior y superior del tórax, a la altura de las primeras 7 costillas. Presenta una espina posterior que termina en el acromion y una apófisis coracoides anterior.",
    origin: "Fosa subescapular (cara anterior), fosa supraespinosa e infraespinosa (cara posterior).",
    insertion: "Cavidad glenoidea recibe la cabeza del húmero formando la articulación glenohumeral.",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "humero",
    name: "Húmero",
    layer: "skeletal",
    details: "Hueso largo de la región del brazo. Su epífisis proximal presenta la cabeza humeral, los tubérculos mayor (troquiter) y menor (troquín) separados por el surco intertubercular. Su diáfisis contiene el canal del nervio radial.",
    origin: "Cabezas y cuellos anatómico y quirúrgico en la epífisis proximal.",
    insertion: "La tróclea humeral distal se articula con el cúbito y el cóndilo (capítulo) con el radio.",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "radio",
    name: "Radio",
    layer: "skeletal",
    details: "Hueso largo lateral del antebrazo. Presenta en su epífisis proximal la cabeza del radio (con la cúpula articular) y el cuello. Su epífisis distal es ancha y presenta la apófisis estiloides lateral.",
    origin: "Cabeza del radio se articula con la escotadura radial del cúbito y el capítulo humeral.",
    insertion: "Apófisis estiloides del radio sirve de inserción al ligamento colateral radial de la muñeca.",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "cubito",
    name: "Cúbito (Ulna)",
    layer: "skeletal",
    details: "Hueso largo y medial del antebrazo, paralelo al radio. Su epífisis proximal presenta la escotadura troclear delimitada por el olécranon superior y la apófisis coronoides inferior.",
    origin: "Cara anterior de la apófisis coronoides y el olécranon.",
    insertion: "Epífisis distal presenta la cabeza del cúbito y la apófisis estiloides medial.",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "carpo",
    name: "Huesos del Carpo (Fila Proximal)",
    layer: "skeletal",
    details: "Grupo de 4 huesos cortos que componen la fila proximal del carpo de lateral a medial: Escafoides, Semilunar, Piramidal y Pisiforme. Forman la base ósea de la articulación radiocarpiana.",
    origin: "El escafoides y semilunar se articulan directamente con la carilla articular inferior del radio.",
    insertion: "El pisiforme presta inserción al tendón del músculo flexor cubital del carpo (cubital anterior).",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "carpo_distal",
    name: "Huesos del Carpo (Fila Distal)",
    layer: "skeletal",
    details: "Grupo de 4 huesos cortos que componen la fila distal de lateral a medial: Trapecio, Trapezoide, Grande (Capitato) y Ganchoso (Hamato). Articulan con las bases de los metacarpianos.",
    origin: "El trapecio presenta una articulación por encaje recíproco (silla de montar) con el primer metacarpiano (pulgar).",
    insertion: "El gancho del hueso ganchoso delimita el canal carpiano medialmente.",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  // Muscular Layer (Base: Latarjet - Ruiz Liard)
  {
    id: "deltoides",
    name: "Músculo Deltoides",
    layer: "muscular",
    details: "Músculo plano y grueso de forma semiconoidea que recubre la cara lateral de la articulación del hombro. Es el principal abductor del brazo hasta los 90 grados.",
    origin: "Borde anterior del tercio lateral de la clavícula, acromion y espina de la escápula.",
    insertion: "Tuberosidad deltoidea (V deltoidea) en la cara lateral del húmero.",
    innervation: "Nervio axilar (C5-C6) procedente del fascículo posterior.",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "biceps",
    name: "Músculo Bíceps Braquial",
    layer: "muscular",
    details: "Músculo biarticular del compartimento anterior del brazo. Consta de dos cabezas proximales. Es el flexor del antebrazo y un potente supinador cuando el codo está en flexión.",
    origin: "Cabeza corta: Apófisis coracoides de la escápula. Cabeza larga: Tubérculo supraglenoideo de la escápula (intracapsular).",
    insertion: "Tuberosidad del radio (tuberosidad bicipital) mediante un tendón fuerte.",
    innervation: "Nervio musculocutáneo (C5-C6).",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "coracobraquial",
    name: "Músculo Coracobraquial",
    layer: "muscular",
    details: "Músculo alargado del compartimento anterior del brazo, atravesado oblicuamente por el nervio musculocutáneo (perforado de Casserius).",
    origin: "Apófisis coracoides de la escápula en tendón común con la cabeza corta del bíceps.",
    insertion: "Tercio medio de la cara medial de la diáfisis humeral.",
    innervation: "Nervio musculocutáneo (C5-C6).",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "braquial",
    name: "Músculo Braquial (Anterior)",
    layer: "muscular",
    details: "Músculo ancho y aplanado situado por detrás del bíceps braquial. Es el flexor más potente del antebrazo en la articulación del codo.",
    origin: "Dos tercios distales de las caras anterior, medial y lateral del húmero.",
    insertion: "Tuberosidad del cúbito y cara anterior de la apófisis coronoides.",
    innervation: "Nervio musculocutáneo (C5-C6).",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "triceps",
    name: "Músculo Tríceps Braquial",
    layer: "muscular",
    details: "Único músculo del compartimento posterior del brazo. Consta de tres cabezas (larga, lateral y medial). Es el principal extensor del antebrazo en la articulación del codo.",
    origin: "Cabeza larga: Tubérculo infraglenoideo de la escápula. Cabeza lateral: Cara posterior del húmero (arriba del surco radial). Cabeza medial: Cara posterior del húmero (debajo del surco radial).",
    insertion: "Cara superior del olécranon del cúbito.",
    innervation: "Nervio radial (C6-C8).",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "braquiorradial",
    name: "Músculo Braquiorradial (Supinador Largo)",
    layer: "muscular",
    details: "Músculo superficial de la región lateral del antebrazo. Forma el límite lateral de la fosa del codo y del canal del pulso.",
    origin: "Borde supracondíleo lateral del húmero.",
    insertion: "Base de la apófisis estiloides del radio.",
    innervation: "Nervio radial (C5-C6).",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  // Neurovascular Layer (Base: Latarjet - Ruiz Liard)
  {
    id: "arteria_braquial",
    name: "Arteria Braquial",
    layer: "neurovascular",
    details: "Continuación de la arteria axilar por debajo del borde inferior del músculo redondo mayor. Discurre en el conducto braquial (conducto de Cruveilhier) medial al húmero.",
    irrigation: "Ramas colaterales: Arteria colateral cubital superior e inferior, y arteria braquial profunda (colateral humeral externa).",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "arteria_radial",
    name: "Arteria Radial",
    layer: "neurovascular",
    details: "Rama de bifurcación lateral de la arteria braquial en la fosa del codo. En la muñeca, discurre por el canal del pulso antes de rodear el carpo hacia la tabaquera anatómica.",
    irrigation: "Irriga el compartimento lateral del antebrazo y forma el arco palmar profundo al unirse con la rama palmar profunda cubital.",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "arteria_cubital",
    name: "Arteria Cubital (Ulnar)",
    layer: "neurovascular",
    details: "Rama de bifurcación medial de la arteria braquial en la fosa del codo. Acompaña al nervio cubital en el conducto cubital (conducto de Guyon) en la muñeca.",
    irrigation: "Origina las arterias interóseas y forma el arco palmar superficial.",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "nervio_radial",
    name: "Nervio Radial",
    layer: "neurovascular",
    details: "Rama terminal del fascículo posterior del plexo braquial. Pasa por el espacio axilar inferior (trígono humerotricipital o de Avelino Gutiérrez) hacia el canal del nervio radial en el húmero.",
    innervation: "Inervación motora: Compartimento posterior del brazo (tríceps) y del antebrazo (extensores/supinadores).",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "nervio_mediano",
    name: "Nervio Mediano",
    layer: "neurovascular",
    details: "Origen por dos raíces (medial y lateral) en el plexo braquial. Desciende por el conducto braquial y la fosa del codo medial a la arteria braquial, ingresando al antebrazo por el músculo pronador redondo.",
    innervation: "Inerva los músculos flexores del antebrazo y los pronadores, excepto el flexor cubital del carpo.",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "nervio_cubital",
    name: "Nervio Cubital",
    layer: "neurovascular",
    details: "Rama terminal del fascículo medial del plexo braquial. Desciende por la región medial del brazo, perfora el tabique intermuscular y pasa por el surco del nervio cubital (canal epitrócleo-olecraniano) en el codo.",
    innervation: "Inerva la mayor parte de la musculatura intrínseca de la mano y el músculo flexor cubital del carpo en el antebrazo.",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
  },
  {
    id: "nervio_musculocutaneo",
    name: "Nervio Musculocutáneo",
    layer: "neurovascular",
    details: "Rama terminal del fascículo lateral del plexo braquial. Perfora el músculo coracobraquial (perforado de Casserius) y discurre entre el bíceps y el braquial.",
    innervation: "Inervación motora para los flexores anteriores del brazo (bíceps, coracobraquial y braquial).",
    sourceBook: "Latarjet - Ruiz Liard, Tomo 1"
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
