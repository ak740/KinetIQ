import { Link } from 'react-router-dom';

const trendLabel = (t) => (t > 0 ? ` ▲${t}` : t < 0 ? ` ▼${Math.abs(t)}` : '');

function TopicList({ items, empty }) {
  if (!items.length) return <p className="muted small">{empty}</p>;
  return (
    <ul className="swot-list">
      {items.map((i) => (
        <li key={i.topicId}>
          <span>{i.topic}{i.slipping && <em className="tag bad">slipping</em>}</span>
          <b>{Math.round(i.mastery)}%<small className={i.trend < 0 ? 'down' : 'up'}>{trendLabel(i.trend)}</small></b>
        </li>
      ))}
    </ul>
  );
}

export default function Swot({ swot, onQuiz }) {
  return (
    <div className="swot">
      <div className="swot-card s">
        <h4>💪 Strengths</h4>
        <TopicList items={swot.strengths} empty="No strong topics yet. Keep practising!" />
      </div>
      <div className="swot-card w">
        <h4>⚠️ Weaknesses</h4>
        <TopicList items={swot.weaknesses} empty="No weak spots. Great work!" />
      </div>
      <div className="swot-card o">
        <h4>🌱 Areas of improvement</h4>
        <TopicList items={swot.improvements} empty="Nothing in the middle zone right now." />
      </div>
      <div className="swot-card t">
        <h4>🎯 Training areas</h4>
        {swot.training.length === 0 ? (
          <p className="muted small">Nothing to train. You're on top of everything!</p>
        ) : (
          <ol className="train-list">
            {swot.training.map((t) => (
              <li key={t.topicId}>
                <div className="row between">
                  <b>{t.topic}</b>
                  <span className={`tag ${t.level === 'weakness' ? 'bad' : 'warn'}`}>{Math.round(t.mastery)}%</span>
                </div>
                <p className="muted small">{t.action}</p>
                <div className="row gap">
                  {t.lessons.map((l) => (
                    <Link key={l.id} to={`/lessons/${l.id}`} className="btn small ghost">
                      {l.completed ? '✓ ' : '📖 '}{l.title}
                    </Link>
                  ))}
                  {onQuiz && <button className="btn small" onClick={() => onQuiz(t.topicId)}>Practice quiz</button>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
      {swot.unassessed.length > 0 && (
        <p className="muted small full">Not yet assessed: {swot.unassessed.map((u) => u.topic).join(', ')}</p>
      )}
    </div>
  );
}
