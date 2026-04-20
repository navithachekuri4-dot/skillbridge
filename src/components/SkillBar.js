// src/components/SkillBar.js
import React from 'react';

// Color based on skill level
function getBarColor(level) {
  if (level >= 70) return '#388bfd';
  if (level >= 40) return '#388bfd99';
  return '#f85149';
}

export default function SkillBar({ name, level }) {
  return (
    <div style={styles.row}>
      <div style={styles.name}>{name}</div>
      <div style={styles.track}>
        <div
          style={{
            ...styles.fill,
            width: `${level}%`,
            background: getBarColor(level),
            animation: 'bar-fill 0.6s ease',
          }}
        />
      </div>
      <div style={{ ...styles.pct, color: getBarColor(level) }}>{level}%</div>
    </div>
  );
}

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  name: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: '#e6edf3',
    width: 100,
    flexShrink: 0,
  },
  track: {
    flex: 1,
    height: 4,
    background: '#21262d',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.6s ease',
  },
  pct: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    width: 36,
    textAlign: 'right',
    flexShrink: 0,
  },
};
