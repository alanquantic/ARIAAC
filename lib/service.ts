import { randomUUID } from "node:crypto";

import { generateReport } from "@/lib/report";
import { calculateScores } from "@/lib/scoring";
import { saveSubmission } from "@/lib/storage";
import { DiagnosticFormValues, SubmissionRecord } from "@/lib/types";

export async function createSubmission(input: DiagnosticFormValues) {
  const scores = calculateScores(input);
  const report = await generateReport(input, scores);

  const record: SubmissionRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    input,
    scores,
    report,
  };

  await saveSubmission(record);

  return record;
}
