"use client";

import { useState } from "react";
import ProductCard from "@/components/products/ProductCard";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_id: number | null;
  category_id: number;
  category_name?: string;
}

interface FeaturedProductsProps {
  categories: Category[];
  products: Product[];
}

export default function FeaturedProducts({ categories, products }: FeaturedProductsProps) {
  const [activeCategories, setActiveCategories] = useState<number[]>([]);

  const toggleCategory = (categoryId: number) => {
    setActiveCategories((prev: number[]) =>
      prev.includes(categoryId)
        ? prev.filter((id: number) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setActiveCategories([]);
  };

  const filteredProducts = activeCategories.length === 0
    ? products
    : products.filter((product: any) =>
        activeCategories.some((catId: number) => product.category_id === catId)
      );

  return (
    <>
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <button
          onClick={clearFilters}
          className={`px-6 py-2 rounded-full transition-all duration-300 ${
            activeCategories.length === 0
              ? "bg-cobre text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Todos
        </button>

        {categories.map((category: any) => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              activeCategories.includes(category.id)
                ? "bg-cobre text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {activeCategories.length > 0 && (
        <div className="mb-8 text-center">
          <span className="text-gray-400 text-sm">
            Filtrando por:{" "}
            {categories
              .filter((c: any) => activeCategories.includes(c.id))
              .map((c: any) => c.name)
              .join(" + ")}
          </span>
          <button
            onClick={clearFilters}
            className="ml-4 text-cobre hover:underline text-sm"
          >
            Limpiar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product: any) => {
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No hay productos destacados en las categorías seleccionadas.
          </p>
        </div>
      )}
    </>
  );
}