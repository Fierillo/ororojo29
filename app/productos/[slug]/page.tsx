import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getProductBySlug, getProducts, getAdminData } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

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

  const imageObj = product.images?.[0];
  const imageUrl = typeof imageObj === 'object' && imageObj?.url ? imageObj.url : null;
  const categoryName = typeof product.category === 'object' && product.category?.name ? product.category.name : '';
  const features = Array.isArray(product.features) ? product.features : [];

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
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
              </div>
              <span className="absolute top-6 left-6 bg-cobre text-white px-5 py-2 rounded-full font-medium z-10">
                {categoryName}
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <h1 className="font-display text-5xl text-white mb-6">
                {product.name}
              </h1>
              <p className="text-4xl text-cobre-light font-semibold mb-8">
                ${product.price.toLocaleString("es-AR")}
              </p>
              <p className="text-gray-400 mb-10 leading-relaxed text-lg">
                {product.description}
              </p>

              {product.stock && (
                <p className="text-sm text-green-500 mb-6 flex items-center gap-2">
                  <Check size={16} />
                  Stock disponible: {product.stock} unidades
                </p>
              )}

              <div className="flex gap-4 flex-wrap">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[200px] bg-green-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-green-500 transition-colors text-center"
                >
                  Consultar por WhatsApp
                </a>
              </div>

              {features.length > 0 && (
                <div className="mt-12 pt-12 border-t border-dark-border">
                  <h3 className="font-semibold text-white mb-6 text-lg">
                    Características
                  </h3>
                  <ul className="space-y-3 text-gray-400">
                    {features.map((featureObj: any, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check size={16} className="text-cobre" />
                        {featureObj.feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <WhatsAppButton phone={whatsappNumber} />
    </MainLayout>
  );
}