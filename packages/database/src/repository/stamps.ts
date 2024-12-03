import { db } from '@/db';
import { sqlGetMonth, sqlGetDate, sqlGetHour } from '@/util';
import { asc, desc, count, eq, gt, lt, and } from 'drizzle-orm';
import { z } from 'zod';
import * as schema from '@/schema';

export const StampsQuerySchema = z
  .object({
    userId: z.string(),
    messageUserId: z.string(),
    channelId: z.string(),
    stampId: z.string(),
    before: z.coerce.date(),
    after: z.coerce.date(),
    isBot: z.coerce.boolean(),
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
    date: query.groupBy ? order(groupBy) : order(schema.messages.createdAt),
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
