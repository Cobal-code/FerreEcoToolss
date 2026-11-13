import { getWebpSrcSet } from "@/lib/imageSrc";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** valor de sizes para el srcset (ej. "(max-width: 640px) 50vw, 300px") */
  sizes?: string;
  /** true para la imagen principal visible al entrar (sin lazy loading) */
  priority?: boolean;
}

/**
 * <img> con srcset WebP responsive + lazy loading por defecto.
 * No cambia el aspecto visual: sólo elige el archivo más liviano posible.
 */
export const SmartImage = ({
  src,
  alt,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px",
  priority = false,
  width,
  height,
  ...rest
}: SmartImageProps) => {
  const srcSet = getWebpSrcSet(src);

  return (
    <img
      src={src}
      srcSet={srcSet || undefined}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      {...{ fetchpriority: priority ? "high" : "auto" }}
      {...rest}
    />
  );
};
