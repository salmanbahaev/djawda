import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container>
        <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">404</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">Такой страницы нет</h1>
        <p className="mt-4 max-w-md text-muted">
          Возможно, адрес изменился. Направления школы собраны на главной.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-teal-900 px-5 py-3 text-sm font-medium text-white"
        >
          На главную
        </Link>
      </Container>
    </section>
  );
}
