import { defineConfig } from 'drizzle-kit';
import { DATABASE_URL } from '@utils/config.util.js';
export default defineConfig({
  out: './drizzle',
  schema: '@db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
});
