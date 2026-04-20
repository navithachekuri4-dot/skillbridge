// src/components/GapCard.js
import React from 'react';

// Badge colors based on status
const badgeStyles = {
  missing: { background: '#f8514922', color: '#f85149', border: '1px solid #f8514944' },
  beginner: { background: '#d2992222', color: '#d29922', border: '1px solid #d2992244' },
  learning: { background: '#388bfd22', color: '#388bfd', border: '1px solid #388bfd44' },
  default: { background: '#30363d', color: '#8b949e', border: '1px solid #30363d' },
};

function pctBadge(pct) {
  return { background: '#21262d', color: '#8b949e', border: '1px solid #30363d' };
}

export default function GapCard({ name, freq, status }) {
  // Determine badge
  let badge = status;
  let badgeStyle = badgeStyles[status] || badgeStyles.default;

  // If no status but we have a freq number, show that as badge
  const showFreq = !status && typeof freq === 'number';

  return (
    <div style={styles.row}>
      <div style={styles.bar} />
      <div style={styles.info}>
        <div style={styles.name}>{name}</div>
        <div style={styles.found}>
          found in {freq}% of matched JDs
        </div>
      </div>
      {showFreq ? (
        <div style={{ ...styles.badge, ...pctBadge() }}>{freq}%</div>
      ) : (
        <div style={{ ...styles.badge, ...badgeStyle }}>{badge}</div>
      )}
    </div>
  );
}

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 0',
    borderBottom: '1px solid #21262d',
  },
  bar: {
    width: 3,
    height: 36,
    background: '#f85149',
    borderRadius: 2,
    flexShrink: 0,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    color: '#e6edf3',
    fontWeight: 600,
  },
  found: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: '#6e7681',
    marginTop: 3,
  },
  badge: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    padding: '3px 8px',
    borderRadius: 4,
    flexShrink: 0,
  },
};
