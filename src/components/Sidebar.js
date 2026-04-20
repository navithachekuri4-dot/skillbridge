// src/components/Sidebar.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'overview', path: '/dashboard' },
  { label: 'skills.db', path: '/skills' },
  { label: 'ai_engine', path: '/analyze' },
];

const reportItems = [
  { label: 'analytics', path: '/analytics' },
  { label: 'portfolio', path: '/portfolio' },
  { label: 'tasks', path: '/tasks' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, profile } = useAuth();

  const isActive = (path) => location.pathname === path;

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <aside style={styles.sidebar}>
      {/* Project name */}
      <div style={styles.projectBlock}>
        <div style={styles.projectName}>skill_bridge/</div>
        <div style={styles.projectVersion}>
          v2.4.1 · {profile?.instance || 'hyd'} instance
        </div>
      </div>

      {/* Workspace nav */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>WORKSPACE</div>
        {navItems.map(item => (
          <button
            key={item.path}
            style={{
              ...styles.navItem,
              ...(isActive(item.path) ? styles.navActive : {}),
            }}
            onClick={() => navigate(item.path)}
          >
            <span style={styles.dot(isActive(item.path))} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Reports nav */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>REPORTS</div>
        {reportItems.map(item => (
          <button
            key={item.path}
            style={{
              ...styles.navItem,
              ...(isActive(item.path) ? styles.navActive : {}),
            }}
            onClick={() => navigate(item.path)}
          >
            <span style={styles.dot(isActive(item.path))} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Bottom logout */}
      <div style={styles.bottom}>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          ⎋ logout
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 220,
    minWidth: 220,
    background: '#0d1117',
    borderRight: '1px solid #21262d',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: '20px 0',
  },
  projectBlock: {
    padding: '0 20px 20px',
    borderBottom: '1px solid #21262d',
    marginBottom: 8,
  },
  projectName: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    fontWeight: 600,
    color: '#e6edf3',
    letterSpacing: '-0.3px',
  },
  projectVersion: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#6e7681',
    marginTop: 4,
  },
  section: {
    padding: '12px 0',
    borderBottom: '1px solid #21262d',
  },
  sectionLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: '#6e7681',
    letterSpacing: '0.08em',
    padding: '0 20px 8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '7px 20px',
    background: 'none',
    border: 'none',
    color: '#8b949e',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'color 0.15s',
  },
  navActive: {
    color: '#e6edf3',
    background: '#161b22',
  },
  dot: (active) => ({
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: active ? '#388bfd' : '#30363d',
    flexShrink: 0,
  }),
  bottom: {
    marginTop: 'auto',
    padding: '16px 20px',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid #30363d',
    color: '#6e7681',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    padding: '6px 12px',
    borderRadius: 4,
    cursor: 'pointer',
    width: '100%',
  },
};
