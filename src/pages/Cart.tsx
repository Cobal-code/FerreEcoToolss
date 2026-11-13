import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { getWebpSrc } from "@/lib/imageSrc";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag className="h-11 w-11 text-primary" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold mb-2">Tu carrito está vacío</h1>
          <p className="text-muted-foreground mb-8">
            Agrega productos para comenzar tu compra
          </p>
          <Button asChild size="lg">
            <Link to="/tienda">Ir a la Tienda</Link>
          </Button>
        </div>
      </div>
    );
  }

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Button variant="ghost" asChild className="mb-4 -ml-3 text-muted-foreground hover:text-foreground hover:bg-muted">
          <Link to="/tienda">
            <ArrowLeft className="h-4 w-4" />
            Seguir comprando
          </Link>
        </Button>

        <div className="flex items-baseline gap-3 mb-6 md:mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold">Carrito de Compras</h1>
          <span className="text-sm font-medium text-muted-foreground tabular-nums">({itemCount})</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-card shadow-soft divide-y divide-border/70">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-5">
                <div className="flex gap-4">
                  {/* Image */}
                  <Link
                    to={`/producto/${item.id}`}
                    className="bg-muted/50 dark:bg-white rounded-xl overflow-hidden flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0"
                  >
                    {item.image.startsWith('/') || item.image.startsWith('http') ? (
                      <img
                        src={getWebpSrc(item.image, 400)}
                        alt={item.name}
                        width={96}
                        height={96}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain p-1.5 mix-blend-multiply"
                      />
                    ) : (
                      <span className="text-4xl">{item.image}</span>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          to={`/producto/${item.id}`}
                          className="font-semibold text-sm sm:text-base leading-snug hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          {item.category}
                        </p>
                        <p className="text-sm font-medium text-foreground/80 mt-1 tabular-nums">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Eliminar ${item.name}`}
                        className="h-9 w-9 -mr-2 -mt-1 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-full border border-border bg-background p-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Disminuir cantidad"
                          className="h-8 w-8 rounded-full hover:bg-muted"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <Input
                          type="number"
                          aria-label="Cantidad"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow numeric input
                            if (/^\d*$/.test(value)) {
                              const numValue = parseInt(value, 10);
                              // Validate: must be between 1 and stock
                              if (!isNaN(numValue) && numValue >= 1 && numValue <= item.stock) {
                                updateQuantity(item.id, numValue);
                              } else if (value === "") {
                                // Allow empty field temporarily during typing
                                updateQuantity(item.id, 1);
                              }
                            }
                          }}
                          onBlur={(e) => {
                            // Ensure valid value on blur
                            const numValue = parseInt(e.target.value, 10);
                            if (isNaN(numValue) || numValue < 1) {
                              updateQuantity(item.id, 1);
                            } else if (numValue > item.stock) {
                              updateQuantity(item.id, item.stock);
                            }
                          }}
                          className="no-spinner h-8 w-11 border-0 bg-transparent px-0 text-center font-semibold tabular-nums shadow-none hover:border-0 focus-visible:ring-2 focus-visible:ring-ring/30"
                          min={1}
                          max={item.stock}
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Aumentar cantidad"
                          className="h-8 w-8 rounded-full hover:bg-muted"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Subtotal:{" "}
                        <span className="font-display text-base font-bold text-foreground tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1 lg:sticky lg:top-40">
            <div className="rounded-2xl border border-border/70 bg-card shadow-soft p-5 sm:p-6">
              <h2 className="font-display text-xl font-bold mb-5">Resumen del Pedido</h2>

              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-foreground">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío</span>
                  <span>Por calcular</span>
                </div>
                <div className="border-t border-dashed border-border pt-4 mt-4 flex items-baseline justify-between">
                  <span className="font-semibold text-base">Total</span>
                  <span className="font-display text-2xl font-extrabold tracking-tight tabular-nums">{formatPrice(getCartTotal())}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full shadow-lg shadow-primary/25"
                onClick={() => navigate("/checkout")}
              >
                Proceder al Pago
                <ArrowRight className="h-5 w-5" />
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
                El costo de envío se calculará en el siguiente paso
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
