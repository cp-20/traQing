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

export const useMessage = (messageId: string) => {
  return useSWR<Message>(
    `/api/messages/${messageId}`,
    fetchWrapper(() =>
      client.messages[':id'].$get({
        param: { id: messageId },
      })
    )
  );
};

export const useChannels = () => {
  return useSWR<Channel[]>(
    '/api/channels',
    fetchWrapper(() => client.channels.$get())
  );
};

export const useGroups = () => {
  return useSWR<UserGroup[]>(
    '/api/groups',
    fetchWrapper(() => client.groups.$get())
  );
};

export const useUsers = () => {
  return useSWR<User[]>(
    '/api/users',
    fetchWrapper(() => client.users.$get())
  );
};

export const useMe = () => {
  return useSWR<MyUserDetail>(
    '/api/me',
    fetchWrapper(() => client.me.$get())
  );
};

export const useMessageStamps = () => {
  return useSWR<Stamp[]>(
    '/api/message-stamps',
    fetchWrapper(() => client['message-stamps'].$get())
  );
};
