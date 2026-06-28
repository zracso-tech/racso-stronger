export type DiaCode = "L" | "M" | "X" | "J" | "V";

export type Tecnica =
  | "isometrico"
  | "descendente"
  | "rest_pausa"
  | "fallo"
  | "superserie"
  | "alta_densidad";

export interface Ejercicio {
  id: string;
  nombre: string;
  musculos: string;
  series: string;
  descanso: string;
  pesoEstimado?: string;
  notas: string;
  tecnicas: Tecnica[];
}

export interface Bloque {
  titulo: string;
  ejercicios: Ejercicio[];
}

export interface Dia {
  code: DiaCode;
  nombre: string;
  titulo: string;
  estimulo: string;
  bloques: Bloque[];
  notaFinal?: string;
}

export const RUTINA: Dia[] = [
  {
    code: "L",
    nombre: "Lunes",
    titulo: "Pecho + Tríceps + Hombro anterior",
    estimulo: "Fuerza-hipertrofia · rangos bajos · técnica isométrica",
    bloques: [
      {
        titulo: "Bloque A — Articulares principales",
        ejercicios: [
          {
            id: "L1",
            nombre: "Press inclinado con barra (30°)",
            musculos: "Pectoral superior · hombro anterior · tríceps",
            series: "4 × 12–10–8–6",
            descanso: "90 s",
            pesoEstimado: "70–85 kg",
            notas: "Isométrico 8 s en rango medio antes de iniciar las repes. Concéntrica explosiva, excéntrica 2 s.",
            tecnicas: ["isometrico", "fallo"],
          },
          {
            id: "L2",
            nombre: "Press plano con mancuernas",
            musculos: "Pectoral medio · tríceps",
            series: "3 × 10–8–8+RP",
            descanso: "75 s",
            pesoEstimado: "28–36 kg/mano",
            notas: "Rest-pausa en la última: tras fallo descansas 20 s y sacas las que puedas.",
            tecnicas: ["rest_pausa"],
          },
        ],
      },
      {
        titulo: "Bloque B — Aislamiento pecho",
        ejercicios: [
          {
            id: "L3",
            nombre: "Cruce de poleas desde abajo",
            musculos: "Pectoral medio-inferior · fibras internas",
            series: "4 × 14–12–10–10",
            descanso: "60 s",
            pesoEstimado: "12–18 kg/lado",
            notas: "Tensión continua, recorrido de hombro a nariz. 1 s en contracción máxima.",
            tecnicas: ["isometrico"],
          },
          {
            id: "L4",
            nombre: "Fondos en paralelas (abiertos)",
            musculos: "Pectoral inferior · tríceps",
            series: "3 × 15–12–fallo",
            descanso: "75 s",
            pesoEstimado: "Corporal (+peso)",
            notas: "Si llegas a 15 cómodas, añade 5–10 kg. Tronco inclinado adelante para enfatizar pecho.",
            tecnicas: ["fallo"],
          },
        ],
      },
      {
        titulo: "Bloque C — Tríceps aislado",
        ejercicios: [
          {
            id: "L5",
            nombre: "Extensión en polea alta con cuerda",
            musculos: "Tríceps (cabeza lateral y medial)",
            series: "3 × 15",
            descanso: "0 s (superserie)",
            pesoEstimado: "25–35 kg",
            notas: "Superserie con press francés. Directo de uno a otro. 90 s entre rondas.",
            tecnicas: ["superserie"],
          },
          {
            id: "L6",
            nombre: "Press francés con mancuerna (copa)",
            musculos: "Tríceps (cabeza larga)",
            series: "3 × 12",
            descanso: "90 s entre rondas",
            pesoEstimado: "20–26 kg",
            notas: "Segundo ejercicio de la superserie. Codos juntos, recorrido completo detrás de la cabeza.",
            tecnicas: ["superserie"],
          },
        ],
      },
      {
        titulo: "Bloque D — Hombro anterior",
        ejercicios: [
          {
            id: "L7",
            nombre: "Elevación frontal con disco (giro alterno)",
            musculos: "Deltoides anterior",
            series: "3 × 12",
            descanso: "60 s",
            pesoEstimado: "10–15 kg disco",
            notas: "Sube girando muñeca: pares a la derecha, nones a la izquierda. Núcleo activado.",
            tecnicas: [],
          },
        ],
      },
    ],
    notaFinal:
      "Bloques de fuerza (6–8 repes) → 90 s. Bomba y superseries → 60–75 s. Tríceps superserie → 90 s entre rondas.",
  },
  {
    code: "M",
    nombre: "Martes",
    titulo: "Espalda + Bíceps",
    estimulo: "Fuerza-hipertrofia · recorrido completo · conexión mente-músculo",
    bloques: [
      {
        titulo: "Bloque A — Articulares espalda",
        ejercicios: [
          {
            id: "M1",
            nombre: "Remo con barra (prono)",
            musculos: "Dorsal ancho · romboides · trapecio medio",
            series: "4 × 12–10–8–6",
            descanso: "90 s",
            pesoEstimado: "70–90 kg",
            notas: "Isométrico 8 s a altura de ombligo en la primera repe. Tira con codos, no con manos.",
            tecnicas: ["isometrico", "descendente"],
          },
          {
            id: "M2",
            nombre: "Peso muerto parcial (rack pull) desde rodillas",
            musculos: "Trapecio · erector espinal · espalda baja",
            series: "4 × 12–10–8–8",
            descanso: "90 s",
            pesoEstimado: "90–110 kg",
            notas: "Desde rodillas a extensión completa. Concéntrate en retracción escapular arriba.",
            tecnicas: [],
          },
        ],
      },
      {
        titulo: "Bloque B — Jalones y tracción vertical",
        ejercicios: [
          {
            id: "M3",
            nombre: "Jalón al pecho agarre inverso (supino estrecho)",
            musculos: "Dorsal · bíceps · redondo mayor",
            series: "4 × 12–10–8–6",
            descanso: "75 s",
            pesoEstimado: "65–80 kg",
            notas: "Supino estrecho activa más el dorsal bajo. Estiramiento completo arriba, pausa 1 s abajo.",
            tecnicas: ["descendente"],
          },
          {
            id: "M4",
            nombre: "Remo a 1 mano con mancuerna",
            musculos: "Dorsal · redondo · bíceps",
            series: "3 × 12–10–8",
            descanso: "15 s entre brazos",
            pesoEstimado: "30–40 kg",
            notas: "Posa la mancuerna en el suelo entre repes para garantizar estiramiento completo.",
            tecnicas: [],
          },
        ],
      },
      {
        titulo: "Bloque C — Bíceps",
        ejercicios: [
          {
            id: "M5",
            nombre: "Curl con barra Z (21s)",
            musculos: "Bíceps braquial (recorrido completo)",
            series: "3 × 21",
            descanso: "75 s",
            pesoEstimado: "25–32 kg barra",
            notas: "7 mitad inferior + 7 mitad superior + 7 completas. Mismo peso en las 3 fases.",
            tecnicas: ["isometrico"],
          },
          {
            id: "M6",
            nombre: "Curl martillo alterno con mancuernas",
            musculos: "Braquial · braquiorradial · bíceps",
            series: "3 × 12–10–fallo",
            descanso: "60 s",
            pesoEstimado: "16–22 kg/mano",
            notas: "Codos pegados. Supinación al subir, pronación controlada al bajar.",
            tecnicas: ["fallo"],
          },
          {
            id: "M7",
            nombre: "Curl inclinado 45° con mancuernas (simultáneo)",
            musculos: "Cabeza larga del bíceps (estiramiento máximo)",
            series: "3 × 12–10–8",
            descanso: "60 s",
            pesoEstimado: "12–18 kg/mano",
            notas: "Banco inclinado pone la cabeza larga en estiramiento máximo desde el inicio.",
            tecnicas: ["isometrico"],
          },
        ],
      },
    ],
    notaFinal: "Series de fuerza (6–8 repes) → 90–120 s. Bomba bíceps → 60–75 s. Entre brazos en remo 1 mano → 15 s.",
  },
  {
    code: "X",
    nombre: "Miércoles",
    titulo: "Pierna completa (cuádriceps · femoral · glúteo)",
    estimulo: "Volumen alto · técnica controlada · sin carreras de fuerza máxima",
    bloques: [
      {
        titulo: "Bloque A — Cuádriceps",
        ejercicios: [
          {
            id: "X1",
            nombre: "Sentadilla con barra (libre)",
            musculos: "Cuádriceps · glúteo · core",
            series: "4 × 14–12–10–8",
            descanso: "2–3 min",
            pesoEstimado: "80–100 kg",
            notas: "2 series calentamiento (50–60%). Muslos pasan la paralela. Concéntrica explosiva.",
            tecnicas: ["isometrico"],
          },
          {
            id: "X2",
            nombre: "Prensa (3 posiciones de pie)",
            musculos: "Cuádriceps · glúteo (varía según posición)",
            series: "3 × (12+12+12)",
            descanso: "2 min",
            pesoEstimado: "120–150 kg",
            notas: "Pies abiertos arriba → centro → juntos. Las 3 sin descanso = 1 serie.",
            tecnicas: [],
          },
          {
            id: "X3",
            nombre: "Jaca (hack squat)",
            musculos: "Cuádriceps (vasto externo e interno)",
            series: "2×15 + 2×10+RP",
            descanso: "90 s",
            pesoEstimado: "80–110 kg",
            notas: "Baja hasta el fondo. Rest-pausa en la última: fallo → 20 s → repes → 20 s → repes.",
            tecnicas: ["rest_pausa"],
          },
        ],
      },
      {
        titulo: "Bloque B — Femoral y glúteo",
        ejercicios: [
          {
            id: "X4",
            nombre: "Peso muerto rumano con barra",
            musculos: "Femoral · glúteo · erector",
            series: "4 × 12–10–8–6",
            descanso: "90 s",
            pesoEstimado: "70–90 kg",
            notas: "Rodillas ligeramente flexionadas fijas. Barra pegada a piernas. Para en estiramiento máximo del femoral.",
            tecnicas: ["descendente"],
          },
          {
            id: "X5",
            nombre: "Hip thrust con barra",
            musculos: "Glúteo mayor · femoral proximal",
            series: "4 × 16–14–12–10",
            descanso: "75 s",
            pesoEstimado: "80–100 kg",
            notas: "Aguanta 3 s en la posición alta de máxima contracción. No uses rebote al bajar.",
            tecnicas: ["isometrico"],
          },
          {
            id: "X6",
            nombre: "Femoral tumbado a 1 pierna (máquina)",
            musculos: "Bíceps femoral · semitendinoso",
            series: "4 × 12–10–8–fallo",
            descanso: "60 s",
            pesoEstimado: "30–45 kg",
            notas: "Pausa 1 s en contracción máxima. Excéntrica 2 s. Últimas 2 series con ayuda.",
            tecnicas: ["fallo"],
          },
        ],
      },
      {
        titulo: "Bloque C — Aductor / abductor",
        ejercicios: [
          {
            id: "X7",
            nombre: "Aductor + abductor con gomas (superserie)",
            musculos: "Aductor · glúteo medio",
            series: "4 × 10+10",
            descanso: "60 s entre rondas",
            pesoEstimado: "Goma media/fuerte",
            notas: "Sin descanso entre aductor y abductor. Muy despacio, tensión continua.",
            tecnicas: ["superserie"],
          },
        ],
      },
    ],
    notaFinal:
      "Sentadilla y prensa → 2–3 min. Femoral y glúteo → 90 s. Superserie → 60 s entre rondas. En pierna nunca acortes el recorrido.",
  },
  {
    code: "J",
    nombre: "Jueves",
    titulo: "Hombros + Tríceps (2ª frecuencia)",
    estimulo: "Bomba metabólica · volumen alto · serie gigante",
    bloques: [
      {
        titulo: "Bloque A — Serie gigante de hombro (4 rondas, sin descanso entre ejercicios)",
        ejercicios: [
          {
            id: "J1",
            nombre: "Elevaciones laterales con mancuernas sentado",
            musculos: "Deltoides medial",
            series: "4 rondas × 12",
            descanso: "0 s (gigante)",
            pesoEstimado: "10–14 kg",
            notas: "Isométrico 10 s en punto medio al inicio de cada ronda. Sin inercia.",
            tecnicas: ["isometrico", "superserie"],
          },
          {
            id: "J2",
            nombre: "Press militar con mancuernas",
            musculos: "Deltoides anterior · medial · tríceps",
            series: "4 rondas × 10",
            descanso: "0 s (gigante)",
            pesoEstimado: "20–28 kg/mano",
            notas: "Baja hasta que la mancuerna roza el hombro. Sin bloquear codo arriba.",
            tecnicas: ["superserie"],
          },
          {
            id: "J3",
            nombre: "Elevaciones laterales de pie (Charles Glass)",
            musculos: "Deltoides medial",
            series: "4 rondas × 10",
            descanso: "0 s (gigante)",
            pesoEstimado: "12–16 kg",
            notas: "Inclinado ligeramente, codo lidera el movimiento. Últimas 2 repes algo de impulso.",
            tecnicas: ["superserie"],
          },
          {
            id: "J4",
            nombre: "Elevaciones frontales en polea baja",
            musculos: "Deltoides anterior",
            series: "4 rondas × 12",
            descanso: "0 s (gigante)",
            pesoEstimado: "10–15 kg",
            notas: "Tensión constante. Sube hasta altura de los ojos.",
            tecnicas: ["superserie"],
          },
          {
            id: "J5",
            nombre: "Pájaro con mancuernas (posterior)",
            musculos: "Deltoides posterior · romboides",
            series: "4 rondas × 20–25",
            descanso: "3 min entre rondas",
            pesoEstimado: "8–12 kg",
            notas: "Codos ligeramente flexionados. No subir más allá de la horizontal. Pausa 1 s arriba.",
            tecnicas: ["superserie"],
          },
        ],
      },
      {
        titulo: "Bloque B — Posterior + Facepull (cierre)",
        ejercicios: [
          {
            id: "J6",
            nombre: "Facepull en polea alta con cuerda",
            musculos: "Deltoides posterior · manguito rotador",
            series: "3 × 15 + 1 al fallo",
            descanso: "45 s",
            pesoEstimado: "15–25 kg",
            notas: "Tira hacia la cara, abre los brazos al final. Salud del hombro.",
            tecnicas: ["fallo"],
          },
        ],
      },
      {
        titulo: "Bloque C — Tríceps (2ª frecuencia)",
        ejercicios: [
          {
            id: "J7",
            nombre: "Patada de tríceps en polea a 1 mano",
            musculos: "Tríceps (cabeza lateral)",
            series: "4 × 14–12–10–8",
            descanso: "60 s",
            pesoEstimado: "10–18 kg",
            notas: "Isométrico en primera repe. Codo fijo paralelo al suelo. Pausa 1 s en extensión.",
            tecnicas: ["isometrico", "descendente"],
          },
          {
            id: "J8",
            nombre: "Fondos entre bancos",
            musculos: "Tríceps · pectoral inferior",
            series: "4 × 20",
            descanso: "75 s",
            pesoEstimado: "Corporal (+peso)",
            notas: "Isométrico 10 s en posición baja de la primera repe. Si llegas a 20 fácil, añade peso.",
            tecnicas: ["isometrico", "fallo"],
          },
        ],
      },
    ],
    notaFinal:
      "Serie gigante → 3 min entre rondas completas (sin descanso dentro de la ronda). Bloque tríceps → 75 s entre series.",
  },
  {
    code: "V",
    nombre: "Viernes",
    titulo: "Espalda (2ª frecuencia) + Bíceps + Pierna posterior",
    estimulo: "Bomba · volumen · técnica descendente y alta densidad",
    bloques: [
      {
        titulo: "Bloque A — Espalda (volumen)",
        ejercicios: [
          {
            id: "V1",
            nombre: "Dominadas (agarre prono amplio)",
            musculos: "Dorsal · bíceps · redondo mayor",
            series: "4 × 10–8–fallo–fallo",
            descanso: "2 min",
            pesoEstimado: "Corporal (+5–10 kg)",
            notas: "Primera sin lastre. Sube lastre cada serie. Estiramiento completo abajo.",
            tecnicas: ["fallo"],
          },
          {
            id: "V2",
            nombre: "Remo en polea baja agarre estrecho",
            musculos: "Dorsal · trapecio medio · romboides",
            series: "7 × 10 (10 s descanso)",
            descanso: "2 min al terminar",
            pesoEstimado: "55–70 kg",
            notas: "Alta densidad. 10 s entre series. Peso moderado-alto, técnica perfecta. Nunca al fallo.",
            tecnicas: ["alta_densidad"],
          },
          {
            id: "V3",
            nombre: "Pullover en polea (brazos rígidos)",
            musculos: "Dorsal · serrato · pectoral",
            series: "4 × 20–25",
            descanso: "45 s",
            pesoEstimado: "25–35 kg",
            notas: "Muy estricto, peso moderado. Estiramiento máximo arriba, contracción total abajo.",
            tecnicas: [],
          },
        ],
      },
      {
        titulo: "Bloque B — Bíceps (2ª frecuencia)",
        ejercicios: [
          {
            id: "V4",
            nombre: "Curl concentrado a 1 brazo",
            musculos: "Bíceps (pico)",
            series: "4 × 12–10–10–8",
            descanso: "45 s",
            pesoEstimado: "16–22 kg/mano",
            notas: "Isométrico en primera. Supinación máxima arriba. Descendente al 20% en última.",
            tecnicas: ["isometrico", "descendente"],
          },
          {
            id: "V5",
            nombre: "Curl en polea baja (ambos brazos)",
            musculos: "Bíceps · braquial",
            series: "7 × 10 (10 s descanso)",
            descanso: "2 min al terminar",
            pesoEstimado: "20–30 kg",
            notas: "Alta densidad. Tensión continua todo el recorrido. Cierre del bloque de bíceps.",
            tecnicas: ["alta_densidad"],
          },
        ],
      },
      {
        titulo: "Bloque C — Pierna posterior",
        ejercicios: [
          {
            id: "V6",
            nombre: "Sentadilla sumo",
            musculos: "Femoral · aductor · glúteo",
            series: "6 × 20–15–fallo×3",
            descanso: "90 s",
            pesoEstimado: "60–80 kg",
            notas: "2 series calentamiento. Excéntrica lenta (3 s). 3 últimas series al fallo.",
            tecnicas: ["fallo"],
          },
          {
            id: "V7",
            nombre: "Patada de glúteo en polea baja",
            musculos: "Glúteo mayor",
            series: "4 × 14–12–10–8",
            descanso: "60 s",
            pesoEstimado: "15–25 kg",
            notas: "Apoyado en banco a 90°. Aguanta 2 s en contracción. Isométrico en primera repe.",
            tecnicas: ["isometrico"],
          },
        ],
      },
    ],
    notaFinal:
      "Dominadas y fuerza → 2 min. Bloques de alta densidad (7×10) → 10 s dentro, 2 min al terminar. Femoral y glúteo → 90 s.",
  },
];

export const TECNICA_LABELS: Record<Tecnica, string> = {
  isometrico: "Isométrico",
  descendente: "Descendente",
  rest_pausa: "Rest-pausa",
  fallo: "Fallo",
  superserie: "Superserie",
  alta_densidad: "Alta densidad",
};

export const TECNICA_COLORS: Record<Tecnica, string> = {
  isometrico: "bg-violet-500/15 text-violet-300",
  descendente: "bg-orange-500/15 text-orange-300",
  rest_pausa: "bg-blue-500/15 text-blue-300",
  fallo: "bg-red-500/15 text-red-300",
  superserie: "bg-green-500/15 text-green-300",
  alta_densidad: "bg-cyan-500/15 text-cyan-300",
};

export const DIA_COLORS: Record<DiaCode, { bg: string; accent: string; chip: string }> = {
  L: { bg: "bg-rose-500", accent: "text-rose-400", chip: "bg-rose-500/15 text-rose-300" },
  M: { bg: "bg-blue-500", accent: "text-blue-400", chip: "bg-blue-500/15 text-blue-300" },
  X: { bg: "bg-green-500", accent: "text-green-400", chip: "bg-green-500/15 text-green-300" },
  J: { bg: "bg-amber-500", accent: "text-amber-400", chip: "bg-amber-500/15 text-amber-300" },
  V: { bg: "bg-fuchsia-500", accent: "text-fuchsia-400", chip: "bg-fuchsia-500/15 text-fuchsia-300" },
};

export const CARDIO_TIPOS = [
  { value: "bici", label: "Bici" },
  { value: "cinta_andar", label: "Cinta · andando" },
  { value: "cinta_correr", label: "Cinta · corriendo" },
] as const;

export type CardioTipo = (typeof CARDIO_TIPOS)[number]["value"];
