import Link from "next/link";
import { ArrowLeft, Building2, ChartColumn, Users } from "lucide-react";

import { SubmissionRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function averageScore(submissions: SubmissionRecord[]) {
  if (!submissions.length) return 0;

  const total = submissions.reduce((sum, item) => sum + item.scores.overallScore, 0);
  return Math.round(total / submissions.length);
}

export function AdminDashboard({
  submissions,
}: {
  submissions: SubmissionRecord[];
}) {
  const sectors = new Set(submissions.map((item) => item.input.sector)).size;

  return (
    <main className="pb-16 pt-6 md:pb-24">
      <div className="container-shell">
        <div className="surface-panel overflow-hidden px-5 py-5 md:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)] transition hover:text-[var(--navy)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="mt-5 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="eyebrow">AARIAC / Panel de envíos</p>
              <h1 className="display-title mt-4 text-4xl font-semibold text-[var(--navy)] md:text-5xl">
                Seguimiento simple de diagnósticos guardados
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--ink-soft)]">
                Esta vista sirve para revisar envíos, interpretar resultados y dar
                seguimiento a las conversaciones comerciales.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Envios",
                  value: submissions.length,
                  icon: Users,
                },
                {
                  label: "Score promedio",
                  value: `${averageScore(submissions)}/100`,
                  icon: ChartColumn,
                },
                {
                  label: "Sectores",
                  value: sectors,
                  icon: Building2,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.label}
                    className="glow-card px-5 py-5 text-[var(--navy)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                        {item.label}
                      </span>
                      <Icon className="h-5 w-5 text-[var(--amber-deep)]" />
                    </div>
                    <p className="mt-4 text-3xl font-semibold">{item.value}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <section className="mt-6">
          <div className="surface-panel overflow-hidden">
            {submissions.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-[rgba(15,23,42,0.04)]">
                    <tr className="text-left text-sm text-[var(--ink-soft)]">
                      <th className="px-5 py-4 font-semibold">Fecha</th>
                      <th className="px-5 py-4 font-semibold">Empresa</th>
                      <th className="px-5 py-4 font-semibold">Contacto</th>
                      <th className="px-5 py-4 font-semibold">Sector</th>
                      <th className="px-5 py-4 font-semibold">Nivel</th>
                      <th className="px-5 py-4 font-semibold">Score</th>
                      <th className="px-5 py-4 font-semibold">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((item) => (
                      <tr key={item.id} className="border-t border-[var(--line)] bg-white/80">
                        <td className="px-5 py-4 text-sm text-[var(--ink-soft)]">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[var(--navy)]">{item.input.company}</p>
                          <p className="text-sm text-[var(--ink-soft)]">
                            {item.input.businessPriority}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-sm text-[var(--ink-soft)]">
                          <p>{item.input.name}</p>
                          <p>{item.input.email}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-[var(--ink-soft)]">
                          {item.input.sector}
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-[var(--card-strong)] px-3 py-1 text-sm font-semibold text-[var(--amber-deep)]">
                            {item.scores.maturityLevel}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-[var(--navy)]">
                          {item.scores.overallScore}/100
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            href={`/resultado/${item.id}`}
                            className="inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--navy)] transition hover:bg-[var(--card-strong)]"
                          >
                            Abrir reporte
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <p className="eyebrow">Sin envíos aún</p>
                <h2 className="display-title mt-4 text-4xl font-semibold text-[var(--navy)]">
                  El panel está listo para recibir respuestas
                </h2>
                <p className="mt-4 text-base leading-8 text-[var(--ink-soft)]">
                  En cuanto completes el primer diagnóstico, aquí aparecerán los
                  resultados guardados.
                </p>
                <div className="mt-8">
                  <Link
                    href="/diagnostico"
                    className="cta-primary inline-flex rounded-full px-6 py-4 text-sm font-semibold transition hover:-translate-y-0.5"
                  >
                    Crear primer diagnóstico
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
