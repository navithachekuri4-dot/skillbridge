// src/pages/Analytics.js
import React, { useMemo } from 'react';
import Layout from '../components/Layout';
import { useSkills } from '../context/SkillsContext';

export default function Analytics() {
  const { skills, analyses, streak } = useSkills();

  const avgLevel = useMemo(() => {
    if (!skills.length) return 0;
    return Math.round(skills.reduce((a, s) => a + (s.level || 0), 0) / skills.length);
  }, [skills]);

  const byCategory = useMemo(() => {
    const map = {};
    skills.forEach(s => {
      const cat = s.category || 'Other';
      if (!map[cat]) map[cat] = { total: 0, count: 0 };
      map[cat].total += s.level || 0;
      map[cat].count++;
    });
    return Object.entries(map).map(([name, v]) => ({
      name,
      avg: Math.round(v.total / v.count),
      count: v.count,
    }));
  }, [skills]);

  const topSkills = useMemo(() => (
    [...skills].sort((a, b) => b.level - a.level).slice(0, 5)
  ), [skills]);

  const weakSkills = useMemo(() => (
    [...skills].sort((a, b) => a.level - b.level).slice(0, 5)
  ), [skills]);

  function levelColor(l) {
    if (l >= 70) return '#3fb950';
    if (l >= 40) return '#d29922';
    return '#f85149';
  }

  return (
    <Layout>
      <div style={styles.page}>
        <div style={styles.topbar}>
          <div style={styles.filepath}>// analytics.ts</div>
          <div style={styles.pageTitle}>Analytics</div>
        </div>

        {/* Summary cards */}
        <div style={styles.statRow}>
          {[
            { label: 'AVG PROFICIENCY', value: `${avgLevel}%`, color: '#388bfd' },
            { label: 'SKILLS LOGGED', value: skills.length, color: '#3fb950' },
            { label: 'JDs ANALYSED', value: analyses.length, color: '#d29922' },
            { label: 'ACTIVE STREAK', value: `${streak}d`, color: '#a371f7' },
          ].map(c => (
            <div key={c.label} style={styles.card}>
              <div style={styles.cardLabel}>{c.label}</div>
              <div style={{ ...styles.cardValue, color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>

        <div style={styles.cols}>
          {/* Category breakdown */}
          <div style={styles.panel}>
            <div style={styles.panelLabel}>BY_CATEGORY[]</div>
            {byCategory.length === 0 ? (
              <div style={styles.empty}>add skills to see breakdown</div>
            ) : (
              <div style={{ marginTop: 16 }}>
                {byCategory.map(cat => (
                  <div key={cat.name} style={styles.catRow}>
                    <div style={styles.catName}>{cat.name}</div>
                    <div style={styles.barTrack}>
                      <div style={{
                        ...styles.barFill,
                        width: `${cat.avg}%`,
                        background: levelColor(cat.avg),
                      }} />
                    </div>
                    <span style={{ ...styles.pct, color: levelColor(cat.avg) }}>{cat.avg}%</span>
                    <span style={styles.count}>{cat.count} skills</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.rightCol}>
            {/* Top skills */}
            <div style={styles.panel}>
              <div style={styles.panelLabel}>TOP_SKILLS[]</div>
              {topSkills.map(s => (
                <div key={s.id} style={styles.rankRow}>
                  <span style={styles.rankName}>{s.name}</span>
                  <span style={{ color: '#3fb950', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{s.level}%</span>
                </div>
              ))}
              {topSkills.length === 0 && <div style={styles.empty}>no skills yet</div>}
            </div>

            {/* Weak spots */}
            <div style={styles.panel}>
              <div style={styles.panelLabel}>WEAK_SPOTS[]</div>
              {weakSkills.map(s => (
                <div key={s.id} style={styles.rankRow}>
                  <span style={styles.rankName}>{s.name}</span>
                  <span style={{ color: '#f85149', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{s.level}%</span>
                </div>
              ))}
              {weakSkills.length === 0 && <div style={styles.empty}>no skills yet</div>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  page: {
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    animation: 'fadeIn 0.3s ease',
  },
  topbar: { display: 'flex', flexDirection: 'column', gap: 4 },
  filepath: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6e7681' },
  pageTitle: { fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: '#e6edf3' },
  statRow: { display: 'flex', gap: 16 },
  card: {
    flex: 1,
    background: '#1c2128',
    border: '1px solid #30363d',
    borderRadius: 6,
    padding: '16px 20px',
  },
  cardLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#6e7681', letterSpacing: '0.08em', marginBottom: 8 },
  cardValue: { fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 700 },
  cols: { display: 'flex', gap: 16 },
  panel: { flex: 1, background: '#1c2128', border: '1px solid #30363d', borderRadius: 6, padding: 20 },
  rightCol: { width: 260, display: 'flex', flexDirection: 'column', gap: 16 },
  panelLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#6e7681', letterSpacing: '0.08em' },
  catRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
  catName: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#e6edf3', width: 110, flexShrink: 0 },
  barTrack: { flex: 1, height: 4, background: '#21262d', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  pct: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, width: 36, textAlign: 'right', flexShrink: 0 },
  count: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#6e7681', width: 50, flexShrink: 0, textAlign: 'right' },
  rankRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #21262d' },
  rankName: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#e6edf3' },
  empty: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6e7681', padding: '16px 0' },
};
