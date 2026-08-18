import { z } from "zod";

import {
  BUSINESS_PRIORITIES,
  COMPANY_SIZES,
  MAIN_CONCERNS,
  QUESTION_IDS,
  SECTORS,
} from "@/lib/constants";

const textField = z
  .string()
  .trim()
  .min(2, "Este campo es obligatorio.")
  .max(120, "Este campo es demasiado largo.");

const scoreField = z.coerce
  .number()
  .min(1, "Selecciona una opción del 1 al 5.")
  .max(5, "Selecciona una opción del 1 al 5.");

const selectionField = (options: string[]) =>
  z
    .string()
    .trim()
    .refine((value) => options.includes(value), "Selecciona una opción válida.");

export const diagnosticFormSchema = z.object({
  name: textField,
  email: z
    .string()
    .trim()
    .max(254, "El correo es demasiado largo.")
    .email("Ingresa un correo válido."),
  company: textField,
  role: textField,
  sector: selectionField(SECTORS),
  companySize: selectionField(COMPANY_SIZES),
  region: textField,
  businessPriority: selectionField(BUSINESS_PRIORITIES),
  mainConcern: selectionField(MAIN_CONCERNS),
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

export const diagnosticSubmissionSchema = diagnosticFormSchema.extend({
  companyWebsite: z.string().max(200).optional().default(""),
  formToken: z.string().max(256).optional().default(""),
});

export type DiagnosticFormInput = z.input<typeof diagnosticFormSchema>;
export type DiagnosticFormSchema = z.output<typeof diagnosticFormSchema>;
export type DiagnosticSubmissionInput = z.input<typeof diagnosticSubmissionSchema>;
export type DiagnosticSubmissionSchema = z.output<typeof diagnosticSubmissionSchema>;

export function countAnsweredQuestions(data: Partial<DiagnosticFormInput>) {
  return QUESTION_IDS.filter((id) => {
    const value = data[id];
    return typeof value === "number" && value >= 1 && value <= 5;
  }).length;
}
