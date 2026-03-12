import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="surface-panel max-w-xl px-8 py-10 text-center">
        <p className="eyebrow">AARIAC / Ruta no encontrada</p>
        <h1 className="display-title mt-4 text-4xl font-semibold text-[var(--navy)]">
          No encontramos este diagnóstico
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--ink-soft)]">
          Es posible que el enlace ya no exista o que el envío todavía no se haya
          guardado en este entorno.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="cta-primary rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
