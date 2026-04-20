// src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('// all fields required');
      return;
    }
    if (password.length < 6) {
      setError('// password must be 6+ chars');
      return;
    }
    setLoading(true);
    try {
      await signup(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError('// ' + (err.message || 'signup failed'));
    }
    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>skill_bridge/</div>
        <div style={styles.subtitle}>create your account</div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>display name</label>
            <input
              style={styles.input}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="your name"
              autoFocus
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="min 6 characters"
            />
          </div>
          <button
            style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'creating account...' : '→ create account'}
          </button>
        </div>

        <div style={styles.footer}>
          already have an account?{' '}
          <Link to="/login" style={styles.link}>sign in</Link>
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
