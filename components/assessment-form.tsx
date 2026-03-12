"use client";

import { useDeferredValue, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import {
  useForm,
  useWatch,
  type UseFormRegisterReturn,
} from "react-hook-form";

import {
  BUSINESS_PRIORITIES,
  COMPANY_SIZES,
  DIAGNOSTIC_SECTIONS,
  MAIN_CONCERNS,
  OPPORTUNITY_AREAS,
  QUESTION_IDS,
  SCALE_OPTIONS,
  SECTORS,
} from "@/lib/constants";
import {
  DiagnosticFormInput,
  DiagnosticFormSchema,
  diagnosticFormSchema,
} from "@/lib/validation";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-2 flex items-center gap-2 text-sm text-[var(--amber-deep)]">
      <AlertCircle className="h-4 w-4" />
      {message}
    </p>
  );
}

function SelectField({
  id,
  label,
  placeholder,
  error,
  registration,
  options,
}: {
  id: string;
  label: string;
  placeholder: string;
  error?: string;
  registration: UseFormRegisterReturn;
  options: string[];
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-sm font-semibold text-[var(--navy)]">
        {label}
      </span>
      <select
        id={id}
        aria-label={label}
        {...registration}
        className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--navy)] outline-none transition focus:border-[var(--amber)]"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </label>
  );
}

export function AssessmentForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isRouting, startTransition] = useTransition();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DiagnosticFormInput, undefined, DiagnosticFormSchema>({
    resolver: zodResolver(diagnosticFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      role: "",
      sector: "",
      companySize: "",
      region: "",
      businessPriority: "",
      aiOpportunityArea: "",
      mainConcern: "",
    },
  });

  const values = useWatch({ control });
  const answeredCount = QUESTION_IDS.filter((id) => {
    const value = Number(values[id]);
    return Number.isFinite(value) && value >= 1 && value <= 5;
  }).length;
  const deferredAnsweredCount = useDeferredValue(answeredCount);
  const progress = Math.round((deferredAnsweredCount / QUESTION_IDS.length) * 100);
  const isBusy = isSubmitting || isRouting;
  const questionScale = SCALE_OPTIONS.map(
    (option) => `${option.label} ${option.description}`,
  ).join(" / ");

  const onSubmit = handleSubmit(async (formValues) => {
    setServerError(null);

    const response = await fetch("/api/diagnostics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });

    const payload = (await response.json()) as {
      error?: string;
      resultUrl?: string;
    };

    if (!response.ok || !payload.resultUrl) {
      setServerError(payload.error ?? "No pudimos procesar el diagnóstico.");
      return;
    }

    startTransition(() => {
      router.push(payload.resultUrl!);
    });
  });

  return (
    <main className="pb-16 pt-6 md:pb-24">
      <div className="container-shell">
        <div className="surface-panel overflow-hidden px-5 py-5 md:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)] transition hover:text-[var(--navy)]"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Link>
              <p className="eyebrow mt-5">AARIAC / Diagnóstico guiado</p>
              <h1 className="display-title mt-3 text-4xl font-semibold text-[var(--navy)] md:text-5xl">
                Diagnóstico de preparación para capacitar talento en IA
              </h1>
              <p className="mt-4 text-base leading-8 text-[var(--ink-soft)]">
                Responde en escala de 1 a 5. El resultado se traduce a un reporte
                ejecutivo con brechas prioritarias, riesgos y una ruta sugerida para
                RH y dirección.
              </p>
            </div>

            <aside className="glow-card w-full max-w-md px-5 py-5">
              <div className="flex items-center justify-between text-sm text-[var(--navy)]">
                <span className="font-semibold">Avance del diagnóstico</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-[rgba(15,23,42,0.08)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--amber),var(--teal))] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-[var(--line)] bg-white px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                    Respondidas
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--navy)]">
                    {deferredAnsweredCount}/{QUESTION_IDS.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--line)] bg-white px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                    Escala
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--navy)]">{questionScale}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="surface-panel px-5 py-6 md:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Paso 1 / Contexto</p>
                  <h2 className="mt-3 text-2xl font-semibold text-[var(--navy)]">
                    Comparte el contexto de tu organización
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                    Usaremos esta información para personalizar tu diagnóstico y
                    preparar el reporte.
                  </p>
                </div>
                <div className="rounded-2xl bg-[var(--card-strong)] p-3 text-[var(--amber-deep)]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block" htmlFor="name">
                  <span className="mb-2 block text-sm font-semibold text-[var(--navy)]">
                    Nombre
                  </span>
                  <input
                    id="name"
                    aria-label="Nombre"
                    {...register("name")}
                    className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--amber)]"
                    placeholder="Nombre completo"
                  />
                  <FieldError message={errors.name?.message} />
                </label>

                <label className="block" htmlFor="email">
                  <span className="mb-2 block text-sm font-semibold text-[var(--navy)]">
                    Correo corporativo
                  </span>
                  <input
                    id="email"
                    aria-label="Correo corporativo"
                    {...register("email")}
                    type="email"
                    className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--amber)]"
                    placeholder="nombre@empresa.com"
                  />
                  <FieldError message={errors.email?.message} />
                </label>

                <label className="block" htmlFor="company">
                  <span className="mb-2 block text-sm font-semibold text-[var(--navy)]">
                    Empresa
                  </span>
                  <input
                    id="company"
                    aria-label="Empresa"
                    {...register("company")}
                    className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--amber)]"
                    placeholder="Nombre de la empresa"
                  />
                  <FieldError message={errors.company?.message} />
                </label>

                <label className="block" htmlFor="role">
                  <span className="mb-2 block text-sm font-semibold text-[var(--navy)]">
                    Cargo
                  </span>
                  <input
                    id="role"
                    aria-label="Cargo"
                    {...register("role")}
                    className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--amber)]"
                    placeholder="Ej. Gerente de RH"
                  />
                  <FieldError message={errors.role?.message} />
                </label>

                <SelectField
                  id="sector"
                  label="Sector"
                  placeholder="Selecciona un sector"
                  error={errors.sector?.message}
                  registration={register("sector")}
                  options={SECTORS}
                />
                <SelectField
                  id="companySize"
                  label="Número de colaboradores"
                  placeholder="Selecciona un rango"
                  error={errors.companySize?.message}
                  registration={register("companySize")}
                  options={COMPANY_SIZES}
                />
                <label className="block" htmlFor="region">
                  <span className="mb-2 block text-sm font-semibold text-[var(--navy)]">
                    Estado o país
                  </span>
                  <input
                    id="region"
                    aria-label="Estado o país"
                    {...register("region")}
                    className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--amber)]"
                    placeholder="Ej. Nuevo León, México"
                  />
                  <FieldError message={errors.region?.message} />
                </label>
                <SelectField
                  id="businessPriority"
                  label="Prioridad del negocio"
                  placeholder="Selecciona una prioridad"
                  error={errors.businessPriority?.message}
                  registration={register("businessPriority")}
                  options={BUSINESS_PRIORITIES}
                />
                <SelectField
                  id="aiOpportunityArea"
                  label="Área con mayor potencial para IA"
                  placeholder="Selecciona un área"
                  error={errors.aiOpportunityArea?.message}
                  registration={register("aiOpportunityArea")}
                  options={OPPORTUNITY_AREAS}
                />
                <SelectField
                  id="mainConcern"
                  label="Principal preocupación frente a la IA"
                  placeholder="Selecciona una preocupación"
                  error={errors.mainConcern?.message}
                  registration={register("mainConcern")}
                  options={MAIN_CONCERNS}
                />
              </div>
            </section>

            {DIAGNOSTIC_SECTIONS.map((section, sectionIndex) => (
              <section key={section.id} className="surface-panel px-5 py-6 md:px-6">
                <p className="eyebrow">Paso {sectionIndex + 2} / {section.title}</p>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--navy)]">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                  {section.intro}
                </p>

                <div className="mt-6 space-y-5">
                  {section.questions.map((question, questionIndex) => {
                    const selected = Number(values[question.id]);

                    return (
                      <article
                        key={question.id}
                        className="rounded-[28px] border border-[var(--line)] bg-white px-5 py-5"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="max-w-2xl">
                            <p className="font-mono text-xs font-semibold tracking-[0.25em] text-[var(--amber-deep)]">
                              {sectionIndex + 1}.{questionIndex + 1}
                            </p>
                            <h3 className="mt-3 text-lg font-semibold leading-7 text-[var(--navy)]">
                              {question.prompt}
                            </h3>
                          </div>
                          <div className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                            {selected ? `Valor ${selected}` : "Sin responder"}
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 md:grid-cols-5">
                          {SCALE_OPTIONS.map((option) => {
                            const isActive = selected === option.value;

                            return (
                              <label
                                key={`${question.id}-${option.value}`}
                                className={`cursor-pointer rounded-[22px] border px-4 py-4 transition ${
                                  isActive
                                    ? "border-[var(--amber)] bg-[var(--card-strong)] shadow-[0_10px_30px_rgba(245,158,11,0.18)]"
                                    : "border-[var(--line)] bg-[rgba(255,255,255,0.72)] hover:border-[rgba(15,23,42,0.2)] hover:bg-white"
                                }`}
                              >
                                <input
                                  type="radio"
                                  value={option.value}
                                  className="sr-only"
                                  {...register(question.id)}
                                />
                                <span className="block text-2xl font-semibold text-[var(--navy)]">
                                  {option.label}
                                </span>
                                <span className="mt-2 block text-sm leading-6 text-[var(--ink-soft)]">
                                  {option.description}
                                </span>
                              </label>
                            );
                          })}
                        </div>

                        <FieldError message={errors[question.id]?.message} />
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-6">
            <section className="glow-card sticky top-6 px-5 py-6">
              <p className="eyebrow">Resultado esperado</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--navy)]">
                Lo que recibirás al finalizar
              </h2>

              <div className="mt-5 space-y-3">
                {[
                  "Score general y nivel de madurez",
                  "Lectura ejecutiva de fortalezas y áreas de oportunidad",
                  "Riesgos de no actuar",
                  "Ruta sugerida para 90 días, 6 meses y 12 meses",
                  "PDF descargable listo para compartir",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[var(--line)] bg-white px-4 py-4 text-sm leading-7 text-[var(--ink-soft)]"
                  >
                    {item}
                  </div>
                ))}
              </div>

              {serverError ? (
                <div className="mt-5 rounded-2xl border border-[rgba(194,65,12,0.18)] bg-[rgba(255,237,213,0.7)] px-4 py-4 text-sm leading-7 text-[var(--amber-deep)]">
                  {serverError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isBusy}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--navy)] px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBusy ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Generando resultado
                  </>
                ) : (
                  <>
                    Ver mi resultado
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </section>
          </aside>
        </form>
      </div>
    </main>
  );
}
