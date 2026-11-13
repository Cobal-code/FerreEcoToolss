import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Returns = () => {
  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-8 md:mb-10 text-center">Política de Devoluciones</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">1. Período de Devolución</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Aceptamos devoluciones dentro de los <strong>30 días</strong> posteriores a la recepción
                del producto. Para ser elegible para una devolución, el artículo debe cumplir las
                siguientes condiciones:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>El producto debe estar sin usar y en las mismas condiciones en que lo recibió</li>
                <li>Debe estar en el empaque original</li>
                <li>Debe incluir todos los accesorios y documentación</li>
                <li>Debe proporcionar el recibo o comprobante de compra</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">2. Productos No Retornables</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Los siguientes productos no son elegibles para devolución:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Productos personalizados o hechos a medida</li>
                <li>Artículos de higiene y seguridad personal (mascarillas, guantes, etc.)</li>
                <li>Productos en liquidación o con descuentos especiales marcados como "venta final"</li>
                <li>Productos que hayan sido utilizados o instalados</li>
                <li>Herramientas eléctricas que hayan sido conectadas a la corriente</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">3. Proceso de Devolución</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Para iniciar una devolución, siga estos pasos:
              </p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Badge variant="secondary" className="h-6 min-w-6 flex items-center justify-center">1</Badge>
                  <div>
                    <p className="font-medium">Contáctenos</p>
                    <p className="text-sm text-muted-foreground">
                      Comuníquese con nuestro equipo por WhatsApp (+57 313 790 6406) o email
                      (ferreecotools@gmail.com) indicando su número de pedido y el motivo de la devolución.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Badge variant="secondary" className="h-6 min-w-6 flex items-center justify-center">2</Badge>
                  <div>
                    <p className="font-medium">Autorización</p>
                    <p className="text-sm text-muted-foreground">
                      Recibirá un número de autorización de devolución (RMA) y las instrucciones
                      para enviar el producto.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Badge variant="secondary" className="h-6 min-w-6 flex items-center justify-center">3</Badge>
                  <div>
                    <p className="font-medium">Empaque</p>
                    <p className="text-sm text-muted-foreground">
                      Empaque el producto de forma segura con todos sus componentes y el número RMA
                      claramente visible en el paquete.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Badge variant="secondary" className="h-6 min-w-6 flex items-center justify-center">4</Badge>
                  <div>
                    <p className="font-medium">Envío</p>
                    <p className="text-sm text-muted-foreground">
                      Envíe el paquete a la dirección proporcionada. Los costos de envío de devolución
                      corren por cuenta del cliente, excepto en caso de productos defectuosos.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">4. Productos Defectuosos o Dañados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Si recibe un producto defectuoso o dañado:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Contáctenos inmediatamente (dentro de 48 horas de la recepción)</li>
                <li>Proporcione fotografías del producto y el empaque dañado</li>
                <li>Cubrirermos los costos de envío para la devolución</li>
                <li>Ofreceremos un reemplazo o reembolso completo a su elección</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">5. Reembolsos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Una vez que recibamos y verifiquemos su devolución:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Le notificaremos por email la aprobación o rechazo de su reembolso</li>
                <li>Si se aprueba, el reembolso se procesará en 5-10 días hábiles</li>
                <li>El dinero se acreditará al método de pago original</li>
                <li>Los costos de envío originales no son reembolsables (excepto en casos de productos defectuosos)</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                <strong>Nota:</strong> Dependiendo de su banco, puede tomar tiempo adicional para que
                el reembolso se refleje en su cuenta.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">6. Cambios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Solo reemplazamos artículos si están defectuosos o dañados. Si necesita cambiar un
                producto por el mismo artículo, contáctenos a través de WhatsApp o email. Para cambiar
                por un producto diferente, deberá procesar una devolución y realizar una nueva compra.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">7. Garantías</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Muchos de nuestros productos cuentan con garantía del fabricante:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>La duración de la garantía varía según el producto y fabricante</li>
                <li>Conserve su comprobante de compra para hacer válida la garantía</li>
                <li>Las garantías cubren defectos de fabricación, no daños por mal uso</li>
                <li>Contáctenos para asistencia con reclamos de garantía</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">8. Contacto para Devoluciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">
                Para cualquier consulta sobre devoluciones:
              </p>
              <ul className="text-muted-foreground space-y-1">
                <li>WhatsApp: +57 313 790 6406 o +57 310 734 8281</li>
                <li>Email: ferreecotools@gmail.com</li>
                <li>Horario de atención: Lunes a Viernes 9:00 - 18:00</li>
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

export default Returns;
