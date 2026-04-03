import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/products/ProductCard";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getCategories, getCategoryBySlug, getProducts, getAdminData } from "@/lib/data";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ categoria: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category: any) => ({
    categoria: category.slug,
  }));
}

export default async function CategoriaPage({ params }: Props) {
  const resolvedParams = await params;
  const category: any = await getCategoryBySlug(resolvedParams.categoria);

  if (!category) {
    notFound();
  }

  const categoryProducts = await getProducts({ category: { equals: category.id } });
  const adminData: any = await getAdminData();
  const whatsappNumber = adminData?.whatsappNumber || "5491112345678";

  return (
    <MainLayout>
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl text-white mb-4">
            <span className="cobre-text-gradient">{category.name}</span>
          </h1>
          <p className="text-gray-400 mb-12 text-lg">{category.description}</p>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryProducts.map((product: any) => {
                const imageObj = product.images?.[0];
                const imageUrl = typeof imageObj === 'object' && imageObj?.url ? imageObj.url : null;
                const categoryName = typeof product.category === 'object' && product.category?.name ? product.category.name : '';

                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    price={product.price}
                    image={imageUrl}
                    category={categoryName}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No hay productos en esta categoría todavía.
              </p>
            </div>
          )}
        </div>
      </div>
      <WhatsAppButton phone={whatsappNumber} />
    </MainLayout>
  );
}