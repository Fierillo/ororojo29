import MainLayout from "@/components/layout/MainLayout";
import ProductGrid from "@/components/ui/ProductGrid";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getProducts, getCategories, getAdminData } from "@/lib/data";
import { Category, Product, AdminData } from "@/lib/types";

export const revalidate = 60;

export default async function ProductosPage() {
  const categories: Category[] = await getCategories();
  const products: Product[] = await getProducts();
  const adminData: AdminData = await getAdminData();
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

          <ProductGrid categories={categories} products={products} />
        </div>
      </div>
      <WhatsAppButton phone={whatsappNumber} />
    </MainLayout>
  );
}