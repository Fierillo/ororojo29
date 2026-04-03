import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    description: 'Product Categories (e.g., Utensils, Decoration)',
  },
  fields: [
    {
      name: 'name',
      label: 'Category Name',
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
        description: 'Example: kitchen-utensils (lowercase and hyphens only)',
      },
    },
    {
      name: 'description',
      label: 'Brief Description',
      type: 'textarea',
    },
  ],
};