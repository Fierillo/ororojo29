import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getProductBySlug, getProducts, getAdminData } from "@/lib/data";
import { getCropImageProps } from "@/lib/cropImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product: any) => ({
    slug: product.slug,
  }));
}

export default async function ProductoDetallePage({ params }: Props) {
  const resolvedParams = await params;
  const product: any = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const adminData: any = await getAdminData();
  const whatsappNumber = adminData?.whatsappNumber || "5491112345678";

  const whatsappMessage = encodeURIComponent(
    `Hola! Me interesa el producto: ${product.name} ($${product.price.toLocaleString("es-AR")})`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const categoryName = product.category_name || '';
  const imageUrl = product.image_id ? `/api/images/${product.image_id}` : null;

  return (
    <MainLayout>
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/productos"
            className="inline-flex items-center text-cobre-light hover:text-cobre mb-10 transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver a productos
          </Link>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="relative">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden energia-glow bg-dark-card">
                {imageUrl ? (
                  <Image {...getCropImageProps({
                    src: imageUrl,
                    alt: product.name,
                    fill: true,
                    sizes: "(max-width: 768px) 100vw, 50vw",
                    className: "object-cover",
                    withFallback: false,
                  })} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Sin imagen
                  </div>
                )}
              </div>
              <span className="absolute top-6 left-6 bg-cobre text-white px-5 py-2 rounded-full font-medium z-10">
                {categoryName}
              </span>
            </div>

            <div>
              <h1 className="font-display text-4xl md:text-5xl text-white mb-6">
                {product.name}
              </h1>
              <p className="text-cobre text-4xl font-bold mb-8">
                ${product.price.toLocaleString("es-AR")}
              </p>
              <div className="mb-8">
                <h2 className="font-display text-2xl text-cobre-light mb-4 italic">La Esencia</h2>
                <p className="text-gray-300 text-lg leading-relaxed italic">
                  {product.description}
                </p>
              </div>

              <div className="h-px w-full bg-linear-to-r from-cobre/50 via-cobre to-cobre/50 mb-8 opacity-30" />

              {product.specs && (
                <div className="mb-10 p-6 bg-dark-card/50 border border-cobre/10 rounded-xl backdrop-blur-sm">
                  <h3 className="font-display text-xl text-cobre-light mb-4 uppercase tracking-widest text-sm">Propiedades de la Materia</h3>
                  <div className="text-gray-400 space-y-2">
                    {product.specs.split('\n').map((line: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-cobre mt-1.5 w-1.5 h-1.5 rounded-full bg-cobre flex-shrink-0" />
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-green-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-green-500 transition-colors"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
      <WhatsAppButton phone={whatsappNumber} />
    </MainLayout>
  );
}