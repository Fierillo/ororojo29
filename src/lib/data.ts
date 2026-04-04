import { products, categories, siteConfig } from './crud';

export async function getProducts(query: Record<string, any> = {}) {
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

export async function getProductBySlug(slug: string) {
  try {
    return await products.getBySlug(slug);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getCategories() {
  try {
    return await categories.getAll();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    return await categories.getBySlug(slug);
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function getAdminData() {
  try {
    return await siteConfig.get();
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return null;
  }
}