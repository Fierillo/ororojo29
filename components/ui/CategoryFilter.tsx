"use client";

import { useState } from "react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  baseUrl?: string;
}

export default function CategoryFilter({ categories, baseUrl }: CategoryFilterProps) {
  const [activeCategories, setActiveCategories] = useState<number[]>([]);

  const toggleCategory = (categoryId: number) => {
    setActiveCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setActiveCategories([]);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3 justify-center">
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
        <div className="mt-4 text-center">
          <span className="text-gray-400 text-sm">
            Filtrando por:{" "}
            {categories
              .filter((c: any) => activeCategories.includes(c.id))
              .map((c: any) => c.name)
              .join(" + ")}
          </span>
        </div>
      )}
    </div>
  );
}

export function filterProductsByCategories(
  products: any[],
  activeCategoryIds: number[]
) {
  if (activeCategoryIds.length === 0) {
    return products;
  }

  // AND filter: product must match ALL selected categories
  return products.filter((product) =>
    activeCategoryIds.every((catId) => product.category_id === catId)
  );
}