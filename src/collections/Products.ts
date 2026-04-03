import type { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    description: 'Oro Rojo 29 Product Catalog',
  },
  fields: [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Friendly URL (Slug)',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Example: hammered-copper-tray',
      },
    },
    {
      name: 'price',
      label: 'Price (ARS)',
      type: 'number',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'features',
      label: 'Features (one per line)',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Example: Handcrafted copper product',
      },
    },
    {
      name: 'images',
      label: 'Product Images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      minRows: 1,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'stock',
      label: 'Available Stock',
      type: 'number',
      admin: {
        description: 'Leave empty if there is no stock limit.',
      },
    },
    {
      name: 'featured',
      label: 'Featured Product',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Check to show on the main page',
      },
    },
  ],
};