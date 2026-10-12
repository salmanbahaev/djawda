import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <section className="bg-[#0f0f10] py-24">
      <Container>
        <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">404</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">Такой страницы нет</h1>
        <p className="mt-4 max-w-md text-muted">
          Возможно, адрес изменился. Направления школы собраны на главной.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[#f4f4f5] px-5 py-3 text-sm font-medium text-[#141416]"
        >
          На главную
        </Link>
      </Container>
    </section>
  );
}
