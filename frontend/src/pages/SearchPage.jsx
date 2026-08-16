import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SearchBar from '../components/SearchBar';

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="7" />
    <line x1="17" y1="17" x2="22" y2="22" />
    <path d="M8 11h6M11 8v6" />
  </svg>
);

const SearchPage = () => {
  const { logout } = useAuth();
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  return (
    <div className="search-page">
      <nav className="search-nav">
        <div className="nav-brand"><LogoIcon /> Queryx</div>
        <div className="nav-user">
          <Link to="/about" className="nav-logout-btn" style={{ textDecoration: 'none' }}>
            About
          </Link>
          {username && (
            <span className="nav-username">
              Hi, <span>{username}</span>
            </span>
          )}
          <button className="nav-logout-btn" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <main className="search-hero">
        <h1 className="search-hero-title">
          What are you<br /><em>looking for?</em>
        </h1>
        <p className="search-hero-sub">Personalised · Intelligent · Instant</p>
        <SearchBar userId={userId} />
        <div className="search-hint">powered by your history + global trends</div>
      </main>
    </div>
  );
};

export default SearchPage;