// The Eyrie mark: an amber sun (the eye) resting on a horizon line.
export default function EyrieMark({ width = 26 }) {
  const height = Math.round((width * 18) / 26);
  return (
    <svg width={width} height={height} viewBox="0 0 26 18" aria-hidden="true">
      <line x1="0" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="9" r="5" style={{ fill: 'var(--amber)' }} />
    </svg>
  );
}