import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import ScoreRing from '../components/ScoreRing.jsx';

function SubjectCard({ s }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const go = async () => {
    setError('');
    if (s.openTest) return navigate(`/tests/${s.openTest.id}`);
    if (!s.diagnosticDone) {
      try {
        const t = await api.post('/tests', { subjectId: s.id, type: 'diagnostic' });
        navigate(`/tests/${t.id}`);
      } catch (e) { setError(e.message); }
    } else navigate(`/subjects/${s.id}`);
  };

  const weeklyText = !s.diagnosticDone ? null
    : s.weekly.available ? '✅ Weekly test ready'
    : `Next weekly test: ${new Date(s.weekly.nextAt).toLocaleDateString()}`;

  return (
    <div className="card subject-card">
      <div className="row between">
        <h3>{s.icon} {s.name}</h3>
        {s.change !== null && s.diagnosticDone && (
          <span className={`tag ${s.change >= 0 ? 'good' : 'bad'}`}>{s.change >= 0 ? '▲' : '▼'} {Math.abs(s.change)} since start</span>
        )}
      </div>
      <div className="row gap center-v">
        <ScoreRing value={s.score} label="score" size={110} />
        <div className="grow">
          {s.diagnosticDone ? (
            <>
              <p className="muted small">Starting score: <b>{Math.round(s.initialScore)}</b></p>
              <p className="muted small">Weekly tests done: <b>{s.weekly.completed}</b></p>
              <p className="small">{weeklyText}</p>
            </>
          ) : (
            <p className="muted">Take a short diagnostic test to get your starting score and personal SWOT.</p>
          )}
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="row gap">
        <button className="btn" onClick={go}>
          {s.openTest ? 'Resume test' : s.diagnosticDone ? 'Open subject' : 'Start diagnostic'}
        </button>
        {s.diagnosticDone && <Link className="btn ghost" to={`/subjects/${s.id}`}>SWOT &amp; plan</Link>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/progress/dashboard').then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!data) return <p className="muted">Loading…</p>;
  const { user, subjects, recentBadges, totals } = data;

  return (
    <>
      <section className="hero card">
        <div>
          <h1>Hey {user.name.split(' ')[0]}, ready to level up? 🚀</h1>
          <p className="muted">Grade {user.grade} · {user.xp} XP · {user.streak}-day streak</p>
        </div>
        <div className="hero-stats">
          <div><b>{totals.tests}</b><small>tests done</small></div>
          <div><b>{totals.lessons}</b><small>lessons</small></div>
          <div><b>{user.level}</b><small>level</small></div>
        </div>
      </section>

      <h2>Your subjects</h2>
      <div className="grid two">{subjects.map((s) => <SubjectCard key={s.id} s={s} />)}</div>

      <div className="row between">
        <h2>Recent badges</h2>
        <Link to="/badges">See all →</Link>
      </div>
      {recentBadges.length === 0 ? (
        <p className="muted">Complete your first test to earn your first badge.</p>
      ) : (
        <div className="badge-row">
          {recentBadges.map((b) => (
            <div key={b.code} className="badge earned"><span>{b.icon}</span><small>{b.name}</small></div>
          ))}
        </div>
      )}
    </>
  );
}
