import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import ScoreRing from '../components/ScoreRing.jsx';
import Swot from '../components/Swot.jsx';
import BadgeToast from '../components/BadgeToast.jsx';

const TITLES = { diagnostic: 'Diagnostic test', weekly: 'Weekly improvement test', quiz: 'Practice quiz' };

function Review({ test }) {
  return (
    <div className="col gap">
      {test.questions.map((q) => (
        <div key={q.id} className={`card review ${q.isCorrect ? 'right' : 'wrong'}`}>
          <p className="muted small">{q.topic}</p>
          <p className="q-text">{q.position}. {q.text}</p>
          <ul className="options">
            {q.options.map((o, i) => (
              <li key={i} className={i === q.correctIndex ? 'correct' : i === q.selectedIndex ? 'incorrect' : ''}>
                {o}{i === q.correctIndex && ' ✓'}{i === q.selectedIndex && i !== q.correctIndex && ' ✗'}
              </li>
            ))}
          </ul>
          <p className="small"><b>{q.isCorrect ? 'Correct.' : q.selectedIndex === null ? 'Skipped.' : 'Not quite.'}</b> {q.explanation}</p>
        </div>
      ))}
    </div>
  );
}

function Result({ test, result, onQuiz }) {
  const isDiag = test.type === 'diagnostic';
  return (
    <>
      <div className="card hero">
        <div className="row gap center-v">
          <ScoreRing value={result.kinetiqScore} label="KinetIQ score" size={130} />
          <div>
            <h1>{isDiag ? 'Your starting score' : 'Test complete!'}</h1>
            <p>You answered <b>{result.correct}/{result.total}</b> correctly ({Math.round(result.score)}%).</p>
            {!isDiag && result.change !== null && (
              <p className={result.change >= 0 ? 'up' : 'down'}>
                {result.change >= 0 ? '▲' : '▼'} {Math.abs(result.change)} points vs before · started at {Math.round(result.initialScore)}
              </p>
            )}
            <p className="muted">+{result.xpEarned} XP · Level {result.level} · 🔥 {result.streak}-day streak</p>
          </div>
        </div>
      </div>
      <BadgeToast badges={result.newBadges} />
      <h2>{isDiag ? 'Your SWOT analysis' : 'Updated SWOT'}</h2>
      <Swot swot={result.swot} onQuiz={onQuiz} />
    </>
  );
}

export default function TestPage() {
  const { id } = useParams();
  const { refresh } = useAuth();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setResult(null);
    setAnswers({});
    setCurrent(0);
    api.get(`/tests/${id}`).then(setTest).catch((e) => setError(e.message));
  }, [id]);

  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      const payload = Object.entries(answers).map(([questionId, selectedIndex]) => ({ questionId: Number(questionId), selectedIndex }));
      const res = await api.post(`/tests/${id}/submit`, { answers: payload });
      setResult(res);
      setTest(await api.get(`/tests/${id}`));
      refresh();
      window.scrollTo({ top: 0 });
    } catch (e) { setError(e.message); }
    setBusy(false);
  };

  const startQuiz = async (topicId) => {
    try {
      const t = await api.post('/tests', { subjectId: test.subject.id, type: 'quiz', topicId });
      window.location.assign(`/tests/${t.id}`);
    } catch (e) { setError(e.message); }
  };

  if (error && !test) return <div className="error">{error}</div>;
  if (!test) return <p className="muted">Loading…</p>;

  const back = <Link to={`/subjects/${test.subject.id}`} className="back">← {test.subject.name}</Link>;

  // Completed: show result (fresh) or review (revisited)
  if (test.status === 'completed') {
    return (
      <>
        {back}
        {result ? <Result test={test} result={result} onQuiz={startQuiz} /> : (
          <div className="card hero"><div><h1>{TITLES[test.type]}</h1><p>Score: <b>{Math.round(test.score)}%</b></p></div></div>
        )}
        <h2>Review your answers</h2>
        <Review test={test} />
      </>
    );
  }

  const q = test.questions[current];
  const answered = Object.keys(answers).length;
  const last = current === test.questions.length - 1;

  return (
    <div className="narrow-col">
      {back}
      <h1>{TITLES[test.type]}{test.topic ? ` · ${test.topic}` : ''}</h1>
      {test.type === 'diagnostic' && <p className="muted">Answer as best you can. This sets your starting point, so don't worry about getting everything right.</p>}
      <div className="progress"><i style={{ width: `${((current + 1) / test.questions.length) * 100}%` }} /></div>
      <p className="muted small">Question {current + 1} of {test.questions.length} · {answered} answered</p>

      <div className="card">
        <p className="muted small">{q.topic}</p>
        <p className="q-text">{q.text}</p>
        <div className="col gap">
          {q.options.map((o, i) => (
            <button key={i} className={`option ${answers[q.id] === i ? 'on' : ''}`} onClick={() => setAnswers({ ...answers, [q.id]: i })}>
              <span className="letter">{String.fromCharCode(65 + i)}</span>{o}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      <div className="row between">
        <button className="btn ghost" disabled={current === 0} onClick={() => setCurrent(current - 1)}>← Previous</button>
        {last ? (
          <button className="btn" disabled={busy} onClick={submit}>
            {busy ? 'Submitting…' : answered < test.questions.length ? `Submit (${test.questions.length - answered} unanswered)` : 'Submit'}
          </button>
        ) : (
          <button className="btn" onClick={() => setCurrent(current + 1)}>Next →</button>
        )}
      </div>
    </div>
  );
}
