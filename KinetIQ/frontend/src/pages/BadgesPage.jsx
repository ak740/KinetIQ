import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function BadgesPage() {
  const [badges, setBadges] = useState(null);
  useEffect(() => { api.get('/progress/badges').then(setBadges); }, []);
  if (!badges) return <p className="muted">Loading…</p>;
  const earned = badges.filter((b) => b.earned).length;
  return (
    <>
      <h1>Achievements</h1>
      <p className="muted">{earned} of {badges.length} badges earned</p>
      <div className="grid badges-grid">
        {badges.map((b) => (
          <div key={b.code} className={`card badge-card ${b.earned ? 'earned' : 'locked'}`}>
            <span className="big-icon">{b.earned ? b.icon : '🔒'}</span>
            <b>{b.name}</b>
            <small className="muted">{b.description}</small>
            {b.earned && <small className="tag good">{new Date(b.earnedAt).toLocaleDateString()}</small>}
          </div>
        ))}
      </div>
    </>
  );
}
