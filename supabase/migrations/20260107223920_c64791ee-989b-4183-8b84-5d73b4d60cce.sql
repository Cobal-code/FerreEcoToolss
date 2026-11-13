-- Tabla para guardar clientes con su WhatsApp (solo COD)
CREATE TABLE public.post_purchase_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    accepts_promotions BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla para guardar las compras y productos comprados
CREATE TABLE public.customer_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.post_purchase_customers(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    product_category TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla para promociones personalizadas generadas
CREATE TABLE public.customer_promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.post_purchase_customers(id) ON DELETE CASCADE NOT NULL,
    purchase_id UUID REFERENCES public.customer_purchases(id) ON DELETE CASCADE NOT NULL,
    related_product_id INTEGER NOT NULL,
    related_product_name TEXT NOT NULL,
    discount_percentage INTEGER NOT NULL DEFAULT 10,
    promo_code TEXT NOT NULL,
    is_sent BOOLEAN DEFAULT false,
    is_used BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS en todas las tablas (solo admin puede acceder)
ALTER TABLE public.post_purchase_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_promotions ENABLE ROW LEVEL SECURITY;

-- No crear políticas públicas - solo acceso vía service_role (edge functions)
-- Esto garantiza que solo el administrador puede ver los datos

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para actualizar updated_at en post_purchase_customers
CREATE TRIGGER update_post_purchase_customers_updated_at
    BEFORE UPDATE ON public.post_purchase_customers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();