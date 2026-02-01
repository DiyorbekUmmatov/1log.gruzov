import { useEffect, useRef } from "react";

type AnyScrollable = HTMLElement & { scrollTop?: number; scrollLeft?: number };

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true
  );
}

export function useScrollRotation(
  containerRef: React.RefObject<HTMLElement | null>,
  onRotate: (deg: number) => void
) {
  const rafId = useRef<number | null>(null);
  const rotation = useRef(0);
  const lastTouch = useRef<{ x: number; y: number } | null>(null);
  const onRotateRef = useRef(onRotate);
  onRotateRef.current = onRotate;

  const apply = (next: number) => {
    rotation.current = next;
    if (rafId.current !== null) return;

    rafId.current = window.requestAnimationFrame(() => {
      rafId.current = null;
      onRotateRef.current(rotation.current);
    });
  };

  useEffect(() => {
    if (prefersReducedMotion()) {
      onRotateRef.current(0);
      return;
    }

    const container = containerRef.current as AnyScrollable | null;
    if (!container) return;

    const onScroll = () => {
      const st = container.scrollTop ?? 0;
      const sl = container.scrollLeft ?? 0;
      const next = (st * 0.03 + sl * 0.06) % 360;
      apply(next);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      lastTouch.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!lastTouch.current || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - lastTouch.current.x;
      const dy = t.clientY - lastTouch.current.y;
      lastTouch.current = { x: t.clientX, y: t.clientY };

      apply((rotation.current + dx * 0.06 - dy * 0.03) % 360);
    };

    const onTouchEnd = () => {
      lastTouch.current = null;
    };

    onScroll();
    container.addEventListener("scroll", onScroll, { passive: true });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("scroll", onScroll);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [containerRef]);

  useEffect(() => {
    return () => {
      if (rafId.current !== null) window.cancelAnimationFrame(rafId.current);
    };
  }, []);
}
