import { Alert, Badge, Group, Select, SimpleGrid, Stack, Table, Text, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSelector, IconServerBolt } from '@tabler/icons-react';
import { type CSSProperties, type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';

type QueryMetric = {
  id: string;
  method: string;
  path: string;
  query: string;
  count: number;
  totalDurationMs: number;
  averageDurationMs: number;
  p99DurationMs: number;
  histogram: Array<{ label: string; count: number }>;
};

type Limit = '10' | '20' | '50' | '100';
type Period = '15m' | '1h' | '6h' | '24h' | '7d' | 'all';
type SortBy = 'count' | 'totalDurationMs' | 'averageDurationMs' | 'p99DurationMs';
type SortOrder = 'asc' | 'desc';

const formatMs = (value: number) => `${Math.round(value).toLocaleString()}ms`;

const periodOptions: { label: string; value: Period }[] = [
  { label: '直近15分', value: '15m' },
  { label: '直近1時間', value: '1h' },
  { label: '直近6時間', value: '6h' },
  { label: '直近24時間', value: '24h' },
  { label: '直近7日', value: '7d' },
  { label: 'すべて', value: 'all' },
];

const limitOptions: { label: string; value: Limit }[] = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

const periodMs: Record<Exclude<Period, 'all'>, number> = {
  '15m': 15 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
};

const getPeriodQuery = (period: Period) => {
  if (period === 'all') return {};
  const now = new Date();
  return {
    after: new Date(now.getTime() - periodMs[period]).toISOString(),
    before: now.toISOString(),
  };
};

const parseQuery = (query: string) => {
  const params = new URLSearchParams(query);
  const result = new Map<string, string[]>();

  for (const [key, value] of params.entries()) {
    result.set(key, [...(result.get(key) ?? []), value]);
  }

  return [...result.entries()].sort(([a], [b]) => a.localeCompare(b));
};

const summarizeValues = (values: string[]) => {
  const uniqueValues = [...new Set(values)].sort();
  if (uniqueValues.length === 0) return '-';
  if (uniqueValues.length <= 3) return uniqueValues.map((value) => value || '(empty)').join(', ');
  return `${uniqueValues[0] || '(empty)'} ほか ${uniqueValues.length - 1} 種類`;
};

const QueryParameters: FC<{ query: string }> = ({ query }) => {
  const parameters = parseQuery(query);
  if (parameters.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        なし
      </Text>
    );
  }

  return (
    <Stack gap={4}>
      {parameters.map(([key, values]) => (
        <Group key={key} gap={6} wrap="nowrap" align="flex-start">
          <Badge variant="light" color="gray" className="traqing-query-param-badge">
            {key}
          </Badge>
          <Text size="sm" className="break-all">
            {summarizeValues(values)}
          </Text>
        </Group>
      ))}
    </Stack>
  );
};

const QueryLabel: FC<{ metric: QueryMetric }> = ({ metric }) => (
  <Stack gap={2}>
    <Badge variant="outline" className="traqing-query-param-badge">
      {metric.method}
    </Badge>
    <Text size="sm" fw={600}>
      {metric.path}
    </Text>
  </Stack>
);

const HistogramBars: FC<{ histogram: QueryMetric['histogram'] }> = ({ histogram }) => {
  const total = histogram.reduce((acc, bucket) => acc + bucket.count, 0);
  const maxCount = Math.max(...histogram.map((bucket) => bucket.count));

  if (total === 0) {
    return (
      <Text size="sm" c="dimmed">
        新しい計測から表示されます
      </Text>
    );
  }

  return (
    <Stack gap={2}>
      {histogram.map((bucket) => {
        const colorIndex = histogram.length <= 1 ? 0 : histogram.indexOf(bucket) / (histogram.length - 1);
        const ratio = bucket.count / maxCount;
        const width = bucket.count === 0 ? 0 : Math.max(ratio * 100, 1);
        const fillStyle = {
          '--traqing-query-histogram-color-index': colorIndex,
          width: `${width}%`,
        } as CSSProperties;
        return (
          <div className="traqing-query-histogram-row" key={bucket.label}>
            <Text size="xs" className="traqing-query-histogram-label">
              {bucket.label}
            </Text>
            <div className="traqing-query-histogram-track">
              <div className="traqing-query-histogram-fill" style={fillStyle} />
            </div>
            <Text size="xs" ta="right" className="traqing-query-histogram-count">
              {bucket.count.toLocaleString()}
            </Text>
          </div>
        );
      })}
    </Stack>
  );
};

type SortHeaderProps = {
  active: boolean;
  children: string;
  onClick: () => void;
  order: SortOrder;
};

const SortHeader: FC<SortHeaderProps> = ({ active, children, onClick, order }) => {
  const Icon = active ? (order === 'asc' ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <UnstyledButton className="traqing-query-sort-header" onClick={onClick}>
      <Group gap={4} justify="flex-end" wrap="nowrap">
        <span>{children}</span>
        <Icon size={14} />
      </Group>
    </UnstyledButton>
  );
};

export const QueryMetricsPage: FC = () => {
  const [limit, setLimit] = useState<Limit>('20');
  const [period, setPeriod] = useState<Period>('24h');
  const [sortBy, setSortBy] = useState<SortBy>('totalDurationMs');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [metrics, setMetrics] = useState<QueryMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(() => {
    return metrics.reduce(
      (acc, metric) => ({
        count: acc.count + metric.count,
        totalDurationMs: acc.totalDurationMs + metric.totalDurationMs,
        p99DurationMs: Math.max(acc.p99DurationMs, metric.p99DurationMs),
      }),
      { count: 0, totalDurationMs: 0, p99DurationMs: 0 },
    );
  }, [metrics]);

  const summaryAverageDurationMs = summary.count === 0 ? 0 : summary.totalDurationMs / summary.count;

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ limit, sortBy, order: sortOrder });
        const periodQuery = getPeriodQuery(period);
        if (periodQuery.after) params.set('after', periodQuery.after);
        if (periodQuery.before) params.set('before', periodQuery.before);
        const res = await fetch(`/api/admin/query-metrics?${params.toString()}`, { signal });
        if (!res.ok) throw new Error('集計の取得に失敗しました');
        setMetrics((await res.json()) as QueryMetric[]);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : '集計の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    },
    [limit, period, sortBy, sortOrder],
  );

  const updateSort = (nextSortBy: SortBy) => {
    if (sortBy === nextSortBy) {
      setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortBy(nextSortBy);
    setSortOrder('desc');
  };

  useEffect(() => {
    const abortController = new AbortController();
    load(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [load]);

  return (
    <Container>
      <ContainerTitle>
        <IconServerBolt className="size-8" />
        <span className="ml-2 text-2xl font-bold">クエリ計測</span>
      </ContainerTitle>

      <Card>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Select
            label="表示件数"
            data={limitOptions}
            value={limit}
            onChange={(v) => setLimit((v ?? '20') as Limit)}
            allowDeselect={false}
          />
          <Select
            label="集計期間"
            data={periodOptions}
            value={period}
            onChange={(v) => setPeriod((v ?? '24h') as Period)}
            allowDeselect={false}
          />
        </SimpleGrid>
      </Card>

      {error && (
        <Alert color="red" variant="light">
          {error}
        </Alert>
      )}

      <SimpleGrid
        className={loading ? 'traqing-query-content-loading' : undefined}
        cols={{ base: 2, sm: 4 }}
        spacing="md"
      >
        <Card>
          <Text size="sm" c="dimmed">
            記録リクエスト数
          </Text>
          <Text fw={700} size="xl">
            {summary.count.toLocaleString()}
          </Text>
        </Card>
        <Card>
          <Text size="sm" c="dimmed">
            累計時間
          </Text>
          <Text fw={700} size="xl">
            {formatMs(summary.totalDurationMs)}
          </Text>
        </Card>
        <Card>
          <Text size="sm" c="dimmed">
            平均時間
          </Text>
          <Text fw={700} size="xl">
            {formatMs(summaryAverageDurationMs)}
          </Text>
        </Card>
        <Card>
          <Text size="sm" c="dimmed">
            p99
          </Text>
          <Text fw={700} size="xl">
            {formatMs(summary.p99DurationMs)}
          </Text>
        </Card>
      </SimpleGrid>

      <Card>
        <Stack gap="sm">
          <Text fw={700}>総時間が大きいクエリ</Text>
          <div className="traqing-table-wrap">
            <Table className="traqing-table" miw={1160} verticalSpacing="xs">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>API</Table.Th>
                  <Table.Th>Parameters</Table.Th>
                  <Table.Th ta="right">
                    <SortHeader active={sortBy === 'count'} order={sortOrder} onClick={() => updateSort('count')}>
                      回数
                    </SortHeader>
                  </Table.Th>
                  <Table.Th ta="right">
                    <SortHeader
                      active={sortBy === 'totalDurationMs'}
                      order={sortOrder}
                      onClick={() => updateSort('totalDurationMs')}
                    >
                      累計
                    </SortHeader>
                  </Table.Th>
                  <Table.Th ta="right">
                    <SortHeader
                      active={sortBy === 'averageDurationMs'}
                      order={sortOrder}
                      onClick={() => updateSort('averageDurationMs')}
                    >
                      平均
                    </SortHeader>
                  </Table.Th>
                  <Table.Th ta="right">
                    <SortHeader
                      active={sortBy === 'p99DurationMs'}
                      order={sortOrder}
                      onClick={() => updateSort('p99DurationMs')}
                    >
                      p99
                    </SortHeader>
                  </Table.Th>
                  <Table.Th>Histogram</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody className={loading ? 'traqing-query-content-loading' : undefined}>
                {metrics.map((metric) => (
                  <Table.Tr key={metric.id}>
                    <Table.Td>
                      <QueryLabel metric={metric} />
                    </Table.Td>
                    <Table.Td>
                      <QueryParameters query={metric.query} />
                    </Table.Td>
                    <Table.Td ta="right">{metric.count.toLocaleString()}</Table.Td>
                    <Table.Td ta="right">{formatMs(metric.totalDurationMs)}</Table.Td>
                    <Table.Td ta="right">{formatMs(metric.averageDurationMs)}</Table.Td>
                    <Table.Td ta="right">{formatMs(metric.p99DurationMs)}</Table.Td>
                    <Table.Td>
                      <HistogramBars histogram={metric.histogram} />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </Stack>
      </Card>
    </Container>
  );
};
