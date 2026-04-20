// src/components/ActivityGrid.js
import React, { useMemo } from 'react';

// Renders a GitHub-style activity heatmap for the last 28 days
export default function ActivityGrid({ activity }) {
  const grid = useMemo(() => {
    const activeDates = new Set(activity.map(a => a.date));
    const days = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      // Random level for visual richness if active
      const level = activeDates.has(key)
        ? Math.floor(Math.random() * 3) + 1
        : 0;
      days.push({ key, level });
    }
    return days;
  }, [activity]);

  function cellColor(level) {
    if (level === 0) return '#161b22';
    if (level === 1) return '#0e4429';
    if (level === 2) return '#006d32';
    return '#39d353';
  }

  return (
    <div>
      <div style={styles.label}>ACTIVITY · LAST 28D</div>
      <div style={styles.grid}>
        {grid.map(day => (
          <div
            key={day.key}
            title={day.key}
            style={{ ...styles.cell, background: cellColor(day.level) }}
          />
        ))}
      </div>
      <div style={styles.legend}>
        <span style={styles.legendText}>none</span>
        {[1, 2, 3].map(l => (
          <div key={l} style={{ ...styles.cell, background: cellColor(l) }} />
        ))}
        <span style={styles.legendText}>active</span>
      </div>
    </div>
  );
}

const styles = {
  label: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: '#6e7681',
    letterSpacing: '0.08em',
    marginBottom: 10,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 3,
  },
  cell: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: 2,
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  legendText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: '#6e7681',
  },
};
