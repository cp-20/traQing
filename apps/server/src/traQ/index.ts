import {
  getLastMessageCreatedAt,
  insertMessageStamps,
  insertMessages,
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
      is_bot: isBot(m.userId),
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
        is_bot: isBot(m.userId),
        is_bot_message: isBot(s.userId),
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
