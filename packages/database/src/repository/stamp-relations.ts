import { db } from '@/db';
import { eq, gte, and } from 'drizzle-orm';
import { z } from 'zod';
import * as schema from '@/schema';

export const StampRelationsQuerySchema = z
  .object({
    userId: z.string(),
    messageUserId: z.string(),
    threshold: z.preprocess((x) => Number(x), z.number().int().positive()),
  })
  .partial();

export type StampRelationsQuery = z.infer<typeof StampRelationsQuerySchema>;

export const getStampRelations = async (query: StampRelationsQuery) => {
  const conditions = [
    query.userId && eq(schema.stampRelationsView.user, query.userId),
    query.messageUserId && eq(schema.stampRelationsView.messageUser, query.messageUserId),
    query.threshold && gte(schema.stampRelationsView.count, query.threshold),
  ];
  return await db
    .select()
    .from(schema.stampRelationsView)
    .where(and(...conditions.filter((x) => !!x)))
    .execute();
};
