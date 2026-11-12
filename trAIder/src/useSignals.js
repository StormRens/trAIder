import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchSignal } from './api.js';

// Keep this at 8 or fewer: the free data plan allows 8 requests per minute.
export const WATCHLIST = ['VOO', 'QQQ', 'AAPL', 'NVDA', 'MSFT', 'TSLA'];

const initial = (tickers) =>
  Object.fromEntries(tickers.map((t) => [t, { status: 'loading', data: null, error: null }]));

export function useSignals(tickers = WATCHLIST) {
  const [entries, setEntries] = useState(() => initial(tickers));
  const [updatedAt, setUpdatedAt] = useState(null);

  const fetchAll = useCallback(
    async (force) => {
      await Promise.all(
        tickers.map(async (t) => {
          try {
            const data = await fetchSignal(t, { force });
            setEntries((p) => ({ ...p, [t]: { status: 'ok', data, error: null } }));
          } catch (err) {
            setEntries((p) => ({
              ...p,
              [t]: { status: 'error', data: p[t]?.data ?? null, error: err.message },
            }));
          }
        })
      );
      setUpdatedAt(new Date());
    },
    [tickers]
  );

  useEffect(() => {
    fetchAll(false);
  }, [fetchAll]);

  // Keep any previous data on screen while refreshing.
  const reload = useCallback(() => {
    setEntries((p) =>
      Object.fromEntries(tickers.map((t) => [t, { ...p[t], status: 'loading', error: null }]))
    );
    fetchAll(true);
  }, [tickers, fetchAll]);

  const quotes = useMemo(
    () =>
      tickers
        .map((t) => entries[t]?.data && { symbol: t, ...entries[t].data.quote })
        .filter(Boolean),
    [tickers, entries]
  );

  const loading = tickers.some((t) => entries[t]?.status === 'loading');
  const failedAll = tickers.every((t) => entries[t]?.status === 'error' && !entries[t].data);

  return { tickers, entries, quotes, reload, updatedAt, loading, failedAll };
}
