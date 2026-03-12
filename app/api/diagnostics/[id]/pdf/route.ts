import { getSubmission } from "@/lib/storage";
import { renderSubmissionPdf } from "@/lib/pdf";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const submission = await getSubmission(id);

  if (!submission) {
    return new Response("Not found", { status: 404 });
  }

  const pdf = await renderSubmissionPdf(submission);
  const body = new Uint8Array(pdf);
  const filename = `${slugify(submission.input.company)}-diagnostico-ia.pdf`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
