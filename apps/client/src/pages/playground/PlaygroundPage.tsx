import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { EffectIcon } from '@/components/icons/EffectIcon';
import { dateRangeToQuery, useDateRangePicker } from '@/composables/useDateRangePicker';
import { fetchMessages } from '@/hooks/useMessages';
import { fetchStamps } from '@/hooks/useStamps';
import { type APIKind, APIKindOptions, type LimitKind, limitKindOptions } from '@/pages/playground/model';
import { PlaygroundResult } from '@/pages/playground/PlaygroundResult';
import { PlaygroundFilters, usePlaygroundFilters } from '@/pages/playground/usePlaygroundFIlters';
import { Button, Select } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import type { MessagesQuery } from '@traq-ing/database';
import { useEffect, useMemo, useState, type FC } from 'react';

export const PlaygroundPage: FC = () => {
  const [apiKind, setApiKind] = useState<APIKind>('messages');
  const [limit, setLimit] = useState<LimitKind>('100');
  const [page, setPage] = useState(0);
  const filter = usePlaygroundFilters(apiKind);
  const datePicker = useDateRangePicker('last-30-days');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown>[]>([]);

  const hasPrev = page > 0;
  const hasNext = result.length > Number.parseInt(limit);

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
        const data = await fetchMessages(query as MessagesQuery);
        setResult(data);
        setLoading(false);
      }

      if (apiKind === 'stamps') {
        setLoading(true);
        const data = await fetchStamps(query);
        setResult(data);
        setLoading(false);
      }
    };
    request();
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
          <PlaygroundResult result={result.slice(0, Number.parseInt(limit))} />
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
    </Container>
  );
};
