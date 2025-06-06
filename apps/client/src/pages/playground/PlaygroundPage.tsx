import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { EffectIcon } from '@/components/icons/EffectIcon';
import { dateRangeToQuery, useDateRangePicker } from '@/composables/useDateRangePicker';
import { fetchMessages, normalizeMessagesQuery } from '@/hooks/useMessages';
import { fetchStamps, normalizeStampsQuery } from '@/hooks/useStamps';
import { type APIKind, APIKindOptions, type LimitKind, limitKindOptions } from '@/pages/playground/model';
import { PlaygroundResult } from '@/pages/playground/PlaygroundResult';
import { loadFromQuery, type QueryState, saveToQuery } from '@/pages/playground/store';
import {
  type PlaygroundFilter,
  PlaygroundFilters,
  usePlaygroundFilters,
} from '@/pages/playground/usePlaygroundFilters';
import { Button, Select } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export const PlaygroundPage: FC = () => {
  const [apiKind, setApiKind] = useState<APIKind>('messages');
  const [limit, setLimit] = useState<LimitKind>('100');
  const [page, setPage] = useState(0);
  const filter = usePlaygroundFilters(apiKind);
  const datePicker = useDateRangePicker('last-30-days');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState(false);
  const initialized = useRef(false);

  const hasPrev = page > 0;
  const hasNext = result.length > Number.parseInt(limit);

  useEffect(() => {
    if (initialized.current) {
      saveToQuery(apiKind, {
        ...filter.state,
        limit,
        page,
        dateRangeType: datePicker.type,
        ...(datePicker.value && dateRangeToQuery(datePicker.value)),
      });
      return;
    }

    const { apiKind: newAPIKind, state } = loadFromQuery();
    if (newAPIKind === null) {
      initialized.current = true;
      return;
    }
    if (apiKind !== newAPIKind) {
      setApiKind(newAPIKind);
      return;
    }

    if (state.dateRangeType) datePicker.actions.setType(state.dateRangeType);
    if (state.dateRangeType === 'custom' && state.dateRange) datePicker.actions.setValue(state.dateRange);
    if (state.limit) setLimit(state.limit);
    if (state.page) setPage(state.page);

    if (apiKind === 'messages') {
      const actions = filter.actions as PlaygroundFilter<'messages'>['reducer']['actions'];
      const { userId, channelId, botKind, groupByKind, orderByKind, orderKind } = state as QueryState<'messages'>;
      actions.userSelectReducer.actions.setUserId(userId);
      actions.channelSelectReducer.actions.setChannelId(channelId);
      if (botKind) actions.setBotKind(botKind);
      if (groupByKind) actions.setGroupByKind(groupByKind);
      if (orderByKind) actions.setOrderByKind(orderByKind);
      if (orderKind) actions.setOrderKind(orderKind);
    } else if (apiKind === 'stamps') {
      const actions = filter.actions as PlaygroundFilter<'stamps'>['reducer']['actions'];
      const { userId, channelId, messageUserId, stampId, botKind, groupByKind, orderByKind, orderKind } =
        state as QueryState<'stamps'>;
      actions.userSelectReducer.actions.setUserId(userId);
      actions.channelSelectReducer.actions.setChannelId(channelId);
      actions.messageUserSelectReducer.actions.setUserId(messageUserId);
      actions.stampPickerReducer.actions.setStampId(stampId);
      if (botKind) actions.setBotKind(botKind);
      if (groupByKind) actions.setGroupByKind(groupByKind);
      if (orderByKind) actions.setOrderByKind(orderByKind);
      if (orderKind) actions.setOrderKind(orderKind);
    }
    initialized.current = true;
  }, [apiKind, filter.state, limit, page, datePicker.value, datePicker.type, datePicker.actions, filter.actions]);

  const query = useMemo(() => {
    return {
      ...filter.value,
      limit: Number.parseInt(limit) + 1,
      offset: page * Number.parseInt(limit),
      ...dateRangeToQuery(datePicker.value),
    };
  }, [filter.value, limit, page, datePicker.value]);

  useEffect(() => {
    const request = async () => {
      if (apiKind === 'messages') {
        setLoading(true);
        try {
          const data = await fetchMessages(query as MessagesQuery);
          setResult(data);
          setError(false);
        } catch (err) {
          setError(true);
        } finally {
          setLoading(false);
        }
      }

      if (apiKind === 'stamps') {
        setLoading(true);
        try {
          const data = await fetchStamps(query as StampsQuery);
          setResult(data);
          setError(false);
        } catch (err) {
          setError(true);
        } finally {
          setLoading(false);
        }
      }
    };
    request();
  }, [apiKind, query]);

  const normalizedQuery = useMemo(() => {
    if (apiKind === 'messages') return normalizeMessagesQuery(query as MessagesQuery);
    if (apiKind === 'stamps') return normalizeStampsQuery(query as StampsQuery);
  }, [apiKind, query]);

  return (
    <Container>
      <ContainerTitle>
        <EffectIcon className="size-8" />
        <span className="ml-2 text-2xl font-bold">APIプレイグラウンド</span>
      </ContainerTitle>

      <Card className="max-w-5xl w-full mx-auto">
        <div className="flex flex-col gap-4">
          <div>
            <Select
              label="使用するAPI"
              data={APIKindOptions}
              value={apiKind}
              onChange={(v) => setApiKind(v as APIKind)}
            />
          </div>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-2">
            <PlaygroundFilters apiKind={apiKind} reducer={filter} />
            <Select label="取得件数" data={limitKindOptions} value={limit} onChange={(v) => setLimit(v as LimitKind)} />
            <div>
              <div className="text-sm/[1.75] font-medium">取得期間</div>
              {datePicker.render({ buttonProps: { fullWidth: true } })}
            </div>
          </div>
        </div>
      </Card>

      <Card className="max-w-5xl w-full mx-auto">
        <div className="space-y-4">
          <div className="font-semibold">実行結果</div>
          <div className="flex gap-2">
            <Button variant="light" fullWidth disabled={!hasPrev || loading} onClick={() => setPage((p) => p - 1)}>
              <IconChevronLeft />
            </Button>
            <Button variant="light" fullWidth disabled={!hasNext || loading} onClick={() => setPage((p) => p + 1)}>
              <IconChevronRight />
            </Button>
          </div>
          {error ? (
            <div className="text-red-500">エラーが発生しました</div>
          ) : (
            <ErrorBoundary fallback={<div className="text-red-500">エラーが発生しました</div>}>
              <PlaygroundResult result={result.slice(0, Number.parseInt(limit))} />
            </ErrorBoundary>
          )}
          <div className="flex gap-2">
            <Button variant="light" fullWidth disabled={!hasPrev || loading} onClick={() => setPage((p) => p - 1)}>
              <IconChevronLeft />
            </Button>
            <Button variant="light" fullWidth disabled={!hasNext || loading} onClick={() => setPage((p) => p + 1)}>
              <IconChevronRight />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="max-w-5xl w-full mx-auto">
        <div className="font-semibold mb-4">コード</div>
        <pre className="border border-gray-200 rounded-md p-4">
          <code className="text-wrap break-all">{`const query = ${JSON.stringify(normalizedQuery, null, 2)};
const params = new URLSearchParams(query);
const result = await fetch(\`${location.origin}/api/${apiKind}?\$\{params.toString()\}\`).then((r) => r.json());
console.log(result);`}</code>
        </pre>
      </Card>
    </Container>
  );
};
