import { useAuth } from '@/hooks/useAuth';
import { useChannels } from '@/hooks/useChannels';
import { useGroups } from '@/hooks/useGroups';
import { useMessage } from '@/hooks/useMessage';
import { useMessageStamps } from '@/hooks/useMessageStamps';
import { useUsers } from '@/hooks/useUsers';
import { Skeleton, Text } from '@mantine/core';
import type { Store, traQMarkdownIt } from '@traptitech/traq-markdown-it';
import { type FC, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import './TraqMessage.css';
import { useOpenGraph } from '@/hooks/useOpenGraph';
import clsx from 'clsx';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${year}/${month}/${day} ${hour}:${minute}`;
};

type TraqMessageProps = {
  messageId: string;
  annotation: ReactNode;
};

export const TraqMessage: FC<TraqMessageProps> = ({ messageId, annotation }) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { getUserFromId, users } = useUsers();
  const { me } = useAuth();
  const { message } = useMessage(messageId);
  const { groups } = useGroups();
  const { channels, getChannelName } = useChannels();
  const { stamps } = useMessageStamps();

  const store: Readonly<Store> | null = useMemo(() => {
    if (
      users === undefined ||
      groups === undefined ||
      me === undefined ||
      channels === undefined ||
      stamps === undefined
    )
      return null;

    return {
      // biome-ignore lint/style/noNonNullAssertion: 簡便のため
      getUser: (userId) => users.find((u) => u.id === userId)!,
      // biome-ignore lint/style/noNonNullAssertion: 簡便のため
      getChannel: (channelId: string) => channels.find((c) => c.id === channelId)!,
      // biome-ignore lint/style/noNonNullAssertion: 簡便のため
      getUserGroup: (groupId: string) => groups.find((g) => g.id === groupId)!,
      // biome-ignore lint/style/noNonNullAssertion: 簡便のため
      getMe: () => me!,
      // biome-ignore lint/style/noNonNullAssertion: 簡便のため
      getStampByName: (name: string) => stamps.find((s) => s.name === name)!,
      // biome-ignore lint/style/noNonNullAssertion: 簡便のため
      getUserByName: (name: string) => users.find((u) => u.name === name)!,
      generateUserHref: (id: string) => `https://q.trap.jp/user/${id}`,
      generateUserGroupHref: (id: string) => `https://q.trap.jp/group/${id}`,
      generateChannelHref: (id: string) => `https://q.trap.jp/channel/${id}`,
    };
  }, [users, groups, me, channels, stamps]);

  const [markdownIt, setMarkdownIt] = useState<traQMarkdownIt | null>(null);
  useEffect(() => {
    import('@traptitech/traq-markdown-it').then(({ traQMarkdownIt }) => {
      if (store === null) return;
      setMarkdownIt(new traQMarkdownIt(store, undefined, 'https://q.trap.jp'));
    });
  }, [store]);

  if (message === undefined) {
    return <TraqMessageSkeleton />;
  }
  const user = getUserFromId(message.userId);
  if (user === undefined) {
    return <TraqMessageSkeleton />;
  }
  if (markdownIt === null) {
    return <TraqMessageSkeleton />;
  }

  const channel = getChannelName(message.channelId);

  const markdown = markdownIt.render(message.content);

  const quotedMessages = markdown.embeddings
    .filter((e) => e.type === 'message')
    .map((e) => <QuotedMessage key={e.id} messageId={e.id} markdownIt={markdownIt} />);
  const attachedImages = markdown.embeddings
    .filter((e) => e.type === 'file')
    .map((e) => (
      <div key={e.id} className="max-w-64">
        <img src={`/api/files/${e.id}`} alt="" />
      </div>
    ));
  const urlRichPreviews = markdown.embeddings
    .filter((e) => e.type === 'url')
    .map((e) => <UrlRichPreview key={e.url} url={e.url} />);

  const date = new Date(message.createdAt);
  const formattedDate = formatDate(date);

  return (
    <div className="border p-4 rounded-md flex flex-col">
      <div className="flex flex-col gap-2" ref={messageContainerRef}>
        <div className="flex gap-1 items-center">
          <img className="rounded-full" src={`/api/files/${user.iconFileId}`} alt="" width={24} height={24} />
          <Text fw="bold">{user.displayName}</Text>
          <Text>(@{user.name})</Text>
          <Text c="dimmed" fz="sm">
            {formattedDate}
          </Text>
          <div className="ml-auto">{annotation}</div>
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Markdownレンダリング処理を外部でやるため */}
          <div className="traq-markdown" dangerouslySetInnerHTML={{ __html: markdown.renderedText }} />
          <div>{quotedMessages}</div>
          <div
            className={clsx(
              'grid',
              attachedImages.length === 1 && 'grid-cols-1',
              attachedImages.length === 2 && 'grid-cols-2',
              attachedImages.length > 2 && 'grid-cols-3',
            )}
          >
            {attachedImages}
          </div>
          <div>{urlRichPreviews}</div>
        </div>
      </div>
      <div className="flex gap-1 justify-between text-gray-500">
        <a href={`https://q.trap.jp/messages/${messageId}`} className="text-blue-600 font-medium hover:underline">
          traQで開く
        </a>
        <span>#{channel}</span>
      </div>
    </div>
  );
};

type QuotedMessageProps = { messageId: string; markdownIt: traQMarkdownIt };

const QuotedMessage: FC<QuotedMessageProps> = ({ messageId, markdownIt }) => {
  const { getUserFromId } = useUsers();
  const { getChannelName } = useChannels();
  const { message } = useMessage(messageId);
  if (message === undefined) {
    return <Skeleton h={12} />;
  }

  const user = getUserFromId(message.userId);
  if (user === undefined) {
    return <Skeleton h={12} />;
  }

  const channel = getChannelName(message.channelId);

  const markdown = markdownIt.render(message.content);
  return (
    <div className="border-l-4 pl-2 py-1">
      <div className="flex gap-1">
        <div>
          <img className="rounded-full" src={`/api/files/${user.iconFileId}`} alt="" width={20} height={20} />
        </div>
        <Text fz="sm" fw="bold">
          {user.displayName}
        </Text>
        <Text fz="sm">(@{user.name})</Text>
      </div>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Markdownレンダリング処理を外部でやるため */}
      <div className="traq-markdown traq-markdown-quoted" dangerouslySetInnerHTML={{ __html: markdown.renderedText }} />
      <Text c="dimmed" fz="xs" className="flex gap-1">
        <span>#{channel}</span>
        <span> - </span>
        <span>{formatDate(new Date(message.createdAt))}</span>
        <a className="font-semibold ml-2" href={`https://q.trap.jp/messages/${message.id}`}>
          メッセージへ
        </a>
      </Text>
    </div>
  );
};

const TraqMessageSkeleton: FC = () => {
  return (
    <div className="border p-4 rounded-md flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 items-center">
          <div>
            <Skeleton w={24} h={24} circle />
          </div>
          <Skeleton h={16} w="50%" radius="sm" />
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <Skeleton h={12} mb={4} radius="md" />
          <Skeleton h={12} mb={4} radius="md" />
          <Skeleton h={12} radius="md" width="70%" />
        </div>
      </div>
      <span className="text-blue-600 font-medium hover:underline">traQで開く</span>
    </div>
  );
};

type UrlRichPreviewProps = { url: string };

const UrlRichPreview: FC<UrlRichPreviewProps> = ({ url }) => {
  const ogp = useOpenGraph(url);
  if (ogp === undefined) {
    return <Skeleton h={64} w={384} className="mb-2" />;
  }

  return (
    <a
      href={url}
      className="border rounded-md flex flex-col gap-2 mb-4 hover:bg-gray-100 transition-all duration-200 max-w-96"
    >
      {ogp.type === 'article' && ogp.image && (
        <div className="flex justify-center">
          <img src={ogp.image} alt="" />
        </div>
      )}
      <div className="flex items-center">
        {ogp.type === 'summary' && ogp.image && (
          <div className="border-r max-w-24">{<img src={ogp.image} alt="" />}</div>
        )}
        <div className="px-4 py-2">
          <Text fz="sm" className="font-semibold">
            {ogp.title}
          </Text>
          <Text fz="sm" lineClamp={ogp.type === 'summary' ? 3 : 2}>
            {ogp.description}
          </Text>
          <Text fz="xs" c="dimmed">
            {ogp.origin}
          </Text>
        </div>
      </div>
    </a>
  );
};
