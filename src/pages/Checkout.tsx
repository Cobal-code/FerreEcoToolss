import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { MessageCircle, Package, Check, ChevronsUpDown, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { colombianDepartments } from "@/data/colombianLocations";
import { products } from "@/data/products";

const formSchema = z.object({
  fullName: z.string().trim().min(3, { message: "El nombre debe tener al menos 3 caracteres" }).max(100),
  phone: z.string().trim().min(10, { message: "El teléfono debe tener al menos 10 dígitos" }).max(25),
  address: z.string().trim().min(10, { message: "La dirección debe tener al menos 10 caracteres" }).max(200),
  department: z.string().min(1, { message: "Selecciona un departamento" }),
  city: z.string().min(1, { message: "Selecciona una ciudad" }),
  notes: z.string().max(500).optional(),
  acceptsPromotions: z.boolean().default(true),
});

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCODDialog, setShowCODDialog] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      department: "",
      city: "",
      notes: "",
      acceptsPromotions: true,
    },
  });

  const selectedDepartment = form.watch("department");

  // Update cities when department changes
  useEffect(() => {
    if (selectedDepartment) {
      const dept = colombianDepartments.find(d => d.name === selectedDepartment);
      setAvailableCities(dept?.cities || []);
      form.setValue("city", ""); // Reset city when department changes
    } else {
      setAvailableCities([]);
    }
  }, [selectedDepartment, form]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppCheckout = () => {
    let message = `Hola FerreEcoTools, quiero confirmar el siguiente pedido:\n\n`;
    message += `🛒 *PRODUCTOS*\n`;

    cart.forEach((item) => {
      message += `• ${item.name}\n`;
      message += `  Cantidad: ${item.quantity}\n`;
      message += `  Precio: ${formatPrice(item.price * item.quantity)}\n\n`;
    });

    message += `💰 *RESUMEN*\n`;
    message += `Subtotal: ${formatPrice(getCartTotal())}\n`;
    message += `*Total: ${formatPrice(getCartTotal())}*`;

    const phoneNumber = "573137906406";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');

    toast({
      title: "Redirigiendo a WhatsApp",
      description: "Completa tu pedido por WhatsApp con nuestro equipo.",
    });
  };

  // Función para encontrar productos relacionados (misma categoría)
  const getRelatedProducts = () => {
    const cartCategories = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      return product?.category;
    }).filter(Boolean);

    // Obtener productos de la misma categoría que no están en el carrito
    const cartIds = cart.map(item => item.id);
    return products
      .filter(p => cartCategories.includes(p.category) && !cartIds.includes(p.id))
      .slice(0, 3)
      .map(p => ({ id: p.id, name: p.name, category: p.category }));
  };

  const handleCODSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // 1. Enviar email de orden
      await supabase.functions.invoke('send-order-email', {
        body: {
          customerInfo: {
            fullName: values.fullName,
            phone: `+57 ${values.phone}`,
            address: values.address,
            city: `${values.city}, ${values.department}`,
            notes: values.notes,
          },
          cart: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: getCartTotal(),
        },
      });

      // 2. Guardar cliente y generar promoción (solo para COD)
      const cartWithCategory = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: product?.category || "General",
        };
      });

      const relatedProducts = getRelatedProducts();

      await supabase.functions.invoke('save-cod-customer', {
        body: {
          customerData: {
            fullName: values.fullName,
            phone: `+57${values.phone.replace(/\s/g, '')}`,
            address: values.address,
            city: `${values.city}, ${values.department}`,
            acceptsPromotions: values.acceptsPromotions,
          },
          cart: cartWithCategory,
          relatedProducts,
        },
      });

      toast({
        title: "¡Muchas gracias por tu compra!",
        description: values.acceptsPromotions 
          ? "Te contactaremos para la entrega y recibirás un beneficio exclusivo por WhatsApp."
          : "Te estaremos contactando para la entrega.",
      });

      clearCart();
      setShowCODDialog(false);
      navigate("/tienda");
    } catch (error) {
      console.error("Error al procesar pedido:", error);
      toast({
        title: "¡Compra registrada!",
        description: "Te estaremos contactando para la entrega.",
      });
      clearCart();
      setShowCODDialog(false);
      navigate("/tienda");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleWhatsAppCheckout();
  };

  if (cart.length === 0) {
    navigate("/carrito");
    return null;
  }

  return (
    <div className="min-h-screen py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 text-center">Finalizar Compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8">
            <div>
              <Card className="max-w-xl mx-auto rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4 text-sm">
                      <span className="text-muted-foreground min-w-0">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="shrink-0 font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="tabular-nums">{formatPrice(getCartTotal())}</span>
                  </div>

                  <Separator />

                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-base">Total</span>
                    <span className="font-display text-2xl font-extrabold tracking-tight tabular-nums">{formatPrice(getCartTotal())}</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg shadow-[#25D366]/25 hover:translate-y-0"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Confirmar por WhatsApp
                    </Button>

                    <Button 
                      type="button"
                      size="lg" 
                      variant="outline"
                      className="w-full border border-border bg-background text-foreground hover:bg-muted hover:text-foreground hover:border-border hover:shadow-none"
                      onClick={() => setShowCODDialog(true)}
                    >
                      <Package className="h-5 w-5 text-primary" />
                      Pago contra entrega
                    </Button>

                    {/* Addi Payment Option */}
                    <div className="relative border border-[#00D26A]/40 rounded-xl p-4 bg-[#00D26A]/[0.06]">
                      <div className="flex items-center gap-3 mb-3">
                        {/* Official Addi Logo SVG */}
                        <svg 
                          viewBox="0 0 80 32" 
                          className="h-8 w-auto flex-shrink-0"
                          aria-label="Addi"
                        >
                          <rect width="80" height="32" rx="6" fill="#3BDB89"/>
                          <text 
                            x="40" 
                            y="23" 
                            textAnchor="middle" 
                            fill="white" 
                            fontFamily="Arial, sans-serif" 
                            fontWeight="bold" 
                            fontSize="18"
                            letterSpacing="1"
                          >
                            addi
                          </text>
                        </svg>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-foreground">Paga en cuotas sin tarjeta</span>
                          <span className="text-xs text-muted-foreground">Compra ahora, paga después</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                        <span className="text-[#00D26A]">✓</span> Sin intereses · Fácil y rápido · Aprobación inmediata
                      </p>
                      <Button 
                        type="button"
                        size="lg" 
                        className="w-full bg-[#00D26A] hover:bg-[#00B85C] text-white font-semibold shadow-sm hover:translate-y-0"
                        onClick={() => {
                          toast({
                            title: "Addi próximamente",
                            description: "Estamos trabajando para integrar Addi como método de pago.",
                          });
                        }}
                      >
                        Pagar con Addi
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Al confirmar, aceptas nuestros términos y condiciones
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>

        <Dialog open={showCODDialog} onOpenChange={setShowCODDialog}>
          <DialogContent className="w-[calc(100%-2rem)] rounded-2xl sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pago contra entrega</DialogTitle>
              <DialogDescription>
                Completa tus datos de envío para procesar el pedido
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCODSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 text-sm border border-r-0 border-input bg-muted rounded-l-lg">
                            +57
                          </span>
                          <Input 
                            placeholder="300 123 4567" 
                            className="rounded-l-none"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^\d\s]/g, '');
                              field.onChange(value);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección de envío</FormLabel>
                      <FormControl>
                        <Input placeholder="Calle 123 #45-67, Apto 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Department Selector */}
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Departamento</FormLabel>
                      <Popover open={departmentOpen} onOpenChange={setDepartmentOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between h-10 border border-input bg-background px-3.5 font-normal text-foreground shadow-sm hover:bg-background hover:text-foreground hover:border-primary/40 hover:shadow-sm",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value || "Selecciona un departamento"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 z-50" align="start">
                          <Command>
                            <CommandInput placeholder="Buscar departamento..." />
                            <CommandList>
                              <CommandEmpty>No se encontró el departamento.</CommandEmpty>
                              <CommandGroup>
                                {colombianDepartments.map((dept) => (
                                  <CommandItem
                                    key={dept.name}
                                    value={dept.name}
                                    onSelect={() => {
                                      form.setValue("department", dept.name);
                                      setDepartmentOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === dept.name ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {dept.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City Selector - Only enabled after department is selected */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ciudad</FormLabel>
                      <Popover open={cityOpen} onOpenChange={setCityOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              disabled={!selectedDepartment}
                              className={cn(
                                "w-full justify-between h-10 border border-input bg-background px-3.5 font-normal text-foreground shadow-sm hover:bg-background hover:text-foreground hover:border-primary/40 hover:shadow-sm",
                                !field.value && "text-muted-foreground",
                                !selectedDepartment && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              {field.value || (selectedDepartment ? "Selecciona una ciudad" : "Primero selecciona un departamento")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 z-50" align="start">
                          <Command>
                            <CommandInput placeholder="Buscar ciudad..." />
                            <CommandList>
                              <CommandEmpty>No se encontró la ciudad.</CommandEmpty>
                              <CommandGroup>
                                {availableCities.map((city) => (
                                  <CommandItem
                                    key={city}
                                    value={city}
                                    onSelect={() => {
                                      form.setValue("city", city);
                                      setCityOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === city ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {city}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas adicionales (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Instrucciones de entrega, referencias, etc." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Promociones post-compra */}
                <FormField
                  control={form.control}
                  name="acceptsPromotions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                          <Gift className="h-4 w-4 text-primary" />
                          Recibir beneficio exclusivo post-compra
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Tu número de WhatsApp será utilizado únicamente para enviarte un descuento especial en productos relacionados con tu compra. Puedes darte de baja en cualquier momento.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="bg-muted/60 border border-border/70 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Total a pagar:</span>
                    <span className="font-display text-lg font-extrabold tabular-nums">{formatPrice(getCartTotal())}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    El pago se realizará al momento de la entrega
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Confirmar pedido
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Checkout;
