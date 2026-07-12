import { useState, useEffect } from "react"
import { motion } from "framer-motion"

type Flashcard = {
  id: string
  question: string
  answer: string
  category: "Anatomía" | "Histología" | "Fisiología" | "General"
  difficulty?: "easy" | "medium" | "hard"
}

export default function Flashcards() {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    try {
      const saved = localStorage.getItem("kinase_student_flashcards")
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn("Could not load flashcards from localStorage", e)
    }

    return [
      {
        id: "1",
        question: "¿Qué nervio pasa por el canal de Guyon en la muñeca?",
        answer: "El nervio cubital (junto con la arteria cubital). El canal está delimitado por el pisiforme, el gancho del ganchoso y el ligamento carpiano palmar.",
        category: "Anatomía"
      },
      {
        id: "2",
        question: "¿Cuáles son las 3 capas que forman la barrera de filtración glomerular renal?",
        answer: "1) El endotelio fenestrado de los capilares glomerulares. 2) La membrana basal glomerular (lámina basal). 3) Los pedicelos de los podocitos (capa epitelial visceral) con sus hendiduras de filtración.",
        category: "Fisiología"
      },
      {
        id: "3",
        question: "¿Cuál es el principal tipo de colágeno presente en el tejido óseo?",
        answer: "Colágeno Tipo I (representa el 90% de la matriz orgánica del hueso, aportando resistencia a la tensión).",
        category: "Histología"
      },
      {
        id: "4",
        question: "¿Qué arteria acompaña al nervio radial en el espacio axilar inferior (trígono humerotricipital)?",
        answer: "La arteria colateral radial / arteria braquial profunda (colateral humeral externa).",
        category: "Anatomía"
      },
      {
        id: "5",
        question: "¿Qué estructura anatómica forma el marcapasos fisiológico del corazón?",
        answer: "El nodo sinusal (sinoauricular o de Keith-Flack), localizado en la pared posterior de la aurícula derecha, cerca de la desembocadura de la vena cava superior.",
        category: "Fisiología"
      }
    ]
  })

  const [currentIdx, setCurrentIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [newCategory, setNewCategory] = useState<Flashcard["category"]>("General")

  useEffect(() => {
    try {
      localStorage.setItem("kinase_student_flashcards", JSON.stringify(cards))
    } catch (e) {
      console.error(e)
    }
  }, [cards])

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim() || !newAnswer.trim()) return

    const newCard: Flashcard = {
      id: Math.random().toString(36).substring(2, 9),
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: newCategory
    }

    setCards(prev => [...prev, newCard])
    setNewQuestion("")
    setNewAnswer("")
    setNewCategory("General")
    setCurrentIdx(cards.length) // Go to new card
    setIsFlipped(false)
  }

  const handleDeleteCard = (id: string) => {
    if (cards.length <= 1) return
    setCards(prev => prev.filter(c => c.id !== id))
    setCurrentIdx(0)
    setIsFlipped(false)
  }

  const handleDifficulty = (difficulty: Flashcard["difficulty"]) => {
    setCards(prev => prev.map((c, idx) => idx === currentIdx ? { ...c, difficulty } : c))
    // Move to next card after difficulty rating
    setTimeout(() => {
      setIsFlipped(false)
      setTimeout(() => {
        setCurrentIdx(prev => (prev + 1) % cards.length)
      }, 150)
    }, 150)
  }

  const currentCard = cards[currentIdx]

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-[#1d3330] pb-2">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          🧠 Flashcards Clínicos VIP
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Repasa mnemotecnias, datos anatómicos y preguntas clave con repetición espaciada.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
        {/* Visualizador de Tarjetas */}
        <div className="space-y-4 flex flex-col items-center">
          
          {/* Card Container with 3D Flip */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-lg h-[300px] cursor-pointer group"
            style={{ perspective: "1000px" }}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full relative duration-500 rounded-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* LADO FRONTAL (Pregunta) */}
              <div 
                className="absolute inset-0 w-full h-full rounded-2xl border-2 border-amber-500/20 bg-white dark:bg-[#0c1312] p-6 flex flex-col justify-between items-center shadow-lg shadow-slate-100 dark:shadow-none"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                    {currentCard?.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Card {currentIdx + 1} of {cards.length}
                  </span>
                </div>

                <div className="text-center px-4">
                  <h4 className="text-sm md:text-md font-bold text-slate-800 dark:text-white leading-relaxed">
                    {currentCard?.question}
                  </h4>
                </div>

                <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 opacity-60 animate-pulse">
                  🖱 Click para voltear tarjeta
                </span>
              </div>

              {/* LADO POSTERIOR (Respuesta) */}
              <div 
                className="absolute inset-0 w-full h-full rounded-2xl border-2 border-emerald-500/20 bg-emerald-50/10 dark:bg-[#0a2320] p-6 flex flex-col justify-between items-center shadow-lg shadow-slate-100 dark:shadow-none"
                style={{ 
                  backfaceVisibility: "hidden", 
                  transform: "rotateY(180deg)" 
                }}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                    Respuesta
                  </span>
                  {currentCard?.difficulty && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Dificultad: {currentCard.difficulty}
                    </span>
                  )}
                </div>

                <div className="text-center px-4 overflow-y-auto max-h-[160px] custom-scrollbar">
                  <p className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                    {currentCard?.answer}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDifficulty("hard") }}
                    className="rounded bg-rose-500 hover:bg-rose-600 text-white font-bold text-[9px] px-2.5 py-1 uppercase"
                  >
                    🔴 Difícil
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDifficulty("medium") }}
                    className="rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-[9px] px-2.5 py-1 uppercase"
                  >
                    🟡 Medio
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDifficulty("easy") }}
                    className="rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[9px] px-2.5 py-1 uppercase"
                  >
                    🟢 Fácil
                  </button>
                </div>
              </div>

            </motion.div>
          </div>

          {/* Navegación manual y delete */}
          <div className="flex gap-3 items-center">
            <button
              onClick={() => { setIsFlipped(false); setCurrentIdx(prev => (prev - 1 + cards.length) % cards.length) }}
              className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-slate-900 border border-slate-200 dark:border-[#1d3330]"
            >
              ←
            </button>
            <button
              onClick={() => handleDeleteCard(currentCard.id)}
              disabled={cards.length <= 1}
              className="text-xs text-rose-600 hover:underline disabled:opacity-40"
            >
              Eliminar esta tarjeta
            </button>
            <button
              onClick={() => { setIsFlipped(false); setCurrentIdx(prev => (prev + 1) % cards.length) }}
              className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-slate-900 border border-slate-200 dark:border-[#1d3330]"
            >
              →
            </button>
          </div>
        </div>

        {/* Panel para Crear Tarjetas */}
        <div className="glass-card rounded-2xl p-5 border border-amber-500/20 clinical-shadow space-y-4">
          <h4 className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider">
            Crear Flashcard VIP
          </h4>

          <form onSubmit={handleAddCard} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Materia/Categoría</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as Flashcard["category"])}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500"
              >
                <option value="General">📂 General</option>
                <option value="Anatomía">💀 Anatomía</option>
                <option value="Histología">🔬 Histología</option>
                <option value="Fisiología">⚡ Fisiología</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pregunta / Concepto</label>
              <textarea
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                placeholder="ej. ¿Qué arterias se originan en el arco aórtico?"
                rows={2}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Respuesta</label>
              <textarea
                value={newAnswer}
                onChange={e => setNewAnswer(e.target.value)}
                placeholder="ej. Tronco braquiocefálico, arteria carótida común izquierda y arteria subclavia izquierda."
                rows={3}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 transition"
            >
              + Agregar Tarjeta
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
