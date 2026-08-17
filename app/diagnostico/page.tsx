import { AssessmentForm } from "@/components/assessment-form";
import { issueFormToken } from "@/lib/form-token";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Diagnóstico | AARIAC",
};

export default function DiagnosticoPage() {
  return <AssessmentForm initialFormToken={issueFormToken()} />;
}
