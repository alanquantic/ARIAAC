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
  "Logistica",
  "Automotriz",
  "Metalmecanica",
  "Alimentos y bebidas",
  "Energia",
  "Construccion",
  "Servicios empresariales",
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
  "Reduccion de rotacion",
  "Eficiencia operativa",
  "Formacion de lideres",
  "Automatizacion administrativa",
  "Cumplimiento y riesgo",
];

export const OPPORTUNITY_AREAS = [
  "Recursos Humanos",
  "Operaciones",
  "Logistica",
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
  "Falta de claridad estrategica",
  "Baja calidad de datos",
  "No saber por donde empezar",
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
      "Mide que tan alineada esta la direccion respecto al valor y al rumbo de la IA.",
    questions: [
      {
        id: "q1",
        dimension: "strategy",
        prompt:
          "La direccion tiene una vision clara de como la IA puede impactar productividad, talento y competitividad.",
      },
      {
        id: "q2",
        dimension: "strategy",
        prompt:
          "La empresa ya identifico procesos o areas donde la IA podria aportar valor real.",
      },
      {
        id: "q3",
        dimension: "strategy",
        prompt:
          "Existen responsables claros para impulsar iniciativas de IA y la capacitacion asociada.",
      },
    ],
  },
  {
    id: "talent",
    title: "Talento y cultura",
    intro:
      "Evalua si la organizacion tiene apertura, recursos y cultura de aprendizaje para adoptar IA.",
    questions: [
      {
        id: "q4",
        dimension: "talent",
        prompt:
          "La empresa conoce que puestos y tareas podrian ser automatizados, asistidos o fortalecidos con IA.",
      },
      {
        id: "q5",
        dimension: "talent",
        prompt:
          "Los lideres y mandos medios muestran apertura para adoptar nuevas herramientas digitales.",
      },
      {
        id: "q6",
        dimension: "talent",
        prompt:
          "Existe tiempo, presupuesto o disposicion real para capacitar al personal en habilidades relacionadas con IA.",
      },
      {
        id: "q7",
        dimension: "talent",
        prompt:
          "La organizacion promueve aprendizaje continuo, pensamiento analitico y adaptacion al cambio.",
      },
    ],
  },
  {
    id: "process",
    title: "Procesos y datos",
    intro:
      "Revisa si existen procesos y datos suficientemente solidos para que la capacitacion tenga impacto.",
    questions: [
      {
        id: "q8",
        dimension: "process",
        prompt:
          "Los procesos clave de la empresa estan suficientemente documentados y estandarizados.",
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
          "Las areas clave ya utilizan herramientas digitales de forma consistente en su trabajo diario.",
      },
    ],
  },
  {
    id: "governance",
    title: "Riesgo y gobernanza",
    intro:
      "Confirma si la empresa puede incorporar IA sin perder trazabilidad, seguridad o supervision humana.",
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
          "Aunque se use IA como apoyo, las decisiones relevantes mantendrian supervision humana.",
      },
    ],
  },
];

export const QUESTION_IDS = DIAGNOSTIC_SECTIONS.flatMap((section) =>
  section.questions.map((question) => question.id),
);

export const MATURITY_DESCRIPTIONS = {
  Inicial:
    "La empresa reconoce la relevancia de la IA, pero todavia no cuenta con bases suficientes para impulsar una capacitacion efectiva.",
  Emergente:
    "Existen señales de interes y algunas capacidades aisladas, aunque todavia hay brechas que limitan una adopcion ordenada.",
  "En transicion":
    "La organizacion ya tiene condiciones relevantes para avanzar, pero necesita priorizar, formalizar y acelerar la ruta de talento.",
  Estrategico:
    "La empresa muestra una preparacion alta para escalar capacitacion en IA con foco en valor, trazabilidad y adopcion transversal.",
} as const;
