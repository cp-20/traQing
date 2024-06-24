import { count } from 'drizzle-orm';
import {
  text,
  integer,
  sqliteTable,
  primaryKey,
  index,
  sqliteView,
} from 'drizzle-orm/sqlite-core';

export const messages = sqliteTable(
  'messages',
  {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id').notNull(),
    channelId: text('channel_id').notNull(),
    content: text('content').notNull(),
    createdAt: text('created_at').notNull(),
    createdAtTimestamp: integer('created_at_timestamp').notNull(),
    pinned: integer('pinned').notNull(),
  },
  (t) => ({
    userIdIndex: index('messages_user_id_idx').on(t.userId),
    channelIdIndex: index('messages_channel_id_idx').on(t.channelId),
    createdAtIndex: index('messages_created_at_idx').on(t.createdAt),
    createdAtTimestampIndex: index('messages_created_at_timestamp_idx').on(
      t.createdAtTimestamp
    ),
    pinnedIndex: index('messages_pinned_idx').on(t.pinned),
  })
);

export const messagesRanking = sqliteView('messages_ranking').as((qb) =>
  qb
    .select({
      user: messages.userId,
      count: count(messages.userId).as('count'),
    })
    .from(messages)
    .groupBy(messages.userId)
);

export const messageStamps = sqliteTable(
  'message_stamps',
  {
    userId: text('user_id').notNull(),
    stampId: text('stamp_id').notNull(),
    messageId: text('message_id')
      .notNull()
      .references(() => messages.id),
    channelId: text('channel_id'),
    count: integer('count').notNull(),
    createdAt: text('created_at').notNull(),
    createdAtTimestamp: integer('created_at_timestamp').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.stampId, t.messageId] }),
    userIdIndex: index('message_stamps_user_id_idx').on(t.userId),
    stampIdIndex: index('message_stamps_stamp_id_idx').on(t.stampId),
    channelIdIndex: index('message_stamps_channel_id_idx').on(t.channelId),
    messageIdIndex: index('message_stamps_message_id_idx').on(t.messageId),
    createdAtIndex: index('message_stamps_created_at_idx').on(t.createdAt),
    createdAtTimestampIndex: index(
      'message_stamps_created_at_timestamp_idx'
    ).on(t.createdAtTimestamp),
  })
);

export const gaveMessageStampsRanking = sqliteView(
  'gave_message_stamps_ranking'
).as((qb) =>
  qb
    .select({
      user: messageStamps.userId,
      count: count(messageStamps.userId).as('count'),
    })
    .from(messageStamps)
    .groupBy(messageStamps.userId)
);

export const receivedMessageStampsRanking = sqliteView(
  'received_message_stamps_ranking'
).as((qb) =>
  qb
    .select({
      user: messages.userId,
      count: count(messages.userId).as('count'),
    })
    .from(messages)
    .groupBy(messages.userId)
);
