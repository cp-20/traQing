import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const migrationClient = postgres(connectionString, { max: 1 });
await migrate(drizzle(migrationClient), { migrationsFolder: '../../drizzle' });
migrationClient.end();

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
