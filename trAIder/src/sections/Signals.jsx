import SignalCard from '../SignalCard.jsx';
import TickerSearch from '../TickerSearch.jsx';
import { MAX_WATCHLIST } from '../useWatchlist.js';

function Signals({ tickers, entries, onReload, updatedAt, loading, failedAll, onAdd, onRemove, isFull }) {
  const time = updatedAt?.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <section className="page-section">
      <div className="section-head">
        <div>
          <h2>Signals</h2>
          <p className="updated">{updatedAt ? `Updated ${time}` : 'Loading prices…'}</p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={onReload}
          disabled={loading || tickers.length === 0}
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <TickerSearch watchlist={tickers} isFull={isFull} onAdd={onAdd} onRemove={onRemove} />

      {failedAll && (
        <p className="alert">
          No data came back. Start the app with npm run dev:api and check that your API key is loaded.
        </p>
      )}

      <h3 className="section-sub">
        Your watchlist{' '}
        <span className="count">
          {tickers.length} of {MAX_WATCHLIST}
        </span>
      </h3>

      {tickers.length === 0 && (
        <p className="note">Your watchlist is empty. Search for a ticker above and add it.</p>
      )}

      <div className="signal-grid">
        {tickers.map((t) => (
          <SignalCard key={t} ticker={t} entry={entries[t]}>
            <div className="card-actions">
              <button type="button" className="action-btn" onClick={() => onRemove(t)}>
                Remove
              </button>
            </div>
          </SignalCard>
        ))}
      </div>

      <p className="disclaimer">
        Trend signals only. They don't include news, macro events, or valuation yet, and they haven't
        been backtested. Not financial advice.
      </p>
    </section>
  );
}

export default Signals;