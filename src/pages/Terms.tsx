import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-8 md:mb-10 text-center">Términos y Condiciones</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">1. Aceptación de los Términos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Al acceder y utilizar FerreEcoTools, usted acepta cumplir con estos términos y condiciones.
                Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">2. Uso del Sitio Web</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                El contenido de este sitio web es para uso personal y no comercial. Usted no puede:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Modificar, copiar o distribuir el contenido sin autorización</li>
                <li>Usar el sitio para fines ilegales o no autorizados</li>
                <li>Intentar acceder a áreas restringidas del sistema</li>
                <li>Interferir con el funcionamiento del sitio</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">3. Productos y Precios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Nos esforzamos por mostrar información precisa sobre nuestros productos:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Los precios están sujetos a cambios sin previo aviso</li>
                <li>Las imágenes son referenciales y pueden variar del producto real</li>
                <li>Nos reservamos el derecho de limitar cantidades</li>
                <li>La disponibilidad de stock está sujeta a cambios</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">4. Pedidos y Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Al realizar un pedido:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Acepta proporcionar información veraz y completa</li>
                <li>Nos reservamos el derecho de rechazar o cancelar pedidos</li>
                <li>Los pagos se procesan de forma segura</li>
                <li>Recibirá confirmación del pedido por correo electrónico o WhatsApp</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">5. Envíos y Entregas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Los tiempos de entrega son estimados y pueden variar según la ubicación y disponibilidad.
                FerreEcoTools no se hace responsable por retrasos causados por terceros o circunstancias
                fuera de nuestro control.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">6. Limitación de Responsabilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                FerreEcoTools no será responsable por daños indirectos, incidentales o consecuentes
                que resulten del uso o la imposibilidad de usar nuestros productos o servicios,
                incluso si hemos sido advertidos de la posibilidad de tales daños.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">7. Modificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nos reservamos el derecho de modificar estos términos en cualquier momento.
                Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio.
                Es su responsabilidad revisar periódicamente estos términos.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">8. Ley Aplicable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Estos términos se regirán e interpretarán de acuerdo con las leyes de Colombia.
                Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción
                exclusiva de los tribunales de Villavicencio, Meta, Colombia.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">9. Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">
                Si tiene preguntas sobre estos términos, contáctenos:
              </p>
              <ul className="text-muted-foreground space-y-1">
                <li>Email: ferreecotools@gmail.com</li>
                <li>Teléfono: +57 313 790 6406</li>
                <li>Teléfono: +57 310 734 8281</li>
              </ul>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground text-center mt-10">
            Última actualización: Enero 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
