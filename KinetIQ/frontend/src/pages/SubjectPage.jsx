import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import ScoreRing from '../components/ScoreRing.jsx';
import LineChart from '../components/LineChart.jsx';
import Swot from '../components/Swot.jsx';

export default function SubjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/progress/subjects/${id}`).then(setData).catch((e) => setError(e.message));
    api.get(`/learning/subjects/${id}/topics`).then(setTopics).catch(() => {});
  }, [id]);

  const startTest = async (type, topicId) => {
    setError('');
    try {
      const t = await api.post('/tests', { subjectId: Number(id), type, topicId });
      navigate(`/tests/${t.id}`);
    } catch (e) { setError(e.message); }
  };

  if (error && !data) return <div className="error">{error}</div>;
  if (!data) return <p className="muted">Loading…</p>;

  const w = data.weekly;
  return (
    <>
      <Link to="/" className="back">← Dashboard</Link>
      <div className="card hero">
        <div className="row gap center-v">
          <ScoreRing value={data.score} label="score" size={120} />
          <div>
            <h1>{data.icon} {data.name}</h1>
            {data.diagnosticDone ? (
              <p className="muted">
                Started at <b>{Math.round(data.initialScore)}</b>
                {data.change !== null && <> · <span className={data.change >= 0 ? 'up' : 'down'}>{data.change >= 0 ? '+' : ''}{data.change} points</span></>}
              </p>
            ) : <p className="muted">Take the diagnostic to get your first score.</p>}
          </div>
        </div>
        <div className="col gap">
          {!data.diagnosticDone && <button className="btn" onClick={() => startTest('diagnostic')}>Start diagnostic</button>}
          {data.diagnosticDone && (
            <button className="btn" disabled={!w.available} onClick={() => startTest('weekly')}>
              {w.available ? 'Take weekly test' : `Weekly test: ${new Date(w.nextAt).toLocaleDateString()}`}
            </button>
          )}
        </div>
      </div>
      {error && <div className="error">{error}</div>}

      {data.diagnosticDone && (
        <>
          <h2>Progress over time</h2>
          <div className="card"><LineChart points={data.history} /></div>

          <h2>Your SWOT</h2>
          <Swot swot={data.swot} onQuiz={(topicId) => startTest('quiz', topicId)} />

          <h2>All topics</h2>
          <div className="grid two">
            {topics.map((t) => (
              <div className="card topic" key={t.id}>
                <div className="row between">
                  <b>{t.name}</b>
                  <span className="muted small">{t.mastery === null ? 'not assessed' : `${Math.round(t.mastery)}%`}</span>
                </div>
                <div className="bar"><i style={{ width: `${t.mastery ?? 0}%` }} className={t.mastery >= 75 ? 'good' : t.mastery >= 50 ? 'warn' : 'bad'} /></div>
                <p className="muted small">{t.description}</p>
                <div className="row gap wrap">
                  {t.lessons.map((l) => (
                    <Link key={l.id} className="btn small ghost" to={`/lessons/${l.id}`}>{l.completed ? '✓' : '📖'} {l.title}</Link>
                  ))}
                  <button className="btn small" onClick={() => startTest('quiz', t.id)}>Quiz</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
