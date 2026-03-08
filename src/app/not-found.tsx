import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <p className="text-teal text-xs font-bold tracking-[0.15em] uppercase mb-3">Error 404</p>
        <h1 className="font-serif text-[2.5rem] md:text-[3.5rem] leading-[1.05] tracking-[-0.02em] text-ink mb-4">
          Página no encontrada.
        </h1>
        <p className="text-gray-500 text-base leading-relaxed mb-8">
          La página que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-content gap-2 bg-ink text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
