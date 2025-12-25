import { asc, count, desc, sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgMaterializedView,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { sqlGetMonth, sqlGetYear } from '@/util';

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    channelId: uuid('channel_id').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull(),
    pinned: boolean('pinned').notNull(),
    isBot: boolean('is_bot').notNull(),
  },
  (t) => ({
    userIdIndex: index('messages_user_id_idx').on(t.userId),
    channelIdIndex: index('messages_channel_id_idx').on(t.channelId),
    createdAtIndex: index('messages_created_at_idx').on(t.createdAt),
    pinnedIndex: index('messages_pinned_idx').on(t.pinned),
    userIdChannelIdIndex: index('messages_user_id_channel_id_idx').on(t.userId, t.channelId),
  }),
);

export const channelMessageRankingView = pgMaterializedView('channel_messages_ranking').as((qb) =>
  qb
    .select({
      channel: messages.channelId,
      count: count().as('count'),
    })
    .from(messages)
    .groupBy(messages.channelId)
    .orderBy(desc(count())),
);

export const messagesRankingView = pgMaterializedView('messages_ranking').as((qb) =>
  qb
    .select({
      user: messages.userId,
      count: count().as('count'),
    })
    .from(messages)
    .groupBy(messages.userId)
    .orderBy(desc(count())),
);

export const messagesMonthlyTimelineView = pgMaterializedView('messages_monthly_timeline').as((qb) =>
  qb
    .select({
      month: sqlGetMonth(messages.createdAt).as('month'),
      count: count().as('count'),
    })
    .from(messages)
    .groupBy(sqlGetMonth(messages.createdAt))
    .orderBy(asc(sqlGetMonth(messages.createdAt))),
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
    isBot: boolean('is_bot').notNull(),
    isBotMessage: boolean('is_bot_message').notNull(),
    count: integer('count').notNull(),
    createdAt: timestamp('created_at').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.stampId, t.messageId] }),
    userIdIndex: index('message_stamps_user_id_idx').on(t.userId),
    stampIdIndex: index('message_stamps_stamp_id_idx').on(t.stampId),
    channelIdIndex: index('message_stamps_channel_id_idx').on(t.channelId),
    messageIdIndex: index('message_stamps_message_id_idx').on(t.messageId),
    messageUserIndex: index('message_stamps_message_user_id_idx').on(t.messageUserId),
    createdAtIndex: index('message_stamps_created_at_idx').on(t.createdAt),
    stampIdUserIdIndex: index('message_stamps_stamp_id_user_id_idx').on(t.stampId, t.userId),
    stampIdMessageUserIdIndex: index('message_stamps_stamp_id_message_user_id_idx').on(t.stampId, t.messageUserId),
    stampIdChannelIdIndex: index('message_stamps_stamp_id_channel_id_idx').on(t.stampId, t.channelId),
    stampIdMessageIdIndex: index('message_stamps_stamp_id_message_id_idx').on(t.stampId, t.messageId),
    userIdStampIdIndex: index('message_stamps_user_id_stamp_id_idx').on(t.userId, t.stampId),
    userIdChannelIdIndex: index('message_stamps_user_id_channel_id_idx').on(t.userId, t.channelId),
    messageUserIdChannelIdIndex: index('message_stamps_message_user_id_channel_id_idx').on(
      t.messageUserId,
      t.channelId,
    ),
  }),
);

export const stampRelationsView = pgMaterializedView('stamp_relations').as((qb) =>
  qb
    .select({
      messageUser: messageStamps.messageUserId,
      user: messageStamps.userId,
      count: count().as('count'),
    })
    .from(messageStamps)
    .groupBy(messageStamps.userId, messageStamps.messageUserId)
    .orderBy(desc(count())),
);

export const stampRankingView = pgMaterializedView('stamp_ranking').as((qb) =>
  qb
    .select({
      stamp: messageStamps.stampId,
      count: count().as('count'),
    })
    .from(messageStamps)
    .groupBy(messageStamps.stampId)
    .orderBy(desc(count())),
);

export const channelStampsRankingView = pgMaterializedView('channel_stamps_ranking').as((qb) =>
  qb
    .select({
      channel: messageStamps.channelId,
      count: count().as('count'),
    })
    .from(messageStamps)
    .groupBy(messageStamps.channelId)
    .orderBy(desc(count())),
);

export const gaveMessageStampsRankingView = pgMaterializedView('gave_message_stamps_ranking').as((qb) =>
  qb
    .select({
      user: messageStamps.userId,
      count: count().as('count'),
    })
    .from(messageStamps)
    .groupBy(messageStamps.userId)
    .orderBy(desc(count())),
);

export const receivedMessageStampsRankingView = pgMaterializedView('received_message_stamps_ranking').as((qb) =>
  qb
    .select({
      messageUser: messageStamps.messageUserId,
      count: count().as('count'),
    })
    .from(messageStamps)
    .groupBy(messageStamps.messageUserId)
    .orderBy(desc(count())),
);

export const yearlyMessagesRankingView = pgMaterializedView('yearly_messages_ranking').as((qb) =>
  qb
    .select({
      year: sqlGetYear(messages.createdAt).as('year'),
      user: messages.userId,
      count: count().as('count'),
    })
    .from(messages)
    .groupBy(sqlGetYear(messages.createdAt), messages.userId)
    .orderBy(desc(count())),
);

export const yearlyChannelMessageRankingView = pgMaterializedView('yearly_channel_message_ranking').as((qb) =>
  qb
    .select({
      year: sqlGetYear(messages.createdAt).as('year'),
      user: messages.userId,
      channel: messages.channelId,
      count: count().as('count'),
    })
    .from(messages)
    .groupBy(sqlGetYear(messages.createdAt), messages.userId, messages.channelId)
    .orderBy(desc(sqlGetYear(messages.createdAt)), desc(count())),
);

export const yearlyGaveMessageStampChannelsRankingView = pgMaterializedView(
  'yearly_gave_message_stamp_channels_ranking',
).as((qb) =>
  qb
    .select({
      year: sqlGetYear(messageStamps.createdAt).as('year'),
      user: messageStamps.userId,
      channel: messageStamps.channelId,
      count: count().as('count'),
    })
    .from(messageStamps)
    .groupBy(sqlGetYear(messageStamps.createdAt), messageStamps.userId, messageStamps.channelId)
    .orderBy(desc(sqlGetYear(messageStamps.createdAt)), desc(count())),
);

export const yearlyMessageLengthRankingView = pgMaterializedView('yearly_message_length_ranking').as((qb) =>
  qb
    .select({
      year: sqlGetYear(messages.createdAt).as('year'),
      user: messages.userId,
      contentSum: sql`SUM(length(${messages.content}))`.as('total_length'),
    })
    .from(messages)
    .groupBy(sqlGetYear(messages.createdAt), messages.userId)
    .orderBy(desc(sql`SUM(length(${messages.content}))`)),
);

export const yearlyGaveMessageStampsRankingView = pgMaterializedView('yearly_gave_message_stamps_ranking').as((qb) =>
  qb
    .select({
      year: sqlGetYear(messageStamps.createdAt).as('year'),
      user: messageStamps.userId,
      stamp: messageStamps.stampId,
      count: count().as('count'),
    })
    .from(messageStamps)
    .groupBy(sqlGetYear(messageStamps.createdAt), messageStamps.userId, messageStamps.stampId)
    .orderBy(desc(count())),
);

export const yearlyReceivedMessageStampsRankingView = pgMaterializedView('yearly_received_message_stamps_ranking').as(
  (qb) =>
    qb
      .select({
        year: sqlGetYear(messageStamps.createdAt).as('year'),
        user: messageStamps.messageUserId,
        stamp: messageStamps.stampId,
        count: count().as('count'),
      })
      .from(messageStamps)
      .groupBy(sqlGetYear(messageStamps.createdAt), messageStamps.messageUserId, messageStamps.stampId)
      .orderBy(desc(count())),
);

export const userGroupRelations = pgTable(
  'user_group_relations',
  {
    userId: uuid('user_id').notNull(),
    groupId: uuid('group_id').notNull(),
    isAdmin: boolean('is_admin').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.groupId] }),
    userIdIndex: index('user_group_relations_user_id_idx').on(t.userId),
    groupIdIndex: index('user_group_relations_group_id_idx').on(t.groupId),
  }),
);

export const tags = pgTable(
  'tags',
  {
    userId: uuid('user_id').notNull(),
    name: text('name').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.name] }),
    nameIndex: index('tags_name_idx').on(t.name),
  }),
);

export const channelSubscriptions = pgTable(
  'channel_subscriptions',
  {
    userId: uuid('user_id').notNull(),
    channelId: uuid('channel_id').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.channelId] }),
    userIdIndex: index('channel_subscriptions_user_id_idx').on(t.userId),
    channelIdIndex: index('channel_subscriptions_channel_id_idx').on(t.channelId),
  }),
);

export const channelPins = pgTable(
  'channel_pins',
  {
    channelId: uuid('channel_id').notNull(),
    messageId: uuid('message_id').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.channelId, t.messageId] }),
    channelIdIndex: index('channel_pins_channel_id_idx').on(t.channelId),
    messageIdIndex: index('channel_pins_message_id_idx').on(t.messageId),
  }),
);
