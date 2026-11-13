import { useEffect, useRef, useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  onAdd: () => void;
  label: string;
  soldOut?: boolean;
  soldOutLabel?: string;
}

/**
 * Botón de "agregar al carrito" con confirmación visual breve (icono ✓ y color),
 * sin cambiar la lógica del carrito: solo llama a onAdd.
 */
export const AddToCartButton = ({
  onAdd,
  label,
  soldOut = false,
  soldOutLabel = "Sin Stock",
  className,
  ...props
}: AddToCartButtonProps) => {
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleClick = () => {
    onAdd();
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      disabled={soldOut || props.disabled}
      aria-live="polite"
      className={cn(
        "relative overflow-hidden hover:translate-y-0",
        added && "bg-green-600 text-white hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-500",
        className,
      )}
    >
      {added ? (
        <span key="added" className="inline-flex items-center gap-2 motion-safe:animate-pop-in">
          <Check className="h-4 w-4" />
          ¡Agregado!
        </span>
      ) : (
        <span key="idle" className="inline-flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          {soldOut ? soldOutLabel : label}
        </span>
      )}
    </Button>
  );
};
