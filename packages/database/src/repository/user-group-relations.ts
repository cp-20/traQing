import { db } from '@/db';
import { and, count, desc, eq, or } from 'drizzle-orm';
import * as schema from '@/schema';

export const getUserGroupRelations = async () => {
  return await db.select().from(schema.userGroupRelations).execute();
};

export const getUserGroupRanking = async (groupBy: 'user' | 'group') => {
  const groupByColumn = {
    user: schema.userGroupRelations.userId,
    group: schema.userGroupRelations.groupId,
  }[groupBy];

  return await db
    .select({
      group: groupByColumn,
      count: count(),
    })
    .from(schema.userGroupRelations)
    .groupBy(groupByColumn)
    .orderBy(desc(count()))
    .execute();
};

export const insertUserGroupRelations = async (relations: { userId: string; groupId: string; isAdmin: boolean }[]) => {
  await db
    .insert(schema.userGroupRelations)
    .values(relations)
    .onConflictDoNothing()
    .returning({ userId: schema.userGroupRelations.userId })
    .execute();
};

export const deleteUserGroupRelations = async (relations: { userId: string; groupId: string }[]) => {
  await db
    .delete(schema.userGroupRelations)
    .where(
      or(
        ...relations.map((relation) =>
          and(
            eq(schema.userGroupRelations.userId, relation.userId),
            eq(schema.userGroupRelations.groupId, relation.groupId),
          ),
        ),
      ),
    )
    .returning({ userId: schema.userGroupRelations.userId })
    .execute();
};
