import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchSignal } from './api.js';

// `tickers` comes from useWatchlist. Results are cached in api.js, so re-running
// the effect when the list changes only costs a request for newly added tickers.
export function useSignals(tickers) {
  const [entries, setEntries] = useState({});

  const fetchList = useCallback(async (list, force) => {
    await Promise.all(
      list.map(async (t) => {
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
  }, []);

  useEffect(() => {
    fetchList(tickers, false);
  }, [tickers, fetchList]);

  // Keep any previous data on screen while refreshing.
  const reload = useCallback(() => {
    setEntries((p) =>
      Object.fromEntries(
        Object.entries(p).map(([t, e]) => [
          t,
          tickers.includes(t) ? { ...e, status: 'loading', error: null } : e,
        ])
      )
    );
    fetchList(tickers, true);
  }, [tickers, fetchList]);

  const quotes = useMemo(
    () =>
      tickers
        .map((t) => entries[t]?.data && { symbol: t, ...entries[t].data.quote })
        .filter(Boolean),
    [tickers, entries]
  );

  // A ticker with no entry yet is still loading.
  const loading = tickers.some((t) => !entries[t] || entries[t].status === 'loading');
  const failedAll =
    tickers.length > 0 && tickers.every((t) => entries[t]?.status === 'error' && !entries[t].data);

  // "Updated" shows when the newest data was fetched, even if it came from the cache.
  const updatedAt = useMemo(() => {
    const times = tickers
      .map((t) => entries[t]?.data?.generated_at)
      .filter(Boolean)
      .map((s) => new Date(s).getTime());
    return times.length ? new Date(Math.max(...times)) : null;
  }, [tickers, entries]);

  return { tickers, entries, quotes, reload, updatedAt, loading, failedAll };
}