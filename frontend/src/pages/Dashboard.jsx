import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { videoApi, channelApi } from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ca-root {
    min-height: 100vh;
    background-color: #0A0A0A;
    background-image:
      radial-gradient(circle at 80% 20%, rgba(255, 92, 0, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 20% 80%, rgba(255, 85, 59, 0.05) 0%, transparent 40%);
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
  .ca-sidebar {
    position: fixed;
    left: 0; top: 0;
    width: 280px;
    height: 100vh;
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255,255,255,0.08);
    display: flex;
    flex-direction: column;
    padding: 40px 0;
    z-index: 40;
  }

  .ca-logo {
    padding: 0 24px 32px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ca-logo-icon {
    width: 40px; height: 40px;
    border-radius: 8px;
    background: #ffb59e;
    display: flex; align-items: center; justify-content: center;
  }
  .ca-logo-icon .material-symbols-outlined { color: #5e1700; font-size: 20px; }
  .ca-logo-title {
    font-family: 'Sora', sans-serif;
    font-size: 20px; font-weight: 800;
    color: #FF5C00;
    line-height: 1;
  }
  .ca-logo-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #e6beb2;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 4px;
  }

  .ca-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .ca-nav a {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 24px;
    text-decoration: none;
    color: #e6beb2;
    font-size: 15px;
    transition: all 0.2s;
  }
  .ca-nav a:hover { background: rgba(255,255,255,0.05); color: #e5e2e1; }
  .ca-nav a.active {
    background: rgba(255, 92, 0, 0.15);
    color: #ffb59e;
    border-right: 3px solid #ffb59e;
  }

  .ca-sidebar-footer { padding: 0 24px; }
  .ca-storage {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
  }
  .ca-storage-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #e6beb2;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }
  .ca-storage-bar {
    width: 100%; height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 999px;
    overflow: hidden;
  }
  .ca-storage-fill {
    height: 100%; width: 75%;
    background: #ffb59e;
    border-radius: 999px;
  }
  .ca-storage-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #e5e2e1;
    margin-top: 6px;
  }
  .ca-upgrade-btn {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    background: linear-gradient(135deg, #ffb59e, #ffb4a6);
    color: #5e1700;
    font-weight: 700;
    font-size: 13px;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .ca-upgrade-btn:hover { opacity: 0.9; }
  .ca-help-link {
    display: flex; align-items: center; gap: 10px;
    padding: 16px 0 0;
    text-decoration: none;
    color: #e6beb2;
    font-size: 15px;
    transition: color 0.2s;
  }
  .ca-help-link:hover { color: #ffb59e; }

  /* ---- MAIN ---- */
  .ca-main {
    flex: 1;
    margin-left: 280px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* ---- TOPBAR ---- */
  .ca-topbar {
    position: sticky;
    top: 0; z-index: 30;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 40px;
    background: rgba(255,255,255,0.02);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .ca-search {
    display: flex; align-items: center; gap: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px;
    padding: 8px 16px;
    width: 360px;
  }
  .ca-search input {
    background: transparent;
    border: none;
    outline: none;
    color: #e5e2e1;
    font-size: 14px;
    width: 100%;
  }
  .ca-search input::placeholder { color: rgba(230,190,178,0.4); }
  .ca-topbar-actions { display: flex; align-items: center; gap: 20px; }
  .ca-icon-btn {
    background: none; border: none;
    color: #e6beb2; cursor: pointer;
    transition: color 0.2s;
    display: flex; align-items: center;
  }
  .ca-icon-btn:hover { color: #ffb59e; }
  .ca-create-btn {
    background: #ffb59e;
    color: #5e1700;
    font-weight: 700;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.04em;
    padding: 8px 20px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.15s, opacity 0.15s;
    display: inline-block;
  }
  .ca-create-btn:hover { transform: scale(1.04); }
  .ca-create-btn:active { opacity: 0.8; transform: scale(0.97); }
  .ca-avatar {
    width: 40px; height: 40px;
    border-radius: 999px;
    border: 1px solid rgba(255,181,158,0.3);
    overflow: hidden;
  }
  .ca-avatar img { width: 100%; height: 100%; object-fit: cover; }

  /* ---- CONTENT ---- */
  .ca-content {
    padding: 40px;
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  /* ---- ERROR ---- */
  .ca-error {
    background: rgba(255, 85, 59, 0.1);
    border: 1px solid rgba(255, 85, 59, 0.3);
    border-radius: 12px;
    padding: 16px 20px;
    color: #ffb4a6;
    font-size: 14px;
  }

  /* ---- HERO ---- */
  .ca-hero {
    border-radius: 24px;
    padding: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
    background: linear-gradient(135deg, #2a2a2a, #131313);
    border: 1px solid rgba(255,255,255,0.08);
    overflow: hidden;
    position: relative;
  }
  .ca-hero-text h2 {
    font-family: 'Sora', sans-serif;
    font-size: 32px; font-weight: 600;
    color: #e5e2e1;
    margin-bottom: 8px;
  }
  .ca-hero-text p {
    font-size: 18px;
    color: #e6beb2;
    max-width: 480px;
    line-height: 1.6;
  }
  .ca-hero-badges {
    display: flex; flex-wrap: wrap; gap: 16px;
    margin-top: 32px;
  }
  .ca-badge {
    display: flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; font-weight: 700;
  }
  .ca-badge.primary { color: #ffb59e; }
  .ca-badge.secondary { color: #ffb4a6; }

  .ca-hero-visual {
    position: relative;
    width: 100%; max-width: 400px;
    aspect-ratio: 16/9;
    border-radius: 16px;
    overflow: hidden;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    flex-shrink: 0;
  }
  .ca-hero-visual-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    display: flex; align-items: flex-end;
    padding: 20px;
  }
  .ca-live-indicator {
    display: flex; align-items: center; gap: 10px;
  }
  .ca-pulse-dot {
    width: 10px; height: 10px;
    background: #FF5C00;
    border-radius: 999px;
    animation: pulse-dot 1.5s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }
  .ca-live-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #e5e2e1;
  }

  /* ---- STATS ---- */
  .ca-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .ca-stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s;
    cursor: default;
  }
  .ca-stat-card:hover {
    border-color: rgba(255,92,0,0.3);
    box-shadow: 0 0 20px rgba(255,92,0,0.05);
  }
  .ca-stat-icon {
    width: 56px; height: 56px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s;
    flex-shrink: 0;
  }
  .ca-stat-icon.orange { background: rgba(255,181,158,0.1); color: #ffb59e; }
  .ca-stat-icon.blue { background: rgba(165,200,255,0.1); color: #a5c8ff; }
  .ca-stat-icon.red { background: rgba(255,180,166,0.1); color: #ffb4a6; }
  .ca-stat-card:hover .ca-stat-icon.orange { background: #ffb59e; color: #5e1700; }
  .ca-stat-card:hover .ca-stat-icon.blue { background: #2492ff; color: #002a53; }
  .ca-stat-card:hover .ca-stat-icon.red { background: #ffb4a6; color: #660700; }
  .ca-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #e6beb2;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
  }
  .ca-stat-value {
    font-family: 'Sora', sans-serif;
    font-size: 32px; font-weight: 600;
    color: #e5e2e1;
  }

  /* ---- CONTENT GRID ---- */
  .ca-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
  .ca-videos-col { grid-column: span 2; display: flex; flex-direction: column; gap: 24px; }
  .ca-sidebar-col { display: flex; flex-direction: column; gap: 24px; }

  /* ---- SECTION HEADER ---- */
  .ca-section-header { display: flex; justify-content: space-between; align-items: flex-end; }
  .ca-section-title {
    font-family: 'Sora', sans-serif;
    font-size: 24px; font-weight: 600;
    color: #e5e2e1;
  }
  .ca-section-sub { font-size: 15px; color: #e6beb2; margin-top: 2px; }
  .ca-view-all {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; font-weight: 700;
    color: #ffb59e;
    text-decoration: none;
    border-bottom: 1px solid rgba(255,181,158,0.3);
    padding-bottom: 2px;
    transition: border-color 0.2s;
  }
  .ca-view-all:hover { border-color: #ffb59e; }

  /* ---- VIDEOS GRID ---- */
  .ca-videos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .ca-video-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s;
  }
  .ca-video-card:hover { border-color: rgba(255,92,0,0.3); }
  .ca-video-thumb {
    aspect-ratio: 16/9;
    background: #1c1b1b;
    position: relative;
    overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  .ca-video-status-badge {
    position: absolute; top: 12px; left: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 700;
    padding: 4px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .ca-video-status-badge.uploaded { background: rgba(16,185,129,0.8); color: #fff; }
  .ca-video-status-badge.rendering { background: #ff571a; color: #fff; animation: pulse-dot 1.5s ease-in-out infinite; }
  .ca-video-status-badge.scripted { background: #2492ff; color: #002a53; }
  .ca-video-status-badge.pending, .ca-video-status-badge.processing { background: rgba(255,255,255,0.15); color: #e5e2e1; }

  .ca-video-placeholder {
    width: 100%; height: 100%;
    background: linear-gradient(135deg, #1c1b1b, #2a2a2a);
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.15);
  }
  .ca-video-placeholder .material-symbols-outlined { font-size: 40px; }

  .ca-video-info { padding: 16px 20px 20px; }
  .ca-video-topic {
    font-size: 16px; font-weight: 600;
    color: #e5e2e1;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 4px;
  }
  .ca-video-title {
    font-size: 13px;
    color: #e6beb2;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 12px;
  }
  .ca-video-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 500;
    color: #ffb59e;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: opacity 0.2s;
  }
  .ca-video-link:hover { opacity: 0.75; }

  .ca-empty-state {
    grid-column: span 2;
    padding: 48px;
    text-align: center;
    color: #e6beb2;
    font-size: 15px;
  }
  .ca-empty-state a { color: #ffb59e; text-decoration: none; }
  .ca-empty-state a:hover { text-decoration: underline; }

  .ca-loading {
    grid-column: span 2;
    padding: 48px;
    text-align: center;
    color: #e6beb2;
    font-size: 15px;
  }

  /* ---- GLASS CARD ---- */
  .ca-glass {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 32px;
  }
  .ca-glass-title {
    font-family: 'Sora', sans-serif;
    font-size: 24px; font-weight: 600;
    color: #e5e2e1;
    margin-bottom: 24px;
  }

  /* ---- QUICK ACTIONS ---- */
  .ca-actions-list { display: flex; flex-direction: column; gap: 10px; }
  .ca-action-btn {
    width: 100%;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px;
    background: #201f1f;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    color: #e5e2e1;
    font-size: 15px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
  }
  .ca-action-btn:hover { background: rgba(255,92,0,0.1); color: #ffb59e; border-color: rgba(255,92,0,0.2); }
  .ca-action-btn-inner { display: flex; align-items: center; gap: 12px; }

  /* ---- PIPELINE ---- */
  .ca-pipeline { position: relative; overflow: hidden; }
  .ca-pipeline-glow {
    position: absolute; top: -20px; right: -20px;
    width: 96px; height: 96px;
    background: rgba(255,92,0,0.1);
    border-radius: 999px;
    filter: blur(40px);
    pointer-events: none;
  }
  .ca-pipeline-stages { display: flex; flex-direction: column; gap: 24px; }
  .ca-pipeline-stage { display: flex; flex-direction: column; gap: 8px; }
  .ca-pipeline-stage-header {
    display: flex; justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #e6beb2;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .ca-stage-active { color: #ffb59e; }
  .ca-pipeline-bar {
    height: 4px;
    background: rgba(255,255,255,0.08);
    border-radius: 999px;
    overflow: hidden;
  }
  .ca-pipeline-fill {
    height: 100%;
    background: #ffb59e;
    border-radius: 999px;
    animation: pipeline-pulse 1.5s ease-in-out infinite;
  }
  @keyframes pipeline-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* ---- PROMO ---- */
  .ca-promo {
    border-radius: 16px;
    padding: 24px;
    background: linear-gradient(135deg, #ff571a, #900d00);
    color: #fff;
    box-shadow: 0 8px 32px rgba(255,87,26,0.2);
  }
  .ca-promo h4 { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
  .ca-promo p {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    opacity: 0.8;
    margin-bottom: 24px;
    line-height: 1.6;
  }
  .ca-promo-btn {
    width: 100%;
    padding: 12px;
    background: #fff;
    color: #521300;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .ca-promo-btn:hover { opacity: 0.9; }

  /* ---- FOOTER ---- */
  .ca-footer {
    margin-top: auto;
    padding: 20px 40px;
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }
  .ca-footer-status { display: flex; align-items: center; gap: 8px; }
  .ca-green-dot { width: 8px; height: 8px; background: #10b981; border-radius: 999px; }
  .ca-footer-links { display: flex; gap: 32px; }
  .ca-footer-links a {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #e6beb2;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: color 0.2s;
  }
  .ca-footer-links a:hover { color: #ffb59e; }
  .ca-footer-copy {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: rgba(230,190,178,0.4);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .ca-mono-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #e6beb2;
  }

  /* ---- MOBILE NAV ---- */
  .ca-mobile-nav {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0;
    height: 64px;
    background: rgba(32,31,31,0.9);
    backdrop-filter: blur(12px);
    border-top: 1px solid rgba(255,255,255,0.08);
    justify-content: space-around;
    align-items: center;
    z-index: 50;
  }
  .ca-mobile-nav a {
    display: flex; flex-direction: column; align-items: center;
    text-decoration: none; color: #e6beb2;
    font-size: 9px; font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    gap: 2px;
    transition: color 0.2s;
  }
  .ca-mobile-nav a.active { color: #ffb59e; }
  .ca-mobile-fab {
    width: 40px; height: 40px;
    margin-top: -24px;
    background: #ffb59e;
    border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(255,181,158,0.4);
  }
  .ca-mobile-fab .material-symbols-outlined { color: #5e1700; font-size: 20px; }

  @media (max-width: 900px) {
    .ca-sidebar { display: none; }
    .ca-main { margin-left: 0; }
    .ca-mobile-nav { display: flex; }
    .ca-content { padding: 20px 20px 80px; }
    .ca-topbar { padding: 12px 20px; }
    .ca-search { display: none; }
    .ca-stats { grid-template-columns: 1fr; }
    .ca-grid { grid-template-columns: 1fr; }
    .ca-videos-col { grid-column: span 1; }
    .ca-videos-grid { grid-template-columns: 1fr; }
    .ca-empty-state, .ca-loading { grid-column: span 1; }
    .ca-hero { flex-direction: column; }
    .ca-hero-visual { max-width: 100%; }
  }
`;

function getStatusBadgeClass(status) {
  if (!status) return 'pending';
  const s = status.toLowerCase();
  if (s === 'uploaded') return 'uploaded';
  if (s === 'rendering' || s === 'processing') return 'rendering';
  if (s === 'scripted') return 'scripted';
  return 'pending';
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [videosRes, channelsRes] = await Promise.all([
        videoApi.getVideos(),
        channelApi.getChannels()
      ]);
      setVideos(videosRes.data.videos || []);
      setChannels(channelsRes.data.channels || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const uploadedCount = videos.filter(v => v.status === 'uploaded').length;

  return (
    <>
      <style>{styles}</style>
      <div className="ca-root">

        {/* Sidebar */}
        <aside className="ca-sidebar">
          <div className="ca-logo">
            <div className="ca-logo-icon">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <div>
              <div className="ca-logo-title">AutoTube</div>
              
            </div>
          </div>

          <nav className="ca-nav">
            <Link to="/dashboard" className="active">
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </Link>
            <Link to="/videos">
              <span className="material-symbols-outlined">video_library</span>
              Videos
            </Link>
            <Link to="/channels">
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
        <main className="ca-main">
          {/* Topbar */}
          <header className="ca-topbar">
            <div className="ca-search">
              <span className="material-symbols-outlined" style={{color:'#e6beb2', fontSize:18}}>search</span>
              <input placeholder="Search videos or logs..." />
            </div>
            <div className="ca-topbar-actions">
              <button className="ca-icon-btn">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="ca-icon-btn" onClick={handleLogout} title="Logout">
                <span className="material-symbols-outlined">logout</span>
              </button>
              <Link to="/create-video" className="ca-create-btn">Create Video</Link>
              <div className="ca-avatar">
                <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,#ff571a,#5e1700)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:15,fontFamily:'Sora'}}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>
            </div>
          </header>

          <div className="ca-content">

            {error && <div className="ca-error">{error}</div>}

            {/* Hero */}
            <section className="ca-hero">
              <div className="ca-hero-text">
                <h2>Welcome back, {user?.name || 'Creator'}</h2>
                <p>Your automated pipeline is currently active. Everything is running smooth.</p>
                <div className="ca-hero-badges">
                  <div className="ca-badge primary">
                    <span className="material-symbols-outlined" style={{fontSize:18}}>check_circle</span>
                    System: Optimized
                  </div>
                  <div className="ca-badge secondary">
                    <span className="material-symbols-outlined" style={{fontSize:18}}>trending_up</span>
                    +12.4% Reach
                  </div>
                </div>
              </div>
              <div className="ca-hero-visual">
                <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,#1c1b1b,#2a2a2a)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span className="material-symbols-outlined" style={{fontSize:64,color:'rgba(255,92,0,0.2)'}}>smart_display</span>
                </div>
                <div className="ca-hero-visual-overlay">
                  <div className="ca-live-indicator">
                    <div className="ca-pulse-dot" />
                    <span className="ca-live-text">Live Pipeline Active</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="ca-stats">
              <div className="ca-stat-card">
                <div className="ca-stat-icon orange">
                  <span className="material-symbols-outlined" style={{fontSize:28}}>video_library</span>
                </div>
                <div>
                  <div className="ca-stat-label">Total Videos</div>
                  <div className="ca-stat-value">{videos.length}</div>
                </div>
              </div>
              <div className="ca-stat-card">
                <div className="ca-stat-icon blue">
                  <span className="material-symbols-outlined" style={{fontSize:28}}>layers</span>
                </div>
                <div>
                  <div className="ca-stat-label">Active Channels</div>
                  <div className="ca-stat-value">{channels.length}</div>
                </div>
              </div>
              <div className="ca-stat-card">
                <div className="ca-stat-icon red">
                  <span className="material-symbols-outlined" style={{fontSize:28}}>cloud_upload</span>
                </div>
                <div>
                  <div className="ca-stat-label">Uploaded</div>
                  <div className="ca-stat-value">{uploadedCount}</div>
                </div>
              </div>
            </section>

            {/* Main Grid */}
            <div className="ca-grid">
              {/* Videos Column */}
              <div className="ca-videos-col">
                <div className="ca-section-header">
                  <div>
                    <div className="ca-section-title">Recent Videos</div>
                    <div className="ca-section-sub">The latest generations from your automation engine.</div>
                  </div>
                  <Link to="/videos" className="ca-view-all">VIEW ALL</Link>
                </div>

                <div className="ca-videos-grid">
                  {loading ? (
                    <div className="ca-loading">Loading...</div>
                  ) : videos.length === 0 ? (
                    <div className="ca-empty-state">
                      No videos yet. <Link to="/create-video">Create one</Link>
                    </div>
                  ) : (
                    videos.slice(0, 6).map(video => (
                      <div key={video._id} className="ca-video-card">
                        <div className="ca-video-thumb">
                          <div className="ca-video-placeholder">
                            <span className="material-symbols-outlined">smart_display</span>
                          </div>
                          <span className={`ca-video-status-badge ${getStatusBadgeClass(video.status)}`}>
                            {video.status || 'Pending'}
                          </span>
                        </div>
                        <div className="ca-video-info">
                          <div className="ca-video-topic">{video.topic}</div>
                          <div className="ca-video-title">{video.title}</div>
                          <Link to={`/video/${video._id}`} className="ca-video-link">
                            View Details →
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="ca-sidebar-col">
                {/* Quick Actions */}
                <div className="ca-glass">
                  <div className="ca-glass-title">Quick Actions</div>
                  <div className="ca-actions-list">
                    <Link to="/create-video" className="ca-action-btn">
                      <span className="ca-action-btn-inner">
                        <span className="material-symbols-outlined">add_circle</span>
                        Create New Video
                      </span>
                      <span className="material-symbols-outlined" style={{fontSize:18}}>chevron_right</span>
                    </Link>
                    <Link to="/channels" className="ca-action-btn">
                      <span className="ca-action-btn-inner">
                        <span className="material-symbols-outlined">layers</span>
                        Manage Channels
                      </span>
                      <span className="material-symbols-outlined" style={{fontSize:18}}>chevron_right</span>
                    </Link>
                    <button className="ca-action-btn" onClick={fetchData}>
                      <span className="ca-action-btn-inner">
                        <span className="material-symbols-outlined">refresh</span>
                        Sync Data
                      </span>
                      <span className="material-symbols-outlined" style={{fontSize:18}}>chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Live Pipeline */}
                <div className="ca-glass ca-pipeline">
                  <div className="ca-pipeline-glow" />
                  <div className="ca-glass-title">Live Pipeline</div>
                  <div className="ca-pipeline-stages">
                    <div className="ca-pipeline-stage">
                      <div className="ca-pipeline-stage-header">
                        <span>Script Generation</span>
                        <span className="ca-stage-active">Active</span>
                      </div>
                      <div className="ca-pipeline-bar">
                        <div className="ca-pipeline-fill" style={{width:'66%'}} />
                      </div>
                    </div>
                    <div className="ca-pipeline-stage">
                      <div className="ca-pipeline-stage-header">
                        <span>Voiceover AI</span>
                        <span>Queued</span>
                      </div>
                      <div className="ca-pipeline-bar" />
                    </div>
                    <div className="ca-pipeline-stage">
                      <div className="ca-pipeline-stage-header">
                        <span>Video Rendering</span>
                        <span>Waiting</span>
                      </div>
                      <div className="ca-pipeline-bar" />
                    </div>
                  </div>
                </div>

                {/* Promo */}
                <div className="ca-promo">
                  <h4>Go Turbo with Pro</h4>
                  <p>Unlock 4K rendering and unlimited AI scripts with our Enterprise tier.</p>
                  <button className="ca-promo-btn">Upgrade Now</button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="ca-footer">
            <div className="ca-footer-status">
              <div className="ca-green-dot" />
              <span className="ca-mono-label">All Systems Operational</span>
            </div>
            <div className="ca-footer-links">
              <a href="#">API Docs</a>
              <a href="#">Privacy Policy</a>
              <a href="#">System Status</a>
            </div>
            <span className="ca-footer-copy">© 2024 Channel Auto. v2.4.0-stable</span>
          </footer>
        </main>

        {/* Mobile Nav */}
        <nav className="ca-mobile-nav">
          <Link to="/dashboard" className="active">
            <span className="material-symbols-outlined">dashboard</span>
            Home
          </Link>
          <Link to="/videos">
            <span className="material-symbols-outlined">video_library</span>
            Videos
          </Link>
          <Link to="/create-video">
            <div className="ca-mobile-fab">
              <span className="material-symbols-outlined">add</span>
            </div>
            Create
          </Link>
          <Link to="/channels">
            <span className="material-symbols-outlined">layers</span>
            Channels
          </Link>
          <Link to="/dashboard">
            <span className="material-symbols-outlined">person</span>
            Profile
          </Link>
        </nav>
      </div>
    </>
  );
}
