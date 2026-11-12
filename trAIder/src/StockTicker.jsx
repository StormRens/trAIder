// Scrolling ticker using real quotes passed in from App (no hardcoded prices).

function Sparkline({ trend, positive }) {
  const width = 56;
  const height = 24;
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const range = max - min || 1;
  const points = trend
    .map((v, i) => `${(i / (trend.length - 1)) * width},${height - ((v - min) / range) * height}`)
    .join(' ');
  return (
    <svg width={width} height={height} className={`sparkline ${positive ? 'pos' : 'neg'}`} aria-hidden="true">
      <polyline points={points} />
    </svg>
  );
}

function StockTicker({ quotes = [], loading = false }) {
  if (quotes.length === 0) {
    return (
      <div className="ticker">
        <p className="ticker-empty">{loading ? 'Loading prices…' : 'Prices unavailable'}</p>
      </div>
    );
  }

  return (
    <div className="ticker">
      <div className="ticker-track">
        {/* Rendered twice so the scroll loops seamlessly */}
        {[...quotes, ...quotes].map((q, i) => {
          const positive = q.change >= 0;
          return (
            <div key={`${q.symbol}-${i}`} className="ticker-item">
              <span className="ticker-symbol">{q.symbol}</span>
              <span className="ticker-price">${q.price.toFixed(2)}</span>
              <span className={`ticker-change ${positive ? 'pos' : 'neg'}`}>
                {positive ? '+' : ''}
                {q.changePercent.toFixed(2)}%
              </span>
              <Sparkline trend={q.trend} positive={positive} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StockTicker;