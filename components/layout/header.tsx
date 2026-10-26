"use client";

import { Mark } from "@/components/ui/mark";
import { CLOSE_MENU_EVENT, lockPageScroll, unlockPageScroll } from "@/lib/anchor-scroll";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export type HeaderProps = {
  logo: string | null;
  logoAlt: string;
  wordmark: string;
  wordmarkRu: string;
  nav: readonly { label: string; href: string }[];
  navCta: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

function siteHref(href: string) {
  if (href.startsWith("#")) return `/${href}`;
  return href;
}

export function Header(props: HeaderProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const menuId = useId();
  const links = props.nav.map((item) => ({ ...item, href: siteHref(item.href) }));
  const count = links.length + 1;
  const stagger = count > 1 ? Math.min(0.06, 0.4 / (count - 1)) : 0;

  useEffect(() => {
    document.documentElement.toggleAttribute("data-menu-open", open);
    if (!open) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [open]);

  useEffect(() => {
    return () => document.documentElement.removeAttribute("data-menu-open");
  }, []);

  useEffect(() => {
    const onClose = () => setOpen(false);
    window.addEventListener(CLOSE_MENU_EVENT, onClose);
    return () => window.removeEventListener(CLOSE_MENU_EVENT, onClose);
  }, []);

  useEffect(() => {
    if (!open) return;
    const button = menuButtonRef.current;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });

    function focusable() {
      const nodes = panel
        ? Array.from(panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"))
        : [];
      if (button) nodes.unshift(button);
      return nodes;
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        button?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-4 md:pt-4">
      <div
        data-header-bar
        className="pointer-events-auto relative z-50 mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 rounded-2xl border border-white/15 bg-[#0f0f10]/80 px-4 shadow-[0_8px_32px_rgba(15,15,16,0.28)] backdrop-blur-xl md:px-6"
      >
        <Link
          href="/#hero"
          className="press flex min-h-11 min-w-0 items-center gap-3"
          onClick={close}
        >
          <Mark src={props.logo} alt={props.logoAlt} height={36} priority tone="flat" />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-display text-2xl leading-none font-medium tracking-wide">
              {props.wordmark}
            </span>
            <span className="mt-1 truncate text-xs tracking-[0.12em] text-[#d7e4ea]">
              {props.wordmarkRu}
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-3 text-sm text-[#e7e7ea] min-[1180px]:flex"
          aria-label="Основное меню"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="press inline-flex min-h-11 items-center whitespace-nowrap px-1 hover:text-[var(--accent-soft)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#lead"
            className="press inline-flex min-h-11 items-center rounded-full bg-[var(--paper)] px-4 text-sm font-semibold whitespace-nowrap text-[var(--accent)] hover:bg-[var(--paper-raised)]"
          >
            {props.navCta}
          </Link>
        </nav>

        <button
          type="button"
          ref={menuButtonRef}
          className="press relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 min-[1180px]:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Закрыть меню" : "Открыть меню"}</span>
          <span className="relative block h-3 w-5" aria-hidden>
            <span
              className={`absolute left-0 h-px w-5 bg-white transition-transform duration-500 ease-brand ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute top-1.5 left-0 h-px w-5 bg-white transition-opacity duration-300 ease-brand ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-5 bg-white transition-transform duration-500 ease-brand ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            ref={panelRef}
            id={menuId}
            aria-label="Мобильное меню"
            className="pointer-events-auto fixed inset-0 z-40 flex flex-col overflow-y-auto bg-[#0f0f10]/95 px-6 pt-28 pb-12 backdrop-blur-xl min-[1180px]:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
          >
            <ul className="mx-auto flex w-full max-w-6xl flex-col gap-2">
              {links.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.5,
                    delay: reduce ? 0 : index * stagger,
                    ease: EASE,
                  }}
                >
                  <Link
                    href={link.href}
                    className="press flex min-h-11 items-center text-2xl text-[#f4f4f5]"
                    onClick={close}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="mx-auto mt-8 w-full max-w-6xl"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduce ? 0 : 0.5,
                delay: reduce ? 0 : links.length * stagger,
                ease: EASE,
              }}
            >
              <Link
                href="/#lead"
                className="press inline-flex min-h-11 items-center rounded-full bg-[var(--paper)] px-4 text-base font-semibold text-[var(--accent)]"
                onClick={close}
              >
                {props.navCta}
              </Link>
            </motion.div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
