import { COURSE_SELECT_EVENT } from "@/lib/forms/course-event";

export const CLOSE_MENU_EVENT = "djawda-close-menu";

const GAP = 12;

type ScrollOptions = {
  force?: boolean;
  immediate?: boolean;
};

type LenisScroll = (target: number, options?: ScrollOptions) => void;

let lenisScroll: LenisScroll | null = null;
let scrollGeneration = 0;

export function registerLenis(scroll: LenisScroll | null) {
  lenisScroll = scroll;
}

/** Sticky bar height plus a small gap. Ignores the open mobile menu, which is in normal flow. */
export function headerClearance() {
  const header = document.querySelector("header");
  const bar = header?.firstElementChild;
  const barHeight = bar instanceof HTMLElement ? bar.getBoundingClientRect().height : 72;
  const border =
    header instanceof HTMLElement
      ? Number.parseFloat(getComputedStyle(header).borderBottomWidth) || 0
      : 0;
  return barHeight + border + GAP;
}

function visualAnchor(id: string): HTMLElement | null {
  const node = document.getElementById(id);
  if (!node) return null;
  if (id === "hero" || id.startsWith("course-")) return node;
  const heading = node.querySelector("h1, h2");
  if (!(heading instanceof HTMLElement)) return node;
  const eyebrow = heading.previousElementSibling;
  if (eyebrow instanceof HTMLElement) return eyebrow;
  return heading;
}

function layoutTop(node: HTMLElement) {
  // offsetTop ignores the in-view reveal transform, so the heading is not
  // measured while it is still translated down.
  let top = 0;
  let current: Element | null = node;
  while (current instanceof HTMLElement) {
    top += current.offsetTop;
    current = current.offsetParent;
  }
  return top;
}

function scrollToY(top: number, immediate: boolean) {
  const y = Math.max(0, top);
  if (lenisScroll) {
    lenisScroll(y, { force: true, immediate });
    return;
  }
  window.scrollTo({ top: y, behavior: "auto" });
}

export function scrollToId(id: string, immediate = false) {
  if (id === "hero") {
    scrollToY(0, immediate);
    return;
  }
  const anchor = visualAnchor(id);
  if (!anchor) return;
  scrollToY(layoutTop(anchor) - headerClearance(), immediate);
}

function hashIdFromAnchor(anchor: HTMLAnchorElement) {
  if (anchor.hasAttribute("download")) return null;
  const target = anchor.getAttribute("target");
  if (target && target !== "_self") return null;
  let url: URL;
  try {
    url = new URL(anchor.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;
  if (url.pathname !== window.location.pathname) return null;
  if (url.search !== window.location.search) return null;
  const id = decodeURIComponent(url.hash.replace(/^#/, ""));
  if (!id || !document.getElementById(id)) return null;
  return id;
}

function whenLayoutSettles(id: string, then: () => void) {
  const generation = ++scrollGeneration;
  const started = performance.now();
  let previous = Number.NaN;
  let stableFrames = 0;

  const tick = () => {
    if (generation !== scrollGeneration) return;
    const menuOpen = document.getElementById("mobile-nav");
    const anchor = visualAnchor(id);
    const docTop = anchor ? layoutTop(anchor) : 0;
    const shifted = !Number.isFinite(previous) || Math.abs(docTop - previous) >= 0.5;
    if (menuOpen || shifted) {
      stableFrames = 0;
      previous = docTop;
    } else {
      stableFrames += 1;
    }
    const timedOut = performance.now() - started > 900;
    if ((!menuOpen && stableFrames >= 2) || timedOut) {
      then();
      return;
    }
    window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
}

function publishHash(id: string) {
  const hash = `#${id}`;
  if (window.location.hash === hash) return;
  window.history.pushState(null, "", hash);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export function followHash(id: string, immediate = false) {
  window.dispatchEvent(new Event(CLOSE_MENU_EVENT));
  publishHash(id);
  whenLayoutSettles(id, () => {
    scrollToId(id, immediate);
  });
}

export function installAnchorClicks() {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest("a");
    if (!(anchor instanceof HTMLAnchorElement)) return;
    const id = hashIdFromAnchor(anchor);
    if (!id) return;

    event.preventDefault();
    event.stopPropagation();

    const course = anchor.dataset.course;
    if (course) {
      document.dispatchEvent(new CustomEvent(COURSE_SELECT_EVENT, { detail: course }));
    }
    followHash(id);
  };

  const onPop = () => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!id || !document.getElementById(id)) return;
    whenLayoutSettles(id, () => scrollToId(id));
  };

  document.addEventListener("click", onClick, true);
  window.addEventListener("popstate", onPop);
  return () => {
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("popstate", onPop);
  };
}
