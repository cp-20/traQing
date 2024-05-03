import type { Config } from 'drizzle-kit';

const dbUrl = process.env.DB_URL;
if (!dbUrl) throw new Error('DB_URL is not set');

export default {
  schema: './src/features/database/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: { url: dbUrl },
} satisfies Config;
