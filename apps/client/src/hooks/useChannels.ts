import { useCallback, useMemo } from 'react';
import { useChannelsData } from '@/hooks/useServerData';

export const useChannels = () => {
  const { data: channels } = useChannelsData();

  const channelsMapById = useMemo(() => new Map(channels?.map((c) => [c.id, c])), [channels]);
  const channelsMapByNameAndParent = useMemo(
    () => new Map(channels?.map((c) => [`${c.name}:${c.parentId}`, c])),
    [channels],
  );

  const getChannelId = useCallback(
    (fullname: string): string | undefined => {
      if (!channels) return undefined;

      let parentId: string | null = null;
      for (const name of fullname.split('/')) {
        parentId = channelsMapByNameAndParent.get(`${name}:${parentId}`)?.id ?? null;
        if (!parentId) return undefined;
      }

      return parentId ?? undefined;
    },
    [channels, channelsMapByNameAndParent],
  );

  const getChannelName = useCallback(
    (id: string): string | undefined => {
      if (!channels) return undefined;

      const channel = channelsMapById.get(id);
      if (!channel) return undefined;

      const parent = channel.parentId && channelsMapById.get(channel.parentId);
      if (parent) {
        return `${getChannelName(parent.id)}/${channel.name}`;
      }

      return channel.name;
    },
    [channels, channelsMapById],
  );

  const getSummedChannelName = useCallback(
    (id: string) => {
      const name = getChannelName(id);
      if (!name) return undefined;

      return name.replaceAll(/([^/])[^/]*\//g, '$1/');
    },
    [getChannelName],
  );

  return { channels, getChannelId, getChannelName, getSummedChannelName };
};
