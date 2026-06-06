import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoApi } from '../services/api';
import '../styles/video-details.css';

export default function VideoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processStep, setProcessStep] = useState(null);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const res = await videoApi.getVideos();
      const found = res.data.videos.find(v => v._id === id);
      setVideo(found);
    } catch (err) {
      setError('Failed to load video');
    }
  };

  const executeStep = async (step, fn) => {
    setProcessStep(step);
    setLoading(true);
    setError('');
    try {
      await fn();
      await fetchVideo();
      setProcessStep(null);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${step}`);
      setProcessStep(null);
    } finally {
      setLoading(false);
    }
  };

  if (!video) return <div className="page-container"><p>Loading...</p></div>;

  return (
    <div className="page-container video-details-page">
      <div className="video-header">
        <h1>{video.topic}</h1>
        <div className="video-meta">
          <span className={`status status-${video.status}`}>{video.status}</span>
          <span className="language">{video.language}</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="video-content">
        <aside className="video-info">
          <div className="info-card">
            <h3>Video Information</h3>
            <p><strong>Title:</strong> {video.title || 'Not generated'}</p>
            <p><strong>Language:</strong> {video.language}</p>
            <p><strong>Status:</strong> {video.status}</p>
            <p><strong>Created:</strong> {new Date(video.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="info-card">
            <h3>Links</h3>
            {video.youtubeUrl && (
              <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                View on YouTube
              </a>
            )}
            {video.renderedVideoPath && (
              <a href={`http://localhost:8000/${video.renderedVideoPath}`} download className="btn-secondary">
                Download Video
              </a>
            )}
          </div>
        </aside>

        <main className="video-process">
          <h2>Generation Process</h2>
          
          <div className="process-steps">
            <div className={`step ${video.title ? 'completed' : ''} ${processStep === 'script' ? 'active' : ''}`}>
              <div className="step-header">
                <h3>1. Generate Script</h3>
                {video.title && <span className="checkmark">✓</span>}
              </div>
              {video.title && (
                <div className="step-content">
                  <p><strong>Title:</strong> {video.title}</p>
                  <p><strong>Hook:</strong> {video.hook}</p>
                </div>
              )}
              <button
                onClick={() => executeStep('script', () => videoApi.generateScript(id))}
                disabled={loading}
                className="btn-action"
              >
                {video.title ? 'Regenerate' : 'Generate'} Script
              </button>
            </div>

            <div className={`step ${video.seoTitle ? 'completed' : ''} ${processStep === 'seo' ? 'active' : ''}`}>
              <div className="step-header">
                <h3>2. Generate SEO</h3>
                {video.seoTitle && <span className="checkmark">✓</span>}
              </div>
              {video.seoTitle && (
                <div className="step-content">
                  <p><strong>SEO Title:</strong> {video.seoTitle}</p>
                  <p><strong>Description:</strong> {video.seoDescription}</p>
                </div>
              )}
              <button
                onClick={() => executeStep('seo', () => videoApi.generateSEO(id))}
                disabled={loading || !video.title}
                className="btn-action"
              >
                {video.seoTitle ? 'Regenerate' : 'Generate'} SEO
              </button>
            </div>

            <div className={`step ${video.hindiVoicePath || video.englishVoicePath ? 'completed' : ''} ${processStep === 'voice' ? 'active' : ''}`}>
              <div className="step-header">
                <h3>3. Generate Voice</h3>
                {(video.hindiVoicePath || video.englishVoicePath) && <span className="checkmark">✓</span>}
              </div>
              <button
                onClick={() => executeStep('voice', () => videoApi.generateVoice(id))}
                disabled={loading || !video.title}
                className="btn-action"
              >
                {(video.hindiVoicePath || video.englishVoicePath) ? 'Regenerate' : 'Generate'} Voice
              </button>
            </div>

            <div className={`step ${video.renderedVideoPath ? 'completed' : ''} ${processStep === 'render' ? 'active' : ''}`}>
              <div className="step-header">
                <h3>4. Render Video</h3>
                {video.renderedVideoPath && <span className="checkmark">✓</span>}
              </div>
              <button
                onClick={() => executeStep('render', () => videoApi.renderVideo(id))}
                disabled={loading || !(video.hindiVoicePath || video.englishVoicePath)}
                className="btn-action"
              >
                {video.renderedVideoPath ? 'Regenerate' : 'Render'} Video
              </button>
            </div>

            <div className={`step ${video.youtubeUrl ? 'completed' : ''} ${processStep === 'upload' ? 'active' : ''}`}>
              <div className="step-header">
                <h3>5. Upload to YouTube</h3>
                {video.youtubeUrl && <span className="checkmark">✓</span>}
              </div>
              {video.youtubeUrl && (
                <div className="step-content">
                  <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    {video.youtubeUrl}
                  </a>
                </div>
              )}
              <button
                onClick={() => executeStep('upload', () => videoApi.uploadToYoutube(id))}
                disabled={loading || !video.renderedVideoPath}
                className="btn-action"
              >
                Upload to YouTube
              </button>
            </div>

            <div className="step quick-action">
              <h3>Quick Action</h3>
              <button
                onClick={() => executeStep('auto-generate', () => videoApi.autoGenerateVideo(id))}
                disabled={loading}
                className="btn-primary-large"
              >
                🚀 Auto Generate Everything
              </button>
            </div>
          </div>
        </main>
      </div>

      <div className="page-actions">
        <button onClick={() => navigate('/videos')} className="btn-secondary">Back to Videos</button>
      </div>
    </div>
  );
}
