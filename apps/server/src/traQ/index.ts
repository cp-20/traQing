import {
  deleteChannelPins,
  deleteChannelSubscriptions,
  deleteTags,
  deleteUserGroupRelations,
  getChannelPins,
  getChannelSubscriptions,
  getLastMessageCreatedAt,
  getTags,
  getUserGroupRelations,
  insertChannelPins,
  insertChannelSubscriptions,
  insertMessageStamps,
  insertMessages,
  insertTags,
  insertUserGroupRelations,
  updateMaterializedViews,
} from '@traq-ing/database';
import { api } from './api';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const updateMessages = async () => {
  const lastMessage = await getLastMessageCreatedAt();
  const after = lastMessage ? new Date(lastMessage.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString() : undefined;
  let before = new Date().toISOString();

  const res = await api.users.getUsers();
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  const users = res.data;
  const isBot = (id: string) => users.find((u) => u.id === id)?.bot ?? false;

  let offset = 0;
  while (true) {
    const res = await api.messages.searchMessages({
      sort: 'createdAt',
      limit: 100,
      after,
      before,
    });
    if (!res.ok) continue;

    const searched = res.data.hits;
    if (searched.length === 0) break;

    const messages = searched.map((m) => ({
      id: m.id,
      userId: m.userId,
      channelId: m.channelId,
      content: m.content.replaceAll('\u0000', ''),
      createdAt: new Date(m.createdAt),
      pinned: m.pinned,
      isBot: isBot(m.userId),
    }));

    await insertMessages(messages);

    const stamps = searched.flatMap((m) =>
      m.stamps.map((s) => ({
        messageId: m.id,
        userId: s.userId,
        stampId: s.stampId,
        channelId: m.channelId,
        messageUserId: m.userId,
        count: s.count,
        createdAt: new Date(s.createdAt),
        isBot: isBot(m.userId),
        isBotMessage: isBot(s.userId),
      })),
    );

    if (stamps.length > 0) {
      await insertMessageStamps(stamps);
    }

    offset += searched.length;
    before = searched[searched.length - 1].createdAt;

    console.log(offset, searched[searched.length - 1].createdAt);
    await sleep(100);
  }

  await updateMaterializedViews();
};

const getDiff = <T>(before: T[], after: T[], comp: (a: T, b: T) => boolean) => {
  const added = after.filter((a) => !before.some((b) => comp(a, b)));
  const deleted = before.filter((b) => !after.some((a) => comp(a, b)));
  return { added, deleted };
};

const chunkArray = <T>(array: T[], size = 1000) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const updateStatistics = async () => {
  // users
  const userRes = await api.users.getUsers({ 'include-suspended': true });
  if (!userRes.ok) throw new Error('Failed to fetch users');
  const users = userRes.data;
  console.log(`Successfully fetched and inserted ${users.length} users`);

  // groups
  const groupRes = await api.groups.getUserGroups();
  if (!groupRes.ok) throw new Error('Failed to fetch groups');
  const groups = groupRes.data;
  const insertedUserGroupRelations = await getUserGroupRelations();
  console.log(`Successfully fetched ${groups.length} groups`);

  const newUserGroupRelations = groups.flatMap((group) =>
    group.members.map((user) => ({
      userId: user.id,
      groupId: group.id,
      isAdmin: group.admins.includes(user.id),
    })),
  );
  const userGroupRelationsDiff = getDiff(
    insertedUserGroupRelations,
    newUserGroupRelations,
    (a, b) => a.userId === b.userId && a.groupId === b.groupId,
  );
  if (userGroupRelationsDiff.added.length > 0) await insertUserGroupRelations(userGroupRelationsDiff.added);
  console.log(`Successfully inserted ${userGroupRelationsDiff.added.length} groups`);
  if (userGroupRelationsDiff.deleted.length > 0) await deleteUserGroupRelations(userGroupRelationsDiff.deleted);
  console.log(`Successfully deleted ${userGroupRelationsDiff.deleted.length} groups`);

  // tags
  const newTags = [];
  for (const user of users) {
    const res = await api.users.getUser(user.id);
    if (!res.ok) throw new Error('Failed to fetch user');
    const userData = res.data;
    newTags.push(
      ...userData.tags.map((tag) => ({
        userId: user.id,
        name: tag.tag,
      })),
    );
    await sleep(100);
  }
  console.log(`Successfully fetched ${newTags.length} tags`);
  const insertedTags = await getTags();
  const tagsDiff = getDiff(insertedTags, newTags, (a, b) => a.userId === b.userId && a.name === b.name);
  if (tagsDiff.added.length > 0) await insertTags(tagsDiff.added);
  console.log(`Successfully inserted ${tagsDiff.added.length} tags`);
  if (tagsDiff.deleted.length > 0) await deleteTags(tagsDiff.deleted);
  console.log(`Successfully deleted ${tagsDiff.deleted.length} tags`);

  // channels
  const channelRes = await api.channels.getChannels();
  if (!channelRes.ok) throw new Error('Failed to fetch channels');
  const channels = channelRes.data.public;
  console.log(`Successfully fetched ${channels.length} channels`);

  // channel subscriptions
  const newChannelSubscriptions = [];
  for (const channel of channels) {
    try {
      const res = await api.channels.getChannelSubscribers(channel.id);
      if (!res.ok) throw new Error('Failed to fetch channel subscriptions');
      const subscriptions = res.data;
      newChannelSubscriptions.push(
        ...subscriptions.map((subscription) => ({
          userId: subscription,
          channelId: channel.id,
        })),
      );
    } catch (err) {
      // 403エラーの場合はスキップ
    }
    await sleep(100);
  }
  const insertedChannelSubscriptions = await getChannelSubscriptions();
  const channelSubscriptionsDiff = getDiff(
    insertedChannelSubscriptions,
    newChannelSubscriptions,
    (a, b) => a.userId === b.userId && a.channelId === b.channelId,
  );
  // 一度に大量のデータを挿入するとエラーが発生するため、1000件ずつ挿入する
  for (const chunk of chunkArray(channelSubscriptionsDiff.added)) {
    await insertChannelSubscriptions(chunk);
  }
  console.log(`Successfully inserted ${channelSubscriptionsDiff.added.length} channel subscriptions`);
  if (channelSubscriptionsDiff.deleted.length > 0) await deleteChannelSubscriptions(channelSubscriptionsDiff.deleted);
  console.log(`Successfully deleted ${channelSubscriptionsDiff.deleted.length} channel subscriptions`);

  // channel pins
  const newChannelPins = [];
  for (const channel of channels) {
    const res = await api.channels.getChannelPins(channel.id);
    if (!res.ok) throw new Error('Failed to fetch channel pins');
    const pins = res.data;
    newChannelPins.push(
      ...pins.map((pin) => ({
        channelId: channel.id,
        messageId: pin.message.id,
      })),
    );
    await sleep(100);
  }
  const insertedChannelPins = await getChannelPins();
  const channelPinsDiff = getDiff(
    insertedChannelPins,
    newChannelPins,
    (a, b) => a.channelId === b.channelId && a.messageId === b.messageId,
  );
  for (const chunk of chunkArray(channelPinsDiff.added)) {
    await insertChannelPins(chunk);
  }
  console.log(`Successfully inserted ${channelPinsDiff.added.length} channel pins`);
  if (channelPinsDiff.deleted.length > 0) await deleteChannelPins(channelPinsDiff.deleted);
  console.log(`Successfully deleted ${channelPinsDiff.deleted.length} channel pins`);

  await updateMaterializedViews();
};
