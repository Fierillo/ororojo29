import { getPayloadClient } from "./payload";

export async function getCategories() {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'categories',
      depth: 1,
      limit: 100,
    });
    return result.docs;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getProducts(query = {}) {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'products',
      depth: 2,
      limit: 100,
      where: query,
    });
    return result.docs;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'products',
      depth: 2,
      where: {
        slug: {
          equals: slug,
        },
      },
    });
    return result.docs[0] || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'categories',
      depth: 1,
      where: {
        slug: {
          equals: slug,
        },
      },
    });
    return result.docs[0] || null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function getAdminData() {
  try {
    const payload = await getPayloadClient();
    const result = await payload.findGlobal({
      slug: 'admin-data',
    });
    return result;
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return null;
  }
}
