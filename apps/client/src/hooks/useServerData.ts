import type { StampRelationsQuery } from '@traq-ing/database';
import { parseResponse } from 'hono/client';
import useSWR from 'swr';
import useImmutableSWR from 'swr/immutable';
import type { Channel, Message, MyUserDetail, Stamp, User, UserGroup } from 'traq-bot-ts';
import { client } from '@/features/api';

export const useSubscriptionsData = () => {
  return useSWR<{ channelId: string; level: number }[]>('/api/subscriptions', () =>
    parseResponse(client.subscriptions.$get()),
  );
};

export const useChannelMessagesRanking = () => {
  return useSWR<{ channel: string; count: number }[]>('/api/channel-messages-ranking', () =>
    parseResponse(client['channel-messages-ranking'].$get()),
  );
};

export const useMessagesRanking = () => {
  return useSWR<{ user: string; count: number }[]>('/api/messages-ranking', () =>
    parseResponse(client['messages-ranking'].$get()),
  );
};

export const useStampRanking = () => {
  return useSWR<{ stamp: string; count: number }[]>('/api/stamp-ranking', () =>
    parseResponse(client['stamp-ranking'].$get()),
  );
};

export const useChannelStampsRanking = () => {
  return useSWR<{ channel: string; count: number }[]>('/api/channel-stamps-ranking', () =>
    parseResponse(client['channel-stamps-ranking'].$get()),
  );
};

export const useGaveMessageStampsRanking = () => {
  return useSWR<{ user: string; count: number }[]>('/api/gave-stamps-ranking', () =>
    parseResponse(client['gave-stamps-ranking'].$get()),
  );
};

export const useReceivedMessageStampsRanking = () => {
  return useSWR<{ messageUser: string; count: number }[]>('/api/received-stamps-ranking', () =>
    parseResponse(client['received-stamps-ranking'].$get()),
  );
};

export const useGroupRanking = (groupBy: 'user' | 'group') => {
  return useSWR<{ group: string; count: number }[]>(`/api/group-ranking?groupBy=${groupBy}`, () =>
    parseResponse(client['group-ranking'].$get({ query: { groupBy } })),
  );
};

export const useTagRanking = (groupBy: 'user' | 'tag') => {
  return useSWR<{ group: string; count: number }[]>(`/api/tag-ranking?groupBy=${groupBy}`, () =>
    parseResponse(client['tag-ranking'].$get({ query: { groupBy } })),
  );
};

export const useSubscriptionRanking = (groupBy: 'user' | 'channel') => {
  return useSWR<{ group: string; count: number }[]>(`/api/subscription-ranking?groupBy=${groupBy}`, () =>
    parseResponse(client['subscription-ranking'].$get({ query: { groupBy } })),
  );
};

export const useMessageData = (messageId: string) => {
  return useSWR<Message>(`/api/messages/${messageId}`, () =>
    parseResponse(
      client.messages[':id'].$get({
        param: { id: messageId },
      }),
    ),
  );
};

export const useMessagesTimelineData = () => {
  return useSWR<{ month: string; count: number }[]>('/api/messages-timeline', () =>
    parseResponse(client['messages-timeline'].$get()),
  );
};

export const useChannelSubscribersData = (channelId: string) => {
  return useSWR<string[]>(`/api/channels/${channelId}/subscribers`, () =>
    parseResponse(
      client.channels[':id'].subscribers.$get({
        param: { id: channelId },
      }),
    ),
  );
};

export const useChannelsData = () => {
  return useImmutableSWR<Channel[]>('/api/channels', () => parseResponse(client.channels.$get()));
};

export const useGroupsData = () => {
  return useImmutableSWR<UserGroup[]>('/api/groups', () => parseResponse(client.groups.$get()));
};

export const useUsersData = () => {
  return useImmutableSWR<User[]>('/api/users', () => parseResponse(client.users.$get()));
};

export const useMeData = () => {
  return useSWR<MyUserDetail>('/api/me', () => parseResponse(client.me.$get()));
};

export const useMessageStampsData = () => {
  return useImmutableSWR<Stamp[]>('/api/message-stamps', () => parseResponse(client['message-stamps'].$get()));
};

export const useStampRelationsData = (query: StampRelationsQuery) => {
  return useImmutableSWR<{ user: string; messageUser: string; count: number }[]>('/api/stamp-relations', () =>
    parseResponse(
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
  return useImmutableSWR<OpenGraph>(`/api/og?url=${encodeURIComponent(url)}`, () =>
    parseResponse(client.og.$get({ query: { url } })),
  );
};
