import { buildConfig } from 'payload';
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Categories } from './collections/Categories';
import { Products } from './collections/Products';
import { AdminData } from './globals/AdminData';

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      title: 'Admin Oro Rojo 29',
      description: 'Administration Panel',
    },
  },
  collections: [Users, Media, Categories, Products],
  globals: [AdminData],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'super-secret-local-development-only',
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || 'postgres://127.0.0.1:5432/ororojo29',
    },
  }),
});