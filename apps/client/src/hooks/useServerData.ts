import { client } from '@/features/api';
import type { StampRelationsQuery } from '@traq-ing/database';
import type { ClientResponse } from 'hono/client';
import useSWR from 'swr';
import useImmutableSWR from 'swr/immutable';
import type { Channel, Message, MyUserDetail, Stamp, User, UserGroup } from 'traq-bot-ts';

const fetchWrapper = <T>(
  fetcher: () => Promise<
    ClientResponse<T, 200, 'json'> | ClientResponse<unknown, 400, 'json'> | ClientResponse<unknown, 500, 'json'>
  >,
): (() => Promise<T>) => {
  return async () => {
    const res = await fetcher();
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const json = await res.json();
    return json;
  };
};

export const useSubscriptionsData = () => {
  return useSWR<{ channelId: string; level: number }[]>(
    '/api/subscriptions',
    fetchWrapper<{ channelId: string; level: number }[]>(() => client.subscriptions.$get()),
  );
};

export const useChannelMessagesRanking = () => {
  return useSWR<{ channel: string; count: number }[]>(
    '/api/channel-messages-ranking',
    fetchWrapper(() => client['channel-messages-ranking'].$get()),
  );
};

export const useMessagesRanking = () => {
  return useSWR<{ user: string; count: number }[]>(
    '/api/messages-ranking',
    fetchWrapper(() => client['messages-ranking'].$get()),
  );
};

export const useStampRanking = () => {
  return useSWR<{ stamp: string; count: number }[]>(
    '/api/stamp-ranking',
    fetchWrapper(() => client['stamp-ranking'].$get()),
  );
};

export const useChannelStampsRanking = () => {
  return useSWR<{ channel: string; count: number }[]>(
    '/api/channel-stamps-ranking',
    fetchWrapper(() => client['channel-stamps-ranking'].$get()),
  );
};

export const useGaveMessageStampsRanking = () => {
  return useSWR<{ user: string; count: number }[]>(
    '/api/gave-stamps-ranking',
    fetchWrapper(() => client['gave-stamps-ranking'].$get()),
  );
};

export const useReceivedMessageStampsRanking = () => {
  return useSWR<{ messageUser: string; count: number }[]>(
    '/api/received-stamps-ranking',
    fetchWrapper(() => client['received-stamps-ranking'].$get()),
  );
};

export const useGroupRanking = (groupBy: 'user' | 'group') => {
  return useSWR<{ group: string; count: number }[]>(
    `/api/group-ranking?groupBy=${groupBy}`,
    fetchWrapper(() => client['group-ranking'].$get({ query: { groupBy } })),
  );
};

export const useTagRanking = (groupBy: 'user' | 'tag') => {
  return useSWR<{ group: string; count: number }[]>(
    `/api/tag-ranking?groupBy=${groupBy}`,
    fetchWrapper(() => client['tag-ranking'].$get({ query: { groupBy } })),
  );
};

export const useSubscriptionRanking = (groupBy: 'user' | 'channel') => {
  return useSWR<{ group: string; count: number }[]>(
    `/api/subscription-ranking?groupBy=${groupBy}`,
    fetchWrapper(() => client['subscription-ranking'].$get({ query: { groupBy } })),
  );
};

export const useMessageData = (messageId: string) => {
  return useSWR<Message>(
    `/api/messages/${messageId}`,
    fetchWrapper(() =>
      client.messages[':id'].$get({
        param: { id: messageId },
      }),
    ),
  );
};

export const useMessagesTimelineData = () => {
  return useSWR<{ month: string; count: number }[]>(
    '/api/messages-timeline',
    fetchWrapper(() => client['messages-timeline'].$get()),
  );
};

export const useChannelSubscribersData = (channelId: string) => {
  return useSWR<string[]>(
    `/api/channels/${channelId}/subscribers`,
    fetchWrapper(() =>
      client.channels[':id'].subscribers.$get({
        param: { id: channelId },
      }),
    ),
  );
};

export const useChannelsData = () => {
  return useImmutableSWR<Channel[]>(
    '/api/channels',
    fetchWrapper(() => client.channels.$get()),
  );
};

export const useGroupsData = () => {
  return useImmutableSWR<UserGroup[]>(
    '/api/groups',
    fetchWrapper(() => client.groups.$get()),
  );
};

export const useUsersData = () => {
  return useImmutableSWR<User[]>(
    '/api/users',
    fetchWrapper(() => client.users.$get()),
  );
};

export const useMeData = () => {
  return useSWR<MyUserDetail>(
    '/api/me',
    fetchWrapper(() => client.me.$get()),
  );
};

export const useMessageStampsData = () => {
  return useImmutableSWR<Stamp[]>(
    '/api/message-stamps',
    fetchWrapper(() => client['message-stamps'].$get()),
  );
};

export const useStampRelationsData = (query: StampRelationsQuery) => {
  return useImmutableSWR<{ user: string; messageUser: string; count: number }[]>(
    '/api/stamp-relations',
    fetchWrapper(() =>
      client['stamp-relations'].$get({
        query: { ...query, threshold: query.threshold?.toString() },
      }),
    ),
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
  return useImmutableSWR<OpenGraph>(
    `/api/og?url=${encodeURIComponent(url)}`,
    fetchWrapper(() => client.og.$get({ query: { url } })),
  );
};
