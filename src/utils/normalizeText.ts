/**
 * Normalizes text for accent-insensitive search.
 * Removes diacritical marks (tildes, accents) and converts to lowercase.
 * Uses Unicode NFD normalization for optimal performance.
 * 
 * Examples:
 * - "Taladró" → "taladro"
 * - "Medición" → "medicion"
 * - "Eléctricas" → "electricas"
 */
export const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};
