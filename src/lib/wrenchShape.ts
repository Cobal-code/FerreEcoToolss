/**
 * Geometría de la llave mixta horizontal del hero.
 *
 * La silueta se calcula sobre una cuadrícula de celdas (cada celda = un recuadro con
 * la foto de un producto): boca abierta a la izquierda, cuerpo largo y delgado, y
 * extremo anular (cerrado) a la derecha. Se genera por geometría y no a mano para
 * poder tener una versión de escritorio y otra más compacta para móvil.
 */

export interface WrenchSpec {
  cols: number;
  /** Alto total = diámetro de las cabezas (en celdas) */
  rows: number;
  /** Grosor del cuerpo (en celdas) */
  handle: number;
  /** Alto de la boca abierta (en celdas) */
  mouth: number;
  /** Profundidad de la boca desde el borde izquierdo (en celdas) */
  mouthDepth: number;
  /** Radio del agujero del extremo anular (en celdas) */
  holeRadius: number;
  /** Celdas extra de grosor en el cuello junto a cada cabeza (0 = sin cuello) */
  neck?: number;
}

export interface WrenchCell {
  row: number;
  col: number;
  /** Redondeo de cada esquina como fracción del lado: [arriba-izq, arriba-der, abajo-der, abajo-izq] */
  corners: [number, number, number, number];
}

export interface WrenchShape {
  cols: number;
  rows: number;
  cells: WrenchCell[];
}

export const buildWrench = (spec: WrenchSpec): WrenchShape => {
  const { cols, rows, handle, mouth, mouthDepth, holeRadius, neck = 0 } = spec;
  const radius = rows / 2;
  const cy = rows / 2;
  const leftX = radius;
  const rightX = cols - radius;
  const filled = new Set<string>();
  const key = (r: number, c: number) => `${r},${c}`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c + 0.5;
      const y = r + 0.5;
      const dy = Math.abs(y - cy);

      const inLeftHead = Math.hypot(x - leftX, y - cy) <= radius + 0.1;
      const inRightHead = Math.hypot(x - rightX, y - cy) <= radius + 0.1;

      // Cuerpo: banda central entre ambas cabezas, con un leve ensanche junto a ellas
      const nearHead = x - leftX < radius + 2 || rightX - x < radius + 2;
      const half = (handle + (nearHead ? neck : 0)) / 2;
      const inHandle = x >= leftX && x <= rightX && dy < half;

      if (!(inLeftHead || inRightHead || inHandle)) continue;

      // Boca abierta (extremo izquierdo)
      if (x <= mouthDepth && dy < mouth / 2) continue;
      // Agujero del extremo anular (extremo derecho)
      if (Math.hypot(x - rightX, y - cy) <= holeRadius) continue;

      filled.add(key(r, c));
    }
  }

  const has = (r: number, c: number) => filled.has(key(r, c));
  const ROUND = 0.5;
  const cells: WrenchCell[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!has(r, c)) continue;
      const up = has(r - 1, c);
      const down = has(r + 1, c);
      const left = has(r, c - 1);
      const right = has(r, c + 1);
      // Una esquina se redondea cuando sus dos vecinos adyacentes están vacíos (esquina convexa):
      // así el contorno completo se suaviza y no parece pixel art.
      cells.push({
        row: r,
        col: c,
        corners: [
          !up && !left ? ROUND : 0,
          !up && !right ? ROUND : 0,
          !down && !right ? ROUND : 0,
          !down && !left ? ROUND : 0,
        ],
      });
    }
  }

  return { cols, rows, cells };
};

/** Versión de escritorio: llave larga y delgada */
export const DESKTOP_WRENCH: WrenchSpec = {
  cols: 34,
  rows: 9,
  handle: 3,
  mouth: 3,
  mouthDepth: 5,
  holeRadius: 2.2,
  neck: 0,
};

/** Versión compacta (móvil/tablet): menos recuadros, mismas proporciones generales */
export const COMPACT_WRENCH: WrenchSpec = {
  cols: 20,
  rows: 6,
  handle: 2,
  mouth: 2,
  mouthDepth: 3,
  holeRadius: 1.3,
  neck: 0,
};

/** Dibujo ASCII para revisar la silueta (solo desarrollo) */
export const wrenchToAscii = (shape: WrenchShape): string => {
  const set = new Set(shape.cells.map((c) => `${c.row},${c.col}`));
  const lines: string[] = [];
  for (let r = 0; r < shape.rows; r++) {
    let line = "";
    for (let c = 0; c < shape.cols; c++) line += set.has(`${r},${c}`) ? "■" : "·";
    lines.push(line);
  }
  return lines.join("\n");
};
