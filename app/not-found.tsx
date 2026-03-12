import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="surface-panel max-w-xl px-8 py-10 text-center">
        <p className="eyebrow">AARIAC / Ruta no encontrada</p>
        <h1 className="display-title mt-4 text-4xl font-semibold text-[var(--navy)]">
          No encontramos este diagnostico
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--ink-soft)]">
          Es posible que el enlace ya no exista o que el envio todavia no se haya
          guardado en este entorno.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Volver al inicio
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-[var(--line)] px-6 py-3 text-sm font-semibold text-[var(--navy)] transition hover:bg-white"
          >
            Ver panel admin
          </Link>
        </div>
      </div>
    </main>
  );
}
