export type QuestionOption = {
  text: string
  points: number
}

export type Question = {
  question: string
  options: QuestionOption[]
}

export const questions: Question[] = [
  {
    question: "1. ¿Cómo gestionas el gran volumen de material teórico y práctico en la semana?",
    options: [
      { text: "No tengo planificación; leo lo que puedo día a día de forma reactiva.", points: 1 },
      { text: "Intento seguir el cronograma oficial de la cátedra pero siempre me atraso.", points: 2 },
      { text: "Planifico mis lecturas pero me cuesta mantener repasos de temas pasados.", points: 3 },
      { text: "Tengo un cronograma al día y aplico repetición espaciada sistemáticamente.", points: 4 },
    ],
  },
  {
    question: "2. ¿Cuál es tu método principal de retención e incorporación de conceptos complejos?",
    options: [
      { text: "Lectura pasiva de libros, resúmenes ajenos y subrayado tradicional.", points: 1 },
      { text: "Relectura reiterada de apuntes y realización de resúmenes escritos a mano.", points: 2 },
      { text: "Uso de flashcards digitales y autoevaluaciones de forma intermitente.", points: 3 },
      { text: "Integración de esquemas activos, repaso espaciado y explicación de conceptos en voz alta.", points: 4 },
    ],
  },
  {
    question: "3. ¿Cómo te desenvuelves al exponer un tema técnico complejo en una evaluación o examen oral?",
    options: [
      { text: "Me bloqueo por la ansiedad y me cuesta estructurar la exposición.", points: 1 },
      { text: "Conozco la teoría pero me falta vocabulario técnico y fluidez al hablar.", points: 2 },
      { text: "Expongo de forma aceptable si me guían con preguntas, pero me cuesta iniciar solo.", points: 3 },
      { text: "Describo con orden lógico, seguridad y terminología exacta.", points: 4 },
    ],
  },
  {
    question: "4. ¿Cuál es tu nivel habitual de estrés y agotamiento durante la cursada?",
    options: [
      { text: "Alto estrés, problemas de sueño y dificultad para concentrarme por burnout.", points: 1 },
      { text: "Pánico antes de los prácticos semanales pero logro controlarlo para aprobar.", points: 2 },
      { text: "Estrés y cansancio normales antes de entregas, pero mantengo el equilibrio.", points: 3 },
      { text: "Tranquilo y motivado; balanceo bien el estudio con el descanso real.", points: 4 },
    ],
  },
  {
    question: "5. ¿Con qué frecuencia realizas simulacros de examen bajo condiciones reales?",
    options: [
      { text: "Nunca; suelo evaluar mi conocimiento recién el día del examen oficial.", points: 1 },
      { text: "Hago simulacros o resuelvo parciales pasados únicamente el día anterior.", points: 2 },
      { text: "Resuelvo simulacros con frecuencia pero sin controlar estrictamente el tiempo.", points: 3 },
      { text: "Realizo autoevaluaciones cronometradas al terminar cada unidad importante.", points: 4 },
    ],
  },
]
