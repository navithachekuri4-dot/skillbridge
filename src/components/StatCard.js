// src/components/StatCard.js
import React from 'react';

export default function StatCard({ label, value, unit, sub, subColor }) {
  return (
    <div style={styles.card}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>
        {value}
        <span style={styles.unit}>{unit}</span>
      </div>
      {sub && (
        <div style={{ ...styles.sub, color: subColor || '#3fb950' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: '#1c2128',
    border: '1px solid #30363d',
    borderRadius: 6,
    padding: '16px 20px',
    flex: 1,
  },
  label: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: '#6e7681',
    letterSpacing: '0.08em',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  value: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 28,
    fontWeight: 700,
    color: '#e6edf3',
    lineHeight: 1,
  },
  unit: {
    fontSize: 13,
    fontWeight: 400,
    color: '#8b949e',
    marginLeft: 3,
  },
  sub: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    marginTop: 6,
  },
};
