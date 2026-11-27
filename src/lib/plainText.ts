/**
 * Convierte el Markdown ligero de las descripciones de producto en texto plano,
 * para mostrarlo en tarjetas y resúmenes sin símbolos como ##, ** o |.
 */
export const toPlainText = (markdown: string): string =>
  markdown
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "$1: $2") // [[Título|Texto]]
    .replace(/^\s{0,3}#{1,6}\s*/gm, "") // encabezados
    .replace(/^\s*>\s?/gm, "") // citas
    .replace(/^\s*[-*]\s+/gm, "") // viñetas
    .replace(/^\s*-{3,}\s*$/gm, "") // separadores
    .replace(/\|/g, " ") // tablas
    .replace(/\*\*|__|\*/g, "") // negritas y cursivas
    .replace(/\s+/g, " ")
    .trim();

/** Texto corto para una tarjeta: la descripción comercial o, si falta, la larga en texto plano */
export const getCardSummary = (product: { shortDescription?: string; description: string }) =>
  product.shortDescription?.trim() || toPlainText(product.description);
