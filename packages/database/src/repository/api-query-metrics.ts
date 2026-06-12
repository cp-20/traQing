import { and, asc, count, desc, gte, inArray, lte, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import * as schema from '@/schema';

export const ApiQueryMetricsQuerySchema = z
  .object({
    limit: z.preprocess((x) => Number(x), z.number().int().positive().max(500)),
    after: z.coerce.date(),
    before: z.coerce.date(),
    sortBy: z.enum(['count', 'totalDurationMs', 'averageDurationMs', 'p99DurationMs']),
    order: z.enum(['asc', 'desc']),
  })
  .partial();

export type ApiQueryMetricsQuery = z.infer<typeof ApiQueryMetricsQuerySchema>;

type ApiQueryMetricInput = {
  method: string;
  path: string;
  query: string;
  durationMs: number;
  status: number;
  measuredAt: Date;
};

const durationBuckets = [
  { label: '<50ms', condition: sql`${schema.apiQueryMeasurements.durationMs} < 50` },
  {
    label: '<100ms',
    condition: sql`${schema.apiQueryMeasurements.durationMs} >= 50 and ${schema.apiQueryMeasurements.durationMs} < 100`,
  },
  {
    label: '<250ms',
    condition: sql`${schema.apiQueryMeasurements.durationMs} >= 100 and ${schema.apiQueryMeasurements.durationMs} < 250`,
  },
  {
    label: '<500ms',
    condition: sql`${schema.apiQueryMeasurements.durationMs} >= 250 and ${schema.apiQueryMeasurements.durationMs} < 500`,
  },
  {
    label: '<1000ms',
    condition: sql`${schema.apiQueryMeasurements.durationMs} >= 500 and ${schema.apiQueryMeasurements.durationMs} < 1000`,
  },
  {
    label: '<2500ms',
    condition: sql`${schema.apiQueryMeasurements.durationMs} >= 1000 and ${schema.apiQueryMeasurements.durationMs} < 2500`,
  },
  {
    label: '<5000ms',
    condition: sql`${schema.apiQueryMeasurements.durationMs} >= 2500 and ${schema.apiQueryMeasurements.durationMs} < 5000`,
  },
  { label: '>=5000ms', condition: sql`${schema.apiQueryMeasurements.durationMs} >= 5000` },
] as const;

const histogramSelect = {
  histogramBucket0: sql<number>`count(*) filter (where ${durationBuckets[0].condition})`,
  histogramBucket1: sql<number>`count(*) filter (where ${durationBuckets[1].condition})`,
  histogramBucket2: sql<number>`count(*) filter (where ${durationBuckets[2].condition})`,
  histogramBucket3: sql<number>`count(*) filter (where ${durationBuckets[3].condition})`,
  histogramBucket4: sql<number>`count(*) filter (where ${durationBuckets[4].condition})`,
  histogramBucket5: sql<number>`count(*) filter (where ${durationBuckets[5].condition})`,
  histogramBucket6: sql<number>`count(*) filter (where ${durationBuckets[6].condition})`,
  histogramBucket7: sql<number>`count(*) filter (where ${durationBuckets[7].condition})`,
};

export const recordApiQueryMetric = async (input: ApiQueryMetricInput) => {
  await db
    .insert(schema.apiQueryMeasurements)
    .values({
      method: input.method,
      path: input.path,
      query: input.query,
      durationMs: input.durationMs,
      status: input.status,
      measuredAt: input.measuredAt,
    })
    .execute();
};

export const getApiQueryMetrics = async (query: ApiQueryMetricsQuery = {}, paths?: string[]) => {
  const normalizedQuery = sql<string>`coalesce(
    (
      select string_agg(param, '&' order by param)
      from unnest(string_to_array(${schema.apiQueryMeasurements.query}, '&')) as param
      where split_part(param, '=', 1) not in ('before', 'after', 'limit')
    ),
    ''
  )`;
  const totalDurationMs = sql<number>`sum(${schema.apiQueryMeasurements.durationMs})`;
  const averageDurationMs = sql<number>`avg(${schema.apiQueryMeasurements.durationMs})`;
  const p99DurationMs = sql<number>`percentile_cont(0.99) within group (order by ${schema.apiQueryMeasurements.durationMs})`;
  const metricCount = count();
  const order = query.order === 'asc' ? asc : desc;
  const orderBy = {
    count: metricCount,
    totalDurationMs,
    averageDurationMs,
    p99DurationMs,
  }[query.sortBy ?? 'totalDurationMs'];
  const conditions = [
    paths && inArray(schema.apiQueryMeasurements.path, paths),
    query.after && gte(schema.apiQueryMeasurements.measuredAt, query.after),
    query.before && lte(schema.apiQueryMeasurements.measuredAt, query.before),
  ];

  const results = await db
    .select({
      id: sql<string>`concat(${schema.apiQueryMeasurements.method}, '\n', ${schema.apiQueryMeasurements.path}, '\n', ${normalizedQuery})`,
      method: schema.apiQueryMeasurements.method,
      path: schema.apiQueryMeasurements.path,
      query: normalizedQuery,
      count: metricCount,
      totalDurationMs,
      averageDurationMs,
      p99DurationMs,
      ...histogramSelect,
    })
    .from(schema.apiQueryMeasurements)
    .where(and(...conditions.filter((condition) => !!condition)))
    .groupBy(schema.apiQueryMeasurements.method, schema.apiQueryMeasurements.path, normalizedQuery)
    .orderBy(order(orderBy))
    .limit(query.limit ?? 100)
    .execute();

  return results.map((result) => ({
    id: result.id,
    method: result.method,
    path: result.path,
    query: result.query,
    count: Number(result.count),
    totalDurationMs: Number(result.totalDurationMs),
    averageDurationMs: Number(result.averageDurationMs),
    p99DurationMs: Number(result.p99DurationMs),
    histogram: [
      { label: durationBuckets[0].label, count: Number(result.histogramBucket0) },
      { label: durationBuckets[1].label, count: Number(result.histogramBucket1) },
      { label: durationBuckets[2].label, count: Number(result.histogramBucket2) },
      { label: durationBuckets[3].label, count: Number(result.histogramBucket3) },
      { label: durationBuckets[4].label, count: Number(result.histogramBucket4) },
      { label: durationBuckets[5].label, count: Number(result.histogramBucket5) },
      { label: durationBuckets[6].label, count: Number(result.histogramBucket6) },
      { label: durationBuckets[7].label, count: Number(result.histogramBucket7) },
    ],
  }));
};

export const clearApiQueryMetrics = async () => {
  await db.delete(schema.apiQueryMeasurements).execute();
};
