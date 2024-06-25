import { db } from '@/db';
import * as schema from './schema';
import { and, asc, count, desc, eq, gt, lt, sql } from 'drizzle-orm';
import { z } from 'zod';

type Message = typeof schema.messages.$inferSelect;
type MessageStamp = typeof schema.messageStamps.$inferSelect;

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
    before: z.string(),
    after: z.string(),
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

const sqlGetMonth = <T>(date: T) => sql`TO_CHAR(${date}, 'YYYY-MM')`;
const sqlGetDate = <T>(date: T) => sql`TO_CHAR(${date}, 'YYYY-MM-DD')`;
const sqlGetHour = <T>(date: T) => sql`TO_CHAR(${date}, 'HH24')`;

export type MessagesQuery = z.infer<typeof MessagesQuerySchema>;

type GetMessagesResult<Q extends MessagesQuery> = Promise<
  Array<
    {
      [K in Q extends { groupBy: infer U }
        ? U extends undefined
          ? never
          : U
        : never]: string;
    } & { count: number }
  >
>;

export const getMessages = async (
  query: MessagesQuery
): GetMessagesResult<MessagesQuery> => {
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
    query.after && gt(schema.messages.createdAt, new Date(query.after)),
    query.before && lt(schema.messages.createdAt, new Date(query.before)),
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

  const finalQuery = query.groupBy
    ? initialQuery.groupBy(groupBy)
    : initialQuery;

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

export const insertMessageStamps = async (stamps: MessageStamp[]) => {
  await db
    .insert(schema.messageStamps)
    .values(stamps)
    .onConflictDoNothing()
    .execute();
};

export const StampsQuerySchema = z
  .object({
    userId: z.string(),
    messageUserId: z.string(),
    channelId: z.string(),
    stampId: z.string(),
    before: z.string(),
    after: z.string(),
    groupBy: z.union([
      z.literal('month'),
      z.literal('day'),
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
    user: schema.messageStamps.userId,
    message: schema.messageStamps.messageId,
    messageUser: schema.messages.userId,
    channel: schema.messageStamps.channelId,
    stamp: schema.messageStamps.stampId,
  }[query.groupBy ?? 'day'];

  const groupBy = {
    month: sqlGetMonth(schema.messageStamps.createdAt),
    day: sqlGetDate(schema.messageStamps.createdAt),
    user: schema.messageStamps.userId,
    message: schema.messageStamps.messageId,
    messageUser: schema.messages.userId,
    channel: schema.messageStamps.channelId,
    stamp: schema.messageStamps.stampId,
  }[query.groupBy ?? 'day'];

  const order = query.order === 'asc' ? asc : desc;

  const orderBy = {
    date: order(schema.messageStamps.createdAt),
    count: order(count(schema.messageStamps.stampId)),
  }[query.orderBy ?? 'count'];

  const conditions = [
    query.userId && eq(schema.messageStamps.userId, query.userId),
    query.messageUserId && eq(schema.messages.userId, query.messageUserId),
    query.channelId && eq(schema.messageStamps.channelId, query.channelId),
    query.stampId && eq(schema.messageStamps.stampId, query.stampId),
    query.after && gt(schema.messageStamps.createdAt, new Date(query.after)),
    query.before && lt(schema.messageStamps.createdAt, new Date(query.before)),
  ];

  const initialQuery = db
    .select({
      ...(query.groupBy ? { [query.groupBy]: select } : {}),
      count: count(),
    })
    .from(schema.messageStamps);

  const joinedQuery =
    query.messageUserId || query.groupBy === 'messageUser'
      ? initialQuery.leftJoin(
          schema.messages,
          eq(schema.messages.id, schema.messageStamps.messageId)
        )
      : initialQuery;

  const groupedQuery = query.groupBy
    ? joinedQuery.groupBy(groupBy)
    : joinedQuery;

  const resultQuery = groupedQuery
    .where(and(...conditions.filter((x) => !!x)))
    .orderBy(orderBy)
    .limit(Math.min(query?.limit ?? 10000, 10000))
    .offset(query?.offset ?? 0);

  const results = await resultQuery.execute();

  return results;
};

export const getMessagesRanking = async () => {
  return await db.select().from(schema.messagesRanking).execute();
};

export const getGaveMessageStampsRanking = async () => {
  return await db.select().from(schema.gaveMessageStampsRanking).execute();
};

export const getReceivedMessageStampsRanking = async () => {
  return await db.select().from(schema.receivedMessageStampsRanking).execute();
};
