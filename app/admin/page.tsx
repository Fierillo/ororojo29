"use client";

import { useState, useEffect } from 'react';

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
  description: string;
  category_id: number;
  category_name?: string;
  featured: boolean;
  image_id: number | null;
}

interface SiteConfig {
  whatsappNumber?: string;
  contactEmail?: string;
  location?: string;
  schedule?: string;
}

type View = 'products' | 'categories' | 'config';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<View>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    whatsappNumber: '',
    contactEmail: '',
    location: '',
    schedule: '',
  });
  const [configLoading, setConfigLoading] = useState(false);

  const headers = {
    'X-Admin-Password': password,
  };

  useEffect(() => {
    if (authenticated) {
      fetchCategories();
      fetchProducts();
      fetchSiteConfig();
    }
  }, [authenticated]);

  async function fetchCategories() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  }

  async function fetchProducts() {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  }

  async function fetchSiteConfig() {
    const res = await fetch('/api/site-config', { headers });
    const data = await res.json();
    setSiteConfig(data);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
    } else {
      alert('Password incorrecto');
    }
  }

  async function handleDeleteProduct(id: number) {
    if (!confirm('¿Eliminar producto?')) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE', headers });
    fetchProducts();
  }

  async function handleDeleteCategory(id: number) {
    if (!confirm('¿Eliminar categoría?')) return;
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE', headers });
    fetchCategories();
  }

  async function handleImageUpload(file: File): Promise<number | null> {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch('/api/images', {
      method: 'POST',
      body: formData,
      headers,
    });
    
    if (res.ok) {
      const data = await res.json();
      return data.id;
    }
    return null;
  }

  async function handleSubmitProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get('image') as File;
    
    let imageId = editingProduct?.image_id || null;
    
    if (imageFile && imageFile.size > 0) {
      setUploading(true);
      imageId = await handleImageUpload(imageFile);
      setUploading(false);
      if (!imageId) {
        alert('Error al subir imagen');
        setLoading(false);
        return;
      }
    }

    const data = {
      name: formData.get('name'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      category_id: Number(formData.get('category_id')),
      destacado: formData.get('destacado') === 'on',
      image_id: imageId,
    };

    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `/api/products?id=${editingProduct.id}` : '/api/products';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(data),
    });

    setEditingProduct(null);
    setPreviewImage(null);
    fetchProducts();
    setLoading(false);
  }

  function handleEditClick(product: Product) {
    setEditingProduct(product);
    if (product.image_id) {
      setPreviewImage(`/api/images/${product.image_id}`);
    } else {
      setPreviewImage(null);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  }

  async function handleSubmitCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ name: formData.get('name') }),
    });
    fetchCategories();
  }

  async function handleSaveConfig(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setConfigLoading(true);
    
    await fetch('/api/site-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(siteConfig),
    });
    
    setConfigLoading(false);
    alert('Configuración guardada');
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg">
          <h1 className="text-2xl text-white mb-4">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 rounded bg-gray-700 text-white mb-4"
          />
          <button type="submit" className="w-full bg-cobre text-white p-2 rounded">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <button onClick={() => setAuthenticated(false)} className="text-gray-400 hover:text-white">
            Cerrar sesión
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setView('products')}
            className={`px-4 py-2 rounded ${view === 'products' ? 'bg-cobre' : 'bg-gray-700'}`}
          >
            Productos
          </button>
          <button
            onClick={() => setView('categories')}
            className={`px-4 py-2 rounded ${view === 'categories' ? 'bg-cobre' : 'bg-gray-700'}`}
          >
            Categorías
          </button>
          <button
            onClick={() => setView('config')}
            className={`px-4 py-2 rounded ${view === 'config' ? 'bg-cobre' : 'bg-gray-700'}`}
          >
            Configuración
          </button>
        </div>

        {view === 'products' && (
          <>
            <form onSubmit={handleSubmitProduct} className="bg-gray-800 p-6 rounded-lg mb-8">
              <h2 className="text-xl mb-4">{editingProduct ? 'Editar' : 'Nuevo'} Producto</h2>
              <div className="grid grid-cols-2 gap-4">
                <input name="name" defaultValue={editingProduct?.name} placeholder="Nombre" required className="p-2 rounded bg-gray-700" />
                <input name="price" type="number" defaultValue={editingProduct?.price} placeholder="Precio" required className="p-2 rounded bg-gray-700" />
                <textarea name="description" defaultValue={editingProduct?.description} placeholder="Descripción" required className="p-2 rounded bg-gray-700 col-span-2" rows={3} />
                <select name="category_id" defaultValue={editingProduct?.category_id || ''} required className="p-2 rounded bg-gray-700">
                  <option value="">Seleccionar categoría</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="destacado" defaultChecked={editingProduct?.featured} />
                  Destacado
                </label>
                <div className="col-span-2">
                  <label className="block mb-2">Imagen del producto</label>
                  <input 
                    type="file" 
                    name="image" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="p-2 rounded bg-gray-700 w-full"
                  />
                  {previewImage && (
                    <div className="mt-2">
                      <img src={previewImage} alt="Preview" className="h-32 object-cover rounded" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" disabled={loading || uploading} className="bg-cobre px-4 py-2 rounded">
                  {loading || uploading ? (uploading ? 'Subiendo imagen...' : 'Guardando...') : 'Guardar'}
                </button>
                {editingProduct && (
                  <button type="button" onClick={() => { setEditingProduct(null); setPreviewImage(null); }} className="bg-gray-600 px-4 py-2 rounded">
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {p.image_id && (
                      <img src={`/api/images/${p.image_id}`} alt={p.name} className="w-12 h-12 object-cover rounded" />
                    )}
                    <div>
                      <span className="font-bold">{p.name}</span>
                      <span className="text-gray-400 ml-2">${p.price}</span>
                      <span className="text-gray-500 ml-2">| {p.category_name}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditClick(p)} className="text-cobre hover:underline">Editar</button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:underline">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'categories' && (
          <>
            <form onSubmit={handleSubmitCategory} className="bg-gray-800 p-6 rounded-lg mb-8">
              <h2 className="text-xl mb-4">Nueva Categoría</h2>
              <div className="flex gap-4">
                <input name="name" placeholder="Nombre" required className="p-2 rounded bg-gray-700 flex-1" />
                <button type="submit" className="bg-cobre px-4 py-2 rounded">Agregar</button>
              </div>
            </form>

            <div className="space-y-2">
              {categories.map((c) => (
                <div key={c.id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
                  <span>{c.name}</span>
                  <button onClick={() => handleDeleteCategory(c.id)} className="text-red-500 hover:underline">Eliminar</button>
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'config' && (
          <form onSubmit={handleSaveConfig} className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl mb-4">Configuración del Sitio</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Número de WhatsApp</label>
                <input
                  type="text"
                  value={siteConfig.whatsappNumber}
                  onChange={(e) => setSiteConfig({ ...siteConfig, whatsappNumber: e.target.value })}
                  placeholder="5491112345678"
                  className="p-2 rounded bg-gray-700 w-full"
                />
              </div>
              <div>
                <label className="block mb-2">Email de contacto</label>
                <input
                  type="email"
                  value={siteConfig.contactEmail}
                  onChange={(e) => setSiteConfig({ ...siteConfig, contactEmail: e.target.value })}
                  placeholder="contacto@ororojo29.com"
                  className="p-2 rounded bg-gray-700 w-full"
                />
              </div>
              <div>
                <label className="block mb-2">Ubicación</label>
                <input
                  type="text"
                  value={siteConfig.location}
                  onChange={(e) => setSiteConfig({ ...siteConfig, location: e.target.value })}
                  placeholder="Buenos Aires, Argentina"
                  className="p-2 rounded bg-gray-700 w-full"
                />
              </div>
              <div>
                <label className="block mb-2">Horario</label>
                <textarea
                  value={siteConfig.schedule}
                  onChange={(e) => setSiteConfig({ ...siteConfig, schedule: e.target.value })}
                  placeholder="Lunes a Viernes: 9:00 - 18:00"
                  className="p-2 rounded bg-gray-700 w-full"
                  rows={3}
                />
              </div>
            </div>
            <button type="submit" disabled={configLoading} className="bg-cobre px-4 py-2 rounded mt-4">
              {configLoading ? 'Guardando...' : 'Guardar configuración'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}