import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import Markdown from '../components/Markdown.jsx';
import BadgeToast from '../components/BadgeToast.jsx';

export default function LessonPage() {
  const { id } = useParams();
  const { refresh } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [done, setDone] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setDone(null);
    api.get(`/learning/lessons/${id}`).then(setLesson).catch((e) => setError(e.message));
  }, [id]);

  const complete = async () => {
    try {
      const r = await api.post(`/learning/lessons/${id}/complete`);
      setDone(r);
      setLesson({ ...lesson, completed: true });
      refresh();
    } catch (e) { setError(e.message); }
  };

  if (error) return <div className="error">{error}</div>;
  if (!lesson) return <p className="muted">Loading…</p>;

  return (
    <div className="narrow-col">
      <Link to={`/subjects/${lesson.subjectId}`} className="back">← Back to subject</Link>
      <div className="card">
        <p className="muted small">{lesson.topic} · {lesson.minutes} min read</p>
        <h1>{lesson.title}</h1>
        <Markdown source={lesson.content} />
        <div className="row gap">
          {lesson.completed ? (
            <span className="tag good">✓ Completed{done?.xpEarned ? ` · +${done.xpEarned} XP` : ''}</span>
          ) : (
            <button className="btn" onClick={complete}>Mark as complete (+15 XP)</button>
          )}
          <Link className="btn ghost" to={`/subjects/${lesson.subjectId}`}>Practice this topic</Link>
        </div>
      </div>
      {done && <BadgeToast badges={done.newBadges} />}
    </div>
  );
}
