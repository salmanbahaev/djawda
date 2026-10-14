"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/ui/mark";
import { CLOSE_MENU_EVENT } from "@/lib/anchor-scroll";

export type HeaderProps = {
  logo: string | null;
  logoAlt: string;
  wordmark: string;
  wordmarkRu: string;
  nav: readonly { label: string; href: string }[];
  navCta: string;
};

function siteHref(href: string) {
  if (href.startsWith("#")) return `/${href}`;
  return href;
}

export function Header(props: HeaderProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const links = props.nav.map((item) => ({ ...item, href: siteHref(item.href) }));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onClose = () => setOpen(false);
    window.addEventListener(CLOSE_MENU_EVENT, onClose);
    return () => window.removeEventListener(CLOSE_MENU_EVENT, onClose);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-teal-950/75 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/#hero"
          className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <Mark src={props.logo} alt={props.logoAlt} height={46} priority tone="flat" />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-display text-2xl leading-none font-medium tracking-wide">
              {props.wordmark}
            </span>
            <span className="mt-1 truncate text-[0.68rem] tracking-[0.12em] text-white/70">
              {props.wordmarkRu}
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-4 text-[0.8125rem] text-white/80 lg:flex"
          aria-label="Основное меню"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap transition-colors duration-200 hover:text-accent-faint"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#lead"
            className="whitespace-nowrap rounded-full bg-[#f4f4f5] px-4 py-2 font-medium text-[#141416] transition duration-200 hover:bg-white"
          >
            {props.navCta}
          </Link>
        </nav>

        <button
          type="button"
          ref={menuButtonRef}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Закрыть меню" : "Открыть меню"}</span>
          <span className="flex w-5 flex-col gap-1.5" aria-hidden>
            <span
              className={`h-px bg-white transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px bg-white transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Мобильное меню"
            className="border-t border-white/10 bg-teal-950 lg:hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl px-3 py-3 text-lg transition-colors hover:text-accent-faint"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#lead"
                className="mt-2 rounded-full bg-[#f4f4f5] px-4 py-3 text-center font-medium text-[#141416]"
                onClick={() => setOpen(false)}
              >
                {props.navCta}
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
