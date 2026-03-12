import OpenAI from "openai";

import { DIMENSION_LABELS, MATURITY_DESCRIPTIONS, OPPORTUNITY_GUIDE } from "@/lib/constants";
import {
  DiagnosticFormValues,
  DimensionKey,
  GeneratedReport,
  OpportunityRecommendation,
  RoadmapPhase,
  ScoreBreakdown,
} from "@/lib/types";

const dimensionPriority: DimensionKey[] = ["strategy", "talent", "process", "governance"];

function toneForLevel(score: ScoreBreakdown["maturityLevel"]) {
  switch (score) {
    case "Inicial":
      return "preparación de bases";
    case "Emergente":
      return "orden y claridad para la adopción";
    case "En transición":
      return "formalización y despliegue progresivo";
    case "Estratégico":
      return "escalamiento con medición de valor";
  }
}

function formatAverage(average: number) {
  return average.toFixed(1);
}

function topStrengths(scores: ScoreBreakdown) {
  return [...dimensionPriority]
    .sort(
      (left, right) =>
        scores.dimensionScores[right] - scores.dimensionScores[left],
    )
    .slice(0, 2);
}

function topGaps(scores: ScoreBreakdown) {
  return [...dimensionPriority]
    .sort(
      (left, right) =>
        scores.dimensionScores[left] - scores.dimensionScores[right],
    )
    .slice(0, 2);
}

function getDimensionInsight(
  dimension: DimensionKey,
  average: number,
  input: DiagnosticFormValues,
) {
  if (dimension === "strategy") {
    if (average < 3) {
      return "La organización todavía no traduce la IA a prioridades claras de negocio. Antes de capacitar de forma más amplia, conviene definir casos de uso, responsables y criterios de valor.";
    }
    if (average < 4) {
      return "Existe una base de dirección para avanzar, pero hace falta bajar la visión a decisiones concretas, procesos prioritarios y responsables visibles.";
    }
    return "La dirección ya ve a la IA como una palanca estratégica. La oportunidad está en sostener esa claridad con un portafolio de casos, indicadores y seguimiento.";
  }

  if (dimension === "talent") {
    if (average < 3) {
      return "La principal brecha está en talento y cultura. Sin tiempo, patrocinio y aprendizaje continuo, la capacitación correría el riesgo de quedarse en un esfuerzo aislado.";
    }
    if (average < 4) {
      return "Hay disposición para aprender, aunque todavía puede haber diferencias entre líderes y equipos. RH puede acelerar mucho si estandariza rutas por perfil.";
    }
    return "La cultura y el liderazgo muestran buenas condiciones para aprender y transferir prácticas. Esto abre espacio para programas por rol y por familia de puestos.";
  }

  if (dimension === "process") {
    if (average < 3) {
      return "Los procesos y los datos aún no ofrecen una base robusta para capturar valor con IA. Conviene priorizar la estandarización operativa y la calidad de información antes de escalar herramientas.";
    }
    if (average < 4) {
      return "La empresa tiene bases parciales en digitalización y proceso, pero todavía necesita mayor consistencia para asegurar un impacto replicable.";
    }
    return "La disciplina operativa y el uso de datos ya dan soporte a iniciativas de mayor impacto. Esto favorece pilotos con metas claras de tiempo, calidad y riesgo.";
  }

  if (average < 3) {
    return "La gobernanza actual puede dejar expuesta a la empresa a decisiones poco trazables, errores de uso o riesgos de privacidad. Es importante formalizar reglas mínimas antes de escalar.";
  }
  if (average < 4) {
    return `La organización ya muestra una base razonable de supervisión humana y control, aunque todavía sería sano reforzar lineamientos en ${input.mainConcern.toLowerCase()}.`;
  }
  return "La empresa parece preparada para incorporar IA con criterios de responsabilidad, supervisión humana y lineamientos internos consistentes.";
}

function buildSummary(input: DiagnosticFormValues, scores: ScoreBreakdown) {
  return `${input.company} muestra un nivel ${scores.maturityLevel} de preparación para capacitar talento en IA. El resultado indica que la conversación ya existe, pero la siguiente prioridad es consolidar ${toneForLevel(scores.maturityLevel)} para que la inversión en formación se traduzca en productividad, adopción y menor riesgo.`;
}

function buildBusinessImpact(input: DiagnosticFormValues, scores: ScoreBreakdown) {
  const lowDimension = topGaps(scores)[0];
  const highDimension = topStrengths(scores)[0];

  return `Hoy la mejor palanca para ${input.businessPriority.toLowerCase()} está en combinar formación aplicada con decisiones organizacionales. ${DIMENSION_LABELS[highDimension]} aparece como una fortaleza relativa, mientras que ${DIMENSION_LABELS[lowDimension].toLowerCase()} necesita atención inmediata para evitar una adopción superficial o fragmentada.`;
}

function inferOpportunityArea(input: DiagnosticFormValues, scores: ScoreBreakdown) {
  const sector = input.sector.toLowerCase();
  const priority = input.businessPriority;

  if (priority === "Reducción de rotación" || priority === "Formación de líderes") {
    return "Recursos Humanos";
  }

  if (priority === "Automatización administrativa") {
    return "Administración y finanzas";
  }

  if (priority === "Cumplimiento y riesgo") {
    return "Calidad y cumplimiento";
  }

  if (sector.includes("logística")) {
    return "Logística";
  }

  if (
    [
      "manufactura",
      "automotriz",
      "metalmecánica",
      "alimentos",
      "agroindustria",
      "energía",
      "minería",
      "aeroespacial",
    ].some((token) => sector.includes(token))
  ) {
    if (scores.dimensionScores.process < 65) {
      return "Calidad y cumplimiento";
    }

    if (priority === "Eficiencia operativa" || priority === "Productividad") {
      return "Operaciones";
    }

    return "Mantenimiento";
  }

  if (sector.includes("retail") || sector.includes("turismo")) {
    return "Comercial y servicio";
  }

  if (
    sector.includes("servicios empresariales") ||
    sector.includes("tecnología") ||
    sector.includes("software") ||
    sector.includes("universidades") ||
    sector.includes("gobierno") ||
    sector.includes("servicios financieros")
  ) {
    if (priority === "Productividad") {
      return "Administración y finanzas";
    }

    return "Recursos Humanos";
  }

  if (sector.includes("salud")) {
    return priority === "Cumplimiento y riesgo"
      ? "Calidad y cumplimiento"
      : "Operaciones";
  }

  return priority === "Eficiencia operativa" ? "Operaciones" : "Recursos Humanos";
}

function buildOpportunityRecommendation(
  input: DiagnosticFormValues,
  scores: ScoreBreakdown,
): OpportunityRecommendation {
  const area = inferOpportunityArea(input, scores);
  const guide =
    OPPORTUNITY_GUIDE.find((item) => item.area === area) ?? OPPORTUNITY_GUIDE[0];

  return {
    area: guide.area,
    rationale: `Por el sector ${input.sector.toLowerCase()} y la prioridad declarada de ${input.businessPriority.toLowerCase()}, ${guide.area.toLowerCase()} suele concentrar oportunidades tempranas con impacto visible, menor fricción de adopción y casos fáciles de traducir a una primera ruta de capacitación.`,
    examples: [...guide.examples],
  };
}

function buildStrengths(
  input: DiagnosticFormValues,
  scores: ScoreBreakdown,
  opportunityRecommendation: OpportunityRecommendation,
) {
  const strengths = topStrengths(scores);

  const items: string[] = strengths.map((dimension) => {
    if (dimension === "strategy") {
      return "La organización ya reconoce que la IA debe conectarse con objetivos reales de negocio, no solo con experimentación aislada.";
    }
    if (dimension === "talent") {
      return "Existe una base cultural favorable para aprender nuevas herramientas y traducir la adopción de IA a prácticas del día a día.";
    }
    if (dimension === "process") {
      return "Los procesos y la digitalización actual ofrecen una plataforma razonable para que la capacitación tenga impacto práctico.";
    }
    return "La empresa muestra una preocupación válida por operar IA con supervisión humana, trazabilidad y criterios de uso responsable.";
  });

  items.push(
    `La mejor área para empezar hoy apunta a ${opportunityRecommendation.area.toLowerCase()}, lo que da una base concreta para activar pilotos con sentido de negocio.`,
  );

  return items.slice(0, 3);
}

function buildPriorityGaps(input: DiagnosticFormValues, scores: ScoreBreakdown) {
  const gaps = topGaps(scores);

  const items: string[] = gaps.map((dimension) => {
    if (dimension === "strategy") {
      return "Hace falta traducir el interés por IA a una agenda clara de prioridades, responsables y criterios de éxito.";
    }
    if (dimension === "talent") {
      return "La ruta de formación aún no parece suficientemente estructurada por perfiles, líderes y necesidades del negocio.";
    }
    if (dimension === "process") {
      return "Sin procesos más consistentes y datos más confiables, cualquier programa de IA puede perder tracción y retorno.";
    }
    return "La empresa necesita lineamientos mínimos de privacidad, seguridad y supervisión para evitar usos improvisados de IA.";
  });

  if (input.mainConcern === "No saber por dónde empezar") {
    items.push(
      "También es importante convertir la incertidumbre inicial en una hoja de ruta concreta de 90 días para que el proyecto gane credibilidad rápidamente.",
    );
  } else if (input.mainConcern === "Falta de habilidades") {
    items.push(
      "La brecha de habilidades ya es visible y conviene fortalecer primero la alfabetización en IA, el pensamiento analítico y los criterios de uso responsable.",
    );
  } else {
    items.push(
      `La preocupación principal declarada, ${input.mainConcern.toLowerCase()}, debe integrarse explícitamente al plan de cambio y comunicación.`,
    );
  }

  return items.slice(0, 5);
}

function buildRisks(scores: ScoreBreakdown) {
  const risks = [
    "Adopción desordenada de herramientas con expectativas altas y resultados inconsistentes.",
    "Capacitación desconectada de procesos reales, sin impacto medible en tiempo, calidad o riesgo.",
    "Dependencia de criterios individuales en lugar de prácticas repetibles y supervisión humana clara.",
  ];

  if (scores.dimensionScores.governance < 60) {
    risks.push(
      "Exposición innecesaria a errores de uso, filtración de información o decisiones poco trazables.",
    );
  }

  return risks.slice(0, 3);
}

function buildRoadmap(
  input: DiagnosticFormValues,
  scores: ScoreBreakdown,
  opportunityRecommendation: OpportunityRecommendation,
): RoadmapPhase[] {
  const weakest = topGaps(scores);
  const needsGovernance = scores.dimensionScores.governance < 60;

  const phase90 = [
    "Alinear dirección, RH y líderes funcionales sobre 3 a 5 casos de uso con impacto claro.",
    "Realizar un análisis de habilidades por familias de puestos para distinguir tareas automatizables y tareas aumentables.",
    `Definir una narrativa común sobre por qué la IA importa hoy para ${input.businessPriority.toLowerCase()}.`,
  ];

  if (weakest.includes("process")) {
    phase90.push("Priorizar la estandarización de procesos y los criterios mínimos de calidad de datos.");
  }

  const phase180 = [
    `Lanzar pilotos guiados en ${opportunityRecommendation.area.toLowerCase()} con medición de tiempo, calidad y riesgo.`,
    "Capacitar a líderes y mandos medios en adopción, prompts, criterio humano y supervisión.",
    "Diseñar rutas de aprendizaje diferenciadas para líderes, personal administrativo y equipos de soporte.",
  ];

  if (needsGovernance) {
    phase180.push(
      "Publicar lineamientos internos de uso responsable, privacidad y escalamiento de decisiones asistidas por IA.",
    );
  }

  const phase360 = [
    "Escalar programas por rol con objetivos de transferencia al puesto y medición trimestral.",
    "Integrar IA a procesos de RH como onboarding, desarrollo, evaluación y analítica de talento.",
    "Construir un tablero ejecutivo que conecte adopción, habilidades y valor de negocio.",
  ];

  return [
    { label: "0 a 90 días", items: phase90.slice(0, 4) },
    { label: "3 a 6 meses", items: phase180.slice(0, 4) },
    { label: "6 a 12 meses", items: phase360.slice(0, 4) },
  ];
}

function buildTrainingRecommendation(input: DiagnosticFormValues, scores: ScoreBreakdown) {
  const audiences = [
    "Dirección y comité ejecutivo",
    "Recursos Humanos y desarrollo organizacional",
    "Mandos medios y líderes funcionales",
  ];

  if (input.companySize !== "1-50 colaboradores") {
    audiences.push("Equipos administrativos y operativos con casos guiados");
  }

  const modules = [
    "Alfabetización en IA y criterio humano",
    "Uso responsable, privacidad y seguridad",
    "Casos de uso por proceso y medición de valor",
    "Prompts, automatización ligera y trabajo asistido",
  ];

  if (scores.dimensionScores.process < 65) {
    modules.push("Estandarización de procesos y calidad de datos para IA");
  }

  return {
    headline:
      "La recomendación es activar un programa de capacitación escalonado, con foco en adopción responsable y aplicación por rol.",
    audiences,
    modules: modules.slice(0, 5),
  };
}

function buildRuleBasedReport(
  input: DiagnosticFormValues,
  scores: ScoreBreakdown,
): GeneratedReport {
  const opportunityRecommendation = buildOpportunityRecommendation(input, scores);
  const dimensionInsights = {
    strategy: getDimensionInsight("strategy", scores.dimensionAverages.strategy, input),
    talent: getDimensionInsight("talent", scores.dimensionAverages.talent, input),
    process: getDimensionInsight("process", scores.dimensionAverages.process, input),
    governance: getDimensionInsight(
      "governance",
      scores.dimensionAverages.governance,
      input,
    ),
  };

  return {
    aiMode: "rules",
    summary: buildSummary(input, scores),
    businessImpact: buildBusinessImpact(input, scores),
    strengths: buildStrengths(input, scores, opportunityRecommendation),
    priorityGaps: buildPriorityGaps(input, scores),
    risks: buildRisks(scores),
    dimensionInsights,
    opportunityRecommendation,
    roadmap: buildRoadmap(input, scores, opportunityRecommendation),
    trainingRecommendation: buildTrainingRecommendation(input, scores),
  };
}

async function maybeEnhanceSummaryWithAI(
  input: DiagnosticFormValues,
  scores: ScoreBreakdown,
  fallbackReport: GeneratedReport,
): Promise<GeneratedReport> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL ?? "gemini-3-flash-preview";
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  const prompt = [
    "Reescribe el resumen ejecutivo y el impacto de negocio de este diagnóstico.",
    "Mantener tono ejecutivo, concreto y en español.",
    "No inventar datos.",
    `Empresa: ${input.company}`,
    `Sector: ${input.sector}`,
    `Prioridad: ${input.businessPriority}`,
    `Nivel: ${scores.maturityLevel}`,
    `Score general: ${scores.overallScore}`,
    `Resumen base: ${fallbackReport.summary}`,
    `Impacto base: ${fallbackReport.businessImpact}`,
    "Devuelve exactamente dos parrafos separados por una linea en blanco.",
  ].join("\n");

  if (geminiApiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.4,
            },
          }),
        },
      );

      if (response.ok) {
        const json = (await response.json()) as {
          candidates?: Array<{
            content?: {
              parts?: Array<{ text?: string }>;
            };
          }>;
        };

        const content = json.candidates?.[0]?.content?.parts
          ?.map((part) => part.text ?? "")
          .join("\n")
          .trim();

        if (content) {
          const [summary, businessImpact] = content
            .split(/\n\s*\n/)
            .map((block) => block.trim())
            .filter(Boolean);

          return {
            ...fallbackReport,
            aiMode: "gemini-assisted" as const,
            summary: summary ?? fallbackReport.summary,
            businessImpact: businessImpact ?? fallbackReport.businessImpact,
          };
        }
      }
    } catch {
      // Fall through to OpenAI or rules-based output.
    }
  }

  if (!apiKey || !model) {
    return fallbackReport;
  }

  try {
    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model,
      input: prompt,
    });

    const content = response.output_text?.trim();

    if (!content) {
      return fallbackReport;
    }

    const [summary, businessImpact] = content
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean);

    return {
      ...fallbackReport,
      aiMode: "openai-assisted" as const,
      summary: summary ?? fallbackReport.summary,
      businessImpact: businessImpact ?? fallbackReport.businessImpact,
    };
  } catch {
    return fallbackReport;
  }
}

export async function generateReport(
  input: DiagnosticFormValues,
  scores: ScoreBreakdown,
): Promise<GeneratedReport> {
  const fallbackReport = buildRuleBasedReport(input, scores);
  return maybeEnhanceSummaryWithAI(input, scores, fallbackReport);
}

export function getOpportunityRecommendation(
  input: DiagnosticFormValues,
  scores: ScoreBreakdown,
  report?: GeneratedReport,
) {
  return report?.opportunityRecommendation ?? buildOpportunityRecommendation(input, scores);
}

export function buildDimensionNarrative(scores: ScoreBreakdown, dimension: DimensionKey) {
  return `${DIMENSION_LABELS[dimension]}: ${scores.dimensionScores[dimension]}/100, promedio ${formatAverage(
    scores.dimensionAverages[dimension],
  )}/5. ${MATURITY_DESCRIPTIONS[scores.maturityLevel]}`;
}
