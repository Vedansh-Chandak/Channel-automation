import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rg-root {
    min-height: 100vh;
    background-color: #0A0A0A;
    background-image:
      radial-gradient(circle at 0% 0%, rgba(255,92,0,0.05) 0%, transparent 50%),
      radial-gradient(circle at 100% 100%, rgba(255,180,166,0.05) 0%, transparent 50%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    color: #e5e2e1;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    font-size: 20px; vertical-align: middle; display: inline-block;
  }

  /* BG blobs */
  .rg-blob {
    position: fixed; border-radius: 999px;
    filter: blur(120px); pointer-events: none;
  }
  .rg-blob-1 {
    top: -10%; right: -10%;
    width: 600px; height: 600px;
    background: rgba(255,92,0,0.1);
  }
  .rg-blob-2 {
    bottom: -10%; left: -10%;
    width: 600px; height: 600px;
    background: rgba(255,180,166,0.08);
  }

  /* Floating elements */
  .rg-float {
    position: fixed; display: none;
    animation: rg-float 6s ease-in-out infinite;
  }
  @media (min-width: 1024px) { .rg-float { display: block; } }
  @keyframes rg-float {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  .rg-float-box {
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }

  /* ---- MAIN CONTENT ---- */
  .rg-main {
    position: relative; z-index: 10;
    width: 100%; max-width: 480px;
  }

  /* Branding */
  .rg-brand { text-align: center; margin-bottom: 40px; }
  .rg-brand-title {
    font-family: 'Sora', sans-serif;
    font-size: 48px; font-weight: 700;
    letter-spacing: -0.02em; color: #e5e2e1;
    line-height: 1.1; margin-bottom: 8px;
  }
  .rg-brand-title span { color: #FF5C00; }
  .rg-brand-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: #e6beb2;
    text-transform: uppercase; letter-spacing: 0.12em;
  }

  /* Card */
  .rg-card {
    background: rgba(18,18,18,0.6);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    position: relative; overflow: hidden;
  }
  .rg-card-glow {
    position: absolute; top: -96px; right: -96px;
    width: 192px; height: 192px;
    background: rgba(255,181,158,0.08);
    border-radius: 999px; filter: blur(60px);
    pointer-events: none;
  }

  .rg-card-header { margin-bottom: 32px; }
  .rg-card-title {
    font-family: 'Sora', sans-serif;
    font-size: 24px; font-weight: 600; color: #e5e2e1;
    margin-bottom: 6px;
  }
  .rg-card-sub { font-size: 15px; color: #e6beb2; }

  /* Error */
  .rg-error {
    background: rgba(255,85,59,0.1);
    border: 1px solid rgba(255,85,59,0.3);
    border-radius: 10px; padding: 12px 16px;
    color: #ffb4a6; font-size: 14px;
    margin-bottom: 24px;
    display: flex; align-items: center; gap: 10px;
  }
  .rg-error .material-symbols-outlined { font-size: 18px; flex-shrink: 0; }

  /* Form */
  .rg-form { display: flex; flex-direction: column; gap: 20px; }

  .rg-field { display: flex; flex-direction: column; gap: 8px; }
  .rg-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: #e6beb2;
    text-transform: uppercase; letter-spacing: 0.1em;
  }
  .rg-input-wrap {
    display: flex; align-items: center; gap: 12px;
    background: #050505;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 14px 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .rg-input-wrap:focus-within {
    border-color: #ffb59e;
    box-shadow: 0 0 0 2px rgba(255,181,158,0.12);
  }
  .rg-input-wrap .material-symbols-outlined { color: #e6beb2; flex-shrink: 0; }
  .rg-input {
    background: transparent; border: none; outline: none;
    color: #e5e2e1; font-size: 15px; font-family: 'Inter', sans-serif;
    width: 100%;
  }
  .rg-input::placeholder { color: rgba(255,255,255,0.2); }

  .rg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 480px) { .rg-row { grid-template-columns: 1fr; } }

  /* Submit */
  .rg-submit {
    width: 100%; padding: 16px;
    background: linear-gradient(135deg, #ff571a 0%, #ffb4a6 100%);
    color: #3a0b00; font-family: 'Sora', sans-serif;
    font-size: 16px; font-weight: 700;
    border: none; border-radius: 10px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: box-shadow 0.3s, transform 0.15s;
    margin-top: 4px;
  }
  .rg-submit:hover:not(:disabled) {
    box-shadow: 0 0 20px rgba(255,87,26,0.4);
    transform: translateY(-1px);
  }
  .rg-submit:active:not(:disabled) { transform: scale(0.98); }
  .rg-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  /* Footer */
  .rg-footer {
    margin-top: 28px; padding-top: 28px;
    border-top: 1px solid rgba(255,255,255,0.08);
    text-align: center;
    font-size: 15px; color: #e6beb2;
  }
  .rg-footer a {
    color: #e5e2e1; font-weight: 600; margin-left: 4px;
    text-decoration: none; transition: color 0.2s;
  }
  .rg-footer a:hover { color: #ffb59e; }

  /* Social proof */
  .rg-proof { margin-top: 48px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .rg-proof-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: #353534;
    text-transform: uppercase; letter-spacing: 0.12em;
  }
  .rg-proof-logos {
    display: flex; gap: 32px; opacity: 0.35;
    transition: opacity 0.5s;
  }
  .rg-proof-logos:hover { opacity: 0.7; }
  .rg-proof-logo {
    display: flex; align-items: center; gap: 6px;
    font-family: 'Sora', sans-serif; font-size: 13px;
    color: #e5e2e1;
  }
  .rg-proof-logo .material-symbols-outlined { font-size: 20px; }
`;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rg-root">

        {/* BG */}
        <div className="rg-blob rg-blob-1" />
        <div className="rg-blob rg-blob-2" />

        {/* Floating decorative elements */}
        <div className="rg-float" style={{left:'10%', top:'20%', animationDelay:'0s'}}>
          <div className="rg-float-box" style={{width:64,height:64,border:'1px solid rgba(255,181,158,0.2)',borderRadius:12,transform:'rotate(12deg)'}}>
            <span className="material-symbols-outlined" style={{color:'#ffb59e',fontSize:28}}>video_camera_back</span>
          </div>
        </div>
        <div className="rg-float" style={{right:'12%', bottom:'25%', animationDelay:'-2s'}}>
          <div className="rg-float-box" style={{width:80,height:80,border:'1px solid rgba(255,180,166,0.2)',borderRadius:'999px',transform:'rotate(-6deg)'}}>
            <span className="material-symbols-outlined" style={{color:'#ffb4a6',fontSize:36}}>auto_videocam</span>
          </div>
        </div>
        <div className="rg-float" style={{left:'15%', bottom:'15%', animationDelay:'-4s'}}>
          <div className="rg-float-box" style={{width:48,height:48,border:'1px solid rgba(255,255,255,0.06)',borderRadius:8,transform:'rotate(45deg)'}}>
            <span className="material-symbols-outlined" style={{color:'#e6beb2',fontSize:20,transform:'rotate(-45deg)'}}>settings_input_component</span>
          </div>
        </div>

        <main className="rg-main">
          {/* Brand */}
          <div className="rg-brand">
            <h1 className="rg-brand-title">Channel<span>Auto</span></h1>
            <p className="rg-brand-sub">Professional Automation Suite</p>
          </div>

          {/* Card */}
          <div className="rg-card">
            <div className="rg-card-glow" />
            <div className="rg-card-header">
              <h2 className="rg-card-title">Create Account</h2>
              <p className="rg-card-sub">Join the next generation of content creators.</p>
            </div>

            {error && (
              <div className="rg-error">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            <form className="rg-form" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="rg-field">
                <label className="rg-label">Full Name</label>
                <div className="rg-input-wrap">
                  <span className="material-symbols-outlined">person</span>
                  <input
                    className="rg-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="rg-field">
                <label className="rg-label">Email Address</label>
                <div className="rg-input-wrap">
                  <span className="material-symbols-outlined">alternate_email</span>
                  <input
                    className="rg-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@channelauto.io"
                    required
                  />
                </div>
              </div>

              {/* Password row */}
              <div className="rg-row">
                <div className="rg-field">
                  <label className="rg-label">Password</label>
                  <div className="rg-input-wrap">
                    <span className="material-symbols-outlined">lock</span>
                    <input
                      className="rg-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div className="rg-field">
                  <label className="rg-label">Confirm</label>
                  <div className="rg-input-wrap">
                    <span className="material-symbols-outlined">security</span>
                    <input
                      className="rg-input"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="rg-submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
                {!loading && <span className="material-symbols-outlined" style={{fontSize:20}}>arrow_forward</span>}
              </button>
            </form>

            <div className="rg-footer">
              Already have an account?
              <Link to="/login">Sign In</Link>
            </div>
          </div>

          {/* Social proof */}
          <div className="rg-proof">
            <span className="rg-proof-label">Trusted by 10,000+ Creators</span>
            <div className="rg-proof-logos">
              <div className="rg-proof-logo">
                <span className="material-symbols-outlined">movie</span>
                Creator Studio
              </div>
              <div className="rg-proof-logo">
                <span className="material-symbols-outlined">bolt</span>
                AutoFlow
              </div>
              <div className="rg-proof-logo">
                <span className="material-symbols-outlined">stream</span>
                LiveSync
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
