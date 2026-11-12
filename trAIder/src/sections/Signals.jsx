import SignalCard from '../SignalCard.jsx';

function Signals({ tickers, entries, onReload, updatedAt, loading, failedAll }) {
  const time = updatedAt?.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <section className="page-section">
      <div className="section-head">
        <div>
          <h2>Signals</h2>
          <p className="updated">{updatedAt ? `Updated ${time}` : 'Loading prices…'}</p>
        </div>
        <button type="button" className="btn-secondary" onClick={onReload} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {failedAll && (
        <p className="alert">
          No data came back. Start the app with npm run dev:api and check that your API key is loaded.
        </p>
      )}

      <div className="signal-grid">
        {tickers.map((t) => (
          <SignalCard key={t} ticker={t} entry={entries[t]} />
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