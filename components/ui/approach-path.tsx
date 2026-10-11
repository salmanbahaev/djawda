"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useRef, useState } from "react";

export function ApproachPath({ steps }: { steps: readonly { title: string; text: string }[] }) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const beadX = useMotionValue(6);
  const beadY = useMotionValue(55);
  const springX = useSpring(beadX, { stiffness: 160, damping: 22, mass: 0.5 });
  const springY = useSpring(beadY, { stiffness: 160, damping: 22, mass: 0.5 });
  const beadLeft = useMotionTemplate`${springX}%`;
  const beadTop = useMotionTemplate`${springY}%`;
  const [armed, setArmed] = useState(false);
  const armedRef = useRef(false);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const path = pathRef.current;
    const track = trackRef.current;
    if (!path || !track) return;
    const rect = track.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 1200;
    const length = path.getTotalLength();
    let bestT = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i <= 64; i += 1) {
      const point = path.getPointAtLength((i / 64) * length);
      const dist = Math.abs(point.x - x);
      if (dist < bestDist) {
        bestDist = dist;
        bestT = i / 64;
      }
    }
    const point = path.getPointAtLength(bestT * length);
    beadX.set((point.x / 1200) * 100);
    beadY.set((point.y / 120) * 100);
    if (!armedRef.current) {
      armedRef.current = true;
      setArmed(true);
    }
  }

  return (
    <div className="relative mt-12" onPointerMove={onPointerMove}>
      <div ref={trackRef} className="relative mb-2 hidden h-24 md:block">
        <svg
          className="absolute inset-0 h-full w-full text-teal-800"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <motion.path
            ref={pathRef}
            d="M24 78C180 18 340 108 600 62C860 16 1020 104 1176 48"
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <motion.span
          aria-hidden
          className={`pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_0_7px_rgba(181,137,63,0.2)] ${armed ? "opacity-100" : "opacity-0"}`}
          style={{ left: beadLeft, top: beadTop }}
        />
      </div>
      <ol className="relative grid gap-4 md:grid-cols-3 md:gap-6">
        {steps.map((step, index) => (
          <motion.li
            key={step.title}
            className="rounded-3xl border border-line bg-paper-2 p-6 shadow-[0_18px_40px_-32px_rgba(0,61,82,0.65)]"
            initial={{ y: 16 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduce ? undefined : { y: -6 }}
          >
            <span className="text-xs font-semibold tracking-[0.18em] text-gold">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-2xl font-medium tracking-tight">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
