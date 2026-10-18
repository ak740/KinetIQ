import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';

export default function Onboarding() {
  const { user, refresh, logout } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [grade, setGrade] = useState(user.grade || null);
  const [selected, setSelected] = useState(user.subjects.map((s) => s.id));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/catalog/subjects').then(setSubjects).catch((e) => setError(e.message));
  }, []);

  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      await api.put('/me/profile', { grade, subjectIds: selected });
      await refresh();
      navigate('/', { replace: true });
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  return (
    <div className="container narrow">
      <div className="card onboard">
        <h1>Hi {user.name.split(' ')[0]}! Let's set you up 👋</h1>

        <h3>1. Which grade are you in?</h3>
        <div className="choice-row">
          {[9, 10, 11, 12].map((g) => (
            <button key={g} className={`choice ${grade === g ? 'on' : ''}`} onClick={() => setGrade(g)}>Grade {g}</button>
          ))}
        </div>

        <h3>2. What do you want help with?</h3>
        <div className="choice-row">
          {subjects.map((s) => (
            <button key={s.id} className={`choice big ${selected.includes(s.id) ? 'on' : ''}`} onClick={() => toggle(s.id)}>
              <span className="emoji">{s.icon}</span>
              <b>{s.name}</b>
              <small>{s.description}</small>
            </button>
          ))}
        </div>

        {error && <div className="error">{error}</div>}
        <div className="row between">
          <button className="btn ghost" onClick={logout}>Log out</button>
          <button className="btn" disabled={!grade || !selected.length || busy} onClick={save}>
            {busy ? 'Saving…' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
