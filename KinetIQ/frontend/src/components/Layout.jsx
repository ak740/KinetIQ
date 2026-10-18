import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  return (
    <>
      <header className="topbar">
        <Link to="/" className="brand">⚡ Kinet<span>IQ</span></Link>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/badges">Badges</NavLink>
        </nav>
        <div className="topbar-stats">
          <span className="chip" title="Study streak">🔥 {user.streak}</span>
          <span className="chip level" title={`${user.xp} XP`}>
            Lv {user.level}
            <span className="xpbar"><i style={{ width: `${Math.round(user.progress * 100)}%` }} /></span>
          </span>
          <span className="who">{user.name.split(' ')[0]}</span>
          <button className="btn ghost small" onClick={logout}>Log out</button>
        </div>
      </header>
      <main className="container">{children}</main>
    </>
  );
}
