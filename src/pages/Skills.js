// src/pages/Skills.js
import React, { useState, useMemo, useCallback } from 'react';
import Layout from '../components/Layout';
import { useSkills } from '../context/SkillsContext';

const CATEGORIES = ['Frontend', 'Backend', 'DevOps', 'DSA', 'System Design', 'Other'];

export default function Skills() {
  const { skills, createSkill, editSkill, removeSkill } = useSkills();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name: '', level: 50, category: 'Frontend' });
  const [saving, setSaving] = useState(false);

  // Filtered skills — useMemo so it doesn't recompute every render
  const filtered = useMemo(() => {
    if (filter === 'all') return skills;
    return skills.filter(s => s.category === filter);
  }, [skills, filter]);

  const resetForm = useCallback(() => {
    setForm({ name: '', level: 50, category: 'Frontend' });
    setEditingId(null);
    setShowForm(false);
  }, []);

  function startEdit(skill) {
    setForm({ name: skill.name, level: skill.level, category: skill.category || 'Frontend' });
    setEditingId(skill.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await editSkill(editingId, form);
      } else {
        await createSkill(form);
      }
      resetForm();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (window.confirm('Delete this skill?')) {
      await removeSkill(id);
    }
  }

  function levelColor(level) {
    if (level >= 70) return '#3fb950';
    if (level >= 40) return '#d29922';
    return '#f85149';
  }

  return (
    <Layout>
      <div style={styles.page}>
        {/* Header */}
        <div style={styles.topbar}>
          <div>
            <div style={styles.filepath}>// skills.db</div>
            <div style={styles.pageTitle}>Skill Registry</div>
          </div>
          <button style={styles.addBtn} onClick={() => { resetForm(); setShowForm(true); }}>
            + add_skill()
          </button>
        </div>

        {/* Filter tabs */}
        <div style={styles.filters}>
          {['all', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              style={{ ...styles.filterBtn, ...(filter === cat ? styles.filterActive : {}) }}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Add / Edit form */}
        {showForm && (
          <div style={styles.formCard}>
            <div style={styles.formTitle}>
              {editingId ? '// edit_skill' : '// new_skill'}
            </div>
            <div style={styles.formRow}>
              <div style={styles.field}>
                <label style={styles.label}>skill name</label>
                <input
                  style={styles.input}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. TypeScript"
                  autoFocus
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>category</label>
                <select
                  style={styles.input}
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>
                proficiency level — <span style={{ color: levelColor(form.level) }}>{form.level}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={form.level}
                onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))}
                style={styles.slider}
              />
            </div>
            <div style={styles.formActions}>
              <button style={styles.cancelBtn} onClick={resetForm}>cancel</button>
              <button
                style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1 }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'saving...' : editingId ? 'update' : 'save'}
              </button>
            </div>
          </div>
        )}

        {/* Skill list */}
        {filtered.length === 0 ? (
          <div style={styles.empty}>
            no skills found · <span
              style={{ color: '#388bfd', cursor: 'pointer' }}
              onClick={() => setShowForm(true)}
            >add one</span>
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map(skill => (
              <div key={skill.id} style={styles.skillRow}>
                <div style={styles.skillLeft}>
                  <div style={styles.skillName}>{skill.name}</div>
                  <div style={styles.skillMeta}>
                    <span style={styles.catBadge}>{skill.category || 'Other'}</span>
                  </div>
                </div>
                <div style={styles.skillCenter}>
                  <div style={styles.barTrack}>
                    <div style={{
                      ...styles.barFill,
                      width: `${skill.level}%`,
                      background: levelColor(skill.level),
                    }} />
                  </div>
                  <span style={{ ...styles.pct, color: levelColor(skill.level) }}>
                    {skill.level}%
                  </span>
                </div>
                <div style={styles.actions}>
                  <button style={styles.editBtn} onClick={() => startEdit(skill)}>edit</button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(skill.id)}>del</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  page: {
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    animation: 'fadeIn 0.3s ease',
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  filepath: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#6e7681',
    marginBottom: 4,
  },
  pageTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 22,
    fontWeight: 700,
    color: '#e6edf3',
  },
  addBtn: {
    background: '#388bfd',
    border: 'none',
    borderRadius: 4,
    padding: '8px 16px',
    color: '#fff',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterBtn: {
    background: 'none',
    border: '1px solid #30363d',
    borderRadius: 4,
    padding: '5px 12px',
    color: '#6e7681',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    cursor: 'pointer',
  },
  filterActive: {
    border: '1px solid #388bfd',
    color: '#388bfd',
    background: '#388bfd11',
  },
  formCard: {
    background: '#1c2128',
    border: '1px solid #388bfd44',
    borderRadius: 6,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  formTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#6e7681',
  },
  formRow: {
    display: 'flex',
    gap: 16,
  },
  field: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#8b949e',
  },
  input: {
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: 4,
    padding: '8px 12px',
    color: '#e6edf3',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    outline: 'none',
  },
  slider: {
    width: '100%',
    accentColor: '#388bfd',
  },
  formActions: {
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    background: 'none',
    border: '1px solid #30363d',
    borderRadius: 4,
    padding: '7px 16px',
    color: '#8b949e',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    cursor: 'pointer',
  },
  saveBtn: {
    background: '#388bfd',
    border: 'none',
    borderRadius: 4,
    padding: '7px 16px',
    color: '#fff',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    cursor: 'pointer',
  },
  empty: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    color: '#6e7681',
    padding: '40px 0',
    textAlign: 'center',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  skillRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: '#1c2128',
    border: '1px solid #30363d',
    borderRadius: 6,
    padding: '12px 16px',
  },
  skillLeft: {
    width: 180,
    flexShrink: 0,
  },
  skillName: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    color: '#e6edf3',
    fontWeight: 600,
  },
  skillMeta: {
    marginTop: 4,
  },
  catBadge: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: '#6e7681',
    background: '#21262d',
    padding: '2px 6px',
    borderRadius: 3,
  },
  skillCenter: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  barTrack: {
    flex: 1,
    height: 4,
    background: '#21262d',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.4s ease',
  },
  pct: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    width: 40,
    textAlign: 'right',
  },
  actions: {
    display: 'flex',
    gap: 6,
  },
  editBtn: {
    background: 'none',
    border: '1px solid #30363d',
    borderRadius: 4,
    padding: '4px 10px',
    color: '#8b949e',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    cursor: 'pointer',
  },
  deleteBtn: {
    background: 'none',
    border: '1px solid #f8514933',
    borderRadius: 4,
    padding: '4px 10px',
    color: '#f85149',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    cursor: 'pointer',
  },
};
