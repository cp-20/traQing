import type { MessagesQuery, StampsQuery } from '@traq-ing/database';

export type LimitKind = '10' | '100' | '200' | '500' | '1000';
export const limitKindOptions: { value: LimitKind; label: string }[] = [
  { value: '10', label: '10件' },
  { value: '100', label: '100件' },
  { value: '200', label: '200件' },
  { value: '500', label: '500件' },
  { value: '1000', label: '1000件' },
];

type OptionsByAPIKind<Kind extends Record<APIKind, string>> = {
  [K in APIKind]: { value: Kind[K]; label: string }[];
};

export type QueryByAPIKind<Kind extends APIKind> = {
  messages: MessagesQuery;
  stamps: StampsQuery;
}[Kind];

export type APIKind = 'messages' | 'stamps';
export const APIKindOptions: { value: APIKind; label: string }[] = [
  { value: 'messages', label: 'メッセージAPI' },
  { value: 'stamps', label: 'スタンプAPI' },
];

export type BotKind = 'all' | 'bot' | 'non-bot';
export const botKindOptions: { value: BotKind; label: string }[] = [
  { value: 'all', label: '全て' },
  { value: 'bot', label: 'Botのみ' },
  { value: 'non-bot', label: 'Bot以外のみ' },
];

export type OrderKind = 'asc' | 'desc';
export const orderKindOptions: { value: OrderKind; label: string }[] = [
  { value: 'asc', label: '昇順' },
  { value: 'desc', label: '降順' },
];

export type GroupByKind = {
  messages: 'none' | Exclude<MessagesQuery['groupBy'], undefined>;
  stamps: 'none' | Exclude<StampsQuery['groupBy'], undefined>;
};
export const groupByKindOptions: OptionsByAPIKind<GroupByKind> = {
  messages: [
    { value: 'none', label: 'グループ化なし' },
    { value: 'month', label: '月 (YYYY-MM)' },
    { value: 'day', label: '日 (YYYY-MM-DD)' },
    { value: 'hour', label: '時間 (HH)' },
    { value: 'user', label: 'ユーザー' },
    { value: 'channel', label: 'チャンネル' },
  ],
  stamps: [
    { value: 'none', label: 'グループ化なし' },
    { value: 'month', label: '月 (YYYY-MM)' },
    { value: 'day', label: '日 (YYYY-MM-DD)' },
    { value: 'hour', label: '時間 (HH)' },
    { value: 'user', label: 'ユーザー' },
    { value: 'channel', label: 'チャンネル' },
    { value: 'messageUser', label: '投稿ユーザー' },
    { value: 'stamp', label: 'スタンプ' },
    { value: 'message', label: 'メッセージ' },
  ],
};

export type OrderByKind = {
  messages: 'none' | Exclude<MessagesQuery['orderBy'], undefined>;
  stamps: 'none' | Exclude<StampsQuery['orderBy'], undefined>;
};
export const orderByKindOptions: OptionsByAPIKind<OrderByKind> = {
  messages: [
    { value: 'none', label: 'ソートなし' },
    { value: 'date', label: '日付' },
    { value: 'count', label: '回数' },
  ],
  stamps: [
    { value: 'none', label: 'ソートなし' },
    { value: 'date', label: '日付' },
    { value: 'count', label: '回数' },
  ],
};
