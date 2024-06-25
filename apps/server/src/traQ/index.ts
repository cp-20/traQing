import {
  getLastMessageCreatedAt,
  insertMessageStamps,
  insertMessages,
} from '@traq-ing/database';
import { api } from './api';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const tzOffset = -new Date().getTimezoneOffset() * 60 * 1000;

export const updateMessages = async () => {
  const lastMessage = await getLastMessageCreatedAt();
  const after = lastMessage ? new Date(lastMessage).toISOString() : undefined;

  let before = new Date().toISOString();

  let offset = 0;
  // eslint-disable-next-line no-constant-condition
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
      createdAt: new Date(new Date(m.createdAt).getTime() + tzOffset),
      pinned: m.pinned,
    }));

    await insertMessages(messages);

    const stamps = searched.flatMap((m) =>
      m.stamps.map((s) => ({
        messageId: m.id,
        userId: s.userId,
        stampId: s.stampId,
        channelId: m.channelId,
        count: s.count,
        createdAt: new Date(new Date(s.createdAt).getTime() + tzOffset),
      }))
    );

    if (stamps.length > 0) {
      await insertMessageStamps(stamps);
    }

    offset += searched.length;
    before = searched[searched.length - 1].createdAt;

    console.log(offset, searched[searched.length - 1].createdAt);
    await sleep(100);
  }
};
