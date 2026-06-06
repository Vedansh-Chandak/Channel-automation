import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { channelApi } from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ch-root {
    min-height: 100vh;
    background-color: #0A0A0A;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(255, 92, 0, 0.05) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(255, 92, 0, 0.03) 0%, transparent 40%);
    color: #e5e2e1;
    font-family: 'Inter', sans-serif;
    display: flex;
  }

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    font-size: 22px;
    vertical-align: middle;
    display: inline-block;
  }

  /* ---- SIDEBAR ---- */
  .ch-sidebar {
    position: fixed; left: 0; top: 0;
    width: 280px; height: 100vh;
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255,255,255,0.08);
    display: flex; flex-direction: column;
    padding: 40px 0;
    z-index: 40;
  }
  .ch-logo { padding: 0 24px 32px; }
  .ch-logo-title {
    font-family: 'Sora', sans-serif;
    font-size: 20px; font-weight: 800;
    color: #FF5C00; text-transform: uppercase;
  }
  .ch-logo-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: #e6beb2;
    text-transform: uppercase; letter-spacing: 0.1em;
    margin-top: 4px;
  }
  .ch-nav { flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .ch-nav a {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 24px;
    text-decoration: none; color: #e6beb2;
    font-size: 15px; transition: all 0.2s;
  }
  .ch-nav a:hover { background: rgba(255,255,255,0.05); color: #e5e2e1; }
  .ch-nav a.active {
    background: rgba(255, 92, 0, 0.15);
    color: #ffb59e;
    border-right: 3px solid #ffb59e;
  }
  .ch-sidebar-footer { padding: 0 24px; }
  .ch-plan-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; padding: 16px; margin-bottom: 16px;
  }
  .ch-plan-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: #ffb59e;
    text-transform: uppercase; margin-bottom: 4px;
  }
  .ch-plan-name { font-size: 15px; font-weight: 600; color: #e5e2e1; margin-bottom: 12px; }
  .ch-upgrade-btn {
    width: 100%; padding: 10px;
    border-radius: 8px;
    background: linear-gradient(135deg, #ff571a, #ff553b);
    color: #fff; font-weight: 700; font-size: 13px;
    border: none; cursor: pointer;
    box-shadow: 0 0 15px rgba(255,77,0,0.2);
    transition: transform 0.15s, opacity 0.15s;
  }
  .ch-upgrade-btn:hover { transform: scale(1.02); }
  .ch-help-link {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 0; text-decoration: none;
    color: #e6beb2; font-size: 15px; transition: color 0.2s;
  }
  .ch-help-link:hover { color: #ffb59e; }

  /* ---- MAIN ---- */
  .ch-main { flex: 1; margin-left: 280px; display: flex; flex-direction: column; min-height: 100vh; }

  /* ---- TOPBAR ---- */
  .ch-topbar {
    position: sticky; top: 0; z-index: 30;
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 40px;
    background: rgba(255,255,255,0.02);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .ch-topbar-left { display: flex; align-items: center; gap: 16px; }
  .ch-topbar-title {
    font-family: 'Sora', sans-serif;
    font-size: 24px; font-weight: 600; color: #e5e2e1;
  }
  .ch-topbar-right { display: flex; align-items: center; gap: 16px; }
  .ch-search {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px; padding: 8px 16px;
  }
  .ch-search input {
    background: transparent; border: none; outline: none;
    color: #e5e2e1; font-size: 14px; width: 160px;
  }
  .ch-search input::placeholder { color: rgba(230,190,178,0.4); }
  .ch-icon-btn {
    background: none; border: none; color: #e6beb2;
    cursor: pointer; transition: color 0.2s;
    display: flex; align-items: center;
  }
  .ch-icon-btn:hover { color: #ffb59e; }
  .ch-avatar {
    width: 40px; height: 40px; border-radius: 999px;
    border: 1px solid rgba(255,181,158,0.3); overflow: hidden;
  }

  /* ---- CONTENT ---- */
  .ch-content { padding: 40px; max-width: 1280px; margin: 0 auto; width: 100%; }

  /* ---- ERROR ---- */
  .ch-error {
    background: rgba(255,85,59,0.1);
    border: 1px solid rgba(255,85,59,0.3);
    border-radius: 12px; padding: 14px 18px;
    color: #ffb4a6; font-size: 14px; margin-bottom: 32px;
  }

  /* ---- STATS ---- */
  .ch-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 40px; }
  .ch-stat {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; padding: 24px;
  }
  .ch-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: #e6beb2;
    text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;
  }
  .ch-stat-value {
    font-family: 'Sora', sans-serif;
    font-size: 32px; font-weight: 600; color: #e5e2e1;
  }
  .ch-stat-value.orange { color: #FF5C00; }
  .ch-stat-value.blue { color: #a5c8ff; }

  /* ---- CHANNELS HEADER ---- */
  .ch-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 32px; flex-wrap: wrap; gap: 16px;
  }
  .ch-header-title {
    font-family: 'Sora', sans-serif;
    font-size: 24px; font-weight: 600; color: #e5e2e1;
  }
  .ch-header-sub { font-size: 15px; color: #e6beb2; margin-top: 4px; }
  .ch-add-btn {
    display: flex; align-items: center; gap: 8px;
    background: #ffb59e; color: #5e1700;
    font-weight: 700; font-size: 14px;
    padding: 12px 20px; border-radius: 8px; border: none;
    cursor: pointer;
    box-shadow: 0 0 20px rgba(255,181,158,0.2);
    transition: transform 0.15s, opacity 0.15s;
  }
  .ch-add-btn:hover { transform: scale(1.04); }
  .ch-add-btn:active { transform: scale(0.97); opacity: 0.85; }
  .ch-cancel-btn {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    color: #e5e2e1; font-weight: 600; font-size: 14px;
    padding: 12px 20px; border-radius: 8px;
    cursor: pointer; transition: background 0.2s;
  }
  .ch-cancel-btn:hover { background: rgba(255,255,255,0.1); }

  /* ---- FORM MODAL ---- */
  .ch-modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    background: rgba(10,10,10,0.8);
    backdrop-filter: blur(6px);
  }
  .ch-modal {
    width: 100%; max-width: 480px;
    background: #131313;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6);
  }
  .ch-modal-header {
    padding: 28px 32px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; justify-content: space-between; align-items: center;
  }
  .ch-modal-title {
    font-family: 'Sora', sans-serif;
    font-size: 22px; font-weight: 600; color: #e5e2e1;
  }
  .ch-modal-close {
    background: none; border: none; color: #e6beb2;
    cursor: pointer; transition: color 0.2s;
  }
  .ch-modal-close:hover { color: #e5e2e1; }
  .ch-modal-body { padding: 32px; display: flex; flex-direction: column; gap: 20px; }

  .ch-form-group { display: flex; flex-direction: column; gap: 8px; }
  .ch-form-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: #e6beb2;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .ch-form-input, .ch-form-textarea {
    width: 100%;
    background: #050505;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 12px 16px;
    color: #e5e2e1; font-size: 15px;
    font-family: 'Inter', sans-serif;
    outline: none; transition: border-color 0.2s;
    resize: vertical;
  }
  .ch-form-input:focus, .ch-form-textarea:focus { border-color: #ffb59e; }
  .ch-form-input::placeholder, .ch-form-textarea::placeholder { color: rgba(230,190,178,0.35); }

  .ch-form-btns { display: flex; gap: 12px; padding-top: 8px; }
  .ch-form-submit {
    flex: 1; padding: 13px;
    background: linear-gradient(135deg, #ff571a, #ff553b);
    color: #fff; font-weight: 700; font-size: 14px;
    border: none; border-radius: 8px; cursor: pointer;
    box-shadow: 0 0 15px rgba(255,77,0,0.3);
    transition: transform 0.15s, opacity 0.15s;
  }
  .ch-form-submit:hover:not(:disabled) { transform: scale(1.02); }
  .ch-form-submit:disabled { opacity: 0.55; cursor: not-allowed; }
  .ch-form-cancel {
    flex: 1; padding: 13px;
    border: 1px solid rgba(255,255,255,0.12);
    background: transparent; color: #e5e2e1;
    font-weight: 600; font-size: 14px;
    border-radius: 8px; cursor: pointer; transition: background 0.2s;
  }
  .ch-form-cancel:hover { background: rgba(255,255,255,0.06); }

  /* ---- GRID ---- */
  .ch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

  /* ---- CHANNEL CARD ---- */
  .ch-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 24px;
    transition: all 0.3s; cursor: default;
  }
  .ch-card:hover {
    border-color: rgba(255,92,0,0.3);
    box-shadow: 0 0 20px rgba(255,92,0,0.08);
    transform: translateY(-4px);
  }
  .ch-card-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 24px;
  }
  .ch-card-identity { display: flex; align-items: center; gap: 14px; }
  .ch-card-avatar {
    width: 56px; height: 56px; border-radius: 12px;
    background: linear-gradient(135deg, #ff571a22, #1c1b1b);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ch-card-avatar-letter {
    font-family: 'Sora', sans-serif;
    font-size: 22px; font-weight: 700; color: #ffb59e;
  }
  .ch-card-name {
    font-family: 'Sora', sans-serif;
    font-size: 18px; font-weight: 600; color: #e5e2e1;
    line-height: 1.2;
  }
  .ch-card-handle {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: #ffb59e; margin-top: 3px;
  }

  .ch-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 700;
    padding: 4px 8px; border-radius: 4px;
    text-transform: uppercase; letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .ch-badge.active { background: rgba(255,92,0,0.12); color: #FF5C00; }
  .ch-badge.inactive { background: rgba(255,255,255,0.06); color: #e6beb2; }

  .ch-card-desc {
    font-size: 14px; color: #e6beb2;
    line-height: 1.5; margin-bottom: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .ch-card-bar-wrap { margin-bottom: 20px; }
  .ch-card-bar {
    height: 4px; background: rgba(255,255,255,0.08);
    border-radius: 999px; overflow: hidden;
  }
  .ch-card-bar-fill {
    height: 100%; background: #FF5C00;
    border-radius: 999px;
  }

  .ch-card-actions { display: flex; gap: 8px; }
  .ch-btn-secondary {
    flex: 1; padding: 9px;
    background: #201f1f;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; color: #e5e2e1;
    font-size: 13px; font-weight: 500;
    cursor: pointer; transition: background 0.2s;
  }
  .ch-btn-secondary:hover { background: #2a2a2a; }
  .ch-btn-danger {
    padding: 9px 14px;
    background: rgba(255,180,171,0.08);
    border: 1px solid rgba(255,180,171,0.15);
    border-radius: 8px; color: #ffb4ab;
    font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center;
  }
  .ch-btn-danger:hover { background: rgba(255,180,171,0.15); }

  /* ---- ADD PLACEHOLDER ---- */
  .ch-add-placeholder {
    border: 2px dashed rgba(255,255,255,0.1);
    border-radius: 20px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px; cursor: pointer;
    transition: all 0.3s; background: transparent;
    color: inherit;
  }
  .ch-add-placeholder:hover {
    border-color: rgba(255,181,158,0.4);
    background: rgba(255,181,158,0.03);
  }
  .ch-add-placeholder:hover .ch-placeholder-icon { transform: scale(1.1); }
  .ch-placeholder-icon {
    width: 64px; height: 64px; border-radius: 999px;
    background: #201f1f;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px; transition: transform 0.2s;
  }
  .ch-placeholder-title {
    font-family: 'Sora', sans-serif;
    font-size: 18px; font-weight: 600; color: #e5e2e1;
    margin-bottom: 6px;
  }
  .ch-placeholder-sub { font-size: 14px; color: #e6beb2; text-align: center; }

  /* ---- EMPTY / LOADING ---- */
  .ch-empty, .ch-loading {
    grid-column: span 3;
    padding: 64px 32px;
    text-align: center; color: #e6beb2; font-size: 15px;
  }
  .ch-empty-icon { font-size: 48px; color: rgba(255,181,158,0.2); margin-bottom: 16px; }
  .ch-empty-title {
    font-family: 'Sora', sans-serif;
    font-size: 22px; font-weight: 600; color: #e5e2e1; margin-bottom: 8px;
  }
  .ch-empty-sub { margin-bottom: 24px; }
  .ch-empty-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: #ffb59e; color: #5e1700;
    font-weight: 700; font-size: 14px;
    padding: 12px 24px; border-radius: 8px; border: none;
    cursor: pointer; transition: transform 0.15s;
  }
  .ch-empty-btn:hover { transform: scale(1.04); }

  /* ---- MOBILE NAV ---- */
  .ch-mobile-nav {
    display: none; position: fixed; bottom: 0; left: 0; right: 0;
    height: 64px; background: rgba(20,19,19,0.92);
    backdrop-filter: blur(12px);
    border-top: 1px solid rgba(255,255,255,0.08);
    justify-content: space-around; align-items: center; z-index: 50;
  }
  .ch-mobile-nav a {
    display: flex; flex-direction: column; align-items: center;
    text-decoration: none; color: #e6beb2;
    font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.05em; gap: 2px;
    transition: color 0.2s;
  }
  .ch-mobile-nav a.active { color: #ffb59e; }

  @media (max-width: 900px) {
    .ch-sidebar { display: none; }
    .ch-main { margin-left: 0; }
    .ch-mobile-nav { display: flex; }
    .ch-content { padding: 20px 20px 80px; }
    .ch-topbar { padding: 12px 20px; }
    .ch-search { display: none; }
    .ch-stats { grid-template-columns: repeat(2, 1fr); }
    .ch-grid { grid-template-columns: 1fr; }
    .ch-empty, .ch-loading { grid-column: span 1; }
  }
`;

function getInitial(name) {
  return (name || '?')[0].toUpperCase();
}

export default function Channels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const res = await channelApi.getChannels();
      setChannels(res.data.channels || []);
    } catch (err) {
      setError('Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      await channelApi.createChannel(formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      await fetchChannels();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create channel');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this channel?')) {
      try {
        await channelApi.deleteChannel(id);
        await fetchChannels();
      } catch (err) {
        setError('Failed to delete channel');
      }
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ch-root">

        {/* Sidebar */}
        <aside className="ch-sidebar">
          <div className="ch-logo">
            <div className="ch-logo-title">AutoTube</div>
           
          </div>
          <nav className="ch-nav">
            <Link to="/dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </Link>
            <Link to="/videos">
              <span className="material-symbols-outlined">video_library</span>
              Videos
            </Link>
            <Link to="/channels" className="active">
              <span className="material-symbols-outlined">layers</span>
              Channels
            </Link>
            <Link to="/create-video">
              <span className="material-symbols-outlined">add_circle</span>
              Create Video
            </Link>
          </nav>
         
        </aside>

        {/* Main */}
        <main className="ch-main">
          {/* Topbar */}
          <header className="ch-topbar">
            <div className="ch-topbar-left">
              <span className="material-symbols-outlined" style={{color:'#e6beb2',display:'none'}} id="ch-menu-icon">menu</span>
              <h2 className="ch-topbar-title">Channels</h2>
            </div>
            <div className="ch-topbar-right">
              <div className="ch-search">
                <span className="material-symbols-outlined" style={{color:'#e6beb2',fontSize:18}}>search</span>
                <input placeholder="Search channels..." />
              </div>
              <button className="ch-icon-btn">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <div className="ch-avatar" style={{background:'linear-gradient(135deg,#ff571a,#5e1700)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontFamily:'Sora',fontSize:15}}>
                C
              </div>
            </div>
          </header>

          <div className="ch-content">
            {error && <div className="ch-error">{error}</div>}

            {/* Stats */}
            <div className="ch-stats">
              <div className="ch-stat">
                <div className="ch-stat-label">Total Channels</div>
                <div className="ch-stat-value orange">{String(channels.length).padStart(2, '0')}</div>
              </div>
              <div className="ch-stat">
                <div className="ch-stat-label">Total Videos</div>
                <div className="ch-stat-value">—</div>
              </div>
              <div className="ch-stat">
                <div className="ch-stat-label">Monthly Uploads</div>
                <div className="ch-stat-value">—</div>
              </div>
              <div className="ch-stat">
                <div className="ch-stat-label">Avg. Retention</div>
                <div className="ch-stat-value blue">—</div>
              </div>
            </div>

            {/* Header */}
            <div className="ch-header">
              <div>
                <div className="ch-header-title">Manage Channels</div>
                <div className="ch-header-sub">Connect and automate your YouTube network.</div>
              </div>
              {showForm ? (
                <button className="ch-cancel-btn" onClick={() => setShowForm(false)}>
                  <span className="material-symbols-outlined" style={{fontSize:18}}>close</span>
                  Cancel
                </button>
              ) : (
                <button className="ch-add-btn" onClick={() => setShowForm(true)}>
                  <span className="material-symbols-outlined" style={{fontSize:18}}>add</span>
                  Add Channel
                </button>
              )}
            </div>

            {/* Grid */}
            <div className="ch-grid">
              {loading ? (
                <div className="ch-loading">Loading channels...</div>
              ) : channels.length === 0 && !showForm ? (
                <>
                  <div className="ch-empty">
                    <div className="ch-empty-icon">
                      <span className="material-symbols-outlined" style={{fontSize:48,color:'rgba(255,181,158,0.2)'}}>layers</span>
                    </div>
                    <div className="ch-empty-title">No channels yet</div>
                    <div className="ch-empty-sub">Connect a channel to start automating your content pipeline.</div>
                    <button className="ch-empty-btn" onClick={() => setShowForm(true)}>
                      <span className="material-symbols-outlined" style={{fontSize:18}}>add</span>
                      Create your first channel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {channels.map((channel) => (
                    <div key={channel._id} className="ch-card">
                      <div className="ch-card-top">
                        <div className="ch-card-identity">
                          <div className="ch-card-avatar">
                            <span className="ch-card-avatar-letter">{getInitial(channel.name)}</span>
                          </div>
                          <div>
                            <div className="ch-card-name">{channel.name}</div>
                            <div className="ch-card-handle">@{channel.name?.toLowerCase().replace(/\s+/g, '_')}</div>
                          </div>
                        </div>
                        <span className="ch-badge active">Active</span>
                      </div>

                      <p className="ch-card-desc">
                        {channel.description || 'No description provided for this channel.'}
                      </p>

                      <div className="ch-card-bar-wrap">
                        <div className="ch-card-bar">
                          <div className="ch-card-bar-fill" style={{width:'60%'}} />
                        </div>
                      </div>

                      <div className="ch-card-actions">
                        <button className="ch-btn-secondary">View Stats</button>
                        <button
                          className="ch-btn-danger"
                          onClick={() => handleDelete(channel._id)}
                          title="Delete channel"
                        >
                          <span className="material-symbols-outlined" style={{fontSize:18}}>delete</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add placeholder */}
                  <button className="ch-add-placeholder" onClick={() => setShowForm(true)}>
                    <div className="ch-placeholder-icon">
                      <span className="material-symbols-outlined" style={{fontSize:28,color:'#ffb59e'}}>add_circle</span>
                    </div>
                    <div className="ch-placeholder-title">Connect Channel</div>
                    <p className="ch-placeholder-sub">Sync your YouTube account to start automating.</p>
                  </button>
                </>
              )}
            </div>
          </div>
        </main>

        {/* Create Channel Modal */}
        {showForm && (
          <div className="ch-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
            <div className="ch-modal">
              <div className="ch-modal-header">
                <span className="ch-modal-title">Create New Channel</span>
                <button className="ch-modal-close" onClick={() => setShowForm(false)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form className="ch-modal-body" onSubmit={handleSubmit}>
                <div className="ch-form-group">
                  <label className="ch-form-label">Channel Name *</label>
                  <input
                    className="ch-form-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="My YouTube Channel"
                    required
                  />
                </div>
                <div className="ch-form-group">
                  <label className="ch-form-label">Description</label>
                  <textarea
                    className="ch-form-textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Channel description..."
                    rows={4}
                  />
                </div>
                <div style={{display:'flex',alignItems:'flex-start',gap:12,padding:'14px 16px',background:'rgba(255,92,0,0.06)',border:'1px solid rgba(255,92,0,0.12)',borderRadius:12}}>
                  <span className="material-symbols-outlined" style={{color:'#ffb59e',fontSize:20,flexShrink:0,marginTop:1}}>security</span>
                  <p style={{fontSize:13,color:'#e6beb2',lineHeight:1.5}}>We use secure OAuth 2.0 to access your channel. We never store your password.</p>
                </div>
                <div className="ch-form-btns">
                  <button type="button" className="ch-form-cancel" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="ch-form-submit" disabled={formLoading}>
                    {formLoading ? 'Creating...' : 'Create Channel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Nav */}
        <nav className="ch-mobile-nav">
          <Link to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            Dash
          </Link>
          <Link to="/videos">
            <span className="material-symbols-outlined">video_library</span>
            Videos
          </Link>
          <Link to="/channels" className="active">
            <span className="material-symbols-outlined">layers</span>
            Channels
          </Link>
          <Link to="/create-video">
            <span className="material-symbols-outlined">add_circle</span>
            Create
          </Link>
        </nav>
      </div>
    </>
  );
}
