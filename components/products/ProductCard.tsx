"use client";

import Image from "next/image";
import Link from "next/link";
import { getImageProps } from "@/lib/cropImage";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null | undefined;
  category: string;
}

export default function ProductCard({
  slug,
  name,
  price,
  image,
  category,
}: ProductCardProps) {
  const imageProps = getImageProps({
    src: image,
    alt: name,
    fill: true,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    className: "object-cover group-hover:scale-105 transition-transform duration-500",
  });

  return (
    <Link href={`/productos/${slug}`} className="group">
      <article className="dark-card card-hover overflow-hidden transition-all duration-300">
        <div className="relative w-full aspect-square bg-dark-card overflow-hidden">
          <Image {...imageProps} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="absolute top-4 left-4 bg-cobre/90 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm z-10">
            {category}
          </span>
        </div>
        
        <div className="p-5">
          <h3 className="font-display text-lg text-white mb-2 group-hover:text-cobre-light transition-colors">
            {name}
          </h3>
          <p className="text-cobre font-semibold text-xl">
            ${price.toLocaleString("es-AR")}
          </p>
        </div>
      </article>
    </Link>
  );
}