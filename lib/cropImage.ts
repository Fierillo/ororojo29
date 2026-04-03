export const PLACEHOLDER = "/images/placeholder.svg";

export function getImageSrc(src: string | null | undefined): string {
  return src || PLACEHOLDER;
}

interface ImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function getImageProps({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  sizes,
  priority = false,
}: ImageProps) {
  const imageSrc = src || PLACEHOLDER;
  
  return {
    src: imageSrc,
    alt,
    fill,
    width,
    height,
    className,
    sizes,
    priority,
    style: { width: 'auto', height: 'auto' },
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.src = PLACEHOLDER;
    },
  };
}

export function getBgImageStyle(src: string | null | undefined): string {
  return src ? `url(${src})` : `url(${PLACEHOLDER})`;
}