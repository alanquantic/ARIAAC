import Link from "next/link";
import { ArrowLeft, Download, Gauge, ShieldCheck, Sparkles } from "lucide-react";

import { DIMENSION_LABELS, MATURITY_DESCRIPTIONS } from "@/lib/constants";
import { buildDimensionNarrative, getOpportunityRecommendation } from "@/lib/report";
import { SubmissionRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function ScoreDial({ score }: { score: number }) {
  return (
    <div
      className="relative flex h-40 w-40 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(var(--amber) ${score * 3.6}deg, rgba(15,23,42,0.08) 0deg)`,
      }}
    >
      <div className="flex h-[7.5rem] w-[7.5rem] flex-col items-center justify-center rounded-full bg-[var(--paper)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
        <span className="text-4xl font-semibold text-[var(--navy)]">{score}</span>
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
          de 100
        </span>
      </div>
    </div>
  );
}

export function ResultDashboard({ submission }: { submission: SubmissionRecord }) {
  const { id, input, scores, report, createdAt } = submission;
  const opportunityRecommendation = getOpportunityRecommendation(input, scores, report);

  return (
    <main className="pb-16 pt-6 md:pb-24">
      <div className="container-shell">
        <div className="surface-panel overflow-hidden px-5 py-5 md:px-6">
          <Link
            href="/diagnostico"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)] transition hover:text-[var(--navy)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Hacer otro diagnóstico
          </Link>

          <section className="mt-5 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="glow-card px-6 py-8">
              <p className="eyebrow">Resultado generado</p>
              <div className="mt-6 flex justify-center">
                <ScoreDial score={scores.overallScore} />
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                  Nivel de madurez
                </p>
                <h1 className="display-title mt-2 text-4xl font-semibold text-[var(--navy)]">
                  {scores.maturityLevel}
                </h1>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                  {MATURITY_DESCRIPTIONS[scores.maturityLevel]}
                </p>
              </div>
            </div>

            <div className="surface-panel px-6 py-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <p className="eyebrow">Reporte ejecutivo para {input.company}</p>
                  <h2 className="display-title mt-4 text-4xl font-semibold text-[var(--navy)] md:text-5xl">
                    Diagnóstico de preparación para capacitar talento en IA
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[var(--ink-soft)]">
                    {report.summary}
                  </p>
                  <p className="mt-4 text-base leading-8 text-[var(--ink-soft)]">
                    {report.businessImpact}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <a
                    href={`/api/diagnostics/${id}/pdf`}
                    className="cta-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                  >
                    <Download className="h-4 w-4" />
                    Descargar PDF
                  </a>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {[
                  { label: "Empresa", value: input.company },
                  { label: "Sector", value: input.sector },
                  { label: "Cargo", value: input.role },
                  { label: "Fecha", value: formatDate(createdAt) },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-[var(--line)] bg-white px-4 py-4"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--navy)]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[24px] border border-[rgba(245,158,11,0.14)] bg-[var(--card-strong)] px-5 py-5">
                <p className="eyebrow">Área sugerida para empezar</p>
                <div className="mt-3 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
                  <div className="rounded-[20px] border border-white/70 bg-white/85 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                      Prioridad sugerida
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-[var(--navy)]">
                      {opportunityRecommendation.area}
                    </h3>
                  </div>
                  <div>
                    <p className="text-sm leading-7 text-[var(--ink-soft)]">
                      {opportunityRecommendation.rationale}
                    </p>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {opportunityRecommendation.examples.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-white/70 bg-white/85 px-4 py-4 text-sm leading-7 text-[var(--ink-soft)]"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="surface-panel px-5 py-6 md:px-6">
              <div className="flex items-center gap-3">
                <Gauge className="h-5 w-5 text-[var(--amber-deep)]" />
                <h2 className="text-2xl font-semibold text-[var(--navy)]">
                  Resultado por dimensión
                </h2>
              </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {Object.entries(scores.dimensionScores).map(([key, score]) => (
                <article
                  key={key}
                  className="rounded-[24px] border border-[var(--line)] bg-white px-5 py-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-[var(--navy)]">
                      {DIMENSION_LABELS[key as keyof typeof DIMENSION_LABELS]}
                    </h3>
                    <div className="rounded-full bg-[var(--card-strong)] px-3 py-1 text-sm font-semibold text-[var(--amber-deep)]">
                      {score}/100
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
                    {report.dimensionInsights[key as keyof typeof report.dimensionInsights]}
                  </p>
                  <p className="mt-4 text-xs leading-6 text-[var(--ink-soft)]">
                    {buildDimensionNarrative(scores, key as keyof typeof scores.dimensionScores)}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <section className="glow-card px-5 py-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-[var(--amber-deep)]" />
                <h2 className="text-2xl font-semibold text-[var(--navy)]">
                  Fortalezas
                </h2>
              </div>
              <div className="mt-5 space-y-3">
                {report.strengths.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[var(--line)] bg-white px-4 py-4 text-sm leading-7 text-[var(--ink-soft)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="surface-panel px-5 py-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[var(--teal)]" />
                <h2 className="text-2xl font-semibold text-[var(--navy)]">
                  Riesgos de no actuar
                </h2>
              </div>
              <div className="mt-5 space-y-3">
                {report.risks.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[var(--line)] bg-white px-4 py-4 text-sm leading-7 text-[var(--ink-soft)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-panel px-5 py-6 md:px-6">
            <h2 className="text-2xl font-semibold text-[var(--navy)]">
              Brechas prioritarias
            </h2>
            <div className="mt-5 space-y-3">
              {report.priorityGaps.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[var(--line)] bg-white px-4 py-4 text-sm leading-7 text-[var(--ink-soft)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel px-5 py-6 md:px-6">
            <h2 className="text-2xl font-semibold text-[var(--navy)]">
              Ruta sugerida
            </h2>
            <div className="mt-5 grid gap-4">
              {report.roadmap.map((phase) => (
                <article
                  key={phase.label}
                  className="rounded-[24px] border border-[rgba(194,65,12,0.14)] bg-[rgba(255,247,237,0.82)] px-5 py-5"
                >
                  <p className="font-mono text-xs font-semibold tracking-[0.28em] text-[var(--amber-deep)]">
                    {phase.label}
                  </p>
                  <div className="mt-4 space-y-3">
                    {phase.items.map((item) => (
                      <p
                        key={item}
                        className="rounded-2xl border border-white/60 bg-white/85 px-4 py-4 text-sm leading-7 text-[var(--ink-soft)]"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="glow-card px-5 py-6 md:px-6">
            <h2 className="text-2xl font-semibold text-[var(--navy)]">
              Enfoque de capacitación recomendado
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--ink-soft)]">
              {report.trainingRecommendation.headline}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-[var(--line)] bg-white px-5 py-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                  Públicos sugeridos
                </p>
                <div className="mt-4 space-y-3">
                  {report.trainingRecommendation.audiences.map((item) => (
                    <p
                      key={item}
                      className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-4 text-sm leading-7 text-[var(--ink-soft)]"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-[var(--line)] bg-white px-5 py-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                  Módulos sugeridos
                </p>
                <div className="mt-4 space-y-3">
                  {report.trainingRecommendation.modules.map((item) => (
                    <p
                      key={item}
                      className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-4 text-sm leading-7 text-[var(--ink-soft)]"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
