import { useState, useRef, useCallback, useEffect } from "react";
import { Expand, ZoomIn } from "lucide-react";
import { getWebpSrcSet } from "@/lib/imageSrc";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  /** Abre el visor ampliado (clic en escritorio, toque en móvil) */
  onOpen?: () => void;
}

/**
 * Imagen principal del producto.
 * - Escritorio (puntero fino): lupa al pasar el cursor; clic abre el visor ampliado.
 * - Táctil: no depende del hover; tocar la foto o el botón abre el visor,
 *   y la página sigue desplazándose con normalidad al deslizar sobre la foto.
 */
export const ImageZoom = ({ src, alt, className = "", onOpen }: ImageZoomProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isTouch, setIsTouch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }, []);

  const srcSet = getWebpSrcSet(src);

  return (
    <div
      ref={containerRef}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `Ampliar imagen de ${alt}` : undefined}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (onOpen && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
        isTouch ? "cursor-pointer" : "cursor-zoom-in"
      } ${className}`}
      onMouseEnter={() => !isTouch && setIsZoomed(true)}
      onMouseLeave={() => !isTouch && setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        srcSet={srcSet || undefined}
        sizes={srcSet ? "(max-width: 1024px) 100vw, 600px" : undefined}
        alt={alt}
        width={600}
        height={600}
        loading="eager"
        decoding="async"
        {...{ fetchpriority: "high" }}
        className={`w-full h-full object-contain transition-transform duration-300 ease-out select-none ${
          isZoomed ? "scale-[2.2]" : "scale-100"
        }`}
        style={{ transformOrigin: `${position.x}% ${position.y}%` }}
        draggable={false}
      />

      {/* Botón para abrir el visor (siempre visible en táctil) */}
      {isTouch && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.();
          }}
          className="absolute bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-3 shadow-lg z-10 active:scale-95 transition-transform"
          aria-label="Ampliar imagen"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
      )}

      {/* Indicador en escritorio */}
      {!isTouch && !isZoomed && (
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-background/85 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity pointer-events-none text-foreground">
          <Expand className="h-4 w-4 text-primary" />
        </div>
      )}

      {/* Pista en táctil */}
      {isTouch && (
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg text-xs text-foreground pointer-events-none">
          Toca el botón 🔍 para zoom
        </div>
      )}
    </div>
  );
};
