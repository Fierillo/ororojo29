export const PLACEHOLDER = "/images/placeholder.svg";

export function getCropImageSrc(src: string | null | undefined): string {
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
  withFallback?: boolean;
}

export function getCropImageProps({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  sizes,
  priority = false,
  withFallback = true,
}: ImageProps) {
  const imageSrc = src || PLACEHOLDER;
  
  const props: any = {
    src: imageSrc,
    alt,
    fill,
    width: fill ? undefined : width,
    height: fill ? undefined : height,
    className,
    sizes,
    priority,
  };
  
  if (withFallback) {
    props.onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.src = PLACEHOLDER;
    };
  }
  
  return props;
}

export function getCropBgImageStyle(src: string | null | undefined): string {
  return src ? `url(${src})` : `url(${PLACEHOLDER})`;
}