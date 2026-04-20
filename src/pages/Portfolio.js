// src/pages/Portfolio.js
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useSkills } from '../context/SkillsContext';
import { saveProfile } from '../services/userService';

export default function Portfolio() {
  const { user, profile } = useAuth();
  const { skills, avgLevel } = useSkills();
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(profile?.bio || '');
  const [github, setGithub] = useState(profile?.github || '');
  const [linkedin, setLinkedin] = useState(profile?.linkedin || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await saveProfile(user.uid, { bio, github, linkedin });
    setSaving(false);
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 2000);
  }

  const topSkills = [...skills].sort((a, b) => b.level - a.level).slice(0, 6);

  return (
    <Layout>
      <div style={styles.page}>
        <div style={styles.topbar}>
          <div style={styles.filepath}>// portfolio.json</div>
          <div style={styles.pageTitle}>Portfolio</div>
        </div>

        {/* Profile card */}
        <div style={styles.profileCard}>
          <div style={styles.avatar}>
            {(profile?.displayName || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div style={styles.profileInfo}>
            <div style={styles.name}>{profile?.displayName || 'Developer'}</div>
            <div style={styles.email}>{user?.email}</div>
            {saved && <div style={styles.savedMsg}>✓ profile saved</div>}
          </div>
          <div style={styles.readiness}>
            <div style={styles.readinessNum}>{avgLevel || 68}%</div>
            <div style={styles.readinessLbl}>readiness</div>
          </div>
          <button
            style={styles.editBtn}
            onClick={() => setEditMode(e => !e)}
          >
            {editMode ? 'cancel' : 'edit profile'}
          </button>
        </div>

        {/* Edit form */}
        {editMode && (
          <div style={styles.editCard}>
            <div style={styles.panelLabel}>EDIT_PROFILE</div>
            <div style={styles.field}>
              <label style={styles.label}>bio</label>
              <textarea
                style={{ ...styles.input, resize: 'vertical' }}
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Brief intro about yourself..."
              />
            </div>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>github username</label>
                <input
                  style={styles.input}
                  value={github}
                  onChange={e => setGithub(e.target.value)}
                  placeholder="your-username"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>linkedin</label>
                <input
                  style={styles.input}
                  value={linkedin}
                  onChange={e => setLinkedin(e.target.value)}
                  placeholder="linkedin.com/in/..."
                />
              </div>
            </div>
            <button
              style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1 }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'saving...' : 'save profile'}
            </button>
          </div>
        )}

        {/* Bio display */}
        {!editMode && (profile?.bio || github || linkedin) && (
          <div style={styles.bioCard}>
            {profile?.bio && <p style={styles.bioText}>{profile.bio}</p>}
            <div style={styles.links}>
              {profile?.github && (
                <a href={`https://github.com/${profile.github}`} style={styles.link} target="_blank" rel="noopener noreferrer">
                  ⟶ github/{profile.github}
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} style={styles.link} target="_blank" rel="noopener noreferrer">
                  ⟶ linkedin
                </a>
              )}
            </div>
          </div>
        )}

        {/* Top skills display */}
        <div style={styles.panel}>
          <div style={styles.panelLabel}>TOP_SKILLS[]</div>
          {topSkills.length === 0 ? (
            <div style={styles.empty}>add skills in skills.db to populate your portfolio</div>
          ) : (
            <div style={styles.chipGrid}>
              {topSkills.map(s => (
                <div key={s.id} style={styles.chip}>
                  <span style={styles.chipName}>{s.name}</span>
                  <span style={styles.chipLevel}>{s.level}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  page: { padding: 24, display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.3s ease' },
  topbar: { display: 'flex', flexDirection: 'column', gap: 4 },
  filepath: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6e7681' },
  pageTitle: { fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: '#e6edf3' },
  profileCard: {
    background: '#1c2128', border: '1px solid #30363d', borderRadius: 6,
    padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20,
  },
  avatar: {
    width: 52, height: 52, borderRadius: '50%', background: '#388bfd',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: '#fff',
    flexShrink: 0,
  },
  profileInfo: { flex: 1 },
  name: { fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: '#e6edf3' },
  email: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6e7681', marginTop: 4 },
  savedMsg: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#3fb950', marginTop: 4 },
  readiness: { textAlign: 'center', marginRight: 8 },
  readinessNum: { fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700, color: '#388bfd' },
  readinessLbl: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#6e7681' },
  editBtn: {
    background: 'none', border: '1px solid #30363d', borderRadius: 4,
    padding: '7px 14px', color: '#8b949e',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer',
  },
  editCard: { background: '#1c2128', border: '1px solid #388bfd44', borderRadius: 6, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 },
  panelLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#6e7681', letterSpacing: '0.08em' },
  field: { flex: 1, display: 'flex', flexDirection: 'column', gap: 6 },
  row: { display: 'flex', gap: 16 },
  label: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#8b949e' },
  input: {
    background: '#0d1117', border: '1px solid #30363d', borderRadius: 4,
    padding: '8px 12px', color: '#e6edf3',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 13, outline: 'none', width: '100%',
  },
  saveBtn: {
    alignSelf: 'flex-end', background: '#388bfd', border: 'none', borderRadius: 4,
    padding: '8px 18px', color: '#fff',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, cursor: 'pointer',
  },
  bioCard: { background: '#1c2128', border: '1px solid #30363d', borderRadius: 6, padding: 20 },
  bioText: { fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#8b949e', lineHeight: 1.7, marginBottom: 12 },
  links: { display: 'flex', gap: 20 },
  link: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#388bfd', textDecoration: 'none' },
  panel: { background: '#1c2128', border: '1px solid #30363d', borderRadius: 6, padding: 20 },
  empty: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6e7681', marginTop: 12 },
  chipGrid: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  chip: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#21262d', border: '1px solid #30363d', borderRadius: 4,
    padding: '6px 12px',
  },
  chipName: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#e6edf3' },
  chipLevel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#388bfd' },
};
