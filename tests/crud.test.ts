import { describe, it, expect } from 'vitest';

describe('slug generation logic', () => {
  const generateSlug = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  it('should generate slug from name (lowercase, hyphens)', () => {
    const slug = generateSlug('Test Product');
    expect(slug).toBe('test-product');
  });

  it('should handle special characters in slug', () => {
    const slug = generateSlug('Producto!@#$%^&*()');
    expect(slug).toBe('producto');
  });

  it('should handle multiple spaces', () => {
    const slug = generateSlug('Test   Product   Name');
    expect(slug).toBe('test-product-name');
  });

  it('should handle accented characters', () => {
    const slug = generateSlug('Decoración');
    expect(slug).toBe('decoracin');
  });

  it('should handle leading/trailing spaces', () => {
    const slug = generateSlug('  Product  ');
    expect(slug).toBe('-product-');
  });

  it('should handle empty string', () => {
    const slug = generateSlug('');
    expect(slug).toBe('');
  });

  it('should keep numbers', () => {
    const slug = generateSlug('Product 123');
    expect(slug).toBe('product-123');
  });
});

describe('JSON serialization', () => {
  it('should serialize config object to JSON', () => {
    const data = { whatsappNumber: '123456', contactEmail: 'test@test.com' };
    const json = JSON.stringify(data);
    expect(json).toBe('{"whatsappNumber":"123456","contactEmail":"test@test.com"}');
  });

  it('should handle empty config', () => {
    const data = {};
    const json = JSON.stringify(data);
    expect(json).toBe('{}');
  });

  it('should handle nested objects', () => {
    const data = { config: { nested: { value: true } } };
    const json = JSON.stringify(data);
    expect(json).toContain('nested');
  });

  it('should parse JSON back to object', () => {
    const json = '{"whatsappNumber":"123456"}';
    const data = JSON.parse(json);
    expect(data.whatsappNumber).toBe('123456');
  });
});

describe('price formatting', () => {
  it('should format price with commas for thousands', () => {
    const price = 45000;
    const formatted = price.toLocaleString('es-AR');
    expect(formatted).toBe('45.000');
  });

  it('should handle decimal prices', () => {
    const price = 1234.56;
    const formatted = price.toLocaleString('es-AR');
    expect(formatted).toContain('1');
  });

  it('should handle zero', () => {
    const price = 0;
    const formatted = price.toLocaleString('es-AR');
    expect(formatted).toBe('0');
  });
});

describe('category filtering', () => {
  const products = [
    { id: 1, name: 'Product 1', category_id: 1, category_name: 'Cocina' },
    { id: 2, name: 'Product 2', category_id: 2, category_name: 'Decoración' },
    { id: 3, name: 'Product 3', category_id: 1, category_name: 'Cocina' },
  ];

  it('should filter products by category_id', () => {
    const filtered = products.filter(p => p.category_id === 1);
    expect(filtered).toHaveLength(2);
    expect(filtered.every(p => p.category_id === 1)).toBe(true);
  });

  it('should return empty array when no match', () => {
    const filtered = products.filter(p => p.category_id === 99);
    expect(filtered).toHaveLength(0);
  });

  it('should get unique category names', () => {
    const categories = [...new Set(products.map(p => p.category_name))];
    expect(categories).toEqual(['Cocina', 'Decoración']);
  });
});

describe('featured products filtering', () => {
  const products = [
    { id: 1, name: 'Featured 1', featured: true },
    { id: 2, name: 'Not Featured', featured: false },
    { id: 3, name: 'Featured 2', featured: true },
  ];

  it('should filter featured products', () => {
    const featured = products.filter(p => p.featured);
    expect(featured).toHaveLength(2);
    expect(featured.every(p => p.featured)).toBe(true);
  });
});

describe('image URL construction', () => {
  it('should build image URL from id', () => {
    const imageId = 10;
    const url = `/api/images/${imageId}`;
    expect(url).toBe('/api/images/10');
  });

  it('should handle null image_id', () => {
    const imageId = null;
    const url = imageId ? `/api/images/${imageId}` : null;
    expect(url).toBeNull();
  });

  it('should handle category-based fallback images', () => {
    const categoryImages: Record<string, string> = {
      'Cocina': '/images/cazuela.svg',
      'Decoración': '/images/decoracion.svg',
      'Copas y Vasos': '/images/copas.svg',
    };
    
    expect(categoryImages['Cocina']).toBe('/images/cazuela.svg');
    expect(categoryImages['Decoración']).toBe('/images/decoracion.svg');
    expect(categoryImages['Unknown']).toBeUndefined();
  });
});

describe('validation helpers', () => {
  it('should validate price is positive', () => {
    const isValidPrice = (price: number) => price > 0;
    expect(isValidPrice(100)).toBe(true);
    expect(isValidPrice(0)).toBe(false);
    expect(isValidPrice(-10)).toBe(false);
  });

  it('should validate required fields', () => {
    const hasRequired = (data: any): boolean => {
      return !!(data.name && data.price && data.description);
    };
    
    expect(hasRequired({ name: 'Test', price: 100, description: 'Desc' })).toBe(true);
    expect(hasRequired({ name: 'Test', price: 100, description: '' })).toBe(false);
    expect(hasRequired({ name: '', price: 100, description: 'Desc' })).toBe(false);
  });

  it('should validate category_id', () => {
    const isValidCategory = (id: number | null) => id === null || id > 0;
    expect(isValidCategory(1)).toBe(true);
    expect(isValidCategory(null)).toBe(true);
    expect(isValidCategory(0)).toBe(false);
    expect(isValidCategory(-1)).toBe(false);
  });
});