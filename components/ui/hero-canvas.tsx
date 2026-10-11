"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { HeroPoster } from "@/components/ui/hero-poster";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const HeroScene = dynamic(() => import("@/components/ui/hero-scene").then((mod) => mod.HeroScene), {
  ssr: false,
  loading: () => <HeroPoster />,
});

class SceneBoundary extends Component<
  { onFail: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail();
  }

  render() {
    if (this.state.failed) return <HeroPoster />;
    return this.props.children;
  }
}

export function HeroCanvas() {
  const reduce = useReducedMotion();
  const isClient = useIsClient();
  const host = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [fallback, setFallback] = useState(false);
  const onLow = useCallback(() => setFallback(true), []);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "160px",
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const live = isClient && reduce === false && !fallback && inView;

  return (
    <div ref={host} className="absolute inset-0" aria-hidden>
      {live ? (
        <SceneBoundary onFail={onLow}>
          <HeroScene onLow={onLow} />
        </SceneBoundary>
      ) : (
        <HeroPoster />
      )}
    </div>
  );
}
