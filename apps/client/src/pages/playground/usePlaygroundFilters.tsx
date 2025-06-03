import { ChannelSelect, useChannelSelect } from '@/composables/useChannelSelect';
import { StampPicker, useStampPicker } from '@/composables/useStampPicker';
import { UserSelect, useUserSelect } from '@/composables/useUserSelect';
import {
  botKindOptions,
  groupByKindOptions,
  orderByKindOptions,
  orderKindOptions,
  type APIKind,
  type BotKind,
  type GroupByKind,
  type OrderByKind,
  type OrderKind,
} from '@/pages/playground/model';
import { Select } from '@mantine/core';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import { type FC, useMemo, useState } from 'react';

const useMessagesFilter = () => {
  const [botKind, setBotKind] = useState<BotKind>('all');
  const [groupByKind, setGroupByKind] = useState<GroupByKind['messages']>('none');
  const [orderByKind, setOrderByKind] = useState<OrderByKind['messages']>('none');
  const [orderKind, setOrderKind] = useState<OrderKind>('asc');

  const userSelect = useUserSelect();
  const channelSelect = useChannelSelect();

  const value = useMemo(
    () =>
      ({
        userId: userSelect.state.userId ?? undefined,
        channelId: channelSelect.state.channelId ?? undefined,
        isBot: {
          all: undefined,
          bot: true,
          'non-bot': false,
        }[botKind],
        groupBy: groupByKind === 'none' ? undefined : groupByKind,
        orderBy: orderByKind === 'none' ? undefined : orderByKind,
        order: orderKind,
      }) satisfies MessagesQuery,
    [userSelect.state.userId, channelSelect.state.channelId, botKind, groupByKind, orderByKind, orderKind],
  );

  const state = {
    userId: userSelect.userId,
    channelId: channelSelect.channelId,
    botKind,
    groupByKind,
    orderByKind,
    orderKind,
  };

  const actions = {
    setBotKind,
    setGroupByKind,
    setOrderByKind,
    setOrderKind,
    userSelectReducer: userSelect,
    channelSelectReducer: channelSelect,
  };

  return { value, state, actions };
};

const MessagesFilter: FC<PlaygroundFilter<'messages'>> = ({ reducer }) => {
  const { botKind, groupByKind, orderByKind, orderKind } = reducer.state;
  const { setBotKind, setGroupByKind, setOrderByKind, setOrderKind } = reducer.actions;
  return (
    <>
      <UserSelect reducer={reducer.actions.userSelectReducer} textInputProps={{ label: 'ユーザー名' }} />
      <ChannelSelect reducer={reducer.actions.channelSelectReducer} textInputProps={{ label: 'チャンネル名' }} />
      <Select label="Botフィルタ" data={botKindOptions} value={botKind} onChange={(v) => setBotKind(v as BotKind)} />
      <Select
        label="グループ化"
        data={groupByKindOptions.messages}
        value={groupByKind}
        onChange={(v) => setGroupByKind(v as GroupByKind['messages'])}
      />
      <Select
        label="ソート項目"
        data={orderByKindOptions.messages}
        value={orderByKind}
        onChange={(v) => setOrderByKind(v as OrderByKind['messages'])}
      />
      <Select
        label="昇順/降順"
        data={orderKindOptions}
        value={orderKind}
        onChange={(v) => setOrderKind(v as OrderKind)}
      />
    </>
  );
};

const useStampsFilter = () => {
  const [botKind, setBotKind] = useState<BotKind>('all');
  const [groupByKind, setGroupByKind] = useState<GroupByKind['stamps']>('none');
  const [orderByKind, setOrderByKind] = useState<OrderByKind['stamps']>('none');
  const [orderKind, setOrderKind] = useState<OrderKind>('asc');

  const userSelect = useUserSelect();
  const channelSelect = useChannelSelect();
  const messageUserSelect = useUserSelect();
  const stampPicker = useStampPicker();

  const value = useMemo(
    () =>
      ({
        userId: userSelect.state.userId ?? undefined,
        channelId: channelSelect.state.channelId ?? undefined,
        stampId: stampPicker.stampId ?? undefined,
        messageUserId: messageUserSelect.state.userId ?? undefined,
        isBot: {
          all: undefined,
          bot: true,
          'non-bot': false,
        }[botKind],
        groupBy: groupByKind === 'none' ? undefined : groupByKind,
        orderBy: orderByKind === 'none' ? undefined : orderByKind,
        order: orderKind,
      }) satisfies StampsQuery,
    [
      userSelect.state.userId,
      channelSelect.state.channelId,
      stampPicker.stampId,
      messageUserSelect.state.userId,
      botKind,
      groupByKind,
      orderByKind,
      orderKind,
    ],
  );

  const state = {
    userId: userSelect.userId,
    channelId: channelSelect.channelId,
    stampId: stampPicker.stampId,
    messageUserId: messageUserSelect.userId,
    botKind,
    groupByKind,
    orderByKind,
    orderKind,
  };

  const actions = {
    setBotKind,
    setGroupByKind,
    setOrderByKind,
    setOrderKind,
    userSelectReducer: userSelect,
    channelSelectReducer: channelSelect,
    messageUserSelectReducer: messageUserSelect,
    stampPickerReducer: stampPicker,
  };

  return { value, state, actions };
};

const StampsFilter: FC<PlaygroundFilter<'stamps'>> = ({ reducer }) => {
  const { botKind, groupByKind, orderByKind, orderKind } = reducer.state;
  const { setBotKind, setGroupByKind, setOrderByKind, setOrderKind } = reducer.actions;
  return (
    <>
      <UserSelect reducer={reducer.actions.userSelectReducer} textInputProps={{ label: 'ユーザー名' }} />
      <ChannelSelect reducer={reducer.actions.channelSelectReducer} textInputProps={{ label: 'チャンネル名' }} />
      <StampPicker reducer={reducer.actions.stampPickerReducer} textInputProps={{ label: 'スタンプ名' }} />
      <UserSelect reducer={reducer.actions.messageUserSelectReducer} textInputProps={{ label: '投稿ユーザー名' }} />
      <Select label="Botフィルタ" data={botKindOptions} value={botKind} onChange={(v) => setBotKind(v as BotKind)} />
      <Select
        label="グループ化"
        data={groupByKindOptions.stamps}
        value={groupByKind}
        onChange={(v) => setGroupByKind(v as GroupByKind['stamps'])}
      />
      <Select
        label="ソート項目"
        data={orderByKindOptions.stamps}
        value={orderByKind}
        onChange={(v) => setOrderByKind(v as OrderByKind['stamps'])}
      />
      <Select
        label="昇順/降順"
        data={orderKindOptions}
        value={orderKind}
        onChange={(v) => setOrderKind(v as OrderKind)}
      />
    </>
  );
};

export type PlaygroundFilter<Kind extends APIKind> = {
  reducer: ReturnType<
    {
      messages: typeof useMessagesFilter;
      stamps: typeof useStampsFilter;
    }[Kind]
  >;
};

export const usePlaygroundFilters = (apiKind: APIKind) => {
  const messagesFilter = useMessagesFilter();
  const stampsFilter = useStampsFilter();
  const filters = {
    messages: messagesFilter,
    stamps: stampsFilter,
  };
  return filters[apiKind];
};

type PlaygroundFiltersProps<Kind extends APIKind> = {
  apiKind: Kind;
  reducer: PlaygroundFilter<Kind>['reducer'];
};

export const PlaygroundFilters = <Kind extends APIKind>({ apiKind, reducer }: PlaygroundFiltersProps<Kind>) => {
  if (apiKind === 'messages') return <MessagesFilter reducer={reducer as PlaygroundFilter<'messages'>['reducer']} />;
  // TODO: 型アサーションを改善する
  if (apiKind === 'stamps') return <StampsFilter reducer={reducer as PlaygroundFilter<'stamps'>['reducer']} />;
  const _: never = apiKind;
  return _;
};
