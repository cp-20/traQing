import { memorize, TTLCache } from '@/cache';
import { sleep } from 'bun';
import { describe, test, setSystemTime, expect, mock } from 'bun:test';

describe('TTLCache', () => {
  test('10sのTTLでキャッシュが期限切れになる', async () => {
    const fetcher = mock(async () => 'value');
    const cache = new TTLCache<string, string>(10000);

    setSystemTime(new Date('2024-01-01T00:00:00Z'));
    expect(await cache.get('key', fetcher), 'value').toBe('value');
    expect(fetcher).toHaveBeenCalledTimes(1);

    setSystemTime(new Date('2024-01-01T00:00:01Z'));
    expect(await cache.get('key', fetcher), 'value').toBe('value');
    expect(fetcher).toHaveBeenCalledTimes(1);

    setSystemTime(new Date('2024-01-01T00:00:20Z'));
    expect(await cache.get('key', fetcher), 'value').toBe('value');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  test('同一期間に二重でリクエストが飛ばない', async () => {
    const cache = new TTLCache<string, string>(10000);

    const fetcher = mock(async () => {
      await sleep(100);
      return 'value';
    });

    await Promise.all([
      cache.get('key', fetcher),
      cache.get('key', fetcher),
      cache.get('key', fetcher),
      cache.get('key', fetcher),
      cache.get('key', fetcher),
    ]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

describe('memorize', () => {
  test('10sのTTLでキャッシュが期限切れになる', async () => {
    const fetcher = mock(async (a: number, b: number) => a + b);
    const memorized = memorize(10000, fetcher);

    setSystemTime(new Date('2024-01-01T00:00:00Z'));
    expect(await memorized(1, 2)).toBe(3);
    expect(fetcher).toHaveBeenCalledTimes(1);

    setSystemTime(new Date('2024-01-01T00:00:01Z'));
    expect(await memorized(1, 2)).toBe(3);
    expect(fetcher).toHaveBeenCalledTimes(1);

    setSystemTime(new Date('2024-01-01T00:00:20Z'));
    expect(await memorized(1, 2)).toBe(3);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  test('同一期間に二重でリクエストが飛ばない', async () => {
    const fetcher = mock(async (a: number, b: number) => {
      await sleep(100);
      return a + b;
    });
    const memorized = memorize(10000, fetcher);

    await Promise.all([memorized(1, 2), memorized(1, 2), memorized(1, 2), memorized(1, 2), memorized(1, 2)]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
