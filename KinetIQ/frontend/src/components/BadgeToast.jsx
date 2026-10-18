export default function BadgeToast({ badges }) {
  if (!badges?.length) return null;
  return (
    <div className="card celebrate">
      <h3>🎉 New badge{badges.length > 1 ? 's' : ''} unlocked!</h3>
      <div className="badge-row">
        {badges.map((b) => (
          <div key={b.code} className="badge earned pop" title={b.description}>
            <span>{b.icon}</span>
            <small>{b.name}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
