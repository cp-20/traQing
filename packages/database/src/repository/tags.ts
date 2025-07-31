import { and, count, desc, eq, or } from 'drizzle-orm';
import { db } from '@/db';
import * as schema from '@/schema';

export const getTags = async () => {
  return await db.select().from(schema.tags).execute();
};

export const getTagRanking = async (groupBy: 'user' | 'tag') => {
  const groupByColumn = {
    user: schema.tags.userId,
    tag: schema.tags.name,
  }[groupBy];

  return await db
    .select({
      group: groupByColumn,
      count: count(),
    })
    .from(schema.tags)
    .groupBy(groupByColumn)
    .orderBy(desc(count()))
    .execute();
};

export const insertTags = async (tags: { userId: string; name: string }[]) => {
  await db.insert(schema.tags).values(tags).onConflictDoNothing().returning({ userId: schema.tags.userId }).execute();
};

export const deleteTags = async (tags: { userId: string; name: string }[]) => {
  await db
    .delete(schema.tags)
    .where(or(...tags.map((tag) => and(eq(schema.tags.userId, tag.userId), eq(schema.tags.name, tag.name)))))
    .returning({ userId: schema.tags.userId })
    .execute();
};
