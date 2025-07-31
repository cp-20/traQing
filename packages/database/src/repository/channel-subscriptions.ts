import { and, count, desc, eq, or } from 'drizzle-orm';
import { db } from '@/db';
import * as schema from '@/schema';

export const getChannelSubscriptions = async () => {
  return await db.select().from(schema.channelSubscriptions).execute();
};

export const getSubscriptionRanking = async (groupBy: 'user' | 'channel') => {
  const groupByColumn = {
    user: schema.channelSubscriptions.userId,
    channel: schema.channelSubscriptions.channelId,
  }[groupBy];

  return await db
    .select({
      group: groupByColumn,
      count: count(),
    })
    .from(schema.channelSubscriptions)
    .groupBy(groupByColumn)
    .orderBy(desc(count()))
    .execute();
};

export const insertChannelSubscriptions = async (subscriptions: { userId: string; channelId: string }[]) => {
  await db
    .insert(schema.channelSubscriptions)
    .values(subscriptions)
    .onConflictDoNothing()
    .returning({ userId: schema.channelSubscriptions.userId })
    .execute();
};

export const deleteChannelSubscriptions = async (subscriptions: { userId: string; channelId: string }[]) => {
  await db
    .delete(schema.channelSubscriptions)
    .where(
      or(
        ...subscriptions.map((subscription) =>
          and(
            eq(schema.channelSubscriptions.userId, subscription.userId),
            eq(schema.channelSubscriptions.channelId, subscription.channelId),
          ),
        ),
      ),
    )
    .returning({ userId: schema.channelSubscriptions.userId })
    .execute();
};
