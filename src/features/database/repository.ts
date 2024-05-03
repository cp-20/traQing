import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import * as schema from './schema';
import Database from 'bun:sqlite';
import { and, asc, count, desc, eq, gt, lt, sql } from 'drizzle-orm';
import { z } from 'zod';
import { excludeFalsy } from '@/utils/excludeFalsy';

type Message = typeof schema.messages.$inferSelect;
type MessageStamp = typeof schema.messageStamps.$inferSelect;

const dbUrl = process.env.DB_URL;
if (!dbUrl) throw new Error('DB_URL is not set');

const database = new Database(dbUrl);
const db = drizzle(database, { schema, logger: true });
migrate(db, { migrationsFolder: './drizzle' });

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
      z.literal('user'),
      z.literal('channel'),
    ]),
    orderBy: z.union([z.literal('date'), z.literal('count')]),
    order: z.union([z.literal('asc'), z.literal('desc')]),
    limit: z.number(),
    offset: z.number(),
  })
  .partial();

export type MessagesQuery = z.infer<typeof MessagesQuerySchema>;

export const getMessages = async (query: MessagesQuery) => {
  const select = {
    month: sql`strftime('%Y-%m', date(${schema.messages.createdAt}))`,
    day: sql`strftime('%Y-%m-%d', date(${schema.messages.createdAt}))`,
    user: schema.messages.userId,
    channel: schema.messages.channelId,
  }[query.groupBy ?? 'day'];

  const groupBy = {
    month: sql`strftime('%Y-%m', date(${schema.messages.createdAt}))`,
    day: sql`strftime('%Y-%m-%d', date(${schema.messages.createdAt}))`,
    user: schema.messages.userId,
    channel: schema.messages.channelId,
  }[query.groupBy ?? 'day'];

  const order = query.order === 'asc' ? asc : desc;

  const orderBy = {
    date: order(schema.messages.createdAt),
    count: order(count(schema.messages.id)),
  }[query.orderBy ?? 'count'];

  const conditions = [
    query.userId && eq(schema.messages.userId, query.userId),
    query.channelId && eq(schema.messages.channelId, query.channelId),
    query.after &&
      gt(
        schema.messages.createdAtTimestamp,
        sql`strftime('%s', ${query.after})`
      ),
    query.before &&
      lt(
        schema.messages.createdAtTimestamp,
        sql`strftime('%s', ${query.before})`
      ),
  ];

  let initialQuery = db
    .select({
      ...(query.groupBy ? { [query.groupBy]: select } : {}),
      count: count(schema.messages.id),
    })
    .from(schema.messages)
    .where(and(...excludeFalsy(conditions)))
    .orderBy(orderBy)
    .limit(Math.min(query?.limit ?? 1000, 1000))
    .offset(query?.offset ?? 0);

  let newQuery;
  if (query.groupBy) {
    newQuery = initialQuery.groupBy(groupBy);
  }

  const dbQuery = newQuery ?? initialQuery;

  const results = await dbQuery.execute();

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
    channelId: z.string(),
    stampId: z.string(),
    before: z.string(),
    after: z.string(),
    groupBy: z.union([
      z.literal('month'),
      z.literal('day'),
      z.literal('user'),
      z.literal('channel'),
      z.literal('stamp'),
    ]),
    orderBy: z.union([z.literal('date'), z.literal('count')]),
    order: z.union([z.literal('asc'), z.literal('desc')]),
    limit: z.number(),
    offset: z.number(),
  })
  .partial();

export type StampsQuery = z.infer<typeof StampsQuerySchema>;

export const getStamps = async (query: StampsQuery) => {
  const select = {
    month: sql`strftime('%Y-%m', date(${schema.messageStamps.createdAt}))`,
    day: sql`strftime('%Y-%m-%d', date(${schema.messageStamps.createdAt}))`,
    user: schema.messageStamps.userId,
    channel: schema.messageStamps.channelId,
    stamp: schema.messageStamps.stampId,
  }[query.groupBy ?? 'day'];

  const groupBy = {
    month: sql`strftime('%Y-%m', date(${schema.messageStamps.createdAt}))`,
    day: sql`strftime('%Y-%m-%d', date(${schema.messageStamps.createdAt}))`,
    user: schema.messageStamps.userId,
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
    query.channelId && eq(schema.messageStamps.channelId, query.channelId),
    query.after &&
      gt(
        schema.messageStamps.createdAtTimestamp,
        sql`strftime('%s', ${query.after})`
      ),
    query.before &&
      lt(
        schema.messageStamps.createdAtTimestamp,
        sql`strftime('%s', ${query.before})`
      ),
  ];

  let initialQuery = db
    .select({
      ...(query.groupBy ? { [query.groupBy]: select } : {}),
      count: count(schema.messageStamps.stampId),
    })
    .from(schema.messageStamps)
    .where(and(...excludeFalsy(conditions)))
    .orderBy(orderBy)
    .limit(Math.min(query?.limit ?? 1000, 1000))
    .offset(query?.offset ?? 0);

  let newQuery;
  if (query.groupBy) {
    newQuery = initialQuery.groupBy(groupBy);
  }
  const dbQuery = newQuery ?? initialQuery;

  const results = await dbQuery.execute();

  return results;
};
