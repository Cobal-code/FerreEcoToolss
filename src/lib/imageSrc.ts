/**
 * Helpers para servir imágenes locales optimizadas (WebP responsive).
 *
 * Cada imagen del proyecto tiene variantes generadas junto al original:
 *   /images/productos/foo.jpg  ->  foo-400.webp | foo-800.webp | foo-1200.webp
 * El original (recomprimido, máx. 1200px) se mantiene como fallback.
 */

const OPTIMIZABLE = /\.(jpe?g|png)$/i;
export const IMAGE_WIDTHS = [400, 800, 1200] as const;

/** true si es una ruta local que tiene variantes WebP generadas */
export const hasOptimizedVariants = (src: string) =>
  typeof src === "string" && src.startsWith("/") && OPTIMIZABLE.test(src);

/** srcset WebP para una ruta local; "" si no aplica */
export const getWebpSrcSet = (src: string) => {
  if (!hasOptimizedVariants(src)) return "";
  const base = src.replace(OPTIMIZABLE, "");
  return IMAGE_WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(", ");
};

/** una variante WebP concreta (útil para thumbnails y previews) */
export const getWebpSrc = (src: string, width: (typeof IMAGE_WIDTHS)[number]) => {
  if (!hasOptimizedVariants(src)) return src;
  return `${src.replace(OPTIMIZABLE, "")}-${width}.webp`;
};
