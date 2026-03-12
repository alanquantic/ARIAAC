import { QuestionSection } from "@/lib/types";

export const SCALE_OPTIONS = [
  { value: 1, label: "1", description: "No existe" },
  { value: 2, label: "2", description: "Muy limitado" },
  { value: 3, label: "3", description: "Parcial" },
  { value: 4, label: "4", description: "Consistente" },
  { value: 5, label: "5", description: "Avanzado" },
] as const;

export const SECTORS = [
  "Manufactura",
  "Logística y transporte",
  "Automotriz",
  "Metalmecánica",
  "Alimentos y bebidas",
  "Agroindustria",
  "Energía y utilities",
  "Construcción e infraestructura",
  "Universidades y educación superior",
  "Salud y hospitalario",
  "Retail y comercio",
  "Tecnología y software",
  "Servicios financieros",
  "Turismo y hotelería",
  "Minería",
  "Telecomunicaciones",
  "Gobierno y sector público",
  "Servicios empresariales",
  "Farmacéutica y biotecnología",
  "Aeroespacial",
  "Otro",
];

export const COMPANY_SIZES = [
  "1-50 colaboradores",
  "51-250 colaboradores",
  "251-1000 colaboradores",
  "1000+ colaboradores",
];

export const BUSINESS_PRIORITIES = [
  "Productividad",
  "Reducción de rotación",
  "Eficiencia operativa",
  "Formación de líderes",
  "Automatización administrativa",
  "Cumplimiento y riesgo",
];

export const OPPORTUNITY_AREAS = [
  "Recursos Humanos",
  "Operaciones",
  "Logística",
  "Compras",
  "Calidad",
  "Mantenimiento",
  "Ventas",
  "Servicio al cliente",
];

export const MAIN_CONCERNS = [
  "Falta de habilidades",
  "Resistencia al cambio",
  "Riesgos de seguridad",
  "Falta de claridad estratégica",
  "Baja calidad de datos",
  "No saber por dónde empezar",
];

export const DIMENSION_LABELS = {
  strategy: "Estrategia y liderazgo",
  talent: "Talento y cultura",
  process: "Procesos y datos",
  governance: "Riesgo y gobernanza",
} as const;

export const DIAGNOSTIC_SECTIONS: QuestionSection[] = [
  {
    id: "strategy",
    title: "Estrategia y liderazgo",
    intro:
      "Evalúa qué tan clara y alineada está la dirección respecto al valor y al rumbo de la IA.",
    questions: [
      {
        id: "q1",
        dimension: "strategy",
        prompt:
          "La dirección tiene una visión clara de cómo la IA puede impactar la productividad, el talento y la competitividad.",
      },
      {
        id: "q2",
        dimension: "strategy",
        prompt:
          "La empresa ya identificó procesos o áreas donde la IA podría aportar valor real.",
      },
      {
        id: "q3",
        dimension: "strategy",
        prompt:
          "Existen responsables claros para impulsar iniciativas de IA y la capacitación asociada.",
      },
    ],
  },
  {
    id: "talent",
    title: "Talento y cultura",
    intro:
      "Evalúa si la organización tiene apertura, recursos y cultura de aprendizaje para adoptar IA.",
    questions: [
      {
        id: "q4",
        dimension: "talent",
        prompt:
          "La empresa conoce qué puestos y tareas podrían ser automatizados, asistidos o fortalecidos con IA.",
      },
      {
        id: "q5",
        dimension: "talent",
        prompt:
          "Los líderes y mandos medios muestran apertura para adoptar nuevas herramientas digitales.",
      },
      {
        id: "q6",
        dimension: "talent",
        prompt:
          "Existe tiempo, presupuesto o disposición real para capacitar al personal en habilidades relacionadas con IA.",
      },
      {
        id: "q7",
        dimension: "talent",
        prompt:
          "La organización promueve aprendizaje continuo, pensamiento analítico y adaptación al cambio.",
      },
    ],
  },
  {
    id: "process",
    title: "Procesos y datos",
    intro:
      "Revisa si existen procesos y datos suficientemente sólidos para que la capacitación tenga impacto.",
    questions: [
      {
        id: "q8",
        dimension: "process",
        prompt:
          "Los procesos clave de la empresa están suficientemente documentados y estandarizados.",
      },
      {
        id: "q9",
        dimension: "process",
        prompt:
          "La empresa cuenta con datos confiables para apoyar decisiones o automatizaciones.",
      },
      {
        id: "q10",
        dimension: "process",
        prompt:
          "Las áreas clave ya utilizan herramientas digitales de forma consistente en su trabajo diario.",
      },
    ],
  },
  {
    id: "governance",
    title: "Riesgo y gobernanza",
    intro:
      "Confirma si la empresa puede incorporar IA sin perder trazabilidad, seguridad o supervisión humana.",
    questions: [
      {
        id: "q11",
        dimension: "governance",
        prompt:
          "La empresa cuenta con lineamientos sobre privacidad, seguridad y uso responsable de herramientas de IA.",
      },
      {
        id: "q12",
        dimension: "governance",
        prompt:
          "Aunque se use IA como apoyo, las decisiones relevantes mantendrían supervisión humana.",
      },
    ],
  },
];

export const QUESTION_IDS = DIAGNOSTIC_SECTIONS.flatMap((section) =>
  section.questions.map((question) => question.id),
);

export const MATURITY_DESCRIPTIONS = {
  Inicial:
    "La empresa reconoce la relevancia de la IA, pero todavía no cuenta con bases suficientes para impulsar una capacitación efectiva.",
  Emergente:
    "Existen señales de interés y algunas capacidades aisladas, aunque todavía hay brechas que limitan una adopción ordenada.",
  "En transición":
    "La organización ya tiene condiciones relevantes para avanzar, pero necesita priorizar, formalizar y acelerar la ruta de talento.",
  Estratégico:
    "La empresa muestra una preparación alta para escalar capacitación en IA con foco en valor, trazabilidad y adopción transversal.",
} as const;
