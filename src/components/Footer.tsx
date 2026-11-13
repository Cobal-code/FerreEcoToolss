import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const linkClass =
  "inline-flex py-0.5 text-ink-foreground/65 transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:text-primary";

const socialClass =
  "flex h-10 w-10 items-center justify-center rounded-full bg-ink-foreground/[0.08] text-ink-foreground/80 ring-1 ring-ink-foreground/10 transition-colors duration-200 hover:bg-primary hover:text-primary-foreground hover:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export const Footer = () => {
  return (
    <footer className="mt-auto bg-ink text-ink-foreground">
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
      <div className="container mx-auto px-4 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 lg:gap-12">
          {/* Información de Contacto */}
          <div>
            <h3 className="font-display font-extrabold text-xl mb-5 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent w-fit">
              FerreEcoTools
            </h3>
            <div className="space-y-3 text-sm text-ink-foreground/65">
              <a href="tel:+573137906406" className="flex items-center gap-3 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>+57 313 790 6406</span>
              </a>
              <a href="tel:+573107348281" className="flex items-center gap-3 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>+57 310 734 8281</span>
              </a>
              <a href="mailto:ferreecotools@gmail.com" className="flex items-center gap-3 hover:text-primary transition-colors break-all">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>ferreecotools@gmail.com</span>
              </a>
              <a
                href="https://maps.app.goo.gl/DLiVB7Tn9PNR1ecH7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-primary transition-colors"
              >
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span className="leading-relaxed">Calle 26B 60b-16este, Comuna 10, Villavicencio, Meta, 500008, Colombia</span>
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-foreground/45 mb-5">Enlaces Rápidos</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/tienda" className={linkClass}>
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link to="/ofertas" className={linkClass}>
                  Ofertas Especiales
                </Link>
              </li>
              <li>
                <Link to="/contacto" className={linkClass}>
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Información Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-foreground/45 mb-5">Información</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/terminos" className={linkClass}>
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className={linkClass}>
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/devoluciones" className={linkClass}>
                  Política de Devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes Sociales y Métodos de Pago */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-foreground/45 mb-5">Síguenos</h3>
            <div className="flex gap-3 mb-8">
              <a
                href="https://www.facebook.com/profile.php?id=61571334246979"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={socialClass}
              >
                <Facebook className="h-[18px] w-[18px]" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className={socialClass}
              >
                <Instagram className="h-[18px] w-[18px]" />
              </a>
              <a
                href="https://www.tiktok.com/@ferreecotools"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className={socialClass}
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-foreground/45 mb-3">Métodos de Pago</h4>
            <div className="flex gap-2 flex-wrap">
              <div className="px-3 py-1.5 rounded-md text-xs font-semibold bg-ink-foreground/[0.08] text-ink-foreground/80 ring-1 ring-ink-foreground/10">
                VISA
              </div>
              <div className="px-3 py-1.5 rounded-md text-xs font-semibold bg-ink-foreground/[0.08] text-ink-foreground/80 ring-1 ring-ink-foreground/10">
                Mastercard
              </div>
              <div className="px-3 py-1.5 rounded-md text-xs font-semibold bg-ink-foreground/[0.08] text-ink-foreground/80 ring-1 ring-ink-foreground/10">
                Webpay
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-ink-foreground/10 text-center text-sm text-ink-foreground/50">
          <p>&copy; 2025 FerreEcoTools. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
