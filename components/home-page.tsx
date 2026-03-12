import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  ClipboardList,
  Factory,
  ShieldCheck,
} from "lucide-react";

const outcomes = [
  {
    title: "Diagnostico serio, no un quiz generico",
    description:
      "Mide estrategia, talento, procesos y gobernanza para traducir la IA a decisiones de RH y de negocio.",
    icon: ClipboardList,
  },
  {
    title: "Lenguaje aterrizado a RH industrial",
    description:
      "El reporte habla de productividad, liderazgo, adopcion, supervision humana y familias de puestos.",
    icon: Factory,
  },
  {
    title: "Reporte ejecutivo listo para compartir",
    description:
      "Obtienes hallazgos, riesgos, prioridades y una ruta sugerida para 90 dias, 6 meses y 12 meses.",
    icon: Building2,
  },
];

const proofPoints = [
  "12 preguntas",
  "4 dimensiones criticas",
  "5 a 7 minutos",
  "PDF descargable",
];

const sectors = [
  "Manufactura",
  "Automotriz",
  "Logistica",
  "Metalmecanica",
  "Alimentos y bebidas",
  "Energia",
];

export function HomePage() {
  return (
    <main className="pb-16 pt-6 md:pb-24">
      <div className="container-shell">
        <header className="surface-panel flex items-center justify-between px-5 py-4 md:px-7">
          <div>
            <p className="eyebrow">AARIAC / RH + IA</p>
            <p className="mt-1 text-sm font-medium text-[var(--ink-soft)]">
              Diagnostico ejecutivo para empresas industriales
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--navy)] transition hover:bg-white md:inline-flex"
            >
              Panel admin
            </Link>
            <Link
              href="/diagnostico"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Iniciar diagnostico
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <section className="grid gap-6 pt-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
          <div className="surface-panel overflow-hidden px-6 py-8 md:px-8 md:py-10">
            <div className="max-w-3xl">
              <p className="eyebrow">Capacitacion en IA con criterio de negocio</p>
              <h1 className="display-title mt-4 text-5xl font-semibold leading-[0.95] text-[var(--navy)] md:text-7xl">
                Evalua que tan preparada esta tu empresa para formar talento en IA
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--ink-soft)] md:text-xl">
                Responde unas cuantas preguntas y recibe un reporte ejecutivo con
                nivel de madurez, brechas criticas, riesgos de no actuar y una ruta
                sugerida para Recursos Humanos y direccion.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {proofPoints.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-[rgba(15,23,42,0.08)] bg-white px-4 py-2 text-sm font-semibold text-[var(--navy)]"
                >
                  {point}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/diagnostico"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--amber)] px-6 py-4 text-sm font-semibold text-[var(--navy)] transition hover:-translate-y-0.5"
              >
                Quiero mi diagnostico
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center rounded-full border border-[var(--line)] px-6 py-4 text-sm font-semibold text-[var(--navy)] transition hover:bg-white"
              >
                Ver como funciona
              </a>
            </div>
          </div>

          <aside className="glow-card px-6 py-8 md:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Lo que obtienes</p>
                <h2 className="display-title mt-3 text-3xl font-semibold text-[var(--navy)]">
                  Un reporte listo para mover conversaciones internas
                </h2>
              </div>
              <div className="rounded-2xl bg-[var(--navy)] p-3 text-white">
                <BrainCircuit className="h-7 w-7" />
              </div>
            </div>

            <div className="mt-8 section-grid">
              {outcomes.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-[22px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-5 py-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-[var(--card-strong)] p-3 text-[var(--amber-deep)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--navy)]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </aside>
        </section>

        <section
          id="como-funciona"
          className="grid gap-6 pt-10 md:grid-cols-[0.85fr_1.15fr]"
        >
          <div className="surface-panel px-6 py-8 md:px-8">
            <p className="eyebrow">Pensado para RH</p>
            <h2 className="display-title mt-4 text-4xl font-semibold text-[var(--navy)]">
              Diagnostico de preparacion, no solo de curiosidad
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--ink-soft)]">
              La herramienta mide si la organizacion tiene las condiciones para
              capacitar bien, escalar con orden y proteger decisiones asistidas por
              IA. Eso hace que el resultado sea util para RH, direccion y areas
              operativas.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                "Estrategia y liderazgo",
                "Talento y cultura",
                "Procesos y datos",
                "Riesgo y gobernanza",
              ].map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm font-medium text-[var(--navy)]"
                >
                  <ShieldCheck className="h-4 w-4 text-[var(--teal)]" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel px-6 py-8 md:px-8">
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Contexto rapido",
                  text: "Captura datos basicos de empresa, sector, tamano y prioridad de negocio.",
                },
                {
                  step: "02",
                  title: "Escala simple 1 a 5",
                  text: "Responde doce preguntas con una escala clara para agilizar el levantamiento.",
                },
                {
                  step: "03",
                  title: "Resultado accionable",
                  text: "Obtienes score, nivel, brechas, riesgos y una ruta sugerida descargable.",
                },
              ].map((item) => (
                <article
                  key={item.step}
                  className="rounded-[24px] border border-[var(--line)] bg-white px-5 py-5"
                >
                  <p className="font-mono text-xs font-semibold tracking-[0.3em] text-[var(--amber-deep)]">
                    {item.step}
                  </p>
                  <h3 className="mt-4 text-xl font-semibold text-[var(--navy)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] bg-[var(--navy)] px-6 py-6 text-white">
              <p className="eyebrow text-[var(--amber)]">Sectores objetivo</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {sectors.map((sector) => (
                  <span
                    key={sector}
                    className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/90"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pt-10">
          <div className="surface-panel overflow-hidden px-6 py-8 md:px-8 md:py-10">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="eyebrow">Siguiente paso</p>
                <h2 className="display-title mt-4 text-4xl font-semibold text-[var(--navy)] md:text-5xl">
                  Si quieres vender confianza, el diagnostico debe verse ejecutivo
                </h2>
                <p className="mt-4 text-base leading-8 text-[var(--ink-soft)]">
                  Esta version ya deja lista una base de producto para captar leads,
                  generar reportes y abrir conversaciones comerciales en torno a
                  programas de capacitacion en IA.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  "Reporte con hallazgos, riesgos y roadmap",
                  "Persistencia local de envios para demos y seguimiento",
                  "Panel admin simple para revisar prospectos",
                  "PDF descargable listo para compartir",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-[var(--line)] bg-white px-5 py-5 text-sm leading-7 text-[var(--ink-soft)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/diagnostico"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--navy)] px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Empezar ahora
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-full border border-[var(--line)] px-6 py-4 text-sm font-semibold text-[var(--navy)] transition hover:bg-white"
              >
                Ver envios guardados
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
