import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="7" />
    <line x1="17" y1="17" x2="22" y2="22" />
    <path d="M8 11h6M11 8v6" />
  </svg>
);

const LoginPage = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="auth-page">
      {/* ── Left: Form Panel ── */}
      <div className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-brand-mark">
            <div className="auth-brand-icon"><LogoIcon /></div>
            <span className="auth-brand-name">Queryx</span>
          </div>
        </div>

        <div style={{ marginBottom: 36 }}>
          <h1 className="auth-headline">
            Welcome<br /><em>back.</em>
          </h1>
          <p className="auth-subtext">
            Your search history and personalised suggestions are waiting for you.
          </p>
        </div>

        {error && (
          <div className="auth-error-banner" style={{ marginBottom: 16 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-block">
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="auth-btn-loading">
                <span className="spinner" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div style={{ marginTop: 20 }}>
          <div className="auth-divider" />
          <p className="auth-footer-text" style={{ marginTop: 16 }}>
            No account yet?{' '}
            <Link to="/signup" className="auth-link">Create one →</Link>
          </p>
        </div>
      </div>

      {/* ── Right: Visual Panel ── */}
      <div className="auth-panel-right">
        <div className="auth-visual">
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: 32,
          }}>
            <em style={{ color: 'var(--gold-light)' }}>Intelligent</em><br />
            search,<br />built for you.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '⚡', label: 'Real-time autocomplete', desc: 'C++ trie engine, sub-millisecond' },
              { icon: '🧠', label: 'Personal history', desc: 'Suggestions shaped by your queries' },
              { icon: '✏️', label: 'Spell correction', desc: 'Levenshtein distance fallback' },
            ].map((f) => (
              <div key={f.label} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '14px 16px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              }}>
                <span style={{ fontSize: 18 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
