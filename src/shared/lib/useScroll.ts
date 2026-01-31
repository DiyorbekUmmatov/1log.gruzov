import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const useScrollTop = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    ref.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return ref;
};
