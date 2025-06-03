import type { DateRange, DateRangeType } from '@/composables/useDateRangePicker';
import type { APIKind, BotKind, GroupByKind, LimitKind, OrderByKind, OrderKind } from '@/pages/playground/model';
import type { PlaygroundFilter } from '@/pages/playground/usePlaygroundFilters';

export const saveToQuery = (apiKind: APIKind, state: Record<string, string | number | Date | null>) => {
  const query = new URLSearchParams();
  query.set('apiKind', apiKind);
  for (const [key, value] of Object.entries(state)) {
    if (value !== undefined) {
      if (typeof value === 'string') {
        query.set(key, value);
      } else if (typeof value === 'number') {
        query.set(key, value.toString());
      } else if (value instanceof Date) {
        query.set(key, value.toISOString());
      }
    }
  }
  if (`?${query.toString()}` !== location.search) {
    history.pushState(null, '', `${location.pathname}?${query.toString()}`);
  }
};

type FilterState<Kind extends APIKind> = PlaygroundFilter<Kind>['reducer']['state'];

export type QueryState<Kind extends APIKind> = {
  dateRangeType: DateRangeType | null;
  dateRange: DateRange | null;
  limit: LimitKind | null;
  page: number | null;
} & {
  [K in keyof FilterState<Kind>]: FilterState<Kind>[K] | null;
};

export const loadFromQuery = () => {
  const query = new URLSearchParams(location.search);
  const apiKind = query.get('apiKind') as APIKind | null;

  const dateRange: DateRange | null =
    // biome-ignore lint/style/noNonNullAssertion: has -> get
    query.has('after') && query.has('before') ? [new Date(query.get('after')!), new Date(query.get('before')!)] : null;

  // TODO: バリデーション
  const state = {
    channelId: query.get('channelId'),
    userId: query.get('userId'),
    messageUserId: query.get('messageUserId'),
    stampId: query.get('stampId'),
    botKind: query.get('botKind') as BotKind | null,
    dateRangeType: query.get('dateRangeType') as DateRangeType | null,
    groupByKind: query.get('groupByKind') as GroupByKind[APIKind] | null,
    orderByKind: query.get('orderByKind') as OrderByKind[APIKind] | null,
    orderKind: query.get('orderKind') as OrderKind | null,
    dateRange,
    limit: query.get('limit') as LimitKind | null,
    // biome-ignore lint/style/noNonNullAssertion: has -> get
    page: query.get('page') ? Number.parseInt(query.get('page')!) : null,
  } as QueryState<APIKind>;

  return {
    apiKind,
    state,
  };
};
