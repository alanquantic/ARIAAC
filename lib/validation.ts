import { z } from "zod";

import { QUESTION_IDS } from "@/lib/constants";

const textField = z
  .string()
  .trim()
  .min(2, "Este campo es obligatorio.")
  .max(120, "Este campo es demasiado largo.");

const scoreField = z.coerce
  .number()
  .min(1, "Selecciona una opción del 1 al 5.")
  .max(5, "Selecciona una opción del 1 al 5.");

export const diagnosticFormSchema = z.object({
  name: textField,
  email: z.string().trim().email("Ingresa un correo válido."),
  company: textField,
  role: textField,
  sector: textField,
  companySize: textField,
  region: textField,
  businessPriority: textField,
  mainConcern: textField,
  q1: scoreField,
  q2: scoreField,
  q3: scoreField,
  q4: scoreField,
  q5: scoreField,
  q6: scoreField,
  q7: scoreField,
  q8: scoreField,
  q9: scoreField,
  q10: scoreField,
  q11: scoreField,
  q12: scoreField,
});

export type DiagnosticFormInput = z.input<typeof diagnosticFormSchema>;
export type DiagnosticFormSchema = z.output<typeof diagnosticFormSchema>;

export function countAnsweredQuestions(data: Partial<DiagnosticFormInput>) {
  return QUESTION_IDS.filter((id) => {
    const value = data[id];
    return typeof value === "number" && value >= 1 && value <= 5;
  }).length;
}
