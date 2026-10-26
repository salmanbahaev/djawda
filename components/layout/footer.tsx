import Link from "next/link";
import { Mark } from "@/components/ui/mark";

export function Footer({
  logo,
  logoAlt,
  wordmark,
  wordmarkRu,
  blurb,
  privacyLabel,
  rights,
  phone,
  whatsappUrl,
  telegramUrl,
  telegramLabel,
  instagramUrl,
  instagramLabel,
  address,
}: {
  logo: string | null;
  logoAlt: string;
  wordmark: string;
  wordmarkRu: string;
  blurb: string;
  privacyLabel: string;
  rights: string;
  phone: string;
  whatsappUrl: string;
  telegramUrl: string;
  telegramLabel: string;
  instagramUrl: string;
  instagramLabel: string;
  address: string;
}) {
  return (
    <footer
      data-surface="dark"
      className="surface-dark border-t border-[var(--color-line)] text-[var(--color-ink)]"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] md:py-24">
        <div>
          <Link href="/" className="press inline-flex min-h-11 items-center gap-3">
            <Mark src={logo} alt={logoAlt} height={48} />
            <span className="flex flex-col leading-none">
              <span className="text-lg font-semibold tracking-wide">{wordmark}</span>
              <span className="mt-1 text-xs tracking-[0.12em] text-[#d7e4ea]">{wordmarkRu}</span>
            </span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#d0d0d4]">{blurb}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[#d7e4ea] uppercase">Связь</p>
          <ul className="mt-4 grid text-sm">
            <li>
              <a
                className="press inline-flex min-h-11 items-center hover:text-[#d7e4ea]"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp · {phone}
              </a>
            </li>
            <li>
              <a
                className="press inline-flex min-h-11 items-center hover:text-[#d7e4ea]"
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
              >
                {telegramLabel}
              </a>
            </li>
            <li>
              <a
                className="press inline-flex min-h-11 items-center hover:text-[#d7e4ea]"
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
              >
                {instagramLabel}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[#d7e4ea] uppercase">Школа</p>
          <ul className="mt-4 grid text-sm">
            <li>
              <Link
                className="press inline-flex min-h-11 items-center hover:text-[#d7e4ea]"
                href="/#courses"
              >
                Направления
              </Link>
            </li>
            <li>
              <Link
                className="press inline-flex min-h-11 items-center hover:text-[#d7e4ea]"
                href="/#teachers"
              >
                Преподаватели
              </Link>
            </li>
            <li>
              <Link
                className="press inline-flex min-h-11 items-center hover:text-[#d7e4ea]"
                href="/#contacts"
              >
                Контакты
              </Link>
            </li>
            <li>
              <Link
                className="press inline-flex min-h-11 items-center hover:text-[#d7e4ea]"
                href="/privacy"
              >
                {privacyLabel}
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-sm text-[#d0d0d4]">{address}</p>
        </div>
      </div>
      <div className="border-t border-[var(--color-line)]">
        <p className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-[#d0d0d4] sm:px-8">
          {rights}
        </p>
      </div>
    </footer>
  );
}
