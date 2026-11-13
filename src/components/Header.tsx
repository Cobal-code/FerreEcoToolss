import { ShoppingCart, Search, Menu } from "lucide-react";
import logoFerreEcotools from "@/assets/logo-ferre-ecotools-400.webp";
import logoFerreEcotoolsSmall from "@/assets/logo-ferre-ecotools-160.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categories, products } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { normalizeText } from "@/utils/normalizeText";
import { getWebpSrc } from "@/lib/imageSrc";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Header = () => {
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<typeof products>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRefDesktop = useRef<HTMLDivElement>(null);
  const searchRefMobile = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const normalizedQuery = normalizeText(searchQuery);
      const filtered = products.filter(
        (product) =>
          normalizeText(product.name).includes(normalizedQuery) ||
          normalizeText(product.description).includes(normalizedQuery) ||
          normalizeText(product.category).includes(normalizedQuery)
      ).slice(0, 6);
      setFilteredProducts(filtered);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setFilteredProducts([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideDesktop = searchRefDesktop.current?.contains(target);
      const insideMobile = searchRefMobile.current?.contains(target);
      if (!insideDesktop && !insideMobile) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear search UI on route change
  const location = useLocation();
  useEffect(() => {
    setShowSuggestions(false);
    setSearchQuery("");
  }, [location.pathname, location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < filteredProducts.length) {
      navigate(`/producto/${filteredProducts[selectedIndex].id}`);
      setSearchQuery("");
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (searchQuery.trim()) {
      navigate(`/tienda?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/producto/${productId}`);
    setSearchQuery("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && showSuggestions) {
      e.preventDefault();
      setShowSuggestions(false);
      setSelectedIndex(-1);
      return;
    }
    if (!showSuggestions || filteredProducts.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < filteredProducts.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    }
  };

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
  const isCategoryActive = location.pathname === "/tienda" && location.search.includes("category=");

  const navLinkClass = (active: boolean) =>
    `relative inline-flex h-12 items-center whitespace-nowrap px-0.5 sm:px-1 text-sm font-medium transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 after:absolute after:inset-x-0.5 sm:after:inset-x-1 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors after:duration-200 ${
      active
        ? "text-foreground after:bg-primary"
        : "text-muted-foreground hover:text-foreground after:bg-transparent hover:after:bg-border"
    }`;

  const renderSuggestions = () =>
    showSuggestions && filteredProducts.length > 0 && (
      <div className="absolute top-full mt-2 w-full rounded-xl border border-border/70 bg-popover p-1.5 shadow-xl shadow-black/5 z-50 max-h-96 overflow-y-auto animate-in fade-in-0 slide-in-from-top-1 duration-150">
        {filteredProducts.map((product, index) => (
          <Link
            key={product.id}
            to={`/producto/${product.id}`}
            className={`w-full rounded-lg px-3 py-2.5 flex items-center gap-3 transition-colors text-left ${
              index === selectedIndex ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-muted/60 rounded-lg overflow-hidden flex-shrink-0">
              {product.image.startsWith('/') || product.image.startsWith('http') ? (
                <img
                  src={getWebpSrc(product.image, 400)}
                  alt={product.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">{product.image}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.category}</p>
            </div>
            <div className="text-right flex-shrink-0">
              {product.isOnSale && product.originalPrice ? (
                <>
                  <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full font-semibold">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                  <p className="text-xs text-muted-foreground line-through mt-0.5">${product.originalPrice.toLocaleString()}</p>
                  <p className="font-bold text-foreground tabular-nums">${product.price.toLocaleString()}</p>
                </>
              ) : (
                <p className="font-semibold text-foreground tabular-nums">${product.price.toLocaleString()}</p>
              )}
            </div>
          </Link>
        ))}
        {filteredProducts.length === 6 && (
          <button
            type="button"
            onClick={() => {
              navigate(`/tienda?search=${encodeURIComponent(searchQuery)}`);
              setSearchQuery("");
              setShowSuggestions(false);
            }}
            className="mt-1 w-full rounded-lg px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 transition-colors border-t border-border/60"
          >
            Ver todos los resultados
          </button>
        )}
      </div>
    );

  const renderSearch = (ref: React.RefObject<HTMLDivElement>) => (
    <div className="relative w-full" ref={ref}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar productos..."
        aria-label="Buscar productos"
        className="h-11 rounded-full border-border/80 bg-muted/50 pl-10 pr-12 shadow-none hover:bg-background focus-visible:bg-background"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => searchQuery && setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
      />
      <Button
        type="submit"
        size="icon"
        aria-label="Buscar"
        className="absolute right-1 top-1 h-9 w-9 rounded-full shadow-none hover:translate-y-0"
      >
        <Search className="h-4 w-4" />
      </Button>
      {renderSuggestions()}
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 transition-shadow duration-300 ${
        scrolled ? "border-border/80 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.25)]" : "border-border/60"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-16 md:h-20 items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <img
              src={logoFerreEcotoolsSmall}
              srcSet={`${logoFerreEcotoolsSmall} 160w, ${logoFerreEcotools} 400w`}
              sizes="72px"
              alt="FerreEcoTools - Equipando tus ideas"
              width={400}
              height={324}
              loading="eager"
              decoding="sync"
              {...{ fetchpriority: "high" }}
              className="h-11 md:h-14 w-auto object-contain"
            />
            <span className="hidden sm:inline font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FerreEcoTools
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            {renderSearch(searchRefDesktop)}
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/carrito"
              aria-label={`Carrito (${getCartCount()} ${getCartCount() === 1 ? "producto" : "productos"})`}
              className={`relative inline-flex h-11 items-center gap-2 rounded-full border px-3 sm:px-4 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] ${
                isActive("/carrito")
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/80 bg-background hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Carrito</span>
              {getCartCount() > 0 && (
                <Badge
                  key={getCartCount()}
                  className="absolute -top-1.5 -right-1.5 h-5 min-w-[1.25rem] px-1.5 flex items-center justify-center bg-primary text-primary-foreground ring-2 ring-background tabular-nums hover:bg-primary motion-safe:animate-cart-bump"
                >
                  {getCartCount()}
                </Badge>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          {renderSearch(searchRefMobile)}
        </form>
      </div>

      {/* Navigation */}
      <div className="border-t border-border/60">
        <nav aria-label="Principal" className="container mx-auto px-4 flex items-center gap-3 sm:gap-7 overflow-x-auto no-scrollbar">
          <Link to="/" className={navLinkClass(isActive("/"))} aria-current={isActive("/") ? "page" : undefined}>
            Inicio
          </Link>
          <Link to="/tienda" className={navLinkClass(isActive("/tienda") && !isCategoryActive)} aria-current={isActive("/tienda") ? "page" : undefined}>
            Tienda
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className={`${navLinkClass(isCategoryActive)} gap-1.5`}>
              Categorías
              <Menu className="hidden sm:block h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[14rem]">
              {categories.map((category) => (
                <DropdownMenuItem key={category} asChild className="rounded-lg px-3 py-2 cursor-pointer">
                  <Link to={`/tienda?category=${encodeURIComponent(category)}`}>
                    {category}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/ofertas" className={navLinkClass(isActive("/ofertas"))} aria-current={isActive("/ofertas") ? "page" : undefined}>
            Ofertas
          </Link>
          <Link to="/contacto" className={navLinkClass(isActive("/contacto"))} aria-current={isActive("/contacto") ? "page" : undefined}>
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
};
