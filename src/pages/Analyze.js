// src/pages/Analyze.js
import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { useSkills } from '../context/SkillsContext';
import { useDebounce } from '../hooks/useDebounce';

export default function Analyze() {
  const [jdTitle, setJdTitle] = useState('');
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const { runAnalysis, analyses } = useSkills();
  const textareaRef = useRef(null);

  // Debounce so word count doesn't flicker
  const debouncedText = useDebounce(jdText, 200);
  const wordCount = debouncedText.trim().split(/\s+/).filter(Boolean).length;

  async function handleAnalyze() {
    if (!jdText.trim()) return;
    setRunning(true);
    setResult(null);
    try {
      const res = await runAnalysis(jdText, jdTitle || 'Untitled JD');
      setResult(res);
    } catch (err) {
      console.error(err);
    }
    setRunning(false);
  }

  function statusBadge(pct) {
    if (pct >= 70) return { label: 'missing', color: '#f85149', bg: '#f8514922' };
    if (pct >= 50) return { label: 'beginner', color: '#d29922', bg: '#d2992222' };
    return { label: 'low priority', color: '#8b949e', bg: '#21262d' };
  }

  return (
    <Layout>
      <div style={styles.page}>
        <div style={styles.topbar}>
          <div>
            <div style={styles.filepath}>// ai_engine.ts</div>
            <div style={styles.pageTitle}>JD Gap Analyzer</div>
          </div>
        </div>

        <div style={styles.cols}>
          {/* Input side */}
          <div style={styles.inputSide}>
            <div style={styles.panel}>
              <div style={styles.panelLabel}>PASTE_JOB_DESCRIPTION</div>
              <input
                style={styles.titleInput}
                placeholder="Job title (e.g. Flipkart SDE-1)"
                value={jdTitle}
                onChange={e => setJdTitle(e.target.value)}
              />
              <textarea
                ref={textareaRef}
                style={styles.textarea}
                placeholder="Paste the full job description here..."
                value={jdText}
                onChange={e => setJdText(e.target.value)}
                rows={14}
              />
              <div style={styles.textareaFooter}>
                <span style={styles.wordCount}>{wordCount} words</span>
                <button
                  style={{
                    ...styles.runBtn,
                    opacity: running || !jdText.trim() ? 0.5 : 1,
                    cursor: running || !jdText.trim() ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleAnalyze}
                  disabled={running || !jdText.trim()}
                >
                  {running ? '▶ analyzing...' : '▶ run_analysis()'}
                </button>
              </div>
            </div>

            {/* Past analyses */}
            {analyses.length > 0 && (
              <div style={styles.panel}>
                <div style={styles.panelLabel}>PAST_ANALYSES[]</div>
                <div style={{ marginTop: 12 }}>
                  {analyses.slice(0, 4).map((a, i) => (
                    <div key={i} style={styles.historyRow}>
                      <span style={styles.historyTitle}>{a.jdTitle}</span>
                      <span style={styles.historyGaps}>{(a.gaps || []).length} gaps</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Result side */}
          <div style={styles.resultSide}>
            {running && (
              <div style={styles.panel}>
                <div style={styles.scanning}>
                  <div style={styles.scanLine}>scanning keywords...</div>
                  <div style={styles.scanLine}>matching your skill profile...</div>
                  <div style={styles.scanLine}>computing gaps...</div>
                </div>
              </div>
            )}

            {result && !running && (
              <div style={styles.panel}>
                <div style={styles.resultHeader}>
                  <div style={styles.panelLabel}>GAP_ANALYSIS.JSON</div>
                  <div style={styles.jdChip}>{result.gaps.length} gaps · {result.jdTitle}</div>
                </div>

                {result.gaps.length === 0 ? (
                  <div style={styles.noGaps}>
                    ✓ no critical gaps found for this JD
                  </div>
                ) : (
                  <div style={{ marginTop: 16 }}>
                    {result.gaps.map((gap, i) => {
                      const badge = statusBadge(gap.freq);
                      return (
                        <div key={i} style={styles.gapRow}>
                          <div style={styles.gapBar} />
                          <div style={styles.gapInfo}>
                            <div style={styles.gapName}>{gap.name}</div>
                            <div style={styles.gapFound}>found in {gap.freq}% of matched JDs</div>
                          </div>
                          <div style={{
                            ...styles.badge,
                            color: badge.color,
                            background: badge.bg,
                          }}>
                            {badge.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={styles.resultStats}>
                  <div style={styles.statItem}>
                    <span style={styles.statVal}>{result.matchedSkills}</span>
                    <span style={styles.statLbl}>keywords found</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={{ ...styles.statVal, color: '#f85149' }}>{result.gaps.length}</span>
                    <span style={styles.statLbl}>gaps identified</span>
                  </div>
                </div>
              </div>
            )}

            {!result && !running && (
              <div style={styles.emptyResult}>
                <div style={styles.emptyIcon}>⌘</div>
                <div style={styles.emptyText}>paste a job description and run analysis</div>
                <div style={styles.emptyHint}>
                  the engine checks your skill profile against JD keywords and surfaces gaps
                </div>
              </div>
            )}
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
  cols: {
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
  },
  inputSide: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  resultSide: {
    flex: 1,
  },
  panel: {
    background: '#1c2128',
    border: '1px solid #30363d',
    borderRadius: 6,
    padding: 20,
  },
  panelLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: '#6e7681',
    letterSpacing: '0.08em',
    marginBottom: 12,
  },
  titleInput: {
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: 4,
    padding: '8px 12px',
    color: '#e6edf3',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    outline: 'none',
    width: '100%',
    marginBottom: 10,
  },
  textarea: {
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: 4,
    padding: '12px',
    color: '#e6edf3',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    outline: 'none',
    width: '100%',
    resize: 'vertical',
    lineHeight: 1.6,
  },
  textareaFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  wordCount: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#6e7681',
  },
  runBtn: {
    background: '#388bfd',
    border: 'none',
    borderRadius: 4,
    padding: '8px 18px',
    color: '#fff',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    fontWeight: 600,
  },
  historyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #21262d',
  },
  historyTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: '#e6edf3',
  },
  historyGaps: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#f85149',
  },
  scanning: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: '20px 0',
  },
  scanLine: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: '#3fb950',
    animation: 'fadeIn 0.5s ease',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jdChip: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    background: '#f8514922',
    color: '#f85149',
    border: '1px solid #f8514444',
    borderRadius: 4,
    padding: '3px 8px',
  },
  gapRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid #21262d',
  },
  gapBar: {
    width: 3,
    height: 32,
    background: '#f85149',
    borderRadius: 2,
    flexShrink: 0,
  },
  gapInfo: { flex: 1 },
  gapName: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    color: '#e6edf3',
    fontWeight: 600,
  },
  gapFound: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: '#6e7681',
    marginTop: 2,
  },
  badge: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    padding: '3px 8px',
    borderRadius: 4,
  },
  resultStats: {
    display: 'flex',
    gap: 24,
    marginTop: 20,
    paddingTop: 16,
    borderTop: '1px solid #21262d',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  statVal: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 22,
    fontWeight: 700,
    color: '#3fb950',
  },
  statLbl: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: '#6e7681',
  },
  noGaps: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    color: '#3fb950',
    padding: '20px 0',
  },
  emptyResult: {
    background: '#1c2128',
    border: '1px solid #30363d',
    borderRadius: 6,
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 28,
    color: '#30363d',
  },
  emptyText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    color: '#6e7681',
  },
  emptyHint: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#484f58',
    maxWidth: 300,
    lineHeight: 1.6,
  },
};
