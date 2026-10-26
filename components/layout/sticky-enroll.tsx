"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function StickyEnroll() {
  const pathname = usePathname();
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    const targets = [document.getElementById("lead"), document.querySelector("footer")].filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    );
    if (targets.length === 0) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setHide(visible.size > 0);
      },
      { rootMargin: "0px 0px 80px 0px", threshold: 0 },
    );
    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  if (pathname !== "/" || hide) return null;

  return (
    <div className="sticky-enroll fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0f0f10]/92 p-3 backdrop-blur-xl md:hidden">
      <Link
        href="/#lead"
        className="press flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--paper)] px-4 text-base font-semibold text-[var(--accent)]"
      >
        Записаться
      </Link>
    </div>
  );
}
