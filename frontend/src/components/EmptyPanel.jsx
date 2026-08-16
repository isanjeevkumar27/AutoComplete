import React from 'react';

const ClockIcon = () => (
   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
   </svg>
);

const FireIcon = () => (
   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z" />
   </svg>
);

const ArrowIcon = () => (
   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
   </svg>
);

const Shimmer = () => (
   <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 20px' }}>
      {[70, 50, 85, 60].map((w, i) => (
         <div key={i} className="shimmer-bar" style={{ width: `${w}%` }} />
      ))}
   </div>
);

const EmptyPanel = ({ recentSearches, trendingSearches, panelLoading, onSelect }) => {
   const hasRecent = recentSearches.length > 0;
   const hasTrending = trendingSearches.length > 0;

   if (panelLoading) return (
      <div className="empty-panel">
         <Shimmer />
      </div>
   );

   if (!hasRecent && !hasTrending) return (
      <div className="empty-panel empty-panel--empty">
         <span className="empty-panel-hint">Start typing to search</span>
      </div>
   );

   return (
      <div className="empty-panel">
         {/* Recent Searches */}
         {hasRecent && (
            <div className="panel-section">
               <div className="panel-section-header">
                  <span className="panel-section-icon" style={{ color: 'var(--text-muted)' }}><ClockIcon /></span>
                  <span className="panel-section-label">Recent</span>
               </div>
               {recentSearches.map((item, i) => (
                  <div key={i} className="panel-item" onClick={() => onSelect(item.query)}>
                     <span className="panel-item-icon" style={{ color: 'var(--text-muted)' }}><ClockIcon /></span>
                     <span className="panel-item-text">{item.query}</span>
                     <span className="panel-item-arrow"><ArrowIcon /></span>
                  </div>
               ))}
            </div>
         )}

         {hasRecent && hasTrending && <div className="panel-divider" />}

         {/* Trending Searches */}
         {hasTrending && (
            <div className="panel-section">
               <div className="panel-section-header">
                  <span className="panel-section-icon" style={{ color: 'var(--gold)' }}><FireIcon /></span>
                  <span className="panel-section-label">Trending <span className="panel-section-sublabel">· last 90 min</span></span>
               </div>
               {trendingSearches.map((item, i) => (
                  <div key={i} className="panel-item" onClick={() => onSelect(item.query)}>
                     <span className="panel-item-rank" style={{
                        color: i < 3 ? 'var(--gold)' : 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        minWidth: 16,
                     }}>
                        {i < 3 ? '🔥' : `${i + 1}`}
                     </span>
                     <span className="panel-item-text">{item.query}</span>
                     <span className="panel-item-count">{item.count}</span>
                  </div>
               ))}
            </div>
         )}

         <div className="panel-footer">
            <span>Trending is calculated from selections in the last 90 minutes</span>
         </div>
      </div>
   );
};

export default EmptyPanel;