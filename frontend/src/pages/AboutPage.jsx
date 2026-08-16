import React from 'react';
import { Link } from 'react-router-dom';

const LogoIcon = () => (
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" />
      <line x1="17" y1="17" x2="22" y2="22" />
      <path d="M8 11h6M11 8v6" />
   </svg>
);

const features = [
   { icon: '⚡', title: 'Real-time Autocomplete', desc: 'Every keystroke queries a C++ Trie engine running locally at port 8080. Results arrive in sub-millisecond time — no full-text DB scan involved.' },
   { icon: '🧠', title: 'Personalised Suggestions', desc: 'Your selected queries are stored in userSearchHistory. When you type, the engine merges your personal Trie with the global one — your frequent searches rank higher.' },
   { icon: '🌍', title: 'Global Frequency Tracking', desc: 'Every selection increments a count in the GlobalFrequency table. This drives the global Trie so popular searches surface faster for everyone.' },
   { icon: '🔥', title: 'Trending Searches', desc: 'Trending is computed from raw SearchLogs entries created in the last 90 minutes. No cron job needed — it\'s a live time-windowed query on demand.' },
   { icon: '✏️', title: 'Spell Correction', desc: 'If no prefix match is found in the Trie, the C++ SpellChecker computes Levenshtein edit distance against every known word and suggests the closest one.' },
   { icon: '🔒', title: 'Auth & Identity', desc: 'Signup hashes passwords with bcrypt before storing. Login compares the hash and returns a userId used to scope all personalised features.' },
];

const flow = [
   { title: 'You type a character', desc: 'The React SearchBar debounces 300ms then calls GET /api/search?query=&userId= — no DB writes happen here.' },
   { title: 'Node forwards to C++ engine', desc: 'The Node controller proxies the request to a Crow HTTP server at 127.0.0.1:8080 which holds the Trie in memory.' },
   { title: 'C++ merges personal + global results', desc: 'Your user Trie (lazy-loaded from DB on first request) is merged with the global Trie. Up to 5 results are returned, ranked by frequency.' },
   { title: 'Spell-check fallback', desc: 'If the Trie returns nothing, SpellChecker scans the vocabulary and returns "Did you mean: X?" for the closest match within edit distance 2.' },
   { title: 'You click a suggestion', desc: 'POST /api/search/select fires. This writes to SearchLogs (for trending), GlobalFrequency (aggregate count), and userSearchHistory (personal count).' },
   { title: 'Trending & Recent on focus', desc: 'When the search bar is focused empty, two parallel calls fetch your recent history and the live trending window — shown in the dropdown panel.' },
];

const stack = [
   { label: 'React 18', role: 'UI + routing' },
   { label: 'React Router v6', role: 'Client routing' },
   { label: 'Axios', role: 'HTTP client' },
   { label: 'Node.js + Express', role: 'REST API server' },
   { label: 'Sequelize ORM', role: 'MySQL models' },
   { label: 'MySQL', role: 'Persistent storage' },
   { label: 'C++ (Crow)', role: 'Search engine' },
   { label: 'Trie + Set', role: 'Autocomplete index' },
   { label: 'Levenshtein DP', role: 'Spell correction' },
   { label: 'bcrypt', role: 'Password hashing' },
];

const AboutPage = () => (
   <div className="about-page">
      {/* Nav */}
      <nav className="search-nav">
         <div className="nav-brand"><LogoIcon /> Queryx</div>
         <div className="nav-user">
            <Link to="/search" className="nav-logout-btn" style={{ textDecoration: 'none' }}>
               ← Back to Search
            </Link>
         </div>
      </nav>

      <div className="about-content">
         <Link to="/search" className="about-back-btn">← Back to search</Link>

         {/* Hero */}
         <div className="about-eyebrow">About Queryx</div>
         <h1 className="about-title">
            A <em>search engine</em><br />built from scratch.
         </h1>
         <p className="about-lead">
            Queryx is a full-stack personalised autocomplete system. It combines a
            C++ in-memory Trie engine with a Node.js REST API and a React frontend
            to deliver Google-style search suggestions — shaped by your personal
            history and real-time global trends.
         </p>

         {/* How it works — flow */}
         <div className="about-section">
            <div className="about-section-title">How it works</div>
            <div className="about-flow">
               {flow.map((step, i) => (
                  <div className="about-flow-step" key={i}>
                     <div className="about-flow-num">{i + 1}</div>
                     <div className="about-flow-body">
                        <div className="about-flow-title">{step.title}</div>
                        <div className="about-flow-desc">{step.desc}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Features */}
         <div className="about-section">
            <div className="about-section-title">Features</div>
            <div className="about-cards">
               {features.map((f, i) => (
                  <div className="about-card" key={i}>
                     <div className="about-card-icon">{f.icon}</div>
                     <div className="about-card-title">{f.title}</div>
                     <div className="about-card-desc">{f.desc}</div>
                  </div>
               ))}
            </div>
         </div>

         {/* Tech stack */}
         <div className="about-section">
            <div className="about-section-title">Tech Stack</div>
            <div className="about-stack">
               {stack.map((s, i) => (
                  <div className="about-stack-item" key={i}>
                     <div className="about-stack-dot" />
                     <div>
                        <div className="about-stack-label">{s.label}</div>
                        <div className="about-stack-role">{s.role}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   </div>
);

export default AboutPage;