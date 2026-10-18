// Dependency-free SVG line chart of score over time (0-100).
export default function LineChart({ points, height = 140 }) {
  if (!points.length) return <div className="muted">No scores yet.</div>;
  const w = 480, pad = 24;
  const x = (i) => (points.length === 1 ? w / 2 : pad + (i * (w - pad * 2)) / (points.length - 1));
  const y = (v) => height - pad - (v / 100) * (height - pad * 2);
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.score)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="linechart" role="img" aria-label="Score history">
      {[0, 50, 100].map((g) => (
        <g key={g}>
          <line x1={pad} x2={w - pad} y1={y(g)} y2={y(g)} stroke="var(--line)" strokeDasharray="3 4" />
          <text x={4} y={y(g) + 4} fontSize="10" fill="var(--muted)">{g}</text>
        </g>
      ))}
      <path d={path} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.score)} r="5" fill="var(--brand)">
            <title>{`${p.source}: ${p.score} (${new Date(p.at).toLocaleDateString()})`}</title>
          </circle>
          <text x={x(i)} y={y(p.score) - 10} fontSize="10" textAnchor="middle" fill="var(--text)">{Math.round(p.score)}</text>
        </g>
      ))}
    </svg>
  );
}
