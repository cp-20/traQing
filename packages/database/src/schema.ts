import { count, desc } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  uuid,
  timestamp,
  boolean,
  pgMaterializedView,
} from 'drizzle-orm/pg-core';

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    channelId: uuid('channel_id').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull(),
    pinned: boolean('pinned').notNull(),
  },
  (t) => ({
    userIdIndex: index('messages_user_id_idx').on(t.userId),
    channelIdIndex: index('messages_channel_id_idx').on(t.channelId),
    createdAtIndex: index('messages_created_at_idx').on(t.createdAt),
    pinnedIndex: index('messages_pinned_idx').on(t.pinned),
  })
);

export const messagesRankingView = pgMaterializedView('messages_ranking').as(
  (qb) =>
    qb
      .select({
        user: messages.userId,
        count: count().as('count'),
      })
      .from(messages)
      .groupBy(messages.userId)
      .orderBy(desc(count()))
);

export const messageStamps = pgTable(
  'message_stamps',
  {
    userId: uuid('user_id').notNull(),
    stampId: uuid('stamp_id').notNull(),
    messageId: uuid('message_id')
      .notNull()
      .references(() => messages.id),
    messageUserId: uuid('message_user_id').notNull(),
    channelId: uuid('channel_id').notNull(),
    count: integer('count').notNull(),
    createdAt: timestamp('created_at').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.stampId, t.messageId] }),
    userIdIndex: index('message_stamps_user_id_idx').on(t.userId),
    stampIdIndex: index('message_stamps_stamp_id_idx').on(t.stampId),
    channelIdIndex: index('message_stamps_channel_id_idx').on(t.channelId),
    messageIdIndex: index('message_stamps_message_id_idx').on(t.messageId),
    messageUserIndex: index('message_stamps_message_user_id_idx').on(
      t.messageUserId
    ),
    createdAtIndex: index('message_stamps_created_at_idx').on(t.createdAt),
  })
);

export const stampRelationsView = pgMaterializedView('stamp_relations').as(
  (qb) =>
    qb
      .select({
        messageUser: messageStamps.messageUserId,
        user: messageStamps.userId,
        count: count().as('count'),
      })
      .from(messageStamps)
      .groupBy(messageStamps.userId, messageStamps.messageUserId)
      .orderBy(desc(count()))
);

export const gaveMessageStampsRankingView = pgMaterializedView(
  'gave_message_stamps_ranking'
).as((qb) =>
  qb
    .select({
      user: messageStamps.userId,
      count: count().as('count'),
    })
    .from(messageStamps)
    .groupBy(messageStamps.userId)
    .orderBy(desc(count()))
);

export const receivedMessageStampsRankingView = pgMaterializedView(
  'received_message_stamps_ranking'
).as((qb) =>
  qb
    .select({
      messageUser: messageStamps.messageUserId,
      count: count().as('count'),
    })
    .from(messageStamps)
    .groupBy(messageStamps.messageUserId)
    .orderBy(desc(count()))
);
