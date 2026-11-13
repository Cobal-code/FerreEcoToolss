import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink, Clock, Phone } from "lucide-react";

const LAT = 4.1254775326449495;
const LNG = -73.54500527328169;
const BUSINESS_NAME = "Ferelectricos Castellanos Ferreecotools";
const GOOGLE_MAPS_URL = `https://www.google.com/maps?q=${LAT},${LNG}`;
const EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(
  BUSINESS_NAME
)}@${LAT},${LNG}&ll=${LAT},${LNG}&z=17&output=embed`;

export const LocationMap = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2">Visítanos en Tienda</h2>
            <p className="text-muted-foreground">
              Te esperamos en nuestra ubicación en Villavicencio, Meta
            </p>
          </div>

          <Card className="border-2 overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-card">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Dirección</h3>
                    <p className="text-sm text-muted-foreground">
                      Calle 27B #60BE-18, Manzana 79 Casa 7, Barrio La Reliquia, Villavicencio
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Teléfono</h3>
                    <p className="text-sm text-muted-foreground">+57 313 790 6406</p>
                    <p className="text-sm text-muted-foreground">+57 310 734 8281</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Horario</h3>
                    <p className="text-sm text-muted-foreground">Lun-Vie: 9:00-18:00</p>
                    <p className="text-sm text-muted-foreground">Sáb: 9:00-14:00</p>
                  </div>
                </div>
              </div>

              <div className="relative w-full h-[350px] bg-muted">
                <iframe
                  title={`${BUSINESS_NAME} en Google Maps`}
                  src={EMBED_URL}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
                {/* Permanent business name label overlay */}
                <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-10 max-w-[92%]">
                  <div className="flex items-center gap-2 rounded-full bg-card/95 backdrop-blur border-2 border-primary/40 shadow-lg px-4 py-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-bold text-foreground truncate">
                      {BUSINESS_NAME}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-card border-t flex justify-center">
                <Button asChild size="lg" className="gap-2">
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir en Google Maps
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
