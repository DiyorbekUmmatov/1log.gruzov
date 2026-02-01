import { useCallback, useMemo, useRef } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ROUTES = ["/", "/bookmarks", "/add", "/notifications", "/applications"] as const;

function isInteractiveElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest("input,textarea,select,button,a,video,[data-swipe-ignore='true']")
  );
}

export function useSwipeNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = useMemo(() => {
    const path = location.pathname;
    const exact = ROUTES.indexOf(path as (typeof ROUTES)[number]);
    if (exact !== -1) return exact;
    // fallback: treat /cargo/:id as within search
    if (path.startsWith("/cargo/")) return 0;
    return 0;
  }, [location.pathname]);

  const start = useRef<{ x: number; y: number; target: EventTarget | null } | null>(null);
  const locked = useRef(false);

  const onTouchStart = useCallback((e: ReactTouchEvent) => {
    if (e.touches.length !== 1) return;
    if (isInteractiveElement(e.target)) return;
    const t = e.touches[0];
    start.current = { x: t.clientX, y: t.clientY, target: e.target };
    locked.current = false;
  }, []);

  const onTouchMove = useCallback((e: ReactTouchEvent) => {
    if (!start.current || locked.current) return;
    const t = e.touches[0];
    const dx = t.clientX - start.current.x;
    const dy = t.clientY - start.current.y;

    // If user is scrolling vertically, don't treat it as swipe nav.
    if (Math.abs(dy) > Math.abs(dx) * 1.2) {
      locked.current = true;
    }
  }, []);

  const onTouchEndCapture = useCallback(
    (e: ReactTouchEvent) => {
      if (!start.current || locked.current) {
        start.current = null;
        locked.current = false;
        return;
      }

      const t = e.changedTouches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      start.current = null;
      locked.current = false;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX < 70) return;
      if (absX < absY * 1.4) return;

      if (dx < 0) {
        // swipe left -> next
        const next = ROUTES[currentIndex + 1];
        if (next) navigate(next);
      } else {
        // swipe right -> prev
        const prev = ROUTES[currentIndex - 1];
        if (prev) navigate(prev);
      }
    },
    [currentIndex, navigate]
  );

  return {
    onTouchStart,
    onTouchMove,
    onTouchEndCapture,
  };
}
