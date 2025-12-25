import { and, asc, count, desc, eq, gt, lt } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import * as schema from '@/schema';
import { isYearQuery, sqlGetDate, sqlGetHour, sqlGetMonth } from '@/util';

export const StampsQuerySchema = z
  .object({
    userId: z.string(),
    messageUserId: z.string(),
    channelId: z.string(),
    stampId: z.string(),
    before: z.coerce.date(),
    after: z.coerce.date(),
    isBot: z.preprocess((input) => JSON.parse(`${input}`), z.boolean()),
    groupBy: z.union([
      z.literal('month'),
      z.literal('day'),
      z.literal('hour'),
      z.literal('user'),
      z.literal('message'),
      z.literal('messageUser'),
      z.literal('channel'),
      z.literal('stamp'),
    ]),
    orderBy: z.union([z.literal('date'), z.literal('count')]),
    order: z.union([z.literal('asc'), z.literal('desc')]),
    limit: z.preprocess((x) => Number(x), z.number().int().positive()),
    offset: z.preprocess((x) => Number(x), z.number().int().nonnegative()),
  })
  .partial();

export type StampsQuery = z.infer<typeof StampsQuerySchema>;

export const getStamps = async (query: StampsQuery) => {
  const select = {
    month: sqlGetMonth(schema.messageStamps.createdAt),
    day: sqlGetDate(schema.messageStamps.createdAt),
    hour: sqlGetHour(schema.messageStamps.createdAt),
    user: schema.messageStamps.userId,
    message: schema.messageStamps.messageId,
    messageUser: schema.messageStamps.messageUserId,
    channel: schema.messageStamps.channelId,
    stamp: schema.messageStamps.stampId,
  }[query.groupBy ?? 'day'];

  const groupBy = {
    month: sqlGetMonth(schema.messageStamps.createdAt),
    day: sqlGetDate(schema.messageStamps.createdAt),
    hour: sqlGetHour(schema.messageStamps.createdAt),
    user: schema.messageStamps.userId,
    message: schema.messageStamps.messageId,
    messageUser: schema.messageStamps.messageUserId,
    channel: schema.messageStamps.channelId,
    stamp: schema.messageStamps.stampId,
  }[query.groupBy ?? 'day'];

  const order = query.order === 'asc' ? asc : desc;

  const orderBy = {
    date: query.groupBy ? order(groupBy) : order(schema.messageStamps.createdAt),
    count: order(count()),
  }[query.orderBy ?? 'count'];

  const conditions = [
    query.userId && eq(schema.messageStamps.userId, query.userId),
    query.messageUserId && eq(schema.messageStamps.messageUserId, query.messageUserId),
    query.channelId && eq(schema.messageStamps.channelId, query.channelId),
    query.stampId && eq(schema.messageStamps.stampId, query.stampId),
    query.after && gt(schema.messageStamps.createdAt, query.after),
    query.before && lt(schema.messageStamps.createdAt, query.before),
    query.isBot && eq(schema.messageStamps.isBot, query.isBot),
  ];

  if (isYearQuery(query)) {
    // biome-ignore lint/style/noNonNullAssertion: already checked above
    const year = query.after?.toISOString().slice(0, 4)!;

    if (
      query.groupBy === 'channel' &&
      (query.orderBy ?? 'count') === 'count' &&
      query.userId !== undefined &&
      !query.messageUserId &&
      !query.channelId &&
      !query.stampId &&
      !query.isBot
    ) {
      const results = await db
        .select({
          channel: schema.yearlyGaveMessageStampChannelsRankingView.channel,
          count: schema.yearlyGaveMessageStampChannelsRankingView.count,
        })
        .from(schema.yearlyGaveMessageStampChannelsRankingView)
        .where(
          and(
            eq(schema.yearlyGaveMessageStampChannelsRankingView.year, year),
            eq(schema.yearlyGaveMessageStampChannelsRankingView.user, query.userId),
          ),
        )
        .orderBy(order(schema.yearlyGaveMessageStampChannelsRankingView.count))
        .limit(Math.min(query?.limit ?? 10000, 10000))
        .offset(query?.offset ?? 0)
        .execute();

      return results;
    }

    if (
      query.groupBy === 'stamp' &&
      (query.orderBy ?? 'count') === 'count' &&
      query.userId !== undefined &&
      !query.messageUserId &&
      !query.channelId &&
      !query.stampId &&
      !query.isBot
    ) {
      const results = await db
        .select({
          stamp: schema.yearlyGaveMessageStampsRankingView.stamp,
          count: schema.yearlyGaveMessageStampsRankingView.count,
        })
        .from(schema.yearlyGaveMessageStampsRankingView)
        .where(
          and(
            eq(schema.yearlyGaveMessageStampsRankingView.year, year),
            eq(schema.yearlyGaveMessageStampsRankingView.user, query.userId),
          ),
        )
        .orderBy(order(schema.yearlyGaveMessageStampsRankingView.count))
        .limit(Math.min(query?.limit ?? 10000, 10000))
        .offset(query?.offset ?? 0)
        .execute();

      return results;
    }

    if (
      query.groupBy === 'stamp' &&
      (query.orderBy ?? 'count') === 'count' &&
      !query.userId &&
      query.messageUserId !== undefined &&
      !query.channelId &&
      !query.stampId &&
      !query.isBot
    ) {
      const results = await db
        .select({
          stamp: schema.yearlyReceivedMessageStampsRankingView.stamp,
          count: schema.yearlyReceivedMessageStampsRankingView.count,
        })
        .from(schema.yearlyReceivedMessageStampsRankingView)
        .where(
          and(
            eq(schema.yearlyReceivedMessageStampsRankingView.year, year),
            eq(schema.yearlyReceivedMessageStampsRankingView.user, query.messageUserId),
          ),
        )
        .orderBy(order(schema.yearlyReceivedMessageStampsRankingView.count))
        .limit(Math.min(query?.limit ?? 10000, 10000))
        .offset(query?.offset ?? 0)
        .execute();

      return results;
    }
  }

  const initialQuery = db
    .select({
      ...(query.groupBy ? { [query.groupBy]: select } : {}),
      count: count(),
    })
    .from(schema.messageStamps);

  const groupedQuery = query.groupBy ? initialQuery.groupBy(groupBy) : initialQuery;

  const resultQuery = groupedQuery
    .where(and(...conditions.filter((x) => !!x)))
    .orderBy(orderBy)
    .limit(Math.min(query?.limit ?? 10000, 10000))
    .offset(query?.offset ?? 0);

  const results = await resultQuery.execute();

  return results;
};

export const StampsMeanUsageQuerySchema = z
  .object({
    userId: z.string(),
    messageUserId: z.string(),
    channelId: z.string(),
    before: z.coerce.date(),
    after: z.coerce.date(),
    isBot: z.preprocess((input) => JSON.parse(`${input}`), z.boolean()),
  })
  .partial()
  .extend({
    target: z.union([z.literal('user'), z.literal('messageUser'), z.literal('channel')]),
  });

export type StampsMeanUsageQuery = z.infer<typeof StampsMeanUsageQuerySchema>;

export const getStampsMeanUsage = async (query: StampsMeanUsageQuery) => {
  const target = {
    user: schema.messageStamps.userId,
    messageUser: schema.messageStamps.messageUserId,
    channel: schema.messageStamps.channelId,
  }[query.target];

  const conditions = [
    query.userId && eq(schema.messageStamps.userId, query.userId),
    query.messageUserId && eq(schema.messageStamps.messageUserId, query.messageUserId),
    query.channelId && eq(schema.messageStamps.channelId, query.channelId),
    query.after && gt(schema.messageStamps.createdAt, query.after),
    query.before && lt(schema.messageStamps.createdAt, query.before),
    query.isBot && eq(schema.messageStamps.isBot, query.isBot),
  ];

  const result = await db
    .select({
      [query.target]: target,
      stamp: schema.messageStamps.stampId,
      count: count(),
    })
    .from(schema.messageStamps)
    .where(and(...conditions.filter((x) => !!x)))
    .groupBy(schema.messageStamps.stampId, target)
    .execute();

  const stampsUsageTotal = new Map<string, number>();
  const stampsUsageCount = new Map<string, number>();

  for (const { stamp, count } of result) {
    stampsUsageTotal.set(stamp, (stampsUsageTotal.get(stamp) ?? 0) + count);
    stampsUsageCount.set(stamp, (stampsUsageCount.get(stamp) ?? 0) + 1);
  }

  const stampsUsageMean = [...stampsUsageTotal.entries()].map(([stamp, total]) => ({
    stamp,
    // biome-ignore lint/style/noNonNullAssertion: 絶対にある
    mean: total / stampsUsageCount.get(stamp)!,
  }));

  return stampsUsageMean;
};

export const dropStamps = async () => {
  await db.delete(schema.messageStamps).execute();
};
