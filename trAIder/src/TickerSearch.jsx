import { useState } from 'react';
import SignalCard from './SignalCard.jsx';
import { fetchSignal } from './api.js';
import { MAX_WATCHLIST } from './useWatchlist.js';

const VALID = /^[A-Z][A-Z0-9.-]{0,9}$/;
const normalize = (s) => s.trim().toUpperCase().replace(/^\$/, '');

export default function TickerSearch({ watchlist, isFull, onAdd, onRemove }) {
  const [query, setQuery] = useState('');
  const [formError, setFormError] = useState('');
  const [result, setResult] = useState(null); // { ticker, status, data, error }

  const submit = async (e) => {
    e.preventDefault();
    const ticker = normalize(query);
    setFormError('');
    if (!VALID.test(ticker)) {
      setResult(null);
      setFormError('Enter a ticker symbol, for example NVDA or BRK.B.');
      return;
    }
    setResult({ ticker, status: 'loading', data: null, error: null });
    try {
      const data = await fetchSignal(ticker);
      setResult((r) => (r?.ticker === ticker ? { ticker, status: 'ok', data, error: null } : r));
    } catch (err) {
      setResult((r) =>
        r?.ticker === ticker ? { ticker, status: 'error', data: null, error: err.message } : r
      );
    }
  };

  const inList = result ? watchlist.includes(result.ticker) : false;
  const searching = result?.status === 'loading';

  return (
    <div className="search-block">
      <form className="search" onSubmit={submit} role="search">
        <input
          type="text"
          aria-label="Ticker symbol"
          placeholder="Search a ticker, e.g. NVDA"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoCapitalize="characters"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          maxLength={11}
        />
        <button type="submit" disabled={searching || !query.trim()}>
          {searching ? 'Searching…' : 'Search'}
        </button>
      </form>

      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}

      {result && (
        <div className="result">
          <div className="result-label">
            <span>Search result</span>
            <button type="button" className="text-btn" onClick={() => setResult(null)}>
              Clear
            </button>
          </div>
          <SignalCard ticker={result.ticker} entry={result}>
            {result.status === 'ok' && (
              <div className="card-actions">
                {inList ? (
                  <button type="button" className="action-btn" onClick={() => onRemove(result.ticker)}>
                    Remove from watchlist
                  </button>
                ) : (
                  <button
                    type="button"
                    className="action-btn primary"
                    disabled={isFull}
                    onClick={() => onAdd(result.ticker)}
                  >
                    {isFull ? `Watchlist full (${MAX_WATCHLIST})` : 'Add to watchlist'}
                  </button>
                )}
              </div>
            )}
          </SignalCard>
        </div>
      )}
    </div>
  );
}