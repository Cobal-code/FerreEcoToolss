import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { getWebpSrc } from "@/lib/imageSrc";

interface ImageLightboxProps {
  images: string[];
  index: number;
  onIndexChange: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alt: string;
}

const isImageUrl = (img: string) => img.startsWith("/") || img.startsWith("http");

/**
 * Visor ampliado de fotos de producto.
 * - Teclado: ← / → cambian de foto, Esc cierra (foco atrapado dentro del visor).
 * - Táctil: deslizar cambia de foto; tocar la foto acerca/aleja.
 * - La versión grande (1200 px) solo se descarga al abrir el visor.
 */
export const ImageLightbox = ({ images, index, onIndexChange, open, onOpenChange, alt }: ImageLightboxProps) => {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [loaded, setLoaded] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const count = images.length;
  const current = images[index] ?? images[0];

  // Recuerda qué elemento abrió el visor para devolverle el foco al cerrar
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setZoomed(false);
    setLoaded(false);
  }, [index, open]);

  const go = (delta: number) => {
    if (count < 2) return;
    onIndexChange((index + delta + count) % count);
  };

  const pointToOrigin = (clientX: number, clientY: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setOrigin({
      x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const controlBtn =
    "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 disabled:opacity-30";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          onKeyDown={onKeyDown}
          onOpenAutoFocus={() => {
            // Aún no se ha movido el foco al visor: guarda el elemento que lo abrió
            lastFocus.current = document.activeElement as HTMLElement | null;
          }}
          onCloseAutoFocus={(e) => {
            if (lastFocus.current && document.contains(lastFocus.current)) {
              e.preventDefault();
              lastFocus.current.focus();
            }
          }}
          aria-describedby={undefined}
          className="fixed inset-0 z-[60] flex flex-col text-white outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        >
          <DialogPrimitive.Title className="sr-only">{alt}</DialogPrimitive.Title>

          {/* Barra superior */}
          <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-6">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium tabular-nums ring-1 ring-white/15" aria-live="polite">
              {index + 1} / {count}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={controlBtn}
                onClick={() => setZoomed((z) => !z)}
                aria-label={zoomed ? "Alejar" : "Acercar"}
                aria-pressed={zoomed}
              >
                {zoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
              </button>
              <DialogPrimitive.Close className={controlBtn} aria-label="Cerrar visor">
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Imagen */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 py-4 sm:px-20">
            <div
              ref={frameRef}
              className={`relative h-full w-full max-w-5xl overflow-hidden ${zoomed ? "cursor-zoom-out touch-none" : "cursor-zoom-in"}`}
              onClick={(e) => {
                pointToOrigin(e.clientX, e.clientY);
                setZoomed((z) => !z);
              }}
              onMouseMove={(e) => zoomed && pointToOrigin(e.clientX, e.clientY)}
              onTouchStart={(e) => {
                const t = e.touches[0];
                touchStart.current = { x: t.clientX, y: t.clientY };
              }}
              onTouchMove={(e) => {
                if (!zoomed) return;
                const t = e.touches[0];
                pointToOrigin(t.clientX, t.clientY);
              }}
              onTouchEnd={(e) => {
                const start = touchStart.current;
                touchStart.current = null;
                if (!start || zoomed) return;
                const t = e.changedTouches[0];
                const dx = t.clientX - start.x;
                const dy = t.clientY - start.y;
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
                  e.preventDefault();
                  go(dx < 0 ? 1 : -1);
                }
              }}
            >
              {!loaded && isImageUrl(current) && (
                <div className="absolute inset-0 flex items-center justify-center" role="status" aria-label="Cargando imagen">
                  <span className="h-10 w-10 rounded-full border-2 border-white/20 border-t-white motion-safe:animate-spin" />
                </div>
              )}
              {isImageUrl(current) ? (
                <img
                  key={current}
                  src={getWebpSrc(current, 1200)}
                  alt={`${alt} - imagen ${index + 1}`}
                  onLoad={() => setLoaded(true)}
                  onError={(e) => {
                    // Si no existe la variante grande, se usa el original
                    const img = e.currentTarget;
                    if (img.src.indexOf(current) === -1) img.src = current;
                    else setLoaded(true);
                  }}
                  draggable={false}
                  className={`h-full w-full select-none object-contain transition-[transform,opacity] duration-300 ease-out ${
                    loaded ? "opacity-100" : "opacity-0"
                  } ${zoomed ? "scale-[2.2]" : "scale-100"}`}
                  style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
                />
              ) : (
                <span className="flex h-full items-center justify-center text-[10rem] leading-none">{current}</span>
              )}
            </div>

            {count > 1 && (
              <>
                <button type="button" className={`${controlBtn} absolute left-3 top-1/2 -translate-y-1/2 sm:left-6`} onClick={() => go(-1)} aria-label="Imagen anterior">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button type="button" className={`${controlBtn} absolute right-3 top-1/2 -translate-y-1/2 sm:right-6`} onClick={() => go(1)} aria-label="Imagen siguiente">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas */}
          {count > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar px-4 pb-5 sm:pb-6">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onIndexChange(i)}
                  aria-label={`Ver imagen ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white transition-[opacity,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    i === index ? "ring-2 ring-primary opacity-100" : "opacity-50 hover:opacity-90"
                  }`}
                >
                  {isImageUrl(img) ? (
                    <img src={getWebpSrc(img, 400)} alt="" width={56} height={56} loading="lazy" decoding="async" className="h-full w-full object-contain p-0.5" />
                  ) : (
                    <span className="text-2xl">{img}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
