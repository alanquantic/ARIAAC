import { DIAGNOSTIC_SECTIONS } from "@/lib/constants";
import { DiagnosticFormValues, DimensionKey, MaturityLevel, ScoreBreakdown } from "@/lib/types";

const MAX_TOTAL_SCORE = 60;

function roundScore(value: number) {
  return Math.round(value);
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getMaturityLevel(score: number): MaturityLevel {
  if (score < 40) return "Inicial";
  if (score < 60) return "Emergente";
  if (score < 80) return "En transicion";
  return "Estrategico";
}

export function calculateScores(input: DiagnosticFormValues): ScoreBreakdown {
  const dimensionScores = {} as Record<DimensionKey, number>;
  const dimensionAverages = {} as Record<DimensionKey, number>;

  const rawTotal = DIAGNOSTIC_SECTIONS.reduce((acc, section) => {
    const values = section.questions.map((question) => input[question.id]);
    const total = values.reduce((sum, value) => sum + value, 0);
    const max = section.questions.length * 5;

    dimensionScores[section.id] = roundScore((total / max) * 100);
    dimensionAverages[section.id] = Number(average(values).toFixed(2));

    return acc + total;
  }, 0);

  const overallScore = roundScore((rawTotal / MAX_TOTAL_SCORE) * 100);

  return {
    overallScore,
    rawTotal,
    maturityLevel: getMaturityLevel(overallScore),
    dimensionScores,
    dimensionAverages,
  };
}
