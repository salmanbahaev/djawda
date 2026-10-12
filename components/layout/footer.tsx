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
    <footer data-surface="dark" className="bg-[#0f0f10] text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Mark src={logo} alt={logoAlt} height={52} />
            <span className="flex flex-col leading-none">
              <span className="text-lg font-semibold tracking-wide">{wordmark}</span>
              <span className="mt-1 text-[0.68rem] tracking-[0.12em] text-white/65">
                {wordmarkRu}
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">{blurb}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-accent-faint uppercase">
            Связь
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                className="hover:text-accent-faint"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp · {phone}
              </a>
            </li>
            <li>
              <a
                className="hover:text-accent-faint"
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
              >
                {telegramLabel}
              </a>
            </li>
            <li>
              <a
                className="hover:text-accent-faint"
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
          <p className="text-xs font-semibold tracking-[0.18em] text-accent-faint uppercase">
            Школа
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link className="hover:text-accent-faint" href="/#courses">
                Направления
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent-faint" href="/#teachers">
                Преподаватели
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent-faint" href="/#contacts">
                Контакты
              </Link>
            </li>
            <li>
              <Link className="hover:text-accent-faint" href="/privacy">
                {privacyLabel}
              </Link>
            </li>
          </ul>
          <p className="mt-5 text-sm text-white/70">{address}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-6xl px-5 py-5 text-xs text-white/55 sm:px-8">{rights}</p>
      </div>
    </footer>
  );
}
