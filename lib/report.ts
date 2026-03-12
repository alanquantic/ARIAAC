import OpenAI from "openai";

import { DIMENSION_LABELS, MATURITY_DESCRIPTIONS } from "@/lib/constants";
import { DiagnosticFormValues, DimensionKey, GeneratedReport, RoadmapPhase, ScoreBreakdown } from "@/lib/types";

const dimensionPriority: DimensionKey[] = ["strategy", "talent", "process", "governance"];

function toneForLevel(score: ScoreBreakdown["maturityLevel"]) {
  switch (score) {
    case "Inicial":
      return "preparacion de bases";
    case "Emergente":
      return "orden y claridad para la adopcion";
    case "En transicion":
      return "formalizacion y despliegue progresivo";
    case "Estrategico":
      return "escalamiento con medicion de valor";
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
      return "La organizacion todavia no traduce la IA a prioridades claras de negocio. Antes de capacitar masivamente, conviene definir casos de uso, responsables y criterios de valor.";
    }
    if (average < 4) {
      return "Existe una base de direccion para avanzar, pero hace falta bajar la vision a decisiones concretas, procesos prioritarios y responsables visibles.";
    }
    return "La direccion ya ve a la IA como una palanca estrategica. La oportunidad esta en sostener esa claridad con portafolio de casos, indicadores y seguimiento.";
  }

  if (dimension === "talent") {
    if (average < 3) {
      return "La principal brecha esta en talento y cultura. Sin tiempo, patrocinio y aprendizaje continuo, la capacitacion correria el riesgo de quedarse en esfuerzo aislado.";
    }
    if (average < 4) {
      return "Hay disposicion para aprender, aunque todavia puede haber heterogeneidad entre lideres y equipos. RH puede acelerar mucho estandarizando rutas por perfil.";
    }
    return "La cultura y el liderazgo muestran buenas condiciones para aprender y transferir practicas. Esto abre espacio para programas por rol y por familia de puestos.";
  }

  if (dimension === "process") {
    if (average < 3) {
      return "Los procesos y datos aun no ofrecen una base robusta para capturar valor con IA. Conviene priorizar estandarizacion operativa y calidad de informacion antes de escalar herramientas.";
    }
    if (average < 4) {
      return "La empresa tiene bases parciales en digitalizacion y proceso, pero todavia necesita mayor consistencia para asegurar impacto replicable.";
    }
    return "La disciplina operativa y el uso de datos ya dan soporte a iniciativas de mayor impacto. Esto favorece pilotos con metas claras de tiempo, calidad y riesgo.";
  }

  if (average < 3) {
    return "La gobernanza actual puede dejar expuesta a la empresa a decisiones poco trazables, errores de uso o riesgos de privacidad. Es importante formalizar reglas minimas antes de escalar.";
  }
  if (average < 4) {
    return `La organizacion ya muestra una base razonable de supervision humana y control, aunque todavia seria sano reforzar lineamientos en ${input.mainConcern.toLowerCase()}.`;
  }
  return "La empresa parece preparada para incorporar IA con criterios de responsabilidad, supervision humana y lineamientos internos consistentes.";
}

function buildSummary(input: DiagnosticFormValues, scores: ScoreBreakdown) {
  return `${input.company} muestra un nivel ${scores.maturityLevel} de preparacion para capacitar talento en IA. El resultado indica que la conversacion ya existe, pero la siguiente prioridad es consolidar ${toneForLevel(scores.maturityLevel)} para que la inversion en formacion se traduzca en productividad, adopcion y menor riesgo.`;
}

function buildBusinessImpact(input: DiagnosticFormValues, scores: ScoreBreakdown) {
  const lowDimension = topGaps(scores)[0];
  const highDimension = topStrengths(scores)[0];

  return `Hoy la mejor palanca para ${input.businessPriority.toLowerCase()} esta en combinar formacion aplicada con decisiones organizacionales. ${DIMENSION_LABELS[highDimension]} aparece como una fortaleza relativa, mientras que ${DIMENSION_LABELS[lowDimension].toLowerCase()} necesita atencion inmediata para evitar una adopcion superficial o fragmentada.`;
}

function buildStrengths(input: DiagnosticFormValues, scores: ScoreBreakdown) {
  const strengths = topStrengths(scores);

  const items: string[] = strengths.map((dimension) => {
    if (dimension === "strategy") {
      return "La organizacion ya reconoce que la IA debe conectarse con objetivos reales de negocio, no solo con experimentacion aislada.";
    }
    if (dimension === "talent") {
      return "Existe una base cultural favorable para aprender nuevas herramientas y traducir la adopcion de IA a practicas del dia a dia.";
    }
    if (dimension === "process") {
      return "Los procesos y la digitalizacion actual ofrecen una plataforma razonable para que la capacitacion tenga impacto practico.";
    }
    return "La empresa muestra una preocupacion valida por operar IA con supervision humana, trazabilidad y criterios de uso responsable.";
  });

  items.push(
    `El mayor potencial declarado en ${input.aiOpportunityArea.toLowerCase()} puede convertirse en una narrativa movilizadora para activar pilotos con sentido de negocio.`,
  );

  return items.slice(0, 3);
}

function buildPriorityGaps(input: DiagnosticFormValues, scores: ScoreBreakdown) {
  const gaps = topGaps(scores);

  const items: string[] = gaps.map((dimension) => {
    if (dimension === "strategy") {
      return "Hace falta traducir el interes por IA a una agenda clara de prioridades, responsables y criterios de exito.";
    }
    if (dimension === "talent") {
      return "La ruta de formacion aun no parece suficientemente estructurada por perfiles, lideres y necesidades de negocio.";
    }
    if (dimension === "process") {
      return "Sin procesos mas consistentes y datos mas confiables, cualquier programa de IA puede perder traccion y retorno.";
    }
    return "La empresa necesita lineamientos minimos de privacidad, seguridad y supervision para evitar usos improvisados de IA.";
  });

  if (input.mainConcern === "No saber por donde empezar") {
    items.push(
      "Tambien es importante convertir la incertidumbre inicial en una hoja de ruta concreta de 90 dias para que el proyecto gane credibilidad rapidamente.",
    );
  } else if (input.mainConcern === "Falta de habilidades") {
    items.push(
      "La brecha de habilidades ya es visible y conviene atacar primero alfabetizacion en IA, pensamiento analitico y criterios de uso responsable.",
    );
  } else {
    items.push(
      `La preocupacion principal declarada, ${input.mainConcern.toLowerCase()}, debe integrarse explicitamente al plan de cambio y comunicacion.`,
    );
  }

  return items.slice(0, 5);
}

function buildRisks(scores: ScoreBreakdown) {
  const risks = [
    "Adopcion desordenada de herramientas con expectativas altas y resultados inconsistentes.",
    "Capacitacion desconectada de procesos reales, sin impacto medible en tiempo, calidad o riesgo.",
    "Dependencia de criterios individuales en lugar de practicas repetibles y supervision humana clara.",
  ];

  if (scores.dimensionScores.governance < 60) {
    risks.push(
      "Exposicion innecesaria a errores de uso, filtracion de informacion o decisiones poco trazables.",
    );
  }

  return risks.slice(0, 3);
}

function buildRoadmap(input: DiagnosticFormValues, scores: ScoreBreakdown): RoadmapPhase[] {
  const weakest = topGaps(scores);
  const needsGovernance = scores.dimensionScores.governance < 60;

  const phase90 = [
    "Alinear direccion, RH y lideres funcionales sobre 3 a 5 casos de uso con impacto claro.",
    "Realizar un skills audit por familias de puestos para distinguir tareas automatizables vs aumentables.",
    `Definir una narrativa comun sobre por que la IA importa hoy para ${input.businessPriority.toLowerCase()}.`,
  ];

  if (weakest.includes("process")) {
    phase90.push("Priorizar estandarizacion de procesos y criterios minimos de calidad de datos.");
  }

  const phase180 = [
    `Lanzar pilotos guiados en ${input.aiOpportunityArea.toLowerCase()} con medicion de tiempo, calidad y riesgo.`,
    "Capacitar a lideres y mandos medios en adopcion, prompts, criterio humano y supervision.",
    "Diseñar rutas de aprendizaje diferenciadas para lideres, personal administrativo y equipos de soporte.",
  ];

  if (needsGovernance) {
    phase180.push(
      "Publicar lineamientos internos de uso responsable, privacidad y escalamiento de decisiones asistidas por IA.",
    );
  }

  const phase360 = [
    "Escalar programas por rol con objetivos de transferencia al puesto y medicion trimestral.",
    "Integrar IA a procesos de RH como onboarding, desarrollo, evaluacion y analitica de talento.",
    "Construir un tablero ejecutivo que conecte adopcion, habilidades y valor de negocio.",
  ];

  return [
    { label: "0 a 90 dias", items: phase90.slice(0, 4) },
    { label: "3 a 6 meses", items: phase180.slice(0, 4) },
    { label: "6 a 12 meses", items: phase360.slice(0, 4) },
  ];
}

function buildTrainingRecommendation(input: DiagnosticFormValues, scores: ScoreBreakdown) {
  const audiences = [
    "Direccion y comite ejecutivo",
    "Recursos Humanos y desarrollo organizacional",
    "Mandos medios y lideres funcionales",
  ];

  if (input.companySize !== "1-50 colaboradores") {
    audiences.push("Equipos administrativos y operativos con casos guiados");
  }

  const modules = [
    "Alfabetizacion en IA y criterio humano",
    "Uso responsable, privacidad y seguridad",
    "Casos de uso por proceso y medicion de valor",
    "Prompts, automatizacion ligera y trabajo asistido",
  ];

  if (scores.dimensionScores.process < 65) {
    modules.push("Estandarizacion de procesos y calidad de datos para IA");
  }

  return {
    headline:
      "La recomendacion es activar un programa de capacitacion escalonado, con foco en adopcion responsable y aplicacion por rol.",
    audiences,
    modules: modules.slice(0, 5),
  };
}

function buildRuleBasedReport(
  input: DiagnosticFormValues,
  scores: ScoreBreakdown,
): GeneratedReport {
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
    strengths: buildStrengths(input, scores),
    priorityGaps: buildPriorityGaps(input, scores),
    risks: buildRisks(scores),
    dimensionInsights,
    roadmap: buildRoadmap(input, scores),
    trainingRecommendation: buildTrainingRecommendation(input, scores),
  };
}

async function maybeEnhanceSummaryWithAI(
  input: DiagnosticFormValues,
  scores: ScoreBreakdown,
  fallbackReport: GeneratedReport,
): Promise<GeneratedReport> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  const prompt = [
    "Reescribe el resumen ejecutivo y el impacto de negocio de este diagnostico.",
    "Mantener tono ejecutivo, concreto y en espanol.",
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

export function buildDimensionNarrative(scores: ScoreBreakdown, dimension: DimensionKey) {
  return `${DIMENSION_LABELS[dimension]}: ${scores.dimensionScores[dimension]}/100, promedio ${formatAverage(
    scores.dimensionAverages[dimension],
  )}/5. ${MATURITY_DESCRIPTIONS[scores.maturityLevel]}`;
}
