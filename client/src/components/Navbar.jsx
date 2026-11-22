import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <Link className="brand" to="/" aria-label="Alzikrayat home">
        <span className="brand-mark">A</span>
        <span>ALZIKRAYAT</span>
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/gallery">Discover</Link>
        {user ? (
          <>
            <span className="hello">Hi, {user.firstName}</span>
            <button className="nav-action" onClick={onLogout}>Log out</button>
          </>
        ) : (
          <Link className="nav-action" to="/login">Sign in</Link>
        )}
      </div>
    </nav>
  );
}
