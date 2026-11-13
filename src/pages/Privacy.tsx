import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-8 md:mb-10 text-center">Política de Privacidad</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">1. Información que Recopilamos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                En FerreEcoTools recopilamos la siguiente información:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Información de contacto:</strong> nombre, dirección de correo electrónico, número de teléfono</li>
                <li><strong>Información de envío:</strong> dirección de entrega, ciudad, código postal</li>
                <li><strong>Información de pago:</strong> detalles de transacciones (procesados de forma segura)</li>
                <li><strong>Información de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">2. Cómo Utilizamos su Información</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Procesar y gestionar sus pedidos</li>
                <li>Comunicarnos con usted sobre su pedido y nuestros servicios</li>
                <li>Mejorar nuestro sitio web y experiencia de usuario</li>
                <li>Enviar información promocional (con su consentimiento)</li>
                <li>Prevenir fraudes y proteger la seguridad</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">3. Compartir Información</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                No vendemos ni alquilamos su información personal. Podemos compartir información con:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Proveedores de servicios:</strong> empresas de envío, procesadores de pago</li>
                <li><strong>Autoridades legales:</strong> cuando sea requerido por ley</li>
                <li><strong>Socios comerciales:</strong> solo con su consentimiento explícito</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">4. Cookies y Tecnologías Similares</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Utilizamos cookies para mejorar su experiencia:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Cookies esenciales:</strong> necesarias para el funcionamiento del sitio</li>
                <li><strong>Cookies de rendimiento:</strong> nos ayudan a entender cómo se usa el sitio</li>
                <li><strong>Cookies de funcionalidad:</strong> recuerdan sus preferencias</li>
                <li><strong>Cookies de marketing:</strong> personalizan el contenido (con su consentimiento)</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Puede configurar su navegador para rechazar cookies, aunque esto puede afectar
                la funcionalidad del sitio.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">5. Seguridad de Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información
                contra acceso no autorizado, alteración, divulgación o destrucción. Sin embargo, ningún
                método de transmisión por Internet es 100% seguro.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">6. Sus Derechos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Usted tiene derecho a:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Acceder a su información personal</li>
                <li>Corregir datos inexactos</li>
                <li>Solicitar la eliminación de sus datos</li>
                <li>Oponerse al procesamiento de sus datos</li>
                <li>Retirar su consentimiento en cualquier momento</li>
                <li>Solicitar la portabilidad de sus datos</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Para ejercer estos derechos, contáctenos a través de los medios proporcionados.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">7. Retención de Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Conservamos su información personal solo durante el tiempo necesario para cumplir con
                los fines establecidos en esta política, a menos que la ley requiera o permita un
                período de retención más largo.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">8. Menores de Edad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos
                intencionalmente información de menores. Si descubrimos que hemos recopilado
                información de un menor, la eliminaremos de inmediato.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">9. Cambios a esta Política</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Podemos actualizar esta política de privacidad periódicamente. Le notificaremos
                sobre cambios significativos publicando la nueva política en esta página y
                actualizando la fecha de "última actualización".
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">10. Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">
                Si tiene preguntas sobre esta política de privacidad, contáctenos:
              </p>
              <ul className="text-muted-foreground space-y-1">
                <li>Email: ferreecotools@gmail.com</li>
                <li>Teléfono: +57 313 790 6406</li>
                <li>Teléfono: +57 310 734 8281</li>
                <li>Dirección: Villavicencio, Meta, Colombia</li>
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

export default Privacy;
