export default function ScoreRing({ value, size = 96, label }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const has = value !== null && value !== undefined;
  const pct = has ? Math.max(0, Math.min(100, value)) : 0;
  const color = pct >= 75 ? 'var(--good)' : pct >= 50 ? 'var(--warn)' : 'var(--bad)';
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth="9" />
        {has && (
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
      </svg>
      <div className="ring-text">
        <b>{has ? Math.round(pct) : '–'}</b>
        {label && <small>{label}</small>}
      </div>
    </div>
  );
}
