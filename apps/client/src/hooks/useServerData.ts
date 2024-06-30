import { client } from '@/features/api';
import { ClientResponse } from 'hono/client';
import useSWR from 'swr';
import type {
  Channel,
  Message,
  UserGroup,
  MyUserDetail,
  Stamp,
  User,
} from 'traq-bot-ts';

type BlankRecordToNever<T> = T extends any
  ? T extends null
    ? null
    : keyof T extends never
    ? never
    : T
  : never;

const fetchWrapper = <T>(
  fetcher: () => Promise<
    | ClientResponse<T, 200, 'json'>
    | ClientResponse<unknown, 400, 'json'>
    | ClientResponse<unknown, 500, 'json'>
  >
): (() => Promise<BlankRecordToNever<T>>) => {
  return async () => {
    const res = await fetcher();
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const json = await res.json();
    return json;
  };
};

export const useMessagesRanking = () => {
  return useSWR<{ user: string; count: number }[]>(
    '/api/messages-ranking',
    fetchWrapper(() => client['messages-ranking'].$get())
  );
};

export const useGaveMessageStampsRanking = () => {
  return useSWR<{ user: string; count: number }[]>(
    '/api/gave-stamps-ranking',
    fetchWrapper(() => client['gave-stamps-ranking'].$get())
  );
};

export const useReceivedMessageStampsRanking = () => {
  return useSWR<{ messageUser: string; count: number }[]>(
    '/api/received-stamps-ranking',
    fetchWrapper(() => client['received-stamps-ranking'].$get())
  );
};

export const useMessageData = (messageId: string) => {
  return useSWR<Message>(
    `/api/messages/${messageId}`,
    fetchWrapper(() =>
      client.messages[':id'].$get({
        param: { id: messageId },
      })
    )
  );
};

export const useChannelsData = () => {
  return useSWR<Channel[]>(
    '/api/channels',
    fetchWrapper(() => client.channels.$get())
  );
};

export const useGroupsData = () => {
  return useSWR<UserGroup[]>(
    '/api/groups',
    fetchWrapper(() => client.groups.$get())
  );
};

export const useUsersData = () => {
  return useSWR<User[]>(
    '/api/users',
    fetchWrapper(() => client.users.$get())
  );
};

export const useMeData = () => {
  return useSWR<MyUserDetail>(
    '/api/me',
    fetchWrapper(() => client.me.$get())
  );
};

export const useMessageStampsData = () => {
  return useSWR<Stamp[]>(
    '/api/message-stamps',
    fetchWrapper(() => client['message-stamps'].$get())
  );
};

export type OpenGraph = {
  title?: string;
  description?: string;
  origin?: string;
  image?: string;
  type: 'summary' | 'article';
};
export const useOpenGraphData = (url: string) => {
  return useSWR<OpenGraph>(
    `/api/open-graph?url=${encodeURIComponent(url)}`,
    fetchWrapper(() => client.og.$get({ query: { url } }))
  );
};
