type CacheValue<T> = {
  value: T;
  expiresAt: number;
};

export class TTLCache<K, V> {
  private cache: Map<K, CacheValue<V>> = new Map();
  private pending: Map<K, Promise<V>> = new Map();

  constructor(private ttl: number) {}

  // TTLをチェックして、期限切れのデータを削除
  private isExpired(key: K): boolean {
    const cacheEntry = this.cache.get(key);
    if (!cacheEntry) return true;
    return Date.now() > cacheEntry.expiresAt;
  }

  // データをキャッシュに保存
  private setCache(key: K, value: V) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttl,
    });
  }

  // キャッシュを取得するメソッド。キャッシュがないか期限切れの場合はfetcherを実行する
  async get(key: K, fetcher: () => Promise<V>): Promise<V> {
    if (this.cache.has(key) && !this.isExpired(key)) {
      // biome-ignore lint/style/noNonNullAssertion: hasでチェックしているため
      return this.cache.get(key)!.value;
    }

    // 同じキーのリクエストが進行中かどうか確認
    if (this.pending.has(key)) {
      // biome-ignore lint/style/noNonNullAssertion: hasでチェックしているため
      return this.pending.get(key)!;
    }

    // 新たなリクエストを作成
    const pendingPromise = new Promise<V>(async (resolve, reject) => {
      try {
        const value = await fetcher();
        this.setCache(key, value);
        resolve(value);
      } catch (error) {
        reject(error);
      } finally {
        // リクエスト完了後はpendingから削除
        this.pending.delete(key);
      }
    });

    // pendingに追加
    this.pending.set(key, pendingPromise);

    return pendingPromise;
  }
}

export const memorize = <Args extends unknown[], Result>(
  ttl: number,
  fn: (...args: Args) => Promise<Result>,
): ((...args: Args) => Promise<Result>) => {
  const cache = new TTLCache<string, Result>(ttl);

  const fetcher = async (...args: Args): Promise<Result> => {
    const key = JSON.stringify(args);
    return cache.get(key, () => fn(...args));
  };

  return fetcher;
};
