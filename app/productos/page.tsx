import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/products/ProductCard";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getProducts, getCategories, getAdminData } from "@/lib/data";
import Link from "next/link";

export const revalidate = 60;

export default async function ProductosPage() {
  const categories = await getCategories();
  const products = await getProducts();
  const adminData: any = await getAdminData();
  const whatsappNumber = adminData?.whatsappNumber || "5491112345678";

  return (
    <MainLayout>
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl text-white mb-4">
            <span className="cobre-text-gradient">Nuestros Productos</span>
          </h1>
          <p className="text-gray-400 mb-12 text-lg">
            Explorá nuestra colección de productos de cobre artesanales
          </p>

          <div className="flex gap-3 mb-12 flex-wrap">
            <Link
              href="/productos"
              className="px-5 py-2.5 rounded-full bg-cobre text-white hover:bg-cobre-light transition-colors font-medium"
            >
              Todos
            </Link>
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className="px-5 py-2.5 rounded-full bg-dark-card text-gray-300 border border-dark-border hover:border-cobre hover:text-cobre-light transition-all font-medium"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => {
              const imageUrl = product.image_id ? `/api/images?id=${product.image_id}` : null;
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
        </div>
      </div>
      <WhatsAppButton phone={whatsappNumber} />
    </MainLayout>
  );
}