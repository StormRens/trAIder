import { useCallback, useEffect, useState } from 'react';

export const DEFAULT_WATCHLIST = ['SCHB', 'SPY', 'AAPL', 'NVDA', 'VOO', 'META'];
// The free data plan allows 8 requests per minute, so keep the list at 8 or fewer.
export const MAX_WATCHLIST = 8;
const KEY = 'eyrie:watchlist';

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(parsed)) {
      return parsed.filter((t) => typeof t === 'string').slice(0, MAX_WATCHLIST);
    }
  } catch {
    // ignore and fall back to the defaults
  }
  return DEFAULT_WATCHLIST;
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(watchlist));
    } catch {
      // storage unavailable: the list just won't persist
    }
  }, [watchlist]);

  const add = useCallback(
    (t) => setWatchlist((p) => (p.includes(t) || p.length >= MAX_WATCHLIST ? p : [...p, t])),
    []
  );
  const remove = useCallback((t) => setWatchlist((p) => p.filter((x) => x !== t)), []);

  return { watchlist, add, remove, isFull: watchlist.length >= MAX_WATCHLIST };
}