"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  r: number;
  a: number;
  accent: boolean;
  phase: number;
};

export type FlowFieldProps = {
  variant?: "full" | "quiet";
  className?: string;
};

export function FlowField({ variant = "full", className = "" }: FlowFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let visible = true;
    const pointer = { x: 0, y: 0, on: false };

    const seed = () => {
      const budget = variant === "quiet" ? 32000 : 17000;
      const cap = variant === "quiet" ? 36 : 70;
      const count = Math.max(16, Math.min(cap, Math.round((width * height) / budget)));
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.45 + Math.random() * 1.35,
        a: 0.16 + Math.random() * 0.42,
        accent: index % 19 === 0,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, width < 760 ? 1.25 : 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      seed();
    };

    const flow = (x: number, y: number, t: number) => {
      const s = 0.0012;
      const a = Math.sin(x * s * 2.1 + t) + Math.cos(y * s * 1.7 - t * 0.85);
      const b = Math.cos(x * s * 1.25 - y * s * 1.9 + t * 0.55);
      const angle = a * 1.2 + b;
      const speed = variant === "quiet" ? 0.11 : 0.18;
      return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed * 0.72 };
    };

    const ribbon = (time: number, yBase: number, amp: number, alpha: number) => {
      ctx.beginPath();
      const steps = 42;
      for (let i = 0; i <= steps; i += 1) {
        const p = i / steps;
        const x = p * width;
        const y =
          height * yBase +
          Math.sin(p * Math.PI * 2 + time) * height * amp +
          Math.sin(p * Math.PI * 5.5 - time * 1.3) * height * amp * 0.22;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(232, 236, 239, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(34, now - last);
      last = now;
      const t = now * 0.00011;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const shiftX = pointer.on ? (pointer.x - width / 2) * 0.012 : 0;
      const shiftY = pointer.on ? (pointer.y - height / 2) * 0.012 : 0;

      ribbon(t, 0.28, variant === "quiet" ? 0.035 : 0.055, variant === "quiet" ? 0.045 : 0.1);
      ribbon(
        t * 0.75 + 1.4,
        0.7,
        variant === "quiet" ? 0.03 : 0.045,
        variant === "quiet" ? 0.035 : 0.07,
      );

      for (const particle of particles) {
        const velocity = flow(particle.x, particle.y, t + particle.phase);
        particle.x += velocity.vx * dt * 0.055;
        particle.y += velocity.vy * dt * 0.055;
        if (particle.x < -12) particle.x = width + 12;
        if (particle.x > width + 12) particle.x = -12;
        if (particle.y < -12) particle.y = height + 12;
        if (particle.y > height + 12) particle.y = -12;
      }

      const cell = 88;
      const buckets = new Map<string, number[]>();
      particles.forEach((particle, index) => {
        const key = `${Math.floor(particle.x / cell)}:${Math.floor(particle.y / cell)}`;
        const bucket = buckets.get(key);
        if (bucket) bucket.push(index);
        else buckets.set(key, [index]);
      });

      const maxDist = variant === "quiet" ? 64 : 82;
      const maxDistSq = maxDist * maxDist;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        const cx = Math.floor(particle.x / cell);
        const cy = Math.floor(particle.y / cell);
        let links = 0;
        for (let oy = -1; oy <= 1; oy += 1) {
          for (let ox = -1; ox <= 1; ox += 1) {
            const bucket = buckets.get(`${cx + ox}:${cy + oy}`);
            if (!bucket) continue;
            for (const j of bucket) {
              if (j <= i || links > 2) continue;
              const other = particles[j];
              const dx = particle.x - other.x;
              const dy = particle.y - other.y;
              const distSq = dx * dx + dy * dy;
              if (distSq < maxDistSq) {
                const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.16;
                ctx.strokeStyle = `rgba(226, 230, 233, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(particle.x + shiftX, particle.y + shiftY);
                ctx.lineTo(other.x + shiftX, other.y + shiftY);
                ctx.stroke();
                links += 1;
              }
            }
          }
        }
      }

      for (const particle of particles) {
        ctx.beginPath();
        ctx.fillStyle = particle.accent
          ? `rgba(158, 180, 194, ${particle.a})`
          : `rgba(236, 239, 242, ${particle.a})`;
        ctx.arc(particle.x + shiftX, particle.y + shiftY, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const onPointer = (event: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.on = true;
    };
    const onLeave = () => {
      pointer.on = false;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);
    observer.observe(parent);
    parent.addEventListener("pointermove", onPointer);
    parent.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      observer.disconnect();
      parent.removeEventListener("pointermove", onPointer);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    />
  );
}
