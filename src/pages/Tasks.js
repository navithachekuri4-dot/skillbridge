// src/pages/Tasks.js
import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { useSkills } from '../context/SkillsContext';

// Auto-generate learning tasks from gap analysis
function generateTasks(gaps, skills) {
  const tasks = [];
  gaps.forEach(gap => {
    tasks.push({
      id: `gap-${gap.name}`,
      title: `Learn ${gap.name}`,
      desc: `Found in ${gap.freq}% of matched JDs. Close this gap to improve readiness.`,
      priority: gap.freq > 60 ? 'high' : gap.freq > 40 ? 'medium' : 'low',
      done: false,
      source: 'auto',
    });
  });
  // Add tasks for weakest skills
  const weak = [...skills].sort((a, b) => a.level - b.level).slice(0, 3);
  weak.forEach(s => {
    tasks.push({
      id: `skill-${s.id}`,
      title: `Improve ${s.name} (currently ${s.level}%)`,
      desc: `Practice and build a project using ${s.name} to hit 70%+`,
      priority: s.level < 30 ? 'high' : 'medium',
      done: false,
      source: 'auto',
    });
  });
  return tasks;
}

const PRIORITY_COLORS = {
  high: { color: '#f85149', bg: '#f8514922', border: '#f8514433' },
  medium: { color: '#d29922', bg: '#d2992222', border: '#d2992244' },
  low: { color: '#8b949e', bg: '#21262d', border: '#30363d' },
};

export default function Tasks() {
  const { criticalGaps, skills } = useSkills();
  const [customTitle, setCustomTitle] = useState('');
  const [customPriority, setCustomPriority] = useState('medium');
  const [manualTasks, setManualTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState(new Set());

  const autoTasks = useMemo(() => generateTasks(criticalGaps, skills), [criticalGaps, skills]);
  const allTasks = useMemo(() => [...autoTasks, ...manualTasks], [autoTasks, manualTasks]);

  function addTask() {
    if (!customTitle.trim()) return;
    setManualTasks(prev => [...prev, {
      id: `manual-${Date.now()}`,
      title: customTitle,
      desc: 'Custom task',
      priority: customPriority,
      done: false,
      source: 'manual',
    }]);
    setCustomTitle('');
  }

  function toggleDone(id) {
    setDoneTasks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function deleteManual(id) {
    setManualTasks(prev => prev.filter(t => t.id !== id));
  }

  const pending = allTasks.filter(t => !doneTasks.has(t.id));
  const done = allTasks.filter(t => doneTasks.has(t.id));

  return (
    <Layout>
      <div style={styles.page}>
        <div style={styles.topbar}>
          <div style={styles.filepath}>// tasks.db</div>
          <div style={styles.pageTitle}>Learning Tasks</div>
        </div>

        {/* Quick add */}
        <div style={styles.addRow}>
          <input
            style={styles.input}
            placeholder="add a task..."
            value={customTitle}
            onChange={e => setCustomTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
          />
          <select
            style={styles.select}
            value={customPriority}
            onChange={e => setCustomPriority(e.target.value)}
          >
            <option value="high">high</option>
            <option value="medium">medium</option>
            <option value="low">low</option>
          </select>
          <button style={styles.addBtn} onClick={addTask}>+ add</button>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <span style={styles.stat}>{pending.length} pending</span>
          <span style={styles.statDivider}>·</span>
          <span style={{ ...styles.stat, color: '#3fb950' }}>{done.length} done</span>
        </div>

        {/* Task list */}
        <div style={styles.list}>
          {pending.map(task => {
            const p = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;
            return (
              <div key={task.id} style={styles.taskRow}>
                <button
                  style={styles.checkbox}
                  onClick={() => toggleDone(task.id)}
                  title="mark done"
                >
                  ○
                </button>
                <div style={styles.taskInfo}>
                  <div style={styles.taskTitle}>{task.title}</div>
                  <div style={styles.taskDesc}>{task.desc}</div>
                </div>
                <div style={styles.badges}>
                  <div style={{
                    ...styles.badge,
                    color: p.color,
                    background: p.bg,
                    border: `1px solid ${p.border}`,
                  }}>
                    {task.priority}
                  </div>
                  {task.source === 'auto' && (
                    <div style={styles.autoBadge}>auto</div>
                  )}
                </div>
                {task.source === 'manual' && (
                  <button style={styles.delBtn} onClick={() => deleteManual(task.id)}>✕</button>
                )}
              </div>
            );
          })}
        </div>

        {/* Done section */}
        {done.length > 0 && (
          <div>
            <div style={styles.doneHeader}>COMPLETED ({done.length})</div>
            {done.map(task => (
              <div key={task.id} style={{ ...styles.taskRow, opacity: 0.4 }}>
                <button style={styles.checkbox} onClick={() => toggleDone(task.id)}>✓</button>
                <div style={styles.taskInfo}>
                  <div style={{ ...styles.taskTitle, textDecoration: 'line-through' }}>{task.title}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {allTasks.length === 0 && (
          <div style={styles.empty}>
            run a JD analysis or add skills to generate tasks
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  page: { padding: 24, display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.3s ease' },
  topbar: { display: 'flex', flexDirection: 'column', gap: 4 },
  filepath: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6e7681' },
  pageTitle: { fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: '#e6edf3' },
  addRow: { display: 'flex', gap: 8 },
  input: {
    flex: 1, background: '#1c2128', border: '1px solid #30363d', borderRadius: 4,
    padding: '9px 14px', color: '#e6edf3',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 13, outline: 'none',
  },
  select: {
    background: '#1c2128', border: '1px solid #30363d', borderRadius: 4,
    padding: '9px 12px', color: '#8b949e',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, outline: 'none',
  },
  addBtn: {
    background: '#388bfd', border: 'none', borderRadius: 4,
    padding: '9px 18px', color: '#fff',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, cursor: 'pointer',
  },
  statsRow: { display: 'flex', gap: 8, alignItems: 'center' },
  stat: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6e7681' },
  statDivider: { color: '#30363d' },
  list: { display: 'flex', flexDirection: 'column', gap: 6 },
  taskRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    background: '#1c2128', border: '1px solid #30363d', borderRadius: 6, padding: '12px 16px',
  },
  checkbox: {
    background: 'none', border: 'none', color: '#6e7681',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 14, cursor: 'pointer', flexShrink: 0,
  },
  taskInfo: { flex: 1 },
  taskTitle: { fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#e6edf3', fontWeight: 600 },
  taskDesc: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6e7681', marginTop: 3 },
  badges: { display: 'flex', gap: 6 },
  badge: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '3px 8px', borderRadius: 4 },
  autoBadge: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '3px 8px', borderRadius: 4,
    background: '#388bfd22', color: '#388bfd', border: '1px solid #388bfd44',
  },
  delBtn: {
    background: 'none', border: 'none', color: '#6e7681',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, cursor: 'pointer',
  },
  doneHeader: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#6e7681', letterSpacing: '0.08em', margin: '8px 0 8px' },
  empty: { fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#6e7681', textAlign: 'center', padding: '40px 0' },
};
