import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoApi } from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .vl-root {
    min-height: 100vh;
    background-color: #0A0A0A;
    color: #e5e2e1;
    font-family: 'Inter', sans-serif;
    display: flex;
    overflow-x: hidden;
  }

  /* BG */
  .vl-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
  .vl-bg-blob {
    position: absolute;
    border-radius: 999px;
    filter: blur(100px);
  }
  .vl-bg-blob-1 {
    top: -10%; right: -10%;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(255,92,0,0.15) 0%, transparent 70%);
  }
  .vl-bg-blob-2 {
    bottom: -10%; left: -10%;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(255,92,0,0.08) 0%, transparent 70%);
  }

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    font-size: 22px; vertical-align: middle; display: inline-block;
  }

  /* scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0A0A0A; }
  ::-webkit-scrollbar-thumb { background: #353534; border-radius: 10px; }

  /* ---- SIDEBAR ---- */
  .vl-sidebar {
    position: fixed; left: 0; top: 0;
    width: 250px; height: 100vh;
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255,255,255,0.08);
    display: flex; flex-direction: column;
    padding: 40px 0; z-index: 40;
  }
  .vl-logo { padding: 0 24px 32px; }
  .vl-logo-title {
    font-family: 'Sora', sans-serif;
    font-size: 20px; font-weight: 800;
    color: #FF5C00; letter-spacing: -0.01em;
  }
  .vl-logo-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: #e6beb2;
    text-transform: uppercase; letter-spacing: 0.1em;
    margin-top: 3px; opacity: 0.6;
  }
  .vl-nav { flex: 1; }
  .vl-nav a {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 24px; text-decoration: none;
    color: #e6beb2; font-size: 15px; transition: all 0.2s;
  }
  .vl-nav a:hover { background: rgba(255,255,255,0.05); color: #e5e2e1; }
  .vl-nav a.active {
    background: rgba(255,92,0,0.15); color: #ffb59e;
    border-right: 3px solid #ffb59e;
  }
  .vl-sidebar-bottom { padding: 16px 24px 0; }
  .vl-plan-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; padding: 16px; margin-bottom: 8px;
  }
  .vl-plan-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; opacity: 0.4;
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;
  }
  .vl-plan-name { font-size: 15px; font-weight: 700; color: #e5e2e1; margin-bottom: 12px; }
  .vl-plan-btn {
    width: 100%; padding: 8px;
    background: #ff571a; color: #fff;
    font-weight: 700; font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase; letter-spacing: 0.04em;
    border: none; border-radius: 8px; cursor: pointer;
    transition: opacity 0.2s;
  }
  .vl-plan-btn:hover { opacity: 0.9; }
  .vl-help-link {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 0; text-decoration: none;
    color: #e6beb2; font-size: 15px; transition: color 0.2s;
  }
  .vl-help-link:hover { color: #ffb59e; }

  /* ---- MAIN ---- */
  .vl-main { flex: 1; margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; position: relative; z-index: 1; }

  /* ---- TOPBAR ---- */
  .vl-topbar {
    position: sticky; top: 0; z-index: 30;
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 40px;
    background: rgba(255,255,255,0.02);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .vl-topbar-left { display: flex; align-items: center; gap: 10px; }
  .vl-breadcrumb {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: #e6beb2;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .vl-breadcrumb .material-symbols-outlined { font-size: 18px; color: #ffb59e; margin-right: 4px; }
  .vl-topbar-right { display: flex; align-items: center; gap: 16px; }
  .vl-icon-btn {
    background: none; border: none; color: #e6beb2;
    cursor: pointer; transition: color 0.2s; display: flex; align-items: center;
  }
  .vl-icon-btn:hover { color: #ffb59e; }
  .vl-create-btn {
    background: linear-gradient(135deg, #ff571a, #900d00);
    color: #fff; font-weight: 700; font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.04em; text-transform: uppercase;
    padding: 8px 20px; border-radius: 8px; border: none;
    cursor: pointer; text-decoration: none;
    transition: box-shadow 0.2s, transform 0.15s;
    display: inline-flex; align-items: center;
  }
  .vl-create-btn:hover { box-shadow: 0 0 15px rgba(255,92,0,0.4); transform: translateY(-1px); }

  /* ---- CONTENT ---- */
  .vl-content { padding: 40px; max-width: 1280px; margin: 0 auto; width: 100%; }

  /* ---- PAGE HEADER ---- */
  .vl-page-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 40px; flex-wrap: wrap; gap: 16px;
  }
  .vl-page-title {
    font-family: 'Sora', sans-serif;
    font-size: 48px; font-weight: 700;
    letter-spacing: -0.02em; color: #fff;
    line-height: 1.1; margin-bottom: 8px;
  }
  .vl-page-sub { font-size: 18px; color: #e6beb2; }
  .vl-header-btns { display: flex; gap: 12px; align-items: center; }
  .vl-download-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; color: #e5e2e1;
    font-size: 15px; font-weight: 600;
    cursor: pointer; text-decoration: none;
    transition: background 0.2s;
  }
  .vl-download-btn:hover { background: rgba(255,255,255,0.07); }

  /* ---- ERROR ---- */
  .vl-error {
    background: rgba(255,85,59,0.1);
    border: 1px solid rgba(255,85,59,0.3);
    border-radius: 12px; padding: 14px 18px;
    color: #ffb4a6; font-size: 14px; margin-bottom: 32px;
  }

  /* ---- FILTER TABS ---- */
  .vl-filters {
    display: flex; flex-wrap: wrap; gap: 8px;
    margin-bottom: 32px;
  }
  .vl-filter-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px; color: #e6beb2;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;
    cursor: pointer; transition: all 0.2s;
  }
  .vl-filter-btn:hover { border-color: rgba(255,181,158,0.3); color: #e5e2e1; }
  .vl-filter-btn.active {
    background: rgba(255,92,0,0.12);
    border-color: rgba(255,181,158,0.4);
    color: #ffb59e;
  }
  .vl-filter-count {
    background: rgba(255,255,255,0.08);
    border-radius: 999px; padding: 1px 7px;
    font-size: 10px;
  }
  .vl-filter-btn.active .vl-filter-count { background: rgba(255,181,158,0.15); }

  /* ---- TABLE CARD ---- */
  .vl-table-card {
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; overflow: hidden;
  }
  .vl-table { width: 100%; border-collapse: collapse; }
  .vl-table thead tr {
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .vl-table th {
    padding: 14px 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: #e6beb2;
    text-transform: uppercase; letter-spacing: 0.08em;
    text-align: left; font-weight: 500;
    white-space: nowrap;
  }
  .vl-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.2s;
    cursor: default;
  }
  .vl-table tbody tr:last-child { border-bottom: none; }
  .vl-table tbody tr:hover { background: rgba(255,255,255,0.025); }
  .vl-table td {
    padding: 16px 20px;
    font-size: 14px; color: #e5e2e1;
    vertical-align: middle;
  }

  /* topic cell */
  .vl-topic-cell { display: flex; align-items: center; gap: 12px; }
  .vl-topic-icon {
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(255,181,158,0.08);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .vl-topic-icon .material-symbols-outlined { color: #ffb59e; font-size: 18px; }
  .vl-topic-text { font-weight: 600; color: #e5e2e1; }

  /* title cell */
  .vl-title-text {
    color: #e6beb2; font-size: 13px;
    max-width: 200px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* lang cell */
  .vl-lang-tag {
    display: inline-block;
    background: rgba(255,255,255,0.06);
    border-radius: 6px; padding: 3px 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: #e5e2e1;
    text-transform: capitalize;
  }

  /* status badge */
  .vl-status {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.04em;
    padding: 4px 10px; border-radius: 999px;
  }
  .vl-status-dot { width: 6px; height: 6px; border-radius: 999px; }
  .vl-status.uploaded  { background: rgba(16,185,129,0.12); color: #10b981; }
  .vl-status.uploaded .vl-status-dot { background: #10b981; }
  .vl-status.rendered  { background: rgba(165,200,255,0.12); color: #a5c8ff; }
  .vl-status.rendered .vl-status-dot { background: #a5c8ff; }
  .vl-status.voiced    { background: rgba(255,181,158,0.12); color: #ffb59e; }
  .vl-status.voiced .vl-status-dot { background: #ffb59e; }
  .vl-status.scripted  { background: rgba(36,146,255,0.12); color: #2492ff; }
  .vl-status.scripted .vl-status-dot { background: #2492ff; }
  .vl-status.processing,
  .vl-status.rendering { background: rgba(255,92,0,0.12); color: #FF5C00; animation: vl-blink 1.5s ease-in-out infinite; }
  .vl-status.processing .vl-status-dot,
  .vl-status.rendering .vl-status-dot { background: #FF5C00; }
  .vl-status.pending   { background: rgba(255,255,255,0.06); color: #e6beb2; }
  .vl-status.pending .vl-status-dot { background: #e6beb2; }
  @keyframes vl-blink { 0%,100%{opacity:1} 50%{opacity:0.5} }

  /* date */
  .vl-date {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: rgba(230,190,178,0.5);
  }

  /* actions */
  .vl-actions { display: flex; align-items: center; gap: 6px; }
  .vl-action-link {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; color: #e5e2e1;
    font-size: 12px; font-weight: 600;
    text-decoration: none; transition: all 0.2s;
  }
  .vl-action-link:hover { background: rgba(255,181,158,0.1); border-color: rgba(255,181,158,0.25); color: #ffb59e; }
  .vl-action-link .material-symbols-outlined { font-size: 15px; }
  .vl-yt-link {
    color: #a5c8ff; border-color: rgba(165,200,255,0.15);
  }
  .vl-yt-link:hover { background: rgba(165,200,255,0.08); border-color: rgba(165,200,255,0.3); color: #a5c8ff; }

  /* ---- EMPTY / LOADING ---- */
  .vl-empty-wrap, .vl-loading-wrap {
    padding: 80px 32px; text-align: center;
  }
  .vl-empty-icon { color: rgba(255,181,158,0.15); margin-bottom: 20px; }
  .vl-empty-icon .material-symbols-outlined { font-size: 56px; }
  .vl-empty-title {
    font-family: 'Sora', sans-serif;
    font-size: 24px; font-weight: 600; color: #e5e2e1; margin-bottom: 8px;
  }
  .vl-empty-sub { font-size: 15px; color: #e6beb2; margin-bottom: 28px; }
  .vl-empty-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #ff571a, #900d00);
    color: #fff; font-weight: 700; font-size: 14px;
    padding: 12px 24px; border-radius: 10px;
    text-decoration: none; transition: box-shadow 0.2s, transform 0.15s;
  }
  .vl-empty-btn:hover { box-shadow: 0 0 20px rgba(255,87,26,0.3); transform: translateY(-1px); }
  .vl-loading-text { font-size: 15px; color: #e6beb2; }

  /* ---- MOBILE NAV ---- */
  .vl-mobile-nav {
    display: none; position: fixed; bottom: 0; left: 0; right: 0; height: 64px;
    background: rgba(255,255,255,0.03); backdrop-filter: blur(12px);
    border-top: 1px solid rgba(255,255,255,0.08);
    justify-content: space-around; align-items: center; z-index: 50;
  }
  .vl-mobile-nav a, .vl-mobile-nav button {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    text-decoration: none; color: #e6beb2; background: none; border: none;
    font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
    font-family: 'JetBrains Mono', monospace; cursor: pointer;
  }
  .vl-mobile-nav a.active { color: #ffb59e; }
  .vl-mobile-fab {
    width: 44px; height: 44px; margin-top: -20px;
    background: linear-gradient(135deg, #ff571a, #900d00);
    border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(255,87,26,0.4);
    text-decoration: none;
  }
  .vl-mobile-fab .material-symbols-outlined { color: #fff; font-size: 22px; }

  @media (max-width: 900px) {
    .vl-sidebar { display: none; }
    .vl-main { margin-left: 0; }
    .vl-mobile-nav { display: flex; }
    .vl-content { padding: 20px 16px 80px; }
    .vl-topbar { padding: 12px 16px; }
    .vl-page-title { font-size: 32px; }
    .vl-table th:nth-child(2),
    .vl-table td:nth-child(2),
    .vl-table th:nth-child(3),
    .vl-table td:nth-child(3),
    .vl-table th:nth-child(5),
    .vl-table td:nth-child(5) { display: none; }
  }
`;

function StatusBadge({ status }) {
  const s = (status || 'pending').toLowerCase();
  return (
    <span className={`vl-status ${s}`}>
      <span className="vl-status-dot" />
      {status || 'Pending'}
    </span>
  );
}

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await videoApi.getVideos();
      setVideos(res.data.videos || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredVideos = () => {
    if (filter === 'all') return videos;
    return videos.filter(v => v.status === filter);
  };

  const filteredVideos = getFilteredVideos();
  const statusCounts = {
    all: videos.length,
    scripted: videos.filter(v => v.status === 'scripted').length,
    voiced: videos.filter(v => v.status === 'voiced').length,
    rendered: videos.filter(v => v.status === 'rendered').length,
    uploaded: videos.filter(v => v.status === 'uploaded').length,
  };

  return (
    <>
      <style>{styles}</style>
      <div className="vl-root">
        <div className="vl-bg">
          <div className="vl-bg-blob vl-bg-blob-1" />
          <div className="vl-bg-blob vl-bg-blob-2" />
        </div>

        {/* Sidebar */}
        <aside className="vl-sidebar">
          <div className="vl-logo">
            <div className="vl-logo-title">AutoTube</div>
            
          </div>
          <nav className="vl-nav">
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
            <Link to="/create-video">
              <span className="material-symbols-outlined">add_circle</span>
              Create Video
            </Link>
          </nav>
        
          
        </aside>

        {/* Main */}
        <main className="vl-main">
          {/* Topbar */}
          <header className="vl-topbar">
            <div className="vl-topbar-left">
              <span className="vl-breadcrumb">
                <span className="material-symbols-outlined">arrow_back</span>
                Videos / All
              </span>
            </div>
            <div className="vl-topbar-right">
              <button className="vl-icon-btn">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="vl-icon-btn">
                <span className="material-symbols-outlined">settings</span>
              </button>
              <Link to="/create-video" className="vl-create-btn">
                Create Video
              </Link>
            </div>
          </header>

          <div className="vl-content">
            {/* Page header */}
            <div className="vl-page-header">
              <div>
                <h1 className="vl-page-title">All Videos</h1>
                <p className="vl-page-sub">Your full generation history and pipeline status.</p>
              </div>
              <div className="vl-header-btns">
                <button className="vl-download-btn">
                  <span className="material-symbols-outlined" style={{fontSize:18}}>download</span>
                  Export
                </button>
                <Link to="/create-video" className="vl-create-btn" style={{padding:'12px 24px',borderRadius:12,fontSize:14}}>
                  <span className="material-symbols-outlined" style={{fontSize:18,marginRight:6}}>bolt</span>
                  Create New
                </Link>
              </div>
            </div>

            {error && <div className="vl-error">{error}</div>}

            {/* Filter tabs */}
            <div className="vl-filters">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  className={`vl-filter-btn${filter === status ? ' active' : ''}`}
                  onClick={() => setFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="vl-filter-count">{count}</span>
                </button>
              ))}
            </div>

            {/* Table */}
            {loading ? (
              <div className="vl-table-card">
                <div className="vl-loading-wrap">
                  <p className="vl-loading-text">Loading videos...</p>
                </div>
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="vl-table-card">
                <div className="vl-empty-wrap">
                  <div className="vl-empty-icon">
                    <span className="material-symbols-outlined">video_library</span>
                  </div>
                  <div className="vl-empty-title">No videos found</div>
                  <p className="vl-empty-sub">
                    {filter === 'all'
                      ? 'Start your automation pipeline by creating a new video.'
                      : `No videos with status "${filter}".`}
                  </p>
                  {filter === 'all' && (
                    <Link to="/create-video" className="vl-empty-btn">
                      <span className="material-symbols-outlined" style={{fontSize:18}}>add</span>
                      Create your first video
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="vl-table-card">
                <table className="vl-table">
                  <thead>
                    <tr>
                      <th>Topic</th>
                      <th>Title</th>
                      <th>Language</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVideos.map(video => (
                      <tr key={video._id}>
                        <td>
                          <div className="vl-topic-cell">
                            <div className="vl-topic-icon">
                              <span className="material-symbols-outlined">smart_display</span>
                            </div>
                            <span className="vl-topic-text">{video.topic}</span>
                          </div>
                        </td>
                        <td>
                          <span className="vl-title-text">{video.title || '—'}</span>
                        </td>
                        <td>
                          <span className="vl-lang-tag">{video.language || '—'}</span>
                        </td>
                        <td>
                          <StatusBadge status={video.status} />
                        </td>
                        <td>
                          <span className="vl-date">
                            {video.createdAt
                              ? new Date(video.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              : '—'}
                          </span>
                        </td>
                        <td>
                          <div className="vl-actions">
                            <Link to={`/video/${video._id}`} className="vl-action-link">
                              <span className="material-symbols-outlined">open_in_new</span>
                              View
                            </Link>
                            {video.youtubeUrl && (
                              <a
                                href={video.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="vl-action-link vl-yt-link"
                              >
                                <span className="material-symbols-outlined">smart_display</span>
                                YouTube
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Mobile Nav */}
        <nav className="vl-mobile-nav">
          <Link to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            Home
          </Link>
          <Link to="/videos" className="active">
            <span className="material-symbols-outlined">video_library</span>
            Videos
          </Link>
          <Link to="/create-video" className="vl-mobile-fab">
            <span className="material-symbols-outlined">add</span>
          </Link>
          <Link to="/channels">
            <span className="material-symbols-outlined">layers</span>
            Channels
          </Link>
          <Link to="/dashboard">
            <span className="material-symbols-outlined">person</span>
            Account
          </Link>
        </nav>
      </div>
    </>
  );
}
