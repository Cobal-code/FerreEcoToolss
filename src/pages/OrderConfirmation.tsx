import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Home, Package } from "lucide-react";
import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardContent className="pt-12 pb-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-6">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-4">¡Pedido Confirmado!</h1>
            
            <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
              Gracias por tu compra. Hemos recibido tu pedido correctamente.
            </p>

            <div className="bg-muted/50 border border-border/70 rounded-2xl p-6 mb-8 text-left">
              <div className="flex items-start gap-3 mb-4">
                <Package className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Número de Pedido</h3>
                  <p className="text-muted-foreground">
                    #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Te hemos enviado un correo electrónico de confirmación con todos los detalles
                de tu pedido. Pronto recibirás información sobre el seguimiento de tu envío.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/">
                  <Home className="mr-2 h-5 w-5" />
                  Volver al Inicio
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/tienda">Seguir Comprando</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmation;
