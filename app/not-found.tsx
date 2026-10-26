import { Container } from "@/components/ui/container";
import { getSettings } from "@/lib/cms/content";
import Link from "next/link";

export default async function NotFound() {
  const settings = await getSettings();

  return (
    <div className="surface-dark min-h-svh">
      <a className="skip-link" href="#content">
        К содержанию
      </a>
      <header className="pt-4">
        <Container>
          <Link
            href="/"
            className="press inline-flex min-h-11 items-center font-display text-2xl text-[var(--paper)]"
          >
            {settings.wordmark}
          </Link>
        </Container>
      </header>
      <main id="content" tabIndex={-1} className="pt-24 pb-16 md:pb-24">
        <Container>
          <p className="text-xs font-semibold tracking-[0.18em] text-[#d7e4ea] uppercase">404</p>
          <h1 className="mt-4 max-w-[680px] text-4xl text-balance sm:text-5xl">
            Такой страницы нет
          </h1>
          <p className="mt-6 max-w-[680px] text-pretty text-[#d0d0d4]">
            Возможно, адрес изменился. Направления школы собраны на главной.
          </p>
          <Link
            href="/"
            className="press mt-8 inline-flex min-h-11 items-center rounded-full bg-[var(--paper)] px-4 text-base font-semibold text-[var(--accent)]"
          >
            На главную
          </Link>
        </Container>
      </main>
    </div>
  );
}
