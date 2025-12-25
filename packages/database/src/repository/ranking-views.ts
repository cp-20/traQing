import { db } from '@/db';
import * as schema from '@/schema';

export const getChannelMessageRanking = async () => {
  return await db.select().from(schema.channelMessageRankingView).execute();
};

export const getMessagesRanking = async () => {
  return await db.select().from(schema.messagesRankingView).execute();
};

export const getMessagesTimeline = async () => {
  return await db.select().from(schema.messagesMonthlyTimelineView).execute();
};

export const getStampRanking = async () => {
  return await db.select().from(schema.stampRankingView).execute();
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
  await db.refreshMaterializedView(schema.stampRankingView);
  await db.refreshMaterializedView(schema.channelStampsRankingView);
  await db.refreshMaterializedView(schema.gaveMessageStampsRankingView);
  await db.refreshMaterializedView(schema.receivedMessageStampsRankingView);
  await db.refreshMaterializedView(schema.yearlyChannelMessageRankingView);
  await db.refreshMaterializedView(schema.yearlyGaveMessageStampChannelsRankingView);
  await db.refreshMaterializedView(schema.yearlyGaveMessageStampsRankingView);
  await db.refreshMaterializedView(schema.yearlyMessageLengthRankingView);
  await db.refreshMaterializedView(schema.yearlyMessagesRankingView);
  await db.refreshMaterializedView(schema.yearlyReceivedMessageStampsRankingView);
};
