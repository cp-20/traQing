import { client } from '@/features/api';
import useSWR from 'swr';
import type { Channel, Message } from 'traq-bot-ts';

export const useMessage = (messageId: string) => {
  return useSWR<Message[]>(`/api/messages/${messageId}`, () =>
    client.messages[':id'].$get({
      param: { id: messageId },
    })
  );
};

export const useChannels = () => {
  return useSWR<Channel[]>('/api/channels', () => client.channels.$get());
};

export const useGroups = () => {
  return useSWR<Channel[]>('/api/groups', () => client.groups.$get());
};

export const useUsers = () => {
  return useSWR<Channel[]>('/api/users', () => client.users.$get());
};

export const useMe = () => {
  return useSWR<Channel[]>('/api/me', () => client.me.$get());
};

export const useMessageStamps = () => {
  return useSWR<Channel[]>('/api/message-stamps', () =>
    client.messageStamps.$get()
  );
};
