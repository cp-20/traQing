import { db } from '@/db';
import { sqlGetDate, sqlGetHour, sqlGetMonth } from '@/util';
import { and, asc, count, desc, eq, gt, gte, lt } from 'drizzle-orm';
import { z } from 'zod';
import * as schema from './schema';

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

export const insertMessageStamps = async (stamps: MessageStamp[]) => {
  await db.insert(schema.messageStamps).values(stamps).onConflictDoNothing().execute();
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
    query.after && gt(schema.messageStamps.createdAt, new Date(query.after)),
    query.before && lt(schema.messageStamps.createdAt, new Date(query.before)),
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

export const getChannelMessageRanking = async () => {
  return await db.select().from(schema.channelMessageRankingView).execute();
};

export const getMessagesRanking = async () => {
  return await db.select().from(schema.messagesRankingView).execute();
};

export const getMessagesTimeline = async () => {
  return await db.select().from(schema.messagesMonthlyTimelineView).execute();
};

export const getChannelStampsRanking = async () => {
  return await db.select().from(schema.channelStampsRankingView).execute();
};

export const getGaveMessageStampsRanking = async () => {
  return await db.select().from(schema.gaveMessageStampsRankingView).execute();
};

export const getReceivedMessageStampsRanking = async () => {
  return await db.select().from(schema.receivedMessageStampsRankingView).execute();
};

export const updateMaterializedViews = async () => {
  await db.refreshMaterializedView(schema.channelMessageRankingView);
  await db.refreshMaterializedView(schema.messagesRankingView);
  await db.refreshMaterializedView(schema.messagesMonthlyTimelineView);
  await db.refreshMaterializedView(schema.stampRelationsView);
  await db.refreshMaterializedView(schema.channelStampsRankingView);
  await db.refreshMaterializedView(schema.gaveMessageStampsRankingView);
  await db.refreshMaterializedView(schema.receivedMessageStampsRankingView);
};
