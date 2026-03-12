import { NextResponse } from "next/server";

import { sendDiagnosticEmail } from "@/lib/email";
import { createSubmission } from "@/lib/service";
import { diagnosticFormSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = diagnosticFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "No pudimos validar tus respuestas.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const submission = await createSubmission(parsed.data);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    const emailStatus = await sendDiagnosticEmail(submission, baseUrl);

    return NextResponse.json({
      id: submission.id,
      resultUrl: `/resultado/${submission.id}`,
      pdfUrl: `/api/diagnostics/${submission.id}/pdf`,
      emailSent: emailStatus.sent,
    });
  } catch {
    return NextResponse.json(
      { error: "Ocurrio un problema al guardar el diagnostico." },
      { status: 500 },
    );
  }
}
