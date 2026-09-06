export type Layer = "skeletal" | "muscular" | "neurovascular"

export type AnatomyPart = {
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

export const anatomyData: AnatomyPart[] = [
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
