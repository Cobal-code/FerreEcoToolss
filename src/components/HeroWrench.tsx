import { memo, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { HERO_SPRITE } from "@/data/heroSprite";
import { buildWrench, COMPACT_WRENCH, DESKTOP_WRENCH, type WrenchCell } from "@/lib/wrenchShape";
import { getWebpSrc } from "@/lib/imageSrc";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Product } from "@/contexts/CartContext";

/*
 * Llave mixta horizontal formada por fotos reales de productos.
 *
 * - Reposo: solo fotografías (un único sprite de 24 KB, sin textos ni precios).
 * - Ratón: al pasar el cursor (o enfocar con teclado) el recuadro crece con `transform`,
 *   sube de capa y se ilumina con un borde; los demás no se mueven (cero layout shift).
 * - Táctil: un toque amplía el recuadro (también se puede deslizar el dedo para recorrerlos);
 *   tocar de nuevo el recuadro ampliado abre el producto. No depende de :hover.
 * - La foto grande (400 px) solo se descarga al interactuar con el recuadro.
 */

interface Tile {
  index: number;
  cell: WrenchCell;
  product: Product;
  spriteIndex: number;
  /** Posición entre los recuadros "principales" (primera aparición de cada producto), o -1 */
  primaryPos: number;
}

const shuffle = <T,>(items: T[]): T[] => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const ACTIVE_MS = 5000;

interface TileViewProps {
  tile: Tile;
  cols: number;
  rows: number;
  active: boolean;
  tabbable: boolean;
  onClick: (event: React.MouseEvent, index: number) => void;
  onFocusTile: (primaryPos: number) => void;
}

const TileView = memo(({ tile, cols, rows, active, tabbable, onClick, onFocusTile }: TileViewProps) => {
  const { cell, product, spriteIndex, primaryPos, index } = tile;
  const [wantsHires, setWantsHires] = useState(false);
  const [hiresReady, setHiresReady] = useState(false);
  const isPrimary = primaryPos >= 0;

  const sx = (spriteIndex % HERO_SPRITE.cols) / (HERO_SPRITE.cols - 1);
  const sy = Math.floor(spriteIndex / HERO_SPRITE.cols) / Math.max(HERO_SPRITE.rows - 1, 1);

  const style = {
    gridRow: cell.row + 1,
    gridColumn: cell.col + 1,
    "--ox": `${(cell.col / (cols - 1)) * 100}%`,
    "--oy": `${(cell.row / (rows - 1)) * 100}%`,
    "--c": cell.col,
    "--r": cell.corners.map((c) => (c ? "46%" : "16%")).join(" "),
  } as CSSProperties;

  return (
    <Link
      to={`/producto/${product.id}`}
      className="wrench-tile"
      style={style}
      data-wrench-tile
      data-index={index}
      data-primary-pos={isPrimary ? primaryPos : undefined}
      data-active={active ? "true" : undefined}
      aria-label={isPrimary ? product.name : undefined}
      aria-hidden={isPrimary ? undefined : true}
      tabIndex={isPrimary && tabbable ? 0 : -1}
      onPointerEnter={() => setWantsHires(true)}
      onFocus={() => {
        setWantsHires(true);
        if (isPrimary) onFocusTile(primaryPos);
      }}
      onClick={(event) => onClick(event, index)}
    >
      <span className="wrench-shadow" />
      <span
        className="wrench-photo"
        style={{
          backgroundImage: `url(${HERO_SPRITE.url})`,
          backgroundSize: `${HERO_SPRITE.cols * 100}% ${HERO_SPRITE.rows * 100}%`,
          backgroundPosition: `${sx * 100}% ${sy * 100}%`,
        }}
      >
        {(wantsHires || active) && (
          <img
            src={getWebpSrc(product.image, 400)}
            alt=""
            width={400}
            height={400}
            decoding="async"
            draggable={false}
            className="wrench-hires"
            data-ready={hiresReady ? "true" : undefined}
            onLoad={() => setHiresReady(true)}
          />
        )}
      </span>
    </Link>
  );
});
TileView.displayName = "TileView";

interface HeroWrenchProps {
  /** Elemento superpuesto en la parte baja y central de la llave (p. ej. la insignia de oferta) */
  children?: ReactNode;
}

export const HeroWrench = ({ children }: HeroWrenchProps) => {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const spec = isDesktop ? DESKTOP_WRENCH : COMPACT_WRENCH;
  const shape = useMemo(() => buildWrench(spec), [spec]);

  // Productos con miniatura en el sprite, mezclados una vez por carga (como antes)
  const pool = useMemo(
    () => shuffle(products.filter((p) => HERO_SPRITE.index[p.id] !== undefined && p.image?.startsWith("/"))),
    [],
  );

  // Reparto de productos: cíclico y sin repetir el mismo producto junto a sí mismo
  const tiles = useMemo<Tile[]>(() => {
    if (pool.length === 0) return [];
    const chosen = new Map<string, number>();
    const firstSeen = new Map<number, number>();
    let pointer = 0;
    let primaries = 0;
    return shape.cells.map((cell, index) => {
      const left = chosen.get(`${cell.row},${cell.col - 1}`);
      const up = chosen.get(`${cell.row - 1},${cell.col}`);
      let pick = pointer % pool.length;
      for (let step = 0; step < pool.length; step++) {
        const candidate = (pointer + step) % pool.length;
        if (candidate !== left && candidate !== up) {
          pick = candidate;
          pointer += step + 1;
          break;
        }
      }
      chosen.set(`${cell.row},${cell.col}`, pick);
      const product = pool[pick];
      let primaryPos = -1;
      if (!firstSeen.has(product.id)) {
        primaryPos = primaries++;
        firstSeen.set(product.id, primaryPos);
      }
      return { index, cell, product, spriteIndex: HERO_SPRITE.index[product.id], primaryPos };
    });
  }, [shape, pool]);

  const tileAt = useMemo(() => {
    const map = new Map<number, number>();
    tiles.forEach((t) => map.set(t.cell.row * 1000 + t.cell.col, t.index));
    return map;
  }, [tiles]);
  const primaryCount = useMemo(() => tiles.filter((t) => t.primaryPos >= 0).length, [tiles]);

  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const pointerType = useRef<string>("mouse");
  const activeRef = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [active, setActive] = useState<number | null>(null);
  const [roving, setRoving] = useState(0);

  const deactivate = useCallback(() => {
    clearTimeout(timer.current);
    activeRef.current = null;
    setActive(null);
  }, []);

  const activate = useCallback((index: number) => {
    clearTimeout(timer.current);
    activeRef.current = index;
    setActive(index);
    timer.current = setTimeout(() => {
      activeRef.current = null;
      setActive(null);
    }, ACTIVE_MS);
  }, []);

  // Un toque fuera de la llave o desplazar la página cierra la ampliación táctil
  useEffect(() => {
    const onOutside = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) deactivate();
    };
    document.addEventListener("pointerdown", onOutside);
    window.addEventListener("scroll", deactivate, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onOutside);
      window.removeEventListener("scroll", deactivate);
      clearTimeout(timer.current);
    };
  }, [deactivate]);

  useEffect(() => {
    deactivate();
  }, [shape, deactivate]);

  const handleClick = useCallback(
    (event: React.MouseEvent, index: number) => {
      // Táctil: el primer toque amplía; un segundo toque sobre el mismo recuadro abre el producto
      if (pointerType.current !== "touch") return;
      if (activeRef.current !== index) {
        event.preventDefault();
        activate(index);
      }
    },
    [activate],
  );

  const handlePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerType.current = event.pointerType;
    // Recorrer con el dedo: se selecciona el recuadro que hay bajo el dedo según la cuadrícula
    if (event.type === "pointermove" && event.pointerType === "touch" && gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      const col = Math.floor(((event.clientX - rect.left) / rect.width) * shape.cols);
      const row = Math.floor(((event.clientY - rect.top) / rect.height) * shape.rows);
      const index = tileAt.get(row * 1000 + col);
      if (index !== undefined && index !== activeRef.current) activate(index);
    }
  };

  // Teclado: un único punto de tabulación; las flechas recorren los productos
  const focusPrimary = (pos: number) => {
    const next = Math.max(0, Math.min(primaryCount - 1, pos));
    setRoving(next);
    rootRef.current?.querySelector<HTMLElement>(`[data-primary-pos="${next}"]`)?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    pointerType.current = "keyboard";
    const current = Number((event.target as HTMLElement).dataset.primaryPos);
    if (Number.isNaN(current)) return;
    const moves: Record<string, number> = { ArrowRight: current + 1, ArrowDown: current + 1, ArrowLeft: current - 1, ArrowUp: current - 1, Home: 0, End: primaryCount - 1 };
    if (event.key in moves) {
      event.preventDefault();
      focusPrimary(moves[event.key]);
    }
  };

  if (tiles.length === 0) return null;

  const gridStyle = {
    gridTemplateColumns: `repeat(${shape.cols}, minmax(0, 1fr))`,
    "--zoom": isDesktop ? 5.4 : 5,
    "--gap": isDesktop ? "1.5px" : "2px",
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="Productos de la tienda"
      className={`relative mx-auto w-full ${isDesktop ? "max-w-[42rem]" : "max-w-[30rem]"}`}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointer}
      onPointerMove={handlePointer}
    >
      {/* Resplandor tras la llave */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[8%] inset-y-[8%] rounded-full bg-gradient-to-r from-primary/25 via-secondary/10 to-primary/20 blur-3xl"
      />
      <div ref={gridRef} className="wrench-grid relative grid" style={gridStyle}>
        {tiles.map((tile) => (
          <TileView
            key={tile.index}
            tile={tile}
            cols={shape.cols}
            rows={shape.rows}
            active={active === tile.index}
            tabbable={tile.primaryPos === roving}
            onClick={handleClick}
            onFocusTile={setRoving}
          />
        ))}
      </div>
      {children}
    </div>
  );
};
