import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import FeaturedProducts from "@/components/ui/FeaturedProducts";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getProducts, getCategories, getAdminData } from "@/lib/data";
import { Sparkles } from "lucide-react";

export const revalidate = 60;

export default async function Home() {
  const categories = await getCategories();
  const products = await getProducts({ featured: true });
  const adminData: any = await getAdminData();
  const whatsappNumber = adminData?.whatsappNumber || "5491112345678";

  return (
    <MainLayout>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-cobre/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="font-display text-5xl md:text-7xl text-white mb-6 leading-tight">
                Piezas de{" "}
                <span className="cobre-text-gradient">Cobre Puro</span>
              </h1>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                El cobre acompaña a la humanidad desde hace milenios. Sus propiedades 
                naturales preservan, transforman y conectan.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/productos" className="btn-primary">
                  Ver Productos
                </Link>
                <Link href="/contacto" className="btn-secondary">
                  Contactanos
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative">
                <div className="absolute -inset-2 bg-linear-to-br from-cobre/40 via-cobre-dark/20 to-cobre-light/40 rounded-3xl blur-sm" />
                <div className="absolute -inset-1 bg-linear-to-br from-cobre-light/30 via-cobre/20 to-cobre-dark/30 rounded-[22px]" />
                <div className="relative bg-dark-card border border-cobre/30 rounded-3xl p-1">
                  <div className="border border-cobre/50 rounded-[20px] p-1">
                    <div className="bg-linear-to-br from-dark-card via-black to-dark-card rounded-[18px] py-16 px-12 flex flex-col items-center justify-center">
                      <div className="w-52 h-52 flex items-center justify-center mb-6">
                        <img
                          src="/logo.png"
                          alt="Oro Rojo 29"
                          width={208}
                          height={208}
                          className="drop-shadow-2xl"
                        />
                      </div>
                      <div className="relative w-32">
                        <div className="absolute inset-0 h-px bg-linear-to-r from-transparent via-cobre to-transparent top-1/2" />
                        <div className="absolute left-0 top-1/2 w-2 h-2 -translate-y-1/2 bg-cobre rounded-full" />
                        <div className="absolute right-0 top-1/2 w-2 h-2 -translate-y-1/2 bg-cobre rounded-full" />
                      </div>
                      <p className="font-display text-3xl text-white text-center mt-8 tracking-[0.2em] uppercase">
                        Cobre para la Vida
                      </p>
                      <p className="text-cobre-light/60 text-xs mt-3 tracking-[0.3em] uppercase">
                        Tradición & Energía Natural
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark-card border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl text-center mb-16">
            <span className="cobre-text-gradient">Nuestras Categorías</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className="group"
              >
                <div className="dark-card card-hover p-10 text-center transition-all duration-300">
                  {category.image_id ? (
                    <img 
                      src={`/api/images/${category.image_id}`}
                      alt={category.name}
                      className="w-20 h-20 rounded-full mx-auto mb-6 object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="w-20 h-20 cobre-gradient rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform energia-glow">
                      <Sparkles size={32} className="text-white" />
                    </div>
                  )}
                  <h3 className="font-display text-2xl text-white mb-3 group-hover:text-cobre-light transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-400">
                    {category.intro_text || category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl text-center mb-16">
            <span className="cobre-text-gradient">Productos Destacados</span>
          </h2>
          
          <FeaturedProducts categories={categories} products={products} />
          
          <div className="text-center mt-16">
            <Link href="/productos" className="btn-primary">
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark-card border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cobre-gradient rounded-3xl p-16 text-center energia-glow">
            <h2 className="font-display text-4xl mb-6 text-white">
              ¿Algo único en mente?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
              Cada pieza puede ser transformada. Cuéntanos tu visión y la hacemos realidad.
            </p>
            <Link
              href="/contacto"
              className="inline-block bg-white text-cobre px-10 py-4 rounded-lg font-semibold hover:bg-crema transition-colors"
            >
              Contactanos
            </Link>
          </div>
        </div>
      </section>

      <WhatsAppButton phone={whatsappNumber} />
    </MainLayout>
  );
}