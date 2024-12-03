import { db } from '@/db';
import { sqlGetDate, sqlGetHour, sqlGetMonth } from '@/util';
import { and, asc, count, desc, eq, gt, lt } from 'drizzle-orm';
import { z } from 'zod';
import * as schema from '@/schema';

type Message = typeof schema.messages.$inferSelect;
export const insertMessages = async (messages: Message[]) => {
  await db
    .insert(schema.messages)
    .values(messages)
    .onConflictDoNothing()
    .returning({ id: schema.messages.id })
    .execute();
};

export const MessagesQuerySchema = z
  .object({
    userId: z.string(),
    channelId: z.string(),
    before: z.coerce.date(),
    after: z.coerce.date(),
    isBot: z.coerce.boolean(),
    groupBy: z.union([
      z.literal('month'),
      z.literal('day'),
      z.literal('hour'),
      z.literal('user'),
      z.literal('channel'),
    ]),
    orderBy: z.union([z.literal('date'), z.literal('count')]),
    order: z.union([z.literal('asc'), z.literal('desc')]),
    limit: z.preprocess((x) => Number(x), z.number().int().positive()),
    offset: z.preprocess((x) => Number(x), z.number().int().nonnegative()),
  })
  .partial();

export type MessagesQuery = z.infer<typeof MessagesQuerySchema>;

type GetMessagesResult<Q extends MessagesQuery> = Promise<
  Array<
    {
      [K in Q extends { groupBy: infer U } ? (U extends undefined ? never : U) : never]: string;
    } & { count: number }
  >
>;

export const getMessages = async (query: MessagesQuery): GetMessagesResult<MessagesQuery> => {
  const select = {
    month: sqlGetMonth(schema.messages.createdAt),
    day: sqlGetDate(schema.messages.createdAt),
    hour: sqlGetHour(schema.messages.createdAt),
    user: schema.messages.userId,
    channel: schema.messages.channelId,
  }[query.groupBy ?? 'day'];

  const groupBy = {
    month: sqlGetMonth(schema.messages.createdAt),
    day: sqlGetDate(schema.messages.createdAt),
    hour: sqlGetHour(schema.messages.createdAt),
    user: schema.messages.userId,
    channel: schema.messages.channelId,
  }[query.groupBy ?? 'day'];

  const order = query.order === 'asc' ? asc : desc;

  const orderBy = {
    date: query.groupBy ? order(groupBy) : order(schema.messages.createdAt),
    count: order(count(schema.messages.id)),
  }[query.orderBy ?? 'count'];

  const conditions = [
    query.userId && eq(schema.messages.userId, query.userId),
    query.channelId && eq(schema.messages.channelId, query.channelId),
    query.after && gt(schema.messages.createdAt, query.after),
    query.before && lt(schema.messages.createdAt, query.before),
    query.isBot && eq(schema.messages.isBot, query.isBot),
  ];

  const initialQuery = db
    .select({
      ...(query.groupBy ? { [query.groupBy]: select } : {}),
      count: count(schema.messages.id),
    })
    .from(schema.messages)
    .where(and(...conditions.filter((x) => !!x)))
    .orderBy(orderBy)
    .limit(Math.min(query?.limit ?? 10000, 10000))
    .offset(query?.offset ?? 0);

  const finalQuery = query.groupBy ? initialQuery.groupBy(groupBy) : initialQuery;

  const results = await finalQuery.execute();

  return results;
};

export const getLastMessageCreatedAt = async () => {
  const message = await db
    .select({ createdAt: schema.messages.createdAt })
    .from(schema.messages)
    .orderBy(desc(schema.messages.createdAt))
    .limit(1)
    .execute();

  return message.at(0)?.createdAt;
};
