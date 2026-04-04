"use client";

import { useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { Category, Product, ProductGridProps } from "@/lib/types";

export default function ProductGrid({ categories, products }: ProductGridProps) {
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
    : products.filter((product: Product) =>
        activeCategories.some((catId: number) => product.category_id === catId)
      );

  return (
    <>
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <button
          onClick={clearFilters}
          className={`px-6 py-2 rounded-full transition-all duration-500 hover:scale-105 ${
            activeCategories.length === 0
              ? "bg-cobre text-white energia-glow border-cobre-light"
              : "bg-dark-card text-gray-400 hover:bg-gray-700 border-dark-border"
          } border`}
        >
          Todos
        </button>

        {categories.map((category: Category) => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`px-6 py-2 rounded-full transition-all duration-500 hover:scale-105 ${
              activeCategories.includes(category.id)
                ? "bg-cobre text-white energia-glow border-cobre-light"
                : "bg-dark-card text-gray-300 border-dark-border hover:border-cobre hover:text-cobre-light"
            } border`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {activeCategories.length > 0 && (
        <div className="mb-8 text-center animate-in fade-in duration-700">
          <span className="text-cobre-light/60 text-sm tracking-widest uppercase">
            Sintonizando:{" "}
            <span className="text-cobre-light">
              {categories
                .filter((c: Category) => activeCategories.includes(c.id))
                .map((c: Category) => c.name)
                .join(" + ")}
            </span>
          </span>
          <button
            onClick={clearFilters}
            className="ml-4 text-gray-500 hover:text-cobre transition-colors text-sm uppercase tracking-tighter"
          >
            [ Limpiar ]
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product: Product) => {
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
            No hay productos en las categorías seleccionadas.
          </p>
        </div>
      )}
    </>
  );
}