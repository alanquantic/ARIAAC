import { randomUUID } from "node:crypto";

import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";

import { validateAntiSpamFields } from "@/lib/anti-spam";
import { sendDiagnosticEmail } from "@/lib/email";
import { verifyFormToken } from "@/lib/form-token";
import { createSubmission } from "@/lib/service";
import { isSubmissionRateLimited } from "@/lib/storage";
import {
  diagnosticFormSchema,
  diagnosticSubmissionSchema,
} from "@/lib/validation";

export const runtime = "nodejs";

function acceptedResponse(id: string = randomUUID(), emailSent = false) {
  return NextResponse.json({
    id,
    resultUrl: `/resultado/${id}`,
    pdfUrl: `/api/diagnostics/${id}/pdf`,
    emailSent,
  });
}

function logRejection(reason: string, body: Record<string, unknown>) {
  const safePayload = { ...body };
  delete safePayload.formToken;
  console.warn(`[anti-spam] ${reason}`, { payload: safePayload });
}

export async function POST(request: Request) {
  try {
    try {
      const verification = await checkBotId({
        advancedOptions: { checkLevel: "basic" },
      });

      if (verification.isBot) {
        console.warn("[anti-spam] Descartado por BotID");
        return acceptedResponse();
      }
    } catch (error) {
      console.warn("[anti-spam] BotID no disponible; continúan las demás capas", error);
    }

    const rawBody: unknown = await request.json();
    const body =
      rawBody && typeof rawBody === "object" && !Array.isArray(rawBody)
        ? (rawBody as Record<string, unknown>)
        : {};

    if (String(body.companyWebsite ?? "").trim()) {
      logRejection("Descartado por honeypot", body);
      return acceptedResponse();
    }

    const tokenVerification = verifyFormToken(body.formToken);
    if (!tokenVerification.valid) {
      logRejection(`Token: ${tokenVerification.reason}`, body);
      return acceptedResponse();
    }

    if (!process.env.FORM_SECRET) {
      console.warn("[anti-spam] FORM_SECRET no configurado; validación temporal omitida");
    }

    const parsed = diagnosticSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "No pudimos validar tus respuestas.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const diagnostic = diagnosticFormSchema.parse(parsed.data);
    const fieldVerification = validateAntiSpamFields(diagnostic);

    if (!fieldVerification.valid) {
      logRejection(`Validación estricta: ${fieldVerification.reason}`, body);
      return acceptedResponse();
    }

    if (await isSubmissionRateLimited(diagnostic.email)) {
      logRejection("Límite de 3 envíos por correo en 24 horas", body);
      return acceptedResponse();
    }

    const submission = await createSubmission(diagnostic);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    const emailStatus = await sendDiagnosticEmail(submission, baseUrl);

    return acceptedResponse(submission.id, emailStatus.sent);
  } catch (error) {
    console.error("diagnostic_submit_error", error);
    return NextResponse.json(
      { error: "Ocurrió un problema al guardar el diagnóstico." },
      { status: 500 },
    );
  }
}
