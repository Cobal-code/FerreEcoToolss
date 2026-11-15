import { useEffect, useRef, useState } from "react";
import { MapPin, Move, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/useInView";
import { BUSINESS_ADDRESS, BUSINESS_NAME, EMBED_URL, GOOGLE_DIRECTIONS_URL } from "@/data/businessLocation";

/**
 * Sección de ubicación al final de Inicio.
 * - El mapa (iframe de Google Maps, el mismo de Contacto) solo se carga cuando la sección
 *   está por entrar en pantalla, y el contenedor reserva su tamaño: no hay salto de diseño.
 * - Para no capturar el desplazamiento de la página por accidente, el mapa está cubierto
 *   por una capa que hay que tocar o pulsar para poder moverlo. Se libera al sacar el
 *   cursor, al tocar fuera o con Escape.
 */
export const HomeLocationMap = () => {
  const { ref: mapRef, inView } = useInView<HTMLDivElement>("400px");
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);

  // Mantiene la última referencia para comprobar toques fuera del mapa
  const boxRef = useRef<HTMLDivElement | null>(null);
  const setBox = (node: HTMLDivElement | null) => {
    boxRef.current = node;
    (mapRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  useEffect(() => {
    if (!active) return;
    const onOutside = (event: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) setActive(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(false);
    };
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <section className="pb-16 md:pb-24" aria-labelledby="home-location">
      <div className="container mx-auto px-4">
        <div className="grid overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="home-location" className="font-display text-[1.75rem] font-extrabold leading-tight sm:text-3xl md:text-4xl">
                Visítanos en Tienda
              </h2>
              <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">{BUSINESS_ADDRESS}</p>
            </div>
            <Button asChild size="lg" className="w-full sm:w-fit">
              <a
                href={GOOGLE_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Cómo llegar (se abre en Google Maps)"
              >
                <Navigation className="h-5 w-5" aria-hidden="true" />
                Cómo llegar
              </a>
            </Button>
          </div>

          <div
            ref={setBox}
            onPointerLeave={(event) => event.pointerType === "mouse" && setActive(false)}
            className="relative h-72 bg-muted sm:h-96 lg:h-auto lg:min-h-[26rem]"
          >
            {/* Marcador de posición mientras el mapa carga */}
            {!loaded && (
              <div className="absolute inset-0 grid place-items-center text-muted-foreground" aria-hidden="true">
                <MapPin className="h-8 w-8 opacity-40 motion-safe:animate-pulse" />
              </div>
            )}

            {inView && (
              <iframe
                title={`${BUSINESS_NAME} en Google Maps`}
                src={EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                onLoad={() => setLoaded(true)}
                className="map-embed absolute inset-0 h-full w-full border-0"
              />
            )}

            {/* Capa que evita capturar el desplazamiento hasta que se activa el mapa */}
            {!active && (
              <button
                type="button"
                onClick={() => setActive(true)}
                aria-label="Activar el mapa para moverlo y hacer zoom"
                className="absolute inset-0 z-10 flex cursor-pointer items-end justify-center pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span className="flex items-center gap-2 rounded-full border border-border/70 bg-card/95 px-3.5 py-2 text-xs font-semibold text-foreground shadow-md backdrop-blur-sm">
                  <Move className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  Toca para mover el mapa
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
