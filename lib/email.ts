import { Resend } from "resend";

import { SubmissionRecord } from "@/lib/types";
import { formatDate, slugify } from "@/lib/utils";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildEmailHtml(submission: SubmissionRecord, resultUrl: string, pdfUrl: string) {
  const { input, scores, report } = submission;

  return `
    <div style="background:#f6f1e7;padding:32px 16px;font-family:'Helvetica Neue',Arial,sans-serif;color:#132230;">
      <div style="max-width:640px;margin:0 auto;background:#fffdfa;border:1px solid rgba(15,23,42,0.08);border-radius:28px;overflow:hidden;">
        <div style="background:#0f172a;padding:28px 28px 20px;color:#f8fafc;">
          <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#f59e0b;">AARIAC / Diagnostico IA</p>
          <h1 style="margin:0;font-size:32px;line-height:1.05;">Tu reporte ya esta listo</h1>
          <p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:#cbd5e1;">
            ${escapeHtml(input.company)} obtuvo un nivel ${escapeHtml(scores.maturityLevel)} con un score general de ${scores.overallScore}/100.
          </p>
        </div>

        <div style="padding:28px;">
          <p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#465467;">
            Hola ${escapeHtml(input.name)}, gracias por completar el diagnostico de preparacion para capacitar talento en IA.
          </p>
          <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#465467;">
            ${escapeHtml(report.summary)}
          </p>

          <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0 0 18px;">
            <div style="background:#fff7ed;border:1px solid rgba(194,65,12,0.16);border-radius:20px;padding:16px;">
              <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#9a3412;">Nivel</div>
              <div style="margin-top:8px;font-size:24px;font-weight:700;color:#0f172a;">${escapeHtml(scores.maturityLevel)}</div>
            </div>
            <div style="background:#f8fafc;border:1px solid rgba(15,23,42,0.08);border-radius:20px;padding:16px;">
              <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#475569;">Score</div>
              <div style="margin-top:8px;font-size:24px;font-weight:700;color:#0f172a;">${scores.overallScore}/100</div>
            </div>
          </div>

          <div style="margin:0 0 20px;">
            <div style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0f172a;">Fortalezas destacadas</div>
            <ul style="margin:0;padding-left:18px;color:#465467;line-height:1.8;">
              ${report.strengths
                .map((item) => `<li>${escapeHtml(item)}</li>`)
                .join("")}
            </ul>
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:26px;">
            <a href="${resultUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;padding:14px 18px;border-radius:999px;text-decoration:none;font-weight:700;">Ver resultado online</a>
            <a href="${pdfUrl}" style="display:inline-block;background:#f59e0b;color:#0f172a;padding:14px 18px;border-radius:999px;text-decoration:none;font-weight:700;">Descargar PDF</a>
          </div>

          <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#64748b;">
            Fecha de generacion: ${escapeHtml(formatDate(submission.createdAt))}. Si quieres profundizar el reporte, este correo puede servir como punto de partida para una sesion de interpretacion.
          </p>
        </div>
      </div>
    </div>
  `;
}

function buildEmailText(submission: SubmissionRecord, resultUrl: string, pdfUrl: string) {
  const { input, scores, report } = submission;

  return [
    `Hola ${input.name},`,
    "",
    `Tu diagnostico para ${input.company} ya esta listo.`,
    `Nivel: ${scores.maturityLevel}`,
    `Score general: ${scores.overallScore}/100`,
    "",
    report.summary,
    "",
    "Fortalezas destacadas:",
    ...report.strengths.map((item) => `- ${item}`),
    "",
    `Resultado online: ${resultUrl}`,
    `PDF descargable: ${pdfUrl}`,
  ].join("\n");
}

export async function sendDiagnosticEmail(
  submission: SubmissionRecord,
  baseUrl: string,
) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { sent: false, reason: "missing-resend-key" as const };
  }

  const resend = new Resend(apiKey);
  const from =
    process.env.RESEND_FROM ??
    "AARIAC Diagnostico <noreply@updates.ceoslogica.com>";
  const replyTo = process.env.RESEND_REPLY_TO;
  const adminTo = process.env.RESEND_ADMIN_TO;
  const resultUrl = `${baseUrl}/resultado/${submission.id}`;
  const pdfUrl = `${baseUrl}/api/diagnostics/${submission.id}/pdf`;
  const subject = `Tu diagnostico de IA para ${submission.input.company}`;

  const { error } = await resend.emails.send({
    from,
    to: [submission.input.email],
    bcc: adminTo ? [adminTo] : undefined,
    replyTo: replyTo ? [replyTo] : undefined,
    subject,
    html: buildEmailHtml(submission, resultUrl, pdfUrl),
    text: buildEmailText(submission, resultUrl, pdfUrl),
    headers: {
      "X-AARIAC-Submission": slugify(submission.id),
    },
  });

  if (error) {
    console.error("resend_error", error);
    return { sent: false, reason: "provider-error" as const };
  }

  return { sent: true, reason: "sent" as const };
}
