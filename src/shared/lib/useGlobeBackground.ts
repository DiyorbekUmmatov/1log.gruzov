import { useEffect, useRef } from "react";

type AnyElement = HTMLElement & { scrollTop?: number; scrollLeft?: number };

export function useGlobeBackground(containerRef: React.RefObject<HTMLElement | null>) {
  const rafId = useRef<number | null>(null);
  const rotation = useRef(0);
  const lastTouch = useRef<{ x: number; y: number } | null>(null);

  const apply = (container: HTMLElement, next: number) => {
    rotation.current = next;
    if (rafId.current !== null) return;

    rafId.current = window.requestAnimationFrame(() => {
      rafId.current = null;
      container.style.setProperty("--globe-rot", `${rotation.current}deg`);
    });
  };

  useEffect(() => {
    const container = containerRef.current as AnyElement | null;
    if (!container) return;

    const onScroll = () => {
      const st = container.scrollTop ?? 0;
      const sl = container.scrollLeft ?? 0;
      const next = (st * 0.03 + sl * 0.06) % 360;
      apply(container, next);
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

      const next = (rotation.current + dx * 0.06 - dy * 0.03) % 360;
      apply(container, next);
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
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return null;
}
