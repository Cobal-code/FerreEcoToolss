import { useEffect, useRef, useState } from "react";

/**
 * Devuelve true la primera vez que el elemento entra (o se acerca) a la pantalla.
 * Sirve para diferir trabajo (p. ej. consultas) de elementos que aún no se ven.
 */
export const useInView = <T extends Element>(rootMargin = "200px") => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
};
