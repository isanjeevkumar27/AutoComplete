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

const VisualCard = ({ label, bars, delay }) => (
  <div className="auth-visual-card" style={{ animationDelay: `${delay}s` }}>
    <div className="auth-visual-card-label">{label}</div>
    {bars.map((w, i) => (
      <div className="auth-visual-bar" key={i}>
        <div className="auth-visual-bar-fill" style={{ width: w, animationDelay: `${i * 0.3}s` }} />
      </div>
    ))}
  </div>
);

const SignupPage = () => {
  const { signup, loading, error } = useAuth();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
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
            Start your<br /><em>search journey.</em>
          </h1>
          <p className="auth-subtext">
            Personalised autocomplete powered by your history and global trends.
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
              <label className="auth-label">Username</label>
              <input
                className="auth-input"
                type="text"
                placeholder="your_handle"
                value={formData.username}
                onChange={handleChange('username')}
                required
                autoComplete="username"
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange('email')}
                required
                autoComplete="email"
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                className="auth-input"
                type="password"
                placeholder="min. 6 characters"
                value={formData.password}
                onChange={handleChange('password')}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="auth-btn-loading">
                <span className="spinner" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div style={{ marginTop: 20 }}>
          <div className="auth-divider" />
          <p className="auth-footer-text" style={{ marginTop: 16 }}>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in →</Link>
          </p>
        </div>
      </div>

      {/* ── Right: Visual Panel ── */}
      <div className="auth-panel-right">
        <div className="auth-visual">
          <div className="auth-visual-grid">
            <VisualCard label="react hooks" bars={['72%', '44%']} delay={0} />
            <VisualCard label="nodejs" bars={['55%']} delay={0.8} />
            <VisualCard label="sequelize" bars={['88%', '30%']} delay={1.6} />
            <VisualCard label="search history" bars={['61%', '45%', '29%']} delay={0.4} />
            <VisualCard label="trending" bars={['92%']} delay={1.2} />
            <VisualCard label="global queries — autocomplete + spell check" bars={['78%', '53%', '36%']} delay={2} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
