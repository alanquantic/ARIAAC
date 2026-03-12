export type QuestionId =
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "q7"
  | "q8"
  | "q9"
  | "q10"
  | "q11"
  | "q12";

export type DimensionKey = "strategy" | "talent" | "process" | "governance";

export type MaturityLevel =
  | "Inicial"
  | "Emergente"
  | "En transicion"
  | "Estrategico";

export interface QuestionDefinition {
  id: QuestionId;
  dimension: DimensionKey;
  prompt: string;
}

export interface QuestionSection {
  id: DimensionKey;
  title: string;
  intro: string;
  questions: QuestionDefinition[];
}

export interface DiagnosticFormValues {
  name: string;
  email: string;
  company: string;
  role: string;
  sector: string;
  companySize: string;
  region: string;
  businessPriority: string;
  aiOpportunityArea: string;
  mainConcern: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
  q11: number;
  q12: number;
}

export interface ScoreBreakdown {
  overallScore: number;
  rawTotal: number;
  maturityLevel: MaturityLevel;
  dimensionScores: Record<DimensionKey, number>;
  dimensionAverages: Record<DimensionKey, number>;
}

export interface RoadmapPhase {
  label: string;
  items: string[];
}

export interface TrainingRecommendation {
  headline: string;
  audiences: string[];
  modules: string[];
}

export interface GeneratedReport {
  aiMode: "rules" | "openai-assisted" | "gemini-assisted";
  summary: string;
  businessImpact: string;
  strengths: string[];
  priorityGaps: string[];
  risks: string[];
  dimensionInsights: Record<DimensionKey, string>;
  roadmap: RoadmapPhase[];
  trainingRecommendation: TrainingRecommendation;
}

export interface SubmissionRecord {
  id: string;
  createdAt: string;
  input: DiagnosticFormValues;
  scores: ScoreBreakdown;
  report: GeneratedReport;
}
