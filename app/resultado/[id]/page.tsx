import { notFound } from "next/navigation";

import { ResultDashboard } from "@/components/result-dashboard";
import { getSubmission } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await getSubmission(id);

  if (!submission) {
    notFound();
  }

  return <ResultDashboard submission={submission} />;
}
