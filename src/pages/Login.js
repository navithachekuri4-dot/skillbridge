// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('// invalid credentials');
    }
    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>skill_bridge/</div>
        <div style={styles.subtitle}>authenticate to continue</div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'authenticating...' : '→ sign in'}
          </button>
        </div>

        <div style={styles.footer}>
          no account?{' '}
          <Link to="/signup" style={styles.link}>create one</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: '100vh',
    background: '#0d1117',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: 8,
    padding: 36,
    width: 360,
    animation: 'fadeIn 0.3s ease',
  },
  title: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 18,
    fontWeight: 700,
    color: '#e6edf3',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#6e7681',
    marginBottom: 28,
  },
  error: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#f85149',
    background: '#f8514911',
    border: '1px solid #f8514933',
    borderRadius: 4,
    padding: '8px 12px',
    marginBottom: 16,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
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
    padding: '10px 12px',
    color: '#e6edf3',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    outline: 'none',
  },
  btn: {
    background: '#388bfd',
    border: 'none',
    borderRadius: 4,
    padding: '10px',
    color: '#fff',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
  },
  footer: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#6e7681',
    marginTop: 20,
    textAlign: 'center',
  },
  link: {
    color: '#388bfd',
    textDecoration: 'none',
  },
};
