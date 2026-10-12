"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useId, useRef } from "react";

const PATH = "M24 78C180 18 340 108 600 62C860 16 1020 104 1176 48";

export function ApproachPath({ steps }: { steps: readonly { title: string; text: string }[] }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGCircleElement>(null);
  const haloRef = useRef<SVGCircleElement>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);
  const filterId = useId().replace(/:/g, "");

  useEffect(() => {
    if (reduce !== false) return;
    const root = rootRef.current;
    const path = pathRef.current;
    if (!root || !path) return;

    let cancelled = false;
    let cleanup = () => {};

    void (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      root.classList.add("is-motion");

      const apply = (progress: number) => {
        const clamped = Math.min(Math.max(progress, 0), 1);
        path.style.strokeDashoffset = `${length * (1 - clamped)}`;
        const point = path.getPointAtLength(clamped * length);
        beadRef.current?.setAttribute("cx", String(point.x));
        beadRef.current?.setAttribute("cy", String(point.y));
        haloRef.current?.setAttribute("cx", String(point.x));
        haloRef.current?.setAttribute("cy", String(point.y));
        const count = clamped >= 0.78 ? 3 : clamped >= 0.42 ? 2 : clamped >= 0.1 ? 1 : 0;
        cardRefs.current.forEach((card, index) => {
          card?.classList.toggle("is-lit", index < count);
        });
      };

      apply(0);
      const mm = gsap.matchMedia();
      const bind = (pin: boolean) => {
        const trigger = ScrollTrigger.create({
          trigger: root,
          start: "top 96px",
          end: pin ? "+=120%" : "bottom 55%",
          pin,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => apply(self.progress),
        });
        return () => trigger.kill();
      };
      mm.add("(min-width: 768px)", () => bind(true));
      mm.add("(max-width: 767px)", () => bind(false));

      cleanup = () => {
        mm.revert();
        root.classList.remove("is-motion");
        path.style.strokeDasharray = "";
        path.style.strokeDashoffset = "";
        cardRefs.current.forEach((card) => card?.classList.remove("is-lit"));
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduce, steps.length]);

  return (
    <div ref={rootRef} className="approach-path relative mt-14">
      <div className="relative mb-8 h-24 md:h-28">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={PATH}
            stroke="#3c3c42"
            strokeOpacity="0.28"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            ref={pathRef}
            d={PATH}
            stroke="#d6d6db"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle ref={haloRef} cx="24" cy="78" r="14" fill="#d6d6db" opacity="0.22" />
          <circle
            ref={beadRef}
            cx="24"
            cy="78"
            r="5.5"
            fill="#f4f4f5"
            filter={`url(#${filterId})`}
          />
        </svg>
      </div>
      <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
        {steps.map((step, index) => (
          <li
            key={step.title}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            className="approach-step rounded-3xl border border-line bg-[#18181a] p-6"
          >
            <span className="step-index text-xs font-semibold tracking-[0.18em] text-gold">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-2xl font-medium tracking-tight">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
