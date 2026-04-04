import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/products/ProductCard";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getCategories, getCategoryBySlug, getProducts, getAdminData } from "@/lib/data";
import { notFound } from "next/navigation";
import { Category, Product, AdminData } from "@/lib/types";

interface PageProps {
  params: Promise<{ categoria: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const categories: Category[] = await getCategories();
  return categories.map((category: Category) => ({
    categoria: category.slug,
  }));
}

export default async function CategoriaPage({ params }: PageProps) {
  const resolvedParams = await params;
  const category: Category | null = await getCategoryBySlug(resolvedParams.categoria);

  if (!category) {
    notFound();
  }

  const categoryProducts: Product[] = await getProducts({ category: category.id });
  const adminData: AdminData = await getAdminData();
  const whatsappNumber = adminData?.whatsappNumber || "5491112345678";

  return (
    <MainLayout>
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl text-white mb-4">
            <span className="cobre-text-gradient">{category.name}</span>
          </h1>
          
          {category.intro_text && (
            <div className="mb-12 p-8 bg-dark-card border border-cobre/20 rounded-2xl">
              <p className="text-gray-300 text-lg leading-relaxed italic">
                {category.intro_text}
              </p>
            </div>
          )}

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryProducts.map((product: Product) => {
                const imageUrl = product.image_id ? `/api/images/${product.image_id}` : null;
                const categoryName = product.category_name || '';

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