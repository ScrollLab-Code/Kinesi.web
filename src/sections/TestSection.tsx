import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"

// Reemplazá con el número al que van a llegar las consultas (ej: 54 9 299 + tu número)
const WHATSAPP_NUMBER = "5492996232195"

// Cada opción tiene un peso: 0 (peor) a 3 (mejor)
const questions = [
  // BLOQUE 1: ORGANIZACIÓN
  {
    block: "Organización",
    question: "¿Tenés un plan o cronograma semanal para estudiar?",
    options: [
      { text: "No, dependo de las ganas que tenga o si estoy apurado", score: 0 },
      { text: "Intento armar uno, pero me desorganizo muy rápido", score: 1 },
      { text: "Tengo una idea general y la cumplo a medias", score: 2 },
      { text: "Sí, tengo días y horarios fijos para cada materia", score: 3 },
    ],
  },
  {
    block: "Organización",
    question: "¿Cómo organizás tus apuntes y materiales de estudio?",
    options: [
      { text: "Es un caos; tengo todo mezclado o no sé dónde están las cosas", score: 0 },
      { text: "Guardo el material, pero me cuesta encontrar lo que busco", score: 1 },
      { text: "Tengo carpetas separadas, aunque a veces me atraso en ordenarlas", score: 2 },
      { text: "Todo está perfectamente ordenado por materia, fecha y tema", score: 3 },
    ],
  },
  {
    block: "Organización",
    question: "¿Con cuánta anticipación empezás a prepararte para un parcial?",
    options: [
      { text: "El día anterior o la noche antes del examen", score: 0 },
      { text: "Dos o tres días antes", score: 1 },
      { text: "Una semana antes", score: 2 },
      { text: "Más de dos semanas antes, repasando de a poco", score: 3 },
    ],
  },

  // BLOQUE 2: CONCENTRACIÓN Y HÁBITOS
  {
    block: "Concentración",
    question: "¿Cuánto tiempo lográs estudiar súper concentrado sin distraerte?",
    options: [
      { text: "Menos de 10 minutos seguidos", score: 0 },
      { text: "Entre 10 y 20 minutos antes de perder el hilo", score: 1 },
      { text: "Entre 20 y 45 minutos a buen ritmo", score: 2 },
      { text: "Más de 45 minutos de corrido, súper enfocado", score: 3 },
    ],
  },
  {
    block: "Concentración",
    question: "¿Qué hacés con el celular mientras estudiás?",
    options: [
      { text: "Lo tengo al lado y respondo cada notificación que llega", score: 0 },
      { text: "Intento no mirarlo, pero igual caigo a cada rato", score: 1 },
      { text: "Lo pongo en silencio, pero lo chequeo de vez en cuando", score: 2 },
      { text: "Lo pongo en modo avión o lo dejo en otra habitación", score: 3 },
    ],
  },
  {
    block: "Concentración",
    question: "¿Cómo es el lugar donde te sentás a estudiar?",
    options: [
      { text: "Con mucho ruido, tele prendida o gente pasando constantemente", score: 0 },
      { text: "Depende del día, a veces es tranquilo y a veces hay distracciones", score: 1 },
      { text: "Suele ser tranquilo, aunque a veces me interrumpen", score: 2 },
      { text: "Es mi espacio exclusivo, preparado para estudiar sin interrupciones", score: 3 },
    ],
  },

  // BLOQUE 3: COMPRENSIÓN Y TÉCNICA
  {
    block: "Comprensión",
    question: "¿Qué hacés cuando tenés que estudiar un tema nuevo?",
    options: [
      { text: "Solo lo leo por encima y espero acordarme", score: 0 },
      { text: "Lo leo una y otra vez hasta que se me pegue algo", score: 1 },
      { text: "Leo, marco lo importante y hago un resumen", score: 2 },
      { text: "Leo, lo explico con mis propias palabras y lo conecto con otros temas", score: 3 },
    ],
  },
  {
    block: "Comprensión",
    question: "¿Qué hacés cuando te topás con un texto o ejercicio muy difícil?",
    options: [
      { text: "Lo salto y paso a otra cosa", score: 0 },
      { text: "Lo leo mil veces y me frustro porque sigo sin entender", score: 1 },
      { text: "Busco algo en internet o le pregunto a un amigo por encima", score: 2 },
      { text: "Busco en varios libros, veo videos y le pregunto al profesor", score: 3 },
    ],
  },
  {
    block: "Comprensión",
    question: "¿Le dedicás tiempo a hacer ejercicios o solo leés la teoría?",
    options: [
      { text: "Casi nunca hago ejercicios, solo me enfoco en leer", score: 0 },
      { text: "Hago la práctica solo si el profesor la pide de tarea", score: 1 },
      { text: "Hago algunos ejercicios, pero me concentro más en la teoría", score: 2 },
      { text: "La práctica es fundamental en mi día a día, hago muchos ejercicios", score: 3 },
    ],
  },

  // BLOQUE 4: MEMORIA Y REPASO
  {
    block: "Repaso",
    question: "¿Cada cuánto volvés a repasar los temas que ya estudiaste?",
    options: [
      { text: "Nunca, lo leo una vez y no lo vuelvo a tocar hasta el parcial", score: 0 },
      { text: "Me pego una panzada de estudio justo la noche antes del examen", score: 1 },
      { text: "Repaso los temas una o dos veces por semana", score: 2 },
      { text: "Repaso un poco todos los días para no olvidarme de nada", score: 3 },
    ],
  },
  {
    block: "Repaso",
    question: "¿Cómo comprobás si realmente aprendiste un tema antes de rendir?",
    options: [
      { text: "Siento que lo sé porque lo leí y lo entendí en el momento", score: 0 },
      { text: "Me hago preguntas fáciles mentalmente", score: 1 },
      { text: "Resuelvo las guías de la materia y veo cómo me va", score: 2 },
      { text: "Me tomo exámenes de prueba, cierro el libro y lo explico de cero", score: 3 },
    ],
  },

  // BLOQUE 5: GESTIÓN EMOCIONAL Y EXÁMENES
  {
    block: "Emociones",
    question: "¿Cómo te sentís los días previos a un examen importante?",
    options: [
      { text: "Me bloqueo, no puedo dormir de los nervios e incluso me duele la panza/cabeza", score: 0 },
      { text: "Muy ansioso, me cuesta mucho concentrarme por el miedo a desaprobar", score: 1 },
      { text: "Un poco nervioso, pero logro controlarlo y sigo estudiando", score: 2 },
      { text: "Tranquilo y seguro, porque sé que me preparé bien", score: 3 },
    ],
  },
  {
    block: "Emociones",
    question: "Si te va mal en un parcial (desaprobás), ¿cómo reaccionás?",
    options: [
      { text: "Siento que no sirvo para esta carrera y dejo de estudiar por unos días", score: 0 },
      { text: "Le echo la culpa al profe o al examen, y me quedo enojado/frustrado", score: 1 },
      { text: "Me bajoneo un poco, pero intento mejorar para la próxima", score: 2 },
      { text: "Analizo mi examen para ver exactamente en qué fallé y cambio mi forma de estudiar", score: 3 },
    ],
  },
  {
    block: "Emociones",
    question: "¿Qué tanto pateás el momento de sentarte a estudiar (procrastinación)?",
    options: [
      { text: "Todo el tiempo. Hago cualquier otra cosa antes de agarrar los libros", score: 0 },
      { text: "Bastante. Necesito tener el agua al cuello para sentarme", score: 1 },
      { text: "A veces, sobre todo con las materias que me parecen aburridas", score: 2 },
      { text: "Casi nunca. Me siento y arranco, aunque no tenga muchas ganas", score: 3 },
    ],
  },

  // BLOQUE 6: RENDIMIENTO REAL
  {
    block: "Rendimiento",
    question: "¿Cómo te está yendo actualmente con las notas y materias?",
    options: [
      { text: "Desapruebo bastante o vengo recursando varias materias", score: 0 },
      { text: "Ahí ando. Apruebo raspando o me va bien en algunas y mal en otras", score: 1 },
      { text: "Bien, mis notas son estables y apruebo casi todo", score: 2 },
      { text: "Excelente, tengo notas altas y domino los temas sin problema", score: 3 },
    ],
  },
  {
    block: "Rendimiento",
    question: "Siendo muy honesto, ¿cuántas horas REALES y súper enfocado estudiás por día?",
    options: [
      { text: "Menos de 30 minutos reales", score: 0 },
      { text: "Entre media hora y una hora", score: 1 },
      { text: "Entre 1 y 3 horas de buena concentración", score: 2 },
      { text: "Más de 3 horas sin distracciones", score: 3 },
    ],
  },
  {
    block: "Rendimiento",
    question: "¿Vas a clases y aprovechás a los profesores?",
    options: [
      { text: "Falto mucho y no participo nada", score: 0 },
      { text: "Voy para dar el presente, pero no presto mucha atención", score: 1 },
      { text: "Voy seguido y a veces pregunto alguna duda", score: 2 },
      { text: "No falto casi nunca, pregunto todo y voy a las clases de consulta", score: 3 },
    ],
  },

  // BLOQUE 7: APOYO Y RECURSOS
  {
    block: "Recursos",
    question: "¿Tenés acceso a los libros y apuntes que pide la materia?",
    options: [
      { text: "Me falta casi todo, no sé de dónde estudiar", score: 0 },
      { text: "Tengo un par de cosas, muchas veces estudio de resúmenes de otros", score: 1 },
      { text: "Tengo lo básico y obligatorio", score: 2 },
      { text: "Tengo todos los libros, apuntes y hasta busco material extra", score: 3 },
    ],
  },
  {
    block: "Recursos",
    question: "¿Te juntás a estudiar o repasar con compañeros?",
    options: [
      { text: "Siempre estudio solo, no hablo con nadie de la facultad", score: 0 },
      { text: "Me junto a veces, pero charlamos más de lo que estudiamos", score: 1 },
      { text: "Tengo compañeros con los que me saco dudas por WhatsApp", score: 2 },
      { text: "Sí, tengo un grupo con el que nos tomamos examen y estudiamos en serio", score: 3 },
    ],
  },
  {
    block: "Recursos",
    question: "¿Buscás activamente nuevas formas o técnicas para estudiar mejor?",
    options: [
      { text: "No, siempre estudio igual aunque me vaya mal", score: 0 },
      { text: "A veces pruebo algo nuevo si me lo cruzo por casualidad", score: 1 },
      { text: "He intentado organizarme mejor o probar técnicas nuevas", score: 2 },
      { text: "Sí, siempre busco métodos (como Pomodoro o mapas mentales) y los pongo en práctica", score: 3 },
    ],
  },
]

// Diagnósticos cada 5% con lenguaje claro, empático y directo
// Semáforo: Rojo (0-30), Amarillo (30-85), Verde (85-100)
const diagnoses = [
  // ZONA ROJA (0% - 30%) - Falta de estructura total
  {
    range: [0, 5],
    semaforo: "rojo",
    title: "Situación crítica: Necesitás empezar desde cero",
    description: "Actualmente no tenés ningún hábito de estudio. Te cuesta sentarte, te distraés rapidísimo y probablemente sentís que no entendés nada. No te preocupes por estudiar muchas horas ahora, primero hay que lograr que te sientes 20 minutos seguidos.",
    actions: ["No intentes estudiar 3 horas; sentate solo 20 minutos reloj", "Alejá el celular en otra habitación, sí o sí", "Buscá ayuda urgente con un profesor particular o tutor"],
  },
  {
    range: [5, 10],
    semaforo: "rojo",
    title: "Estudio por impulsos: Falta constancia",
    description: "Estudiás solo cuando tenés un poco de ganas o cuando el miedo al parcial te obliga. Al no tener una rutina, cada vez que te sentás es un esfuerzo enorme y te frustrás rápido.",
    actions: ["Elegí un horario fijo para estudiar todos los días (ej: 18 a 19 hs)", "Estudiá en el mismo lugar de tu casa siempre", "Dividí lo que tenés que leer en partes muy chiquitas"],
  },
  {
    range: [10, 15],
    semaforo: "rojo",
    title: "Desorganización que genera frustración",
    description: "A veces intentás ponerte las pilas, pero la cantidad de cosas por hacer te abruma. Perdés tiempo buscando apuntes o no sabés por dónde empezar, y eso hace que termines abandonando.",
    actions: ["Comprá una agenda o usá un cuaderno solo para anotar fechas y tareas", "Ordená todos tus apuntes en carpetas hoy mismo", "Usá el método Pomodoro: 25 minutos estudiando, 5 descansando"],
  },
  {
    range: [15, 20],
    semaforo: "rojo",
    title: "Fuerza bruta sin técnica",
    description: "Le ponés algo de voluntad, pero usás técnicas que no rinden, como leer el mismo texto cinco veces esperando que se te grabe. Llegás a los exámenes pensando que sabés, pero te quedás en blanco.",
    actions: ["Dejá de releer: empezá a subrayar lo importante y hacé cuadros", "Si no entendés algo a la segunda leída, buscá un video de YouTube", "Obligate a estar sentado 1 hora al día con el celular apagado"],
  },
  {
    range: [20, 25],
    semaforo: "rojo",
    title: "El síndrome de la noche anterior",
    description: "Solo lográs concentrarte cuando tenés el parcial encima. Este nivel de presión te salva a veces, pero te destruye los nervios y hace que te olvides de todo a los dos días de rendir.",
    actions: ["Adelantá tus fechas límite: actuá como si el parcial fuera 3 días antes", "Hacé un grupo de estudio de WhatsApp para sentir 'presión social' sana", "Cortá el estudio reactivo y repasá tus apuntes el mismo día que los tomaste"],
  },
  {
    range: [25, 30],
    semaforo: "rojo",
    title: "Al borde del colapso de información",
    description: "La cantidad de temas te está superando porque no tenés un sistema para procesarlos. Estás al límite de la zona de riesgo; si la materia se pone más difícil, los hábitos que tenés hoy no te van a alcanzar.",
    actions: ["Hacé una lista de los temas que MENOS entendés y atacalos primero", "No pases a un tema nuevo si no podés explicar el anterior en voz alta", "Llevá todas tus dudas anotadas a la próxima clase"],
  },

  // ZONA AMARILLA (30% - 85%) - En camino a mejorar
  {
    range: [30, 35],
    semaforo: "amarillo",
    title: "Empezando a arrancar, pero falta firmeza",
    description: "Estás dando los primeros pasos hacia organizarte bien. Entendés que tenés que estudiar, pero a la primera dificultad o semana pesada, tus buenos hábitos se desmoronan.",
    actions: ["Armá un 'Plan de Emergencia' para las semanas llenas de exámenes", "Explicate los temas en voz alta frente a un espejo", "Medí con un cronómetro cuántas horas reales estudiás por día"],
  },
  {
    range: [35, 40],
    semaforo: "amarillo",
    title: "Rendimiento inestable (Días buenos y malos)",
    description: "A veces sos una máquina de estudiar y a veces no hacés nada por días. Sos bueno en lo que te gusta y en las materias más aburridas te cuesta muchísimo mantener la atención.",
    actions: ["Estudiá la materia que menos te gusta a primera hora del día", "Pegale un repaso rápido a lo de hoy, mañana a la mañana", "Tratá de buscarle un lado práctico a lo que estás leyendo"],
  },
  {
    range: [40, 45],
    semaforo: "amarillo",
    title: "Falta de profundidad al estudiar",
    description: "Leés, te organizás más o menos bien y prestás atención, pero te quedás mucho en la memoria. Te cuesta relacionar temas entre sí y responder preguntas que te hagan pensar un poco más allá del texto.",
    actions: ["Empezá a tomar apuntes con tus propias palabras, no copies literal", "Tratá de ver cómo se conecta la Unidad 1 con la Unidad 2", "Pedile a un profe que te corrija un ejercicio antes del parcial"],
  },
  {
    range: [45, 50],
    semaforo: "amarillo",
    title: "En la mitad del camino: Falta una chispa",
    description: "Estás justo en la media. Cumplís con lo justo, vas a clases y aprobás, pero sentís que estás estancado. Es hora de dejar de estudiar 'en automático' y empezar a usar mejores técnicas.",
    actions: ["Aumentá tu tiempo de estudio profundo a una hora y media sin cortes", "Empezá a prepararte para los parciales con dos semanas de anticipación", "Fijate qué técnica usás (resumen, cuadro) y probá una distinta a ver si te rinde más"],
  },
  {
    range: [50, 55],
    semaforo: "amarillo",
    title: "La trampa de la comodidad",
    description: "Tenés capacidad, pero le esquivás a los ejercicios difíciles. Al evitar esforzarte para resolver problemas complejos antes del examen, tus notas no reflejan lo inteligente que realmente sos.",
    actions: ["Conseguí parciales de años anteriores y resolvelos en tu casa", "Ponete a prueba: tapá el cuaderno y tratá de escribir todo lo que te acordás", "Asegurate de dormir bien: no estudies de madrugada"],
  },
  {
    range: [55, 60],
    semaforo: "amarillo",
    title: "Temas sueltos que no se conectan",
    description: "Te va bien reteniendo información, pero guardás los temas en tu cabeza como si estuvieran en cajas separadas. Esto hace que las materias largas te resulten imposibles de integrar al final.",
    actions: ["Hacé mapas conceptuales gigantes que junten toda la materia", "Tratá de resumir un tema completo en una sola carilla", "Buscá ejemplos de la vida real para cada concepto nuevo"],
  },
  {
    range: [60, 65],
    semaforo: "amarillo",
    title: "Hábitos sólidos, pero muy rígidos",
    description: "Sos disciplinado y tenés un buen sistema. El problema es que estudiás matemática de la misma forma que estudiás historia. Te falta adaptar tu manera de estudiar a lo que pide cada materia.",
    actions: ["Si la materia es práctica, pasá 80% del tiempo haciendo ejercicios", "Si la materia es de lectura, pasá tiempo debatiendo y resumiendo", "Simulá estar en el parcial, midiendo el tiempo con reloj"],
  },
  {
    range: [65, 70],
    semaforo: "amarillo",
    title: "Buen estudiante, camino a destacar",
    description: "Tenés todo para que te vaya súper bien. Te organizás, no te distraés tanto y controlás los nervios. Para subir tu promedio solo tenés que empezar a repasar de manera más inteligente.",
    actions: ["Empezá a usar Flashcards (tarjetas de preguntas) para memorizar datos duros", "Cuestioná lo que leés: preguntate siempre '¿Por qué esto es así?'", "Juntate a debatir temas de la materia con compañeros enfocados"],
  },
  {
    range: [70, 75],
    semaforo: "amarillo",
    title: "Muy buen nivel, afinando detalles",
    description: "Estás por encima del promedio y tu forma de llevar la carrera es muy buena. Ya no tenés grandes problemas, solo hay que pulir cómo manejás el tiempo durante los parciales y no agotarte tanto.",
    actions: ["En los exámenes, resolvé lo fácil primero y dejá lo difícil para el final", "Anotá después de cada examen en qué tipo de preguntas te equivocaste", "Tratá de leer un poco más allá de los apuntes del profesor"],
  },
  {
    range: [75, 80],
    semaforo: "amarillo",
    title: "A un paso del alto rendimiento",
    description: "Tu organización, tu ambiente y tu mente trabajan juntos a tu favor. Tenés muchísimo control sobre tus resultados. Lo que te falta para ser el mejor de la clase es convertirte en 'profesor' de lo que aprendés.",
    actions: ["Buscá a un compañero al que le cueste la materia y explicale los temas", "Revisá en qué momento de tu rutina de estudio perdés minutos y ajustalo", "Sé el líder en los trabajos prácticos grupales"],
  },
  {
    range: [80, 85],
    semaforo: "amarillo",
    title: "Excelente nivel, en la puerta de la zona verde",
    description: "El acto de estudiar ya no te resulta un sufrimiento, fluye con naturalidad porque tenés un sistema buenísimo. Estás a punto de entrar a la zona de excelencia donde todo se vuelve mucho más fácil.",
    actions: ["Tomate exámenes en tu casa sin mirar ningún apunte", "Empezá a armar 'súper resúmenes' que sirvan para repasar toda la materia en 1 hora", "Fijate qué otros autores hablan de los temas de tu materia para enriquecer tus respuestas"],
  },

  // ZONA VERDE (85% - 100%) - Excelencia académica
  {
    range: [85, 90],
    semaforo: "verde",
    title: "Alto rendimiento: Entraste a la zona de excelencia",
    description: "Sos un estudiante destacado. Tu forma de organizarte, tu concentración y tu capacidad para no ponerte nervioso son buenísimas. Podés aplicar lo que aprendés a problemas de la vida real.",
    actions: ["Mantené tu sistema firme para no relajarte de más con el éxito", "Metete en proyectos de la facultad, ayudantías o investigación", "Pedile correcciones detalladas a los profesores más exigentes"],
  },
  {
    range: [90, 95],
    semaforo: "verde",
    title: "Dominio experto de tu aprendizaje",
    description: "Ya descubriste exactamente cómo funciona tu cerebro. Sabés qué temas sabés bien, cuáles te faltan, y cuánto tiempo te va a llevar aprender algo nuevo. Tu forma de estudiar es un relojito.",
    actions: ["Ofrecete como tutor para alumnos de primeros años", "Empezá a conectar lo que estudiás con lo que vas a hacer cuando trabajes", "Escribí artículos o ensayos dando tu propia opinión sobre los temas de la carrera"],
  },
  {
    range: [95, 100],
    semaforo: "verde",
    title: "Nivel Élite: Sos un referente entre tus compañeros",
    description: "Alcanzaste el nivel máximo. Organizás tu tiempo a la perfección, entendés la información súper rápido y rendís bárbaro bajo presión. Tus compañeros seguramente te preguntan cómo hacés.",
    actions: ["Armá una guía de 'Cómo sobrevivir a esta materia' y compartila", "Aplicá a becas, intercambios al exterior o puestos como ayudante de cátedra", "No te castigues si sacás un 8 en lugar de un 10; mantené el equilibrio sano con tu vida personal"],
  },
]

const TOTAL_SCORE = questions.length * 3 // 20 * 3 = 60

function getDiagnosis(score: number) {
  const pct = Math.round((score / TOTAL_SCORE) * 100)
  const d = diagnoses.find((d) => pct >= d.range[0] && pct < d.range[1])
  return d ?? diagnoses[diagnoses.length - 1]
}

function getSemaforoColor(semaforo: string) {
  if (semaforo === "rojo") return { bg: "bg-red-50", border: "border-red-400", text: "text-red-700", badge: "bg-red-600", pill: "bg-red-100 text-red-800" }
  if (semaforo === "amarillo") return { bg: "bg-amber-50", border: "border-amber-400", text: "text-amber-700", badge: "bg-amber-500", pill: "bg-amber-100 text-amber-800" }
  return { bg: "bg-emerald-50", border: "border-emerald-400", text: "text-emerald-700", badge: "bg-emerald-600", pill: "bg-emerald-100 text-emerald-800" }
}

const BLOCKS = [...new Set(questions.map((q) => q.block))]

export default function TestSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ text: string; score: number }[]>([])
  const [showForm, setShowForm] = useState(false)
  const [finished, setFinished] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [sent, setSent] = useState(false)
  const [formData, setFormData] = useState({ name: "", lastname: "", email: "", phone: "", career: "" })

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const totalScore = answers.reduce((s, a) => s + a.score, 0)
  const pct = Math.round((totalScore / TOTAL_SCORE) * 100)
  const diagnosis = getDiagnosis(totalScore)
  const colors = getSemaforoColor(diagnosis.semaforo)

  const blockScores = BLOCKS.map((block) => {
    const blockQs = questions.filter((q) => q.block === block)
    const blockAnswers = answers.slice(
      questions.indexOf(blockQs[0]),
      questions.indexOf(blockQs[0]) + blockQs.length
    )
    const scored = blockAnswers.reduce((s, a) => s + a.score, 0)
    const max = blockQs.length * 3
    return { block, pct: max > 0 ? Math.round((scored / max) * 100) : 0, answered: blockAnswers.length, total: blockQs.length }
  })

  const nextQuestion = () => {
    if (selectedScore === null) return
    const updatedAnswers = [...answers, { text: question.options[question.options.findIndex(o => o.score === selectedScore)].text, score: selectedScore }]
    setAnswers(updatedAnswers)
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedScore(null)
    } else {
      setFinished(true)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion === 0) return
    setAnswers(answers.slice(0, -1))
    setCurrentQuestion((c) => c - 1)
    setSelectedScore(null)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  // Lógica de envío por Email (mailto)
  
    const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
  event?.preventDefault()

  setIsSubmitting(true)
  setSubmitError("")

  try {
    const message = `🎓 *SOLICITUD DE AYUDA ACADÉMICA*

📊 *RESULTADOS DEL TEST*

• Puntaje: ${totalScore}/${TOTAL_SCORE}
• Porcentaje: ${pct}%
• Semáforo: ${diagnosis.semaforo.toUpperCase()}
• Diagnóstico: ${diagnosis.title}

📝 *Descripción*
${diagnosis.description}

📈 *ANÁLISIS POR ÁREAS*

${blockScores
  .map((block) => `• ${block.block}: ${block.pct}%`)
  .join("\n")}

💡 *RECOMENDACIONES*

${diagnosis.actions
  .map((action, index) => `${index + 1}. ${action}`)
  .join("\n")}

👤 *DATOS DEL ESTUDIANTE*

• Nombre: ${formData.name}
• Apellido: ${formData.lastname}
• Email: ${formData.email}
• Celular: ${formData.phone}
• Carrera/Materia: ${formData.career}

────────────────────────

Mensaje generado automáticamente desde Kinase Academy.`

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
      encodeURIComponent(message)

    window.open(whatsappUrl, "_blank")

    setSent(true)
  } catch (error) {
    setSubmitError(
      "No se pudo abrir WhatsApp. Intentá nuevamente."
    )
  } finally {
    setIsSubmitting(false)
  }
}

  // ── PANTALLA ENVIADO ──
  if (sent) {
    return (
      <section id="diagnostico" className="bg-gradient-to-br from-emerald-50 to-emerald-100 py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border-2 border-emerald-300 bg-white p-8 md:p-12 text-center shadow-lg">
            <div className="mb-6 text-6xl">✓</div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Test finalizado</p>
            <h2 className="mb-4 text-4xl font-black text-slate-950">Tu resultado está listo para ser enviado.</h2>
            <p className="mb-8 text-lg leading-8 text-slate-600">Se abrió tu aplicación de WhatsApp. Solo tenés que presionar <strong>Enviar</strong> para que nuestro equipo reciba tu perfil y pueda ayudarte a mejorar.</p>
            <div className="space-y-3 text-left bg-emerald-50 p-6 rounded-xl mb-8">
              {["� Recibiremos tus resultados por WhatsApp", "💬 Un asesor revisará en qué áreas te cuesta más", "🎯 Te responderemos con un plan pensado para vos"].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
            <a href="#cursos" className="inline-block rounded-lg bg-emerald-700 px-8 py-3 font-black text-white transition hover:bg-emerald-800">Ver cursos</a>
          </div>
        </div>
      </section>
    )
  }

  // ── FORMULARIO ──
  if (showForm) {
    return (
      <section id="diagnostico" className="bg-stone-50 py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border-2 border-emerald-300 bg-white p-8 md:p-10 shadow-lg">
            <div className="mb-8 text-center">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Pedir ayuda</p>
              <h2 className="mb-4 text-4xl font-black text-slate-950">Mejorá tus hábitos de estudio.</h2>
              <p className="text-slate-600">Completá tus datos para enviarnos tus resultados y recibir ayuda personalizada.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                {(["name", "lastname", "email", "phone"] as const).map((field) => (
                  <div key={field}>
                    <label htmlFor={field} className="block text-sm font-bold text-slate-700 mb-2 capitalize">{field === "name" ? "Nombre" : field === "lastname" ? "Apellido" : field === "email" ? "Email" : "Celular"}</label>
                    <input
                      id={field}
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      name={field}
                      placeholder={field === "phone" ? "+54 9 11 0000 0000" : field === "email" ? "tu@email.com" : ""}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white p-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <label htmlFor="career" className="block text-sm font-bold text-slate-700 mb-2">Carrera o materia que más te cuesta</label>
                <input id="career" type="text" name="career" placeholder="Ej: Matemática, Abogacía, Química, etc." value={formData.career} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 bg-white p-4 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" />
              </div>
              {submitError && <p className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700 font-bold">{submitError}</p>}
              <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-emerald-700 py-4 font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400 mb-3">
                {isSubmitting ? "Preparando mensaje..." : "Enviar mis resultados por WhatsApp"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="w-full rounded-lg border-2 border-slate-300 py-4 font-bold text-slate-700 transition hover:border-slate-950">Volver atrás</button>
            </form>
          </div>
        </div>
      </section>
    )
  }

  // ── RESULTADOS (SEMÁFORO) ──
  if (finished) {
    const semaforoEmoji = diagnosis.semaforo === "rojo" ? "🔴" : diagnosis.semaforo === "amarillo" ? "🟡" : "🟢"
    return (
      <section id="diagnostico" className={`py-24 px-6 ${colors.bg}`}>
        <div className="mx-auto max-w-3xl">
          <div className={`rounded-2xl border-2 ${colors.border} bg-white p-8 md:p-12 shadow-xl`}>
            {/* Cabecera */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.pill} text-sm font-black uppercase tracking-widest mb-4`}>
                {semaforoEmoji} {diagnosis.semaforo === "rojo" ? "Zona de Peligro" : diagnosis.semaforo === "amarillo" ? "En Camino a Mejorar" : "Zona de Excelencia"}
              </div>
              <h2 className="mb-4 text-3xl md:text-4xl font-black leading-tight text-slate-950">{diagnosis.title}</h2>
              <p className="text-lg leading-8 text-slate-600">{diagnosis.description}</p>
            </div>

            {/* Porcentaje Grande */}
            <div className="flex items-center justify-center mb-8">
              <div className={`rounded-2xl border-2 ${colors.border} p-6 text-center`}>
                <div className={`text-6xl font-black ${colors.text} mb-1`}>{pct}%</div>
                <div className="text-slate-500 text-sm font-bold">Puntaje: {totalScore} de {TOTAL_SCORE} ptos.</div>
              </div>
            </div>

            {/* Barra Visual Semáforo (0-30 Rojo, 30-85 Amarillo, 85-100 Verde) */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                <span className="text-red-600">🔴 Rojo (0–30%)</span>
                <span className="text-amber-600">🟡 Amarillo (30–85%)</span>
                <span className="text-emerald-600">🟢 Verde (85–100%)</span>
              </div>
              <div className="relative h-5 rounded-full overflow-hidden bg-slate-100">
                <div className="absolute inset-0 flex">
                  <div className="bg-red-200" style={{ width: "30%" }} />
                  <div className="bg-amber-200" style={{ width: "55%" }} />
                  <div className="bg-emerald-200" style={{ width: "15%" }} />
                </div>
                <div
                  className={`absolute top-0 h-full rounded-full ${colors.badge} transition-all duration-700`}
                  style={{ width: `${pct}%`, opacity: 0.85 }}
                />
              </div>
            </div>

            {/* Análisis por Categoría */}
            <div className="mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Tu nivel en cada área</h3>
              <div className="space-y-3">
                {blockScores.map(({ block, pct: bpct }) => {
                  const bColor = bpct <= 30 ? "bg-red-500" : bpct < 85 ? "bg-amber-400" : "bg-emerald-500"
                  return (
                    <div key={block}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold text-slate-700">{block}</span>
                        <span className="font-black text-slate-500">{bpct}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${bColor} transition-all duration-500`} style={{ width: `${bpct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recomendaciones Claras */}
            <div className={`rounded-xl border ${colors.border} ${colors.bg} p-6 mb-8`}>
              <h3 className={`text-sm font-black uppercase tracking-widest ${colors.text} mb-4`}>💡 Qué deberías hacer ahora</h3>
              <ul className="space-y-3">
                {diagnosis.actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <span className={`mt-0.5 font-black text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-white ${colors.badge}`}>{i + 1}</span>
                    <span className="text-sm leading-relaxed">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={() => setShowForm(true)} className="w-full rounded-lg bg-emerald-700 py-4 font-black text-white transition hover:bg-emerald-800 mb-3">
              Pedir ayuda con mi estudio →
            </button>
          </div>
        </div>
      </section>
    )
  }

  // ── PREGUNTAS DEL TEST ──
  const currentBlock = question.block
  return (
    <section id="diagnostico" className="bg-stone-50 py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Descubrí tu nivel</p>
          <h2 className="mb-4 text-4xl font-black text-slate-950 md:text-5xl">Test de Hábitos de Estudio.</h2>
          <p className="text-slate-600">Respondé estas 20 preguntas con total honestidad para saber qué te está frenando y cómo podés mejorar tus notas.</p>
        </div>

        <div className="rounded-2xl border-2 border-emerald-300 bg-white p-8 md:p-10 shadow-lg">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-600">Pregunta {currentQuestion + 1} de {questions.length}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black rounded-full bg-emerald-100 text-emerald-700 px-3 py-0.5">{currentBlock}</span>
                <span className="text-sm font-black text-emerald-700">{Math.round(progress)}%</span>
              </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <h3 className="mb-8 text-2xl font-black leading-snug text-slate-950 md:text-3xl">{question.question}</h3>

          <div className="grid gap-3 mb-10">
            {question.options.map((option) => (
              <button
                key={option.text}
                type="button"
                onClick={() => setSelectedScore(option.score)}
                className={`rounded-lg border-2 p-4 text-left font-bold transition ${
                  selectedScore === option.score
                    ? "border-emerald-600 bg-emerald-50 text-slate-950 shadow-md"
                    : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/30"
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={prevQuestion} disabled={currentQuestion === 0} className="rounded-lg border-2 border-slate-300 bg-white py-3 font-bold text-slate-700 transition hover:border-slate-950 disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
            <button onClick={nextQuestion} disabled={selectedScore === null} className="rounded-lg bg-emerald-700 py-3 font-black text-white transition hover:bg-emerald-800 disabled:bg-slate-400 disabled:cursor-not-allowed">
              {currentQuestion === questions.length - 1 ? "Ver mis resultados →" : "Siguiente →"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}