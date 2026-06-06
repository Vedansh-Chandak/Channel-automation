import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { videoApi, channelApi } from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cv-root {
    min-height: 100vh;
    background-color: #0A0A0A;
    color: #e5e2e1;
    font-family: 'Inter', sans-serif;
    display: flex;
    overflow-x: hidden;
  }

  /* bg blobs */
  .cv-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
  }
  .cv-blob-1 {
    position: absolute; top: -10%; right: -10%;
    width: 600px; height: 600px;
    background: rgba(255,92,0,0.18);
    border-radius: 999px; filter: blur(120px);
    animation: cv-pulse 4s ease-in-out infinite;
  }
  .cv-blob-2 {
    position: absolute; bottom: -5%; left: -5%;
    width: 500px; height: 500px;
    background: rgba(255,85,59,0.08);
    border-radius: 999px; filter: blur(100px);
  }
  .cv-grid-overlay {
    position: absolute; inset: 0; opacity: 0.15;
    background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
    background-size: 40px 40px;
  }
  @keyframes cv-pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.1); }
  }

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    font-size: 22px; vertical-align: middle; display: inline-block;
  }

  /* ---- SIDEBAR ---- */
  .cv-sidebar {
    position: fixed; left: 0; top: 0;
    width: 280px; height: 100vh;
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255,255,255,0.08);
    display: flex; flex-direction: column;
    padding: 40px 0; z-index: 40;
  }
  .cv-logo { padding: 0 24px 32px; display: flex; align-items: center; gap: 12px; }
  .cv-logo-icon {
    width: 40px; height: 40px; border-radius: 8px;
    background: linear-gradient(135deg, #ffb59e, #ffb4a6);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(255,181,158,0.2);
  }
  .cv-logo-icon .material-symbols-outlined {
    color: #5e1700; font-size: 20px;
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
  .cv-logo-text {}
  .cv-logo-title {
    font-family: 'Sora', sans-serif;
    font-size: 20px; font-weight: 800; color: #FF5C00; line-height: 1;
  }
  .cv-logo-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: #e6beb2;
    text-transform: uppercase; letter-spacing: 0.1em;
    margin-top: 3px; opacity: 0.7;
  }
  .cv-nav { flex: 1; display: flex; flex-direction: column; }
  .cv-nav a {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 24px; text-decoration: none;
    color: #e6beb2; font-size: 15px; transition: all 0.2s;
  }
  .cv-nav a:hover { background: rgba(255,255,255,0.05); color: #e5e2e1; }
  .cv-nav a.active {
    background: rgba(255,92,0,0.15); color: #ffb59e;
    border-right: 3px solid #ffb59e;
  }
  .cv-nav a.active .material-symbols-outlined {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
  .cv-sidebar-bottom { padding: 16px 24px 0; border-top: 1px solid rgba(255,255,255,0.06); }
  .cv-upgrade-box {
    background: linear-gradient(135deg, rgba(255,87,26,0.15), transparent);
    border: 1px solid rgba(255,181,158,0.15);
    border-radius: 12px; padding: 16px; margin-bottom: 8px;
  }
  .cv-upgrade-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: #ffb59e;
    text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;
  }
  .cv-upgrade-desc { font-size: 13px; color: #e6beb2; line-height: 1.4; margin-bottom: 12px; }
  .cv-upgrade-btn {
    width: 100%; padding: 8px;
    background: #ffb59e; color: #5e1700;
    font-weight: 700; font-size: 13px;
    border: none; border-radius: 8px; cursor: pointer;
    transition: transform 0.15s;
  }
  .cv-upgrade-btn:hover { transform: scale(1.03); }
  .cv-help-link {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 0; text-decoration: none;
    color: #e6beb2; font-size: 15px; transition: color 0.2s;
  }
  .cv-help-link:hover { color: #ffb59e; }

  /* ---- MAIN ---- */
  .cv-main {
    flex: 1; margin-left: 280px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px; position: relative; z-index: 1;
    min-height: 100vh;
  }

  /* mobile topbar */
  .cv-mobile-bar {
    display: none; width: 100%;
    justify-content: space-between; align-items: center;
    margin-bottom: 32px;
  }
  .cv-mobile-title {
    font-family: 'Sora', sans-serif;
    font-size: 22px; font-weight: 700; color: #e5e2e1;
  }

  .cv-wrapper { width: 100%; max-width: 640px; }

  /* ---- PAGE HEADER ---- */
  .cv-page-header { text-align: center; margin-bottom: 40px; }
  .cv-page-title {
    font-family: 'Sora', sans-serif;
    font-size: 48px; font-weight: 700;
    letter-spacing: -0.02em; color: #fff;
    line-height: 1.1; margin-bottom: 10px;
  }
  .cv-page-sub { font-size: 18px; color: #e6beb2; line-height: 1.6; }

  /* ---- FORM CARD ---- */
  .cv-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 48px;
    box-shadow: 0 32px 64px rgba(0,0,0,0.4);
    position: relative; overflow: hidden;
  }
  .cv-card-glow {
    position: absolute; top: -96px; right: -96px;
    width: 192px; height: 192px;
    background: rgba(255,181,158,0.1);
    border-radius: 999px; filter: blur(40px);
    pointer-events: none;
  }

  .cv-form { display: flex; flex-direction: column; gap: 32px; }

  /* ---- ERROR ---- */
  .cv-error {
    background: rgba(255,85,59,0.1);
    border: 1px solid rgba(255,85,59,0.3);
    border-radius: 10px; padding: 14px 18px;
    color: #ffb4a6; font-size: 14px;
  }

  /* ---- FORM FIELDS ---- */
  .cv-field { display: flex; flex-direction: column; gap: 10px; }
  .cv-label {
    display: flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: #ffb59e;
    text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500;
  }
  .cv-label .material-symbols-outlined { font-size: 15px; }
  .cv-input, .cv-select {
    width: 100%;
    background: #050505;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 16px 20px;
    color: #e5e2e1; font-size: 15px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
  }
  .cv-input::placeholder { color: rgba(230,190,178,0.3); }
  .cv-input:focus, .cv-select:focus {
    border-color: #ffb59e;
    box-shadow: 0 0 0 3px rgba(255,181,158,0.08);
  }
  .cv-input-hint { font-size: 12px; color: rgba(230,190,178,0.5); font-style: italic; padding: 0 4px; }
  .cv-input-warn { font-size: 12px; color: rgba(255,181,158,0.7); padding: 0 4px; }
  .cv-input-warn a { color: #ffb59e; }

  .cv-select-wrap { position: relative; }
  .cv-select-wrap .material-symbols-outlined {
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
    pointer-events: none; color: #e6beb2; font-size: 20px;
  }

  .cv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

  /* ---- TOGGLE ROW ---- */
  .cv-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px;
    background: #1c1b1b;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
  }
  .cv-toggle-left { display: flex; align-items: center; gap: 14px; }
  .cv-toggle-icon {
    width: 40px; height: 40px; border-radius: 999px;
    background: rgba(255,181,158,0.08);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cv-toggle-icon .material-symbols-outlined { color: #ffb59e; font-size: 20px; }
  .cv-toggle-title { font-size: 15px; font-weight: 600; color: #e5e2e1; }
  .cv-toggle-sub { font-size: 12px; color: #e6beb2; margin-top: 2px; }

  .cv-toggle-btn {
    width: 48px; height: 26px;
    background: #353534;
    border-radius: 999px; border: none;
    position: relative; cursor: pointer;
    transition: background 0.3s; flex-shrink: 0;
  }
  .cv-toggle-btn.on { background: #ffb59e; }
  .cv-toggle-knob {
    width: 18px; height: 18px; background: #fff;
    border-radius: 999px;
    position: absolute; left: 4px; top: 4px;
    transition: transform 0.3s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }
  .cv-toggle-btn.on .cv-toggle-knob { transform: translateX(22px); }

  /* ---- SUBMIT ---- */
  .cv-submit-wrap { display: flex; flex-direction: column; gap: 16px; padding-top: 8px; }
  .cv-submit-btn {
    width: 100%; padding: 20px;
    background: linear-gradient(135deg, #ff571a, #ff553b);
    color: #fff; font-family: 'Sora', sans-serif;
    font-size: 18px; font-weight: 700;
    border: none; border-radius: 16px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    position: relative; overflow: hidden;
    transition: box-shadow 0.3s, transform 0.15s;
  }
  .cv-submit-btn:hover:not(:disabled) {
    box-shadow: 0 0 30px rgba(255,87,26,0.4);
  }
  .cv-submit-btn:hover:not(:disabled) .cv-submit-icon { transform: translateX(3px); }
  .cv-submit-btn:active:not(:disabled) { transform: scale(0.98); }
  .cv-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .cv-submit-btn-overlay {
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.08);
    opacity: 0; transition: opacity 0.2s;
  }
  .cv-submit-btn:hover .cv-submit-btn-overlay { opacity: 1; }
  .cv-submit-icon { transition: transform 0.2s; }
  .cv-submit-icon .material-symbols-outlined {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }

  .cv-cancel-link {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    color: #e6beb2; font-size: 15px; text-align: center;
    background: none; border: none; cursor: pointer;
    padding: 8px; text-decoration: none;
    transition: color 0.2s;
  }
  .cv-cancel-link:hover { color: #fff; }
  .cv-cancel-link:hover .cv-back-icon { transform: translateX(-3px); }
  .cv-back-icon .material-symbols-outlined { font-size: 18px; transition: transform 0.2s; }

  /* ---- STATS BAR ---- */
  .cv-stats-bar {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 0; margin-top: 48px;
  }
  .cv-stat-item { text-align: center; padding: 0 16px; }
  .cv-stat-item + .cv-stat-item { border-left: 1px solid rgba(255,255,255,0.08); }
  .cv-stat-value {
    font-family: 'Sora', sans-serif;
    font-size: 28px; font-weight: 600; color: #fff;
    margin-bottom: 4px;
  }
  .cv-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: #e6beb2;
    text-transform: uppercase; letter-spacing: 0.08em;
  }

  /* ---- MOBILE NAV ---- */
  .cv-mobile-nav {
    display: none; position: fixed;
    bottom: 0; left: 0; right: 0; height: 64px;
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(12px);
    border-top: 1px solid rgba(255,255,255,0.08);
    justify-content: space-around; align-items: center; z-index: 50;
  }
  .cv-mobile-nav a {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    text-decoration: none; color: #e6beb2;
    font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
  }
  .cv-mobile-nav a.active { color: #ffb59e; }

  @media (max-width: 900px) {
    .cv-sidebar { display: none; }
    .cv-main { margin-left: 0; padding: 20px 20px 80px; }
    .cv-mobile-bar { display: flex; }
    .cv-mobile-nav { display: flex; }
    .cv-page-title { font-size: 32px; }
    .cv-card { padding: 28px 24px; }
    .cv-grid { grid-template-columns: 1fr; }
  }
`;

export default function CreateVideo() {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    language: 'english',
    channelId: ''
  });

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const res = await channelApi.getChannels();
      setChannels(res.data.channels || []);
    } catch (err) {
      setError('Failed to load channels');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await videoApi.createVideo(formData);
      navigate(`/video/${res.data.video._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cv-root">

        {/* BG */}
        <div className="cv-bg">
          <div className="cv-blob-1" />
          <div className="cv-blob-2" />
          <div className="cv-grid-overlay" />
        </div>

        {/* Sidebar */}
        <aside className="cv-sidebar">
          <div className="cv-logo">
            <div className="cv-logo-icon">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <div className="cv-logo-text">
              <div className="cv-logo-title">Channel Auto</div>
              <div className="cv-logo-sub">Pro Automation</div>
            </div>
          </div>
          <nav className="cv-nav">
            <Link to="/dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </Link>
            <Link to="/videos" className="active">
              <span className="material-symbols-outlined">video_library</span>
              Videos
            </Link>
            <Link to="/channels">
              <span className="material-symbols-outlined">layers</span>
              Channels
            </Link>
          </nav>
          <div className="cv-sidebar-bottom">
            <div className="cv-upgrade-box">
              <div className="cv-upgrade-label">Pro Plan</div>
              <div className="cv-upgrade-desc">Unlock unlimited generation and 4K exports.</div>
              <button className="cv-upgrade-btn">Upgrade Pro</button>
            </div>
            <a href="#" className="cv-help-link">
              <span className="material-symbols-outlined">help</span>
              Help Center
            </a>
          </div>
        </aside>

        {/* Main */}
        <main className="cv-main">
          <div className="cv-mobile-bar">
            <span className="cv-mobile-title">Channel Auto</span>
            <span className="material-symbols-outlined" style={{color:'#ffb59e'}}>menu</span>
          </div>

          <div className="cv-wrapper">
            <div className="cv-page-header">
              <h2 className="cv-page-title">Create New Video</h2>
              <p className="cv-page-sub">Configure your automation parameters below</p>
            </div>

            <div className="cv-card">
              <div className="cv-card-glow" />

              <form className="cv-form" onSubmit={handleSubmit}>
                {error && <div className="cv-error">{error}</div>}

                {/* Topic */}
                <div className="cv-field">
                  <label className="cv-label">
                    <span className="material-symbols-outlined">topic</span>
                    Video Topic
                  </label>
                  <input
                    className="cv-input"
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="e.g. 10 Mind-Blowing Space Facts"
                    required
                  />
                  <span className="cv-input-hint">Describe the subject clearly for better AI generation.</span>
                </div>

                {/* Language + Channel */}
                <div className="cv-grid">
                  <div className="cv-field">
                    <label className="cv-label">
                      <span className="material-symbols-outlined">language</span>
                      Language
                    </label>
                    <div className="cv-select-wrap">
                      <select
                        className="cv-select"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        required
                      >
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                      </select>
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>

                  <div className="cv-field">
                    <label className="cv-label">
                      <span className="material-symbols-outlined">smart_display</span>
                      Channel
                    </label>
                    <div className="cv-select-wrap">
                      <select
                        className="cv-select"
                        name="channelId"
                        value={formData.channelId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a channel</option>
                        {channels.map(channel => (
                          <option key={channel._id} value={channel._id}>
                            {channel.name}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                    {channels.length === 0 && (
                      <span className="cv-input-warn">
                        No channels found. <Link to="/channels">Create one first</Link>
                      </span>
                    )}
                  </div>
                </div>

                {/* Auto-optimize toggle */}
                <div className="cv-toggle-row">
                  <div className="cv-toggle-left">
                    <div className="cv-toggle-icon">
                      <span className="material-symbols-outlined">auto_fix_high</span>
                    </div>
                    <div>
                      <div className="cv-toggle-title">Auto-Optimize Script</div>
                      <div className="cv-toggle-sub">Enhance topic for high retention</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`cv-toggle-btn${autoOptimize ? ' on' : ''}`}
                    onClick={() => setAutoOptimize(v => !v)}
                  >
                    <div className="cv-toggle-knob" />
                  </button>
                </div>

                {/* Submit */}
                <div className="cv-submit-wrap">
                  <button type="submit" className="cv-submit-btn" disabled={loading}>
                    <div className="cv-submit-btn-overlay" />
                    <span>{loading ? 'Creating...' : 'Start Generation'}</span>
                    {!loading && (
                      <span className="cv-submit-icon">
                        <span className="material-symbols-outlined">bolt</span>
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    className="cv-cancel-link"
                    onClick={() => navigate('/dashboard')}
                  >
                    <span className="cv-back-icon">
                      <span className="material-symbols-outlined">arrow_back</span>
                    </span>
                    Cancel and Go Back
                  </button>
                </div>
              </form>
            </div>

            {/* Stats bar */}
            <div className="cv-stats-bar">
              <div className="cv-stat-item">
                <div className="cv-stat-value">~4m</div>
                <div className="cv-stat-label">Estimated Duration</div>
              </div>
              <div className="cv-stat-item">
                <div className="cv-stat-value">4K</div>
                <div className="cv-stat-label">Max Resolution</div>
              </div>
              <div className="cv-stat-item">
                <div className="cv-stat-value">AI</div>
                <div className="cv-stat-label">Narration Engine</div>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Nav */}
        <nav className="cv-mobile-nav">
          <Link to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
          </Link>
          <Link to="/create-video" className="active">
            <span className="material-symbols-outlined">add_circle</span>
          </Link>
          <Link to="/videos">
            <span className="material-symbols-outlined">video_library</span>
          </Link>
          <Link to="/channels">
            <span className="material-symbols-outlined">layers</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
