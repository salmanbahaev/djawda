import { COURSE_SELECT_EVENT } from "@/lib/forms/course-event";

export const CLOSE_MENU_EVENT = "djawda-close-menu";

const GAP = 12;

type ScrollOptions = {
  force?: boolean;
  immediate?: boolean;
};

type LenisScroll = (target: number, options?: ScrollOptions) => void;

type LenisLock = {
  stop: () => void;
  start: () => void;
};

const SCROLL_KEYS = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"]);

let lenisScroll: LenisScroll | null = null;
let lenisLock: LenisLock | null = null;
let scrollGeneration = 0;
let scrollLocks = 0;

function blockBackgroundKeys(event: KeyboardEvent) {
  if (!SCROLL_KEYS.has(event.key)) return;
  const target = event.target;
  if (target instanceof HTMLElement) {
    if (target.isContentEditable) return;
    const tag = target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (target.closest("[data-course-drawer-root]")) return;
  }
  event.preventDefault();
}

export function registerLenis(scroll: LenisScroll | null, lock: LenisLock | null = null) {
  lenisScroll = scroll;
  lenisLock = lock;
  if (scrollLocks > 0) lenisLock?.stop();
}

/** Stops Lenis and background keys while a course drawer is open. Nested scroll uses data-lenis-prevent. */
export function lockPageScroll() {
  if (typeof document === "undefined") return;
  scrollLocks += 1;
  if (scrollLocks > 1) return;
  const root = document.documentElement;
  const gap = window.innerWidth - root.clientWidth;
  root.style.paddingRight = gap > 0 ? `${gap}px` : "";
  root.setAttribute("data-scroll-lock", "");
  lenisLock?.stop();
  document.addEventListener("keydown", blockBackgroundKeys);
}

export function unlockPageScroll() {
  if (typeof document === "undefined") return;
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks > 0) return;
  const root = document.documentElement;
  root.style.paddingRight = "";
  root.removeAttribute("data-scroll-lock");
  document.removeEventListener("keydown", blockBackgroundKeys);
  lenisLock?.start();
}

/** Floating bar bottom plus a small gap. The open menu is an overlay and is not measured. */
export function headerClearance() {
  const bar = document.querySelector("[data-header-bar]");
  if (bar instanceof HTMLElement) return bar.getBoundingClientRect().bottom + GAP;
  return 80 + GAP;
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
