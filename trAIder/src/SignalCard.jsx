const LABEL = { buy: 'Buy', hold: 'Hold', sell: 'Sell' };
const MAX_DRIVER = 30; // largest possible single contribution (weight 0.30 x score 100)

const signed = (n, digits = 1) => `${n >= 0 ? '+' : ''}${n.toFixed(digits)}`;

function Driver({ driver }) {
  const pos = driver.effect >= 0;
  const width = Math.min(Math.abs(driver.effect) / MAX_DRIVER, 1) * 50;
  return (
    <li>
      <div className="driver-head">
        <span>{driver.name}</span>
        <span className={pos ? 'pos' : 'neg'}>{signed(driver.effect)}</span>
      </div>
      <div className="driver-track" aria-hidden="true">
        <span className="driver-mid" />
        <span className={`driver-fill ${pos ? 'pos' : 'neg'}`} style={{ width: `${width}%` }} />
      </div>
    </li>
  );
}

export default function SignalCard({ ticker, entry }) {
  const s = entry?.data;

  if (!s) {
    if (entry?.status === 'error') {
      return (
        <article className="signal-card">
          <h3 className="signal-ticker">{ticker}</h3>
          <p className="signal-error">{entry.error}</p>
        </article>
      );
    }
    return (
      <article className="signal-card" aria-busy="true">
        <h3 className="signal-ticker">{ticker}</h3>
        <div className="skeleton-bar" />
        <div className="skeleton-bar short" />
      </article>
    );
  }

  const up = s.quote.change >= 0;
  const refreshing = entry.status === 'loading';

  return (
    <article className={`signal-card ${refreshing ? 'refreshing' : ''}`}>
      <header className="signal-top">
        <div>
          <h3 className="signal-ticker">{s.ticker}</h3>
          <div className="signal-price">
            ${s.quote.price.toFixed(2)}
            <span className={`chg ${up ? 'pos' : 'neg'}`}>{signed(s.quote.changePercent, 2)}%</span>
          </div>
        </div>
        <span className={`pill ${s.action}`}>{LABEL[s.action]}</span>
      </header>

      <div className="confidence">
        <div className="confidence-row">
          <span>Confidence</span>
          <span className="confidence-num">{s.confidence}</span>
        </div>
        <div className="confidence-bar" aria-hidden="true">
          <i style={{ width: `${s.confidence}%` }} />
        </div>
        {!s.calibrated && <p className="note">Not yet backtested, so not a probability.</p>}
      </div>

      <h4 className="drivers-title">What is driving this</h4>
      <ul className="drivers">
        {s.drivers.map((d) => (
          <Driver key={d.name} driver={d} />
        ))}
      </ul>

      <details className="more">
        <summary>Details and risks</summary>
        <h4>How each driver reads</h4>
        <ul className="plain-list">
          {s.drivers.map((d) => (
            <li key={d.name}>{d.note}</li>
          ))}
        </ul>
        <h4>Risks</h4>
        <ul className="plain-list">
          {s.risks.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <h4>Would change if</h4>
        <ul className="plain-list">
          {s.would_change_if.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </details>

      <p className="note signal-foot">
        Prices as of {s.data_as_of} · {s.horizon} view
        {entry.status === 'error' && <span className="neg"> · refresh failed: {entry.error}</span>}
      </p>
    </article>
  );
}