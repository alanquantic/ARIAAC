import { AdminDashboard } from "@/components/admin-dashboard";
import { listSubmissions } from "@/lib/storage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin | AARIAC",
};

export default async function AdminPage() {
  const submissions = await listSubmissions();

  return <AdminDashboard submissions={submissions} />;
}
