import { products, categories, siteConfig } from './crud';
import { Product, Category, AdminData } from './types';

export async function getProducts(query: { featured?: boolean; category?: number } = {}): Promise<Product[]> {
  try {
    if (query.featured) {
      return await products.getFeatured();
    }
    if (query.category && typeof query.category === 'number') {
      return await products.getByCategory(query.category);
    }
    return await products.getAll();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await products.getBySlug(slug);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    return await categories.getAll();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    return await categories.getBySlug(slug);
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function getAdminData(): Promise<AdminData> {
  try {
    return await siteConfig.get();
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return {};
  }
}