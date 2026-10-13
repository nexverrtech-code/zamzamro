import Lenis from 'lenis';

// One shared Lenis instance for soft, inertia-based scrolling.
// Touch devices keep native scrolling (Lenis' default), and "reduce motion" users get native scroll too.
let lenis: Lenis | null = null;

const NAV_OFFSET = -96;

export function initSmoothScroll() {
  if (lenis || typeof window === 'undefined') return lenis;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
    anchors: { offset: NAV_OFFSET },
  });
  const raf = (time: number) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  if (import.meta.env.DEV) (window as unknown as { lenis: Lenis }).lenis = lenis;
  return lenis;
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}

export function scrollToElement(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.3 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.body.style.overflow = locked ? 'hidden' : '';
}
