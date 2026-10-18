// Minimal, safe markdown renderer (headings, bullets, **bold**, `code`). No HTML injection.
function inline(text) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    return part;
  });
}

export default function Markdown({ source }) {
  const out = [];
  let bullets = [];
  const flush = () => {
    if (bullets.length) out.push(<ul key={`ul${out.length}`}>{bullets}</ul>);
    bullets = [];
  };
  source.split('\n').forEach((line, i) => {
    if (line.startsWith('- ')) return bullets.push(<li key={i}>{inline(line.slice(2))}</li>);
    flush();
    if (line.startsWith('# ')) out.push(<h2 key={i}>{inline(line.slice(2))}</h2>);
    else if (line.startsWith('## ')) out.push(<h3 key={i}>{inline(line.slice(3))}</h3>);
    else if (line.trim()) out.push(<p key={i}>{inline(line)}</p>);
  });
  flush();
  return <div className="prose">{out}</div>;
}
