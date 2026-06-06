import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoApi } from '../services/api';
import '../styles/videos-list.css';

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
    uploaded: videos.filter(v => v.status === 'uploaded').length
  };

  return (
    <div className="page-container videos-page">
      <div className="page-header">
        <h1>All Videos</h1>
        <Link to="/create-video" className="btn-primary">+ Create New</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-tabs">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`filter-tab ${filter === status ? 'active' : ''}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading videos...</div>
      ) : filteredVideos.length === 0 ? (
        <div className="empty-state">
          <p>No videos found</p>
          <Link to="/create-video" className="btn-primary">Create your first video</Link>
        </div>
      ) : (
        <div className="videos-table">
          <table>
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
                  <td>{video.topic}</td>
                  <td>{video.title || '-'}</td>
                  <td>{video.language}</td>
                  <td>
                    <span className={`status-badge status-${video.status}`}>
                      {video.status}
                    </span>
                  </td>
                  <td>{new Date(video.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <Link to={`/video/${video._id}`} className="btn-link">View</Link>
                    {video.youtubeUrl && (
                      <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-link">
                        YouTube
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
