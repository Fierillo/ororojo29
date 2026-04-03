import type { GlobalConfig } from 'payload';

export const AdminData: GlobalConfig = {
  slug: 'admin-data',
  label: 'General Settings',
  admin: {
    description: 'Site settings such as WhatsApp number, emails, and location.',
  },
  fields: [
    {
      name: 'whatsappNumber',
      label: 'WhatsApp Number',
      type: 'text',
      required: true,
      defaultValue: '5491112345678',
      admin: {
        description: 'Country code + area + number (without symbols, e.g., 5491112345678)',
      },
    },
    {
      name: 'contactEmail',
      label: 'Contact Email',
      type: 'email',
      required: true,
      defaultValue: 'contacto@ororojo29.com',
    },
    {
      name: 'location',
      label: 'Physical Location',
      type: 'text',
      required: true,
      defaultValue: 'Buenos Aires, Argentina',
    },
    {
      name: 'schedule',
      label: 'Business Hours',
      type: 'textarea',
      defaultValue: 'Monday to Friday: 9:00 - 18:00\nSaturdays: 10:00 - 14:00',
    },
  ],
};