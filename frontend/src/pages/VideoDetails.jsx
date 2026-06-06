import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { videoApi } from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .vd-root {
    min-height: 100vh;
    background-color: #0A0A0A;
    color: #e5e2e1;
    font-family: 'Inter', sans-serif;
    display: flex;
    overflow-x: hidden;
  }

  /* BG */
  .vd-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
  .vd-bg-1 {
    position: absolute; top: -10%; right: -10%;
    width: 600px; height: 600px;
    background: radial-gradient(circle at 50% 50%, rgba(255,92,0,0.15) 0%, transparent 70%);
    border-radius: 999px; filter: blur(100px);
  }
  .vd-bg-2 {
    position: absolute; bottom: -10%; left: -10%;
    width: 500px; height: 500px;
    background: radial-gradient(circle at 50% 50%, rgba(255,92,0,0.08) 0%, transparent 70%);
    border-radius: 999px; filter: blur(100px);
  }

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    font-size: 22px; vertical-align: middle; display: inline-block;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0A0A0A; }
  ::-webkit-scrollbar-thumb { background: #353534; border-radius: 10px; }

  /* ---- SIDEBAR ---- */
  .vd-sidebar {
    position: fixed; left: 0; top: 0;
    width: 280px; height: 100vh;
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255,255,255,0.08);
    display: flex; flex-direction: column;
    padding: 40px 0; z-index: 40;
  }
  .vd-logo { padding: 0 24px 32px; }
  .vd-logo-title {
    font-family: 'Sora', sans-serif;
    font-size: 20px; font-weight: 800; color: #FF5C00;
  }
  .vd-logo-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: #e6beb2;
    text-transform: uppercase; letter-spacing: 0.1em;
    margin-top: 3px; opacity: 0.6;
  }
  .vd-nav { flex: 1; }
  .vd-nav a {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 24px; text-decoration: none;
    color: #e6beb2; font-size: 15px; transition: all 0.2s;
  }
  .vd-nav a:hover { background: rgba(255,255,255,0.05); color: #e5e2e1; }
  .vd-nav a.active {
    background: rgba(255,92,0,0.15); color: #ffb59e;
    border-right: 3px solid #ffb59e;
  }
  .vd-sidebar-bottom { padding: 0 24px; }
  .vd-plan-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; padding: 16px; margin-bottom: 8px;
  }
  .vd-plan-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; opacity: 0.5;
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;
  }
  .vd-plan-name { font-size: 15px; font-weight: 700; color: #e5e2e1; margin-bottom: 12px; }
  .vd-plan-btn {
    width: 100%; padding: 8px;
    background: #ff571a; color: #fff;
    font-weight: 700; font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase; letter-spacing: 0.04em;
    border: none; border-radius: 8px; cursor: pointer; transition: opacity 0.2s;
  }
  .vd-plan-btn:hover { opacity: 0.9; }
  .vd-help-link {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 0; text-decoration: none;
    color: #e6beb2; font-size: 15px; transition: color 0.2s;
  }
  .vd-help-link:hover { color: #ffb59e; }

  /* ---- MAIN ---- */
  .vd-main { flex: 1; margin-left: 280px; min-height: 100vh; position: relative; z-index: 1; }

  /* ---- TOPBAR ---- */
  .vd-topbar {
    position: sticky; top: 0; z-index: 30;
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 40px;
    background: rgba(255,255,255,0.02);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .vd-breadcrumb {
    display: flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: #e6beb2;
    text-transform: uppercase; letter-spacing: 0.08em;
    text-decoration: none;
    transition: color 0.2s;
  }
  .vd-breadcrumb:hover { color: #ffb59e; }
  .vd-breadcrumb .material-symbols-outlined { font-size: 18px; color: #ffb59e; }
  .vd-topbar-right { display: flex; align-items: center; gap: 16px; }
  .vd-icon-btn {
    background: none; border: none; color: #e6beb2;
    cursor: pointer; transition: color 0.2s; display: flex; align-items: center;
  }
  .vd-icon-btn:hover { color: #ffb59e; }
  .vd-avatar {
    width: 40px; height: 40px; border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.08); overflow: hidden;
    background: linear-gradient(135deg, #ff571a, #5e1700);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 700; font-family: 'Sora', sans-serif; font-size: 15px;
  }
  .vd-create-btn {
    background: linear-gradient(135deg, #ff571a, #900d00);
    color: #fff; font-weight: 700; font-size: 12px;
    font-family: 'JetBrains Mono', monospace; text-transform: uppercase;
    letter-spacing: 0.04em; padding: 8px 20px; border-radius: 8px; border: none;
    cursor: pointer; text-decoration: none; transition: box-shadow 0.2s, transform 0.15s;
    display: inline-flex; align-items: center;
  }
  .vd-create-btn:hover { box-shadow: 0 0 15px rgba(255,92,0,0.4); transform: translateY(-1px); }

  /* ---- CONTENT ---- */
  .vd-content { padding: 32px 40px; max-width: 1280px; margin: 0 auto; }

  /* ---- PAGE HEADER ---- */
  .vd-page-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 40px; flex-wrap: wrap; gap: 16px;
  }
  .vd-page-title {
    font-family: 'Sora', sans-serif;
    font-size: 48px; font-weight: 700;
    letter-spacing: -0.02em; color: #fff;
    line-height: 1.1; margin-bottom: 8px;
  }
  .vd-page-sub { font-size: 18px; color: #e6beb2; max-width: 640px; opacity: 0.7; }
  .vd-header-btns { display: flex; gap: 12px; align-items: center; }
  .vd-dl-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; color: #e5e2e1;
    font-size: 15px; font-weight: 600;
    cursor: pointer; text-decoration: none; transition: background 0.2s;
  }
  .vd-dl-btn:hover { background: rgba(255,255,255,0.07); }
  .vd-auto-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #ff571a, #900d00);
    color: #fff; font-weight: 700; font-size: 15px;
    border: none; border-radius: 12px; cursor: pointer;
    transition: box-shadow 0.3s, transform 0.15s;
  }
  .vd-auto-btn:hover:not(:disabled) { box-shadow: 0 0 20px rgba(255,87,26,0.4); transform: translateY(-1px); }
  .vd-auto-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  /* ---- ERROR ---- */
  .vd-error {
    background: rgba(255,85,59,0.1);
    border: 1px solid rgba(255,85,59,0.3);
    border-radius: 12px; padding: 14px 18px;
    color: #ffb4a6; font-size: 14px; margin-bottom: 24px;
    display: flex; align-items: center; gap: 10px;
  }

  /* ---- GRID ---- */
  .vd-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
  .vd-col-main { grid-column: span 2; display: flex; flex-direction: column; gap: 24px; }
  .vd-col-side { display: flex; flex-direction: column; gap: 24px; }

  /* ---- GLASS ---- */
  .vd-glass {
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    transition: all 0.3s;
  }

  /* ---- PIPELINE STEPS ---- */
  .vd-steps-card { padding: 32px; position: relative; overflow: hidden; }
  .vd-steps-row {
    display: flex; justify-content: space-between; align-items: flex-start;
    position: relative; z-index: 1;
  }
  .vd-step { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .vd-step-circle {
    border-radius: 999px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    position: relative; transition: all 0.3s;
  }
  .vd-step-circle.done {
    border-color: #ffb4a6; color: #ffb4a6;
  }
  .vd-step-circle.done .material-symbols-outlined { color: #ffb4a6; }
  .vd-step-circle.active {
    border-color: #FF5C00; color: #FF5C00;
    animation: vd-pulse 2s ease-in-out infinite;
  }
  .vd-step-circle.active .material-symbols-outlined { color: #FF5C00; }
  .vd-step-circle.pending { opacity: 0.35; }
  @keyframes vd-pulse {
    0%,100% { box-shadow: 0 0 5px rgba(255,92,0,0.2); transform: scale(1); }
    50% { box-shadow: 0 0 20px rgba(255,92,0,0.4); transform: scale(1.05); }
  }
  .vd-step-badge {
    position: absolute; top: -4px; right: -4px;
    width: 20px; height: 20px; border-radius: 999px;
    background: #ffb4a6;
    display: flex; align-items: center; justify-content: center;
  }
  .vd-step-badge .material-symbols-outlined { font-size: 13px; color: #660700; }
  .vd-step-processing-badge {
    position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);
    background: #FF5C00; color: #fff;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; font-weight: 700;
    padding: 2px 8px; border-radius: 999px; white-space: nowrap;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .vd-step-label {
    text-align: center;
  }
  .vd-step-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;
    margin-bottom: 2px;
  }
  .vd-step-name { font-size: 14px; font-weight: 700; color: #e5e2e1; }
  .vd-step-connector { height: 2px; flex: 1; margin-top: 32px; opacity: 0.3; }
  .vd-step-connector.done { background: #ffb4a6; }
  .vd-step-connector.pending { background: #5c4037; }

  .vd-progress-bar {
    position: absolute; bottom: 0; left: 0; height: 3px;
    background: linear-gradient(90deg, #ffb4a6, #FF5C00, transparent);
    border-radius: 0 0 0 20px;
  }

  /* ---- DETAIL CARDS ---- */
  .vd-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .vd-status-card { padding: 24px; display: flex; flex-direction: column; justify-content: space-between; }
  .vd-status-top { margin-bottom: 20px; }
  .vd-status-indicator { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .vd-pulse-dot {
    width: 8px; height: 8px; background: #FF5C00;
    border-radius: 999px;
    animation: vd-dot-pulse 1.5s ease-in-out infinite;
  }
  @keyframes vd-dot-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
  .vd-status-title {
    font-family: 'Sora', sans-serif;
    font-size: 20px; font-weight: 600; color: #e5e2e1;
  }
  .vd-status-desc { font-size: 14px; color: #e6beb2; line-height: 1.6; }
  .vd-progress-label {
    display: flex; justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: #e6beb2; margin-bottom: 6px;
  }
  .vd-progress-label span:last-child { color: #FF5C00; }
  .vd-progress-track {
    width: 100%; height: 8px;
    background: #201f1f; border-radius: 999px; overflow: hidden;
  }
  .vd-progress-fill {
    height: 100%; background: #FF5C00; border-radius: 999px;
  }

  .vd-preview-card { position: relative; overflow: hidden; min-height: 240px; }
  .vd-preview-placeholder {
    width: 100%; height: 100%; min-height: 240px;
    background: linear-gradient(135deg, #1c1b1b, #201f1f);
    display: flex; align-items: center; justify-content: center;
  }
  .vd-preview-placeholder .material-symbols-outlined { font-size: 48px; color: rgba(255,181,158,0.1); }
  .vd-preview-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    display: flex; align-items: flex-end; padding: 20px;
  }
  .vd-play-btn {
    width: 40px; height: 40px; border-radius: 999px;
    background: rgba(255,255,255,0.1); backdrop-filter: blur(8px);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    margin-right: 12px; transition: background 0.2s;
  }
  .vd-play-btn:hover { background: rgba(255,255,255,0.2); }
  .vd-play-btn .material-symbols-outlined { color: #fff; font-size: 20px; }
  .vd-preview-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: rgba(255,255,255,0.7);
  }

  /* ---- CONSOLE ---- */
  .vd-console-card { padding: 24px; }
  .vd-console-title {
    font-family: 'Sora', sans-serif;
    font-size: 18px; font-weight: 600; color: #e5e2e1; margin-bottom: 16px;
  }
  .vd-console {
    background: #050505;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; padding: 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; color: rgba(230,190,178,0.7);
    height: 180px; overflow-y: auto;
    display: flex; flex-direction: column; gap: 6px;
  }
  .vd-log { display: flex; gap: 16px; }
  .vd-log-ts.done { color: #ffb4a6; }
  .vd-log-ts.active { color: #FF5C00; }
  .vd-log-processing { animation: vd-dot-pulse 1.5s ease-in-out infinite; }

  /* ---- PIPELINE STEP ACTIONS ---- */
  .vd-pipeline-steps { display: flex; flex-direction: column; gap: 12px; }
  .vd-step-action {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px; padding: 20px;
    transition: border-color 0.2s;
  }
  .vd-step-action.is-done { border-color: rgba(255,180,166,0.2); }
  .vd-step-action.is-active { border-color: rgba(255,92,0,0.3); }
  .vd-step-action-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 12px;
  }
  .vd-step-action-title-row { display: flex; align-items: center; gap: 10px; }
  .vd-step-action-icon {
    width: 36px; height: 36px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .vd-step-action-icon.done { background: rgba(255,180,166,0.1); }
  .vd-step-action-icon.done .material-symbols-outlined { color: #ffb4a6; font-size: 18px; }
  .vd-step-action-icon.active { background: rgba(255,92,0,0.1); }
  .vd-step-action-icon.active .material-symbols-outlined { color: #FF5C00; font-size: 18px; }
  .vd-step-action-icon.pending { background: rgba(255,255,255,0.04); }
  .vd-step-action-icon.pending .material-symbols-outlined { color: #e6beb2; font-size: 18px; }
  .vd-step-action-name {
    font-size: 15px; font-weight: 600; color: #e5e2e1;
  }
  .vd-step-action-status {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;
    padding: 3px 8px; border-radius: 999px;
  }
  .vd-step-action-status.done { background: rgba(255,180,166,0.1); color: #ffb4a6; }
  .vd-step-action-status.active { background: rgba(255,92,0,0.1); color: #FF5C00; animation: vd-dot-pulse 1.5s ease-in-out infinite; }
  .vd-step-action-status.pending { background: rgba(255,255,255,0.05); color: #e6beb2; }

  .vd-step-content {
    background: rgba(255,255,255,0.02);
    border-radius: 8px; padding: 12px 14px; margin-bottom: 12px;
    font-size: 13px; color: #e6beb2; line-height: 1.5;
  }
  .vd-step-content strong { color: #e5e2e1; }
  .vd-step-content a { color: #a5c8ff; text-decoration: none; word-break: break-all; }
  .vd-step-content a:hover { text-decoration: underline; }

  .vd-step-btn {
    padding: 9px 16px;
    border-radius: 8px; border: none;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.2s;
  }
  .vd-step-btn.primary {
    background: rgba(255,181,158,0.12);
    border: 1px solid rgba(255,181,158,0.2);
    color: #ffb59e;
  }
  .vd-step-btn.primary:hover:not(:disabled) { background: rgba(255,181,158,0.2); }
  .vd-step-btn.disabled-look, .vd-step-btn:disabled {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    color: rgba(230,190,178,0.3); cursor: not-allowed;
  }
  .vd-step-btn.loading-look {
    background: rgba(255,92,0,0.1);
    border: 1px solid rgba(255,92,0,0.2);
    color: #FF5C00;
  }

  /* ---- SIDEBAR CARDS ---- */
  .vd-meta-card { padding: 24px; }
  .vd-meta-title {
    font-family: 'Sora', sans-serif;
    font-size: 22px; font-weight: 600; color: #e5e2e1; margin-bottom: 24px;
  }
  .vd-meta-fields { display: flex; flex-direction: column; gap: 20px; }
  .vd-meta-field {}
  .vd-meta-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: rgba(230,190,178,0.4);
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 4px;
  }
  .vd-meta-value { font-size: 15px; font-weight: 600; color: #e5e2e1; }
  .vd-meta-tag {
    display: inline-block;
    background: #201f1f; border-radius: 6px;
    padding: 3px 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: #e5e2e1;
  }
  .vd-meta-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .vd-meta-divider { height: 1px; background: rgba(255,255,255,0.06); }
  .vd-seo-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .vd-seo-tag {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px; padding: 3px 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: #ffb4a6;
  }

  .vd-actions-card { padding: 24px; }
  .vd-actions-title {
    font-family: 'Sora', sans-serif;
    font-size: 20px; font-weight: 600; color: #e5e2e1; margin-bottom: 16px;
  }
  .vd-action-row {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 12px 14px; border-radius: 12px;
    background: none; border: none; cursor: pointer;
    transition: background 0.2s; text-decoration: none;
    color: inherit;
  }
  .vd-action-row:hover { background: #201f1f; }
  .vd-action-left { display: flex; align-items: center; gap: 12px; font-size: 15px; color: #e5e2e1; }
  .vd-action-left .material-symbols-outlined { color: #ffb59e; font-size: 20px; }
  .vd-action-left.danger { color: #ffb4ab; }
  .vd-action-left.danger .material-symbols-outlined { color: #ffb4ab; }
  .vd-action-chevron { color: rgba(255,255,255,0.2); font-size: 18px !important; }

  .vd-perf-card {
    padding: 24px;
    background: linear-gradient(135deg, rgba(255,92,0,0.05), transparent);
  }
  .vd-perf-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; opacity: 0.4;
    text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px;
  }
  .vd-perf-value {
    font-family: 'Sora', sans-serif;
    font-size: 48px; font-weight: 700;
    letter-spacing: -0.02em; line-height: 1; color: #fff;
    margin-bottom: 4px;
  }
  .vd-perf-sub { font-size: 11px; color: rgba(230,190,178,0.5); font-family: 'JetBrains Mono', monospace; margin-bottom: 12px; }
  .vd-perf-trend {
    display: inline-flex; align-items: center; gap: 4px;
    color: #10b981; font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 700;
  }
  .vd-perf-trend .material-symbols-outlined { font-size: 14px; }

  /* ---- LOADING / EMPTY ---- */
  .vd-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh;
    font-size: 15px; color: #e6beb2;
  }

  /* ---- MOBILE NAV ---- */
  .vd-mobile-nav {
    display: none; position: fixed; bottom: 0; left: 0; right: 0; height: 64px;
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(12px);
    border-top: 1px solid rgba(255,255,255,0.08);
    justify-content: space-around; align-items: center; z-index: 50;
  }
  .vd-mobile-nav a, .vd-mobile-nav button {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    text-decoration: none; color: #e6beb2; background: none; border: none;
    font-size: 9px; font-weight: 700; text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace; cursor: pointer;
  }
  .vd-mobile-nav a.active { color: #ffb59e; }
  .vd-mobile-fab {
    width: 44px; height: 44px; margin-top: -20px;
    background: linear-gradient(135deg, #ff571a, #900d00);
    border-radius: 999px; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(255,87,26,0.4); text-decoration: none;
  }
  .vd-mobile-fab .material-symbols-outlined { color: #fff; font-size: 22px; }

  @media (max-width: 900px) {
    .vd-sidebar { display: none; }
    .vd-main { margin-left: 0; }
    .vd-mobile-nav { display: flex; }
    .vd-content { padding: 20px 16px 80px; }
    .vd-topbar { padding: 12px 16px; }
    .vd-page-title { font-size: 28px; }
    .vd-grid { grid-template-columns: 1fr; }
    .vd-col-main { grid-column: span 1; }
    .vd-detail-grid { grid-template-columns: 1fr; }
  }
`;

const STEPS = [
  { key: 'script',  label: 'Script',  icon: 'description',       num: 1 },
  { key: 'seo',     label: 'SEO',     icon: 'search',             num: 2 },
  { key: 'voice',   label: 'Voice',   icon: 'record_voice_over',  num: 3 },
  { key: 'render',  label: 'Render',  icon: 'movie_edit',         num: 4 },
  { key: 'youtube', label: 'YouTube', icon: 'smart_display',      num: 5 },
];

function getStepState(key, video) {
  if (key === 'script')  return video?.title ? 'done' : 'pending';
  if (key === 'seo')     return video?.seoTitle ? 'done' : 'pending';
  if (key === 'voice')   return (video?.hindiVoicePath || video?.englishVoicePath) ? 'done' : 'pending';
  if (key === 'render')  return video?.renderedVideoPath ? 'done' : 'pending';
  if (key === 'youtube') return video?.youtubeUrl ? 'done' : 'pending';
  return 'pending';
}

function getActiveStep(video) {
  if (!video?.title) return 'script';
  if (!video?.seoTitle) return 'seo';
  if (!video?.hindiVoicePath && !video?.englishVoicePath) return 'voice';
  if (!video?.renderedVideoPath) return 'render';
  if (!video?.youtubeUrl) return 'youtube';
  return null;
}

function getProgressWidth(video) {
  let done = 0;
  if (video?.title) done++;
  if (video?.seoTitle) done++;
  if (video?.hindiVoicePath || video?.englishVoicePath) done++;
  if (video?.renderedVideoPath) done++;
  if (video?.youtubeUrl) done++;
  return `${(done / 5) * 100}%`;
}

export default function VideoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processStep, setProcessStep] = useState(null);
  const consoleRef = useRef(null);
  const [logs, setLogs] = useState([
    { ts: new Date().toLocaleTimeString(), msg: 'Pipeline initialized.', type: 'done' },
  ]);

  useEffect(() => { fetchVideo(); }, [id]);

  const fetchVideo = async () => {
    try {
      const res = await videoApi.getVideos();
      const found = res.data.videos.find(v => v._id === id);
      setVideo(found);
    } catch (err) {
      setError('Failed to load video');
    }
  };

  const addLog = (msg, type = 'active') => {
    setLogs(prev => [...prev, { ts: new Date().toLocaleTimeString(), msg, type }]);
    setTimeout(() => { if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight; }, 50);
  };

  const executeStep = async (step, fn) => {
    setProcessStep(step);
    setLoading(true);
    setError('');
    addLog(`Starting: ${step}...`, 'active');
    try {
      await fn();
      await fetchVideo();
      addLog(`${step} completed successfully.`, 'done');
      setProcessStep(null);
    } catch (err) {
      const msg = err.response?.data?.message || `Failed to ${step}`;
      setError(msg);
      addLog(`Error: ${msg}`, 'active');
      setProcessStep(null);
    } finally {
      setLoading(false);
    }
  };

  if (!video) return (
    <>
      <style>{styles}</style>
      <div className="vd-loading">
        {error ? error : 'Loading pipeline...'}
      </div>
    </>
  );

  const activeStep = processStep || getActiveStep(video);

  const stepActionData = [
    {
      key: 'script', icon: 'description', label: 'Generate Script',
      done: !!video.title, disabled: loading,
      fn: () => executeStep('script', () => videoApi.generateScript(id)),
      btnLabel: video.title ? 'Regenerate Script' : 'Generate Script',
      content: video.title ? (
        <div className="vd-step-content">
          <div><strong>Title:</strong> {video.title}</div>
          {video.hook && <div style={{marginTop:4}}><strong>Hook:</strong> {video.hook}</div>}
        </div>
      ) : null,
    },
    {
      key: 'seo', icon: 'search', label: 'Generate SEO',
      done: !!video.seoTitle, disabled: loading || !video.title,
      fn: () => executeStep('seo', () => videoApi.generateSEO(id)),
      btnLabel: video.seoTitle ? 'Regenerate SEO' : 'Generate SEO',
      content: video.seoTitle ? (
        <div className="vd-step-content">
          <div><strong>SEO Title:</strong> {video.seoTitle}</div>
          {video.seoDescription && <div style={{marginTop:4}}><strong>Desc:</strong> {video.seoDescription}</div>}
        </div>
      ) : null,
    },
    {
      key: 'voice', icon: 'record_voice_over', label: 'Generate Voice',
      done: !!(video.hindiVoicePath || video.englishVoicePath),
      disabled: loading || !video.title,
      fn: () => executeStep('voice', () => videoApi.generateVoice(id)),
      btnLabel: (video.hindiVoicePath || video.englishVoicePath) ? 'Regenerate Voice' : 'Generate Voice',
      content: null,
    },
    {
      key: 'render', icon: 'movie_edit', label: 'Render Video',
      done: !!video.renderedVideoPath,
      disabled: loading || !(video.hindiVoicePath || video.englishVoicePath),
      fn: () => executeStep('render', () => videoApi.renderVideo(id)),
      btnLabel: video.renderedVideoPath ? 'Regenerate' : 'Render Video',
      content: video.renderedVideoPath ? (
        <div className="vd-step-content">
          <a href={`http://localhost:8000/${video.renderedVideoPath}`} download>
            <span className="material-symbols-outlined" style={{fontSize:15,marginRight:6}}>download</span>
            Download rendered video
          </a>
        </div>
      ) : null,
    },
    {
      key: 'youtube', icon: 'smart_display', label: 'Upload to YouTube',
      done: !!video.youtubeUrl,
      disabled: loading || !video.renderedVideoPath,
      fn: () => executeStep('upload', () => videoApi.uploadToYoutube(id)),
      btnLabel: 'Upload to YouTube',
      content: video.youtubeUrl ? (
        <div className="vd-step-content">
          <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">{video.youtubeUrl}</a>
        </div>
      ) : null,
    },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="vd-root">
        <div className="vd-bg"><div className="vd-bg-1" /><div className="vd-bg-2" /></div>

        {/* Sidebar */}
        <aside className="vd-sidebar">
          <div className="vd-logo">
            <div className="vd-logo-title">Channel Auto</div>
            <div className="vd-logo-sub">Pro Automation</div>
          </div>
          <nav className="vd-nav">
            <Link to="/dashboard"><span className="material-symbols-outlined">dashboard</span>Dashboard</Link>
            <Link to="/videos" className="active"><span className="material-symbols-outlined">video_library</span>Videos</Link>
            <Link to="/channels"><span className="material-symbols-outlined">layers</span>Channels</Link>
            <Link to="/create-video"><span className="material-symbols-outlined">add_circle</span>Create Video</Link>
          </nav>
          <div className="vd-sidebar-bottom">
            <div className="vd-plan-card">
              <div className="vd-plan-label">Plan Details</div>
              <div className="vd-plan-name">Enterprise Suite</div>
              <button className="vd-plan-btn">Upgrade Pro</button>
            </div>
            <a href="#" className="vd-help-link"><span className="material-symbols-outlined">help</span>Help Center</a>
          </div>
        </aside>

        {/* Main */}
        <main className="vd-main">
          {/* Topbar */}
          <header className="vd-topbar">
            <Link to="/videos" className="vd-breadcrumb">
              <span className="material-symbols-outlined">arrow_back</span>
              Videos / Details
            </Link>
            <div className="vd-topbar-right">
              <button className="vd-icon-btn"><span className="material-symbols-outlined">notifications</span></button>
              <button className="vd-icon-btn"><span className="material-symbols-outlined">settings</span></button>
              <div className="vd-avatar">C</div>
              <Link to="/create-video" className="vd-create-btn">Create Video</Link>
            </div>
          </header>

          <div className="vd-content">
            {/* Page header */}
            <div className="vd-page-header">
              <div>
                <h2 className="vd-page-title">Generation Pipeline</h2>
                <p className="vd-page-sub">Automating "{video.topic}" — {video.language}</p>
              </div>
              <div className="vd-header-btns">
                {video.renderedVideoPath && (
                  <a
                    href={`http://localhost:8000/${video.renderedVideoPath}`}
                    download className="vd-dl-btn"
                  >
                    <span className="material-symbols-outlined" style={{fontSize:18}}>download</span>
                    Download
                  </a>
                )}
                <button
                  className="vd-auto-btn"
                  disabled={loading}
                  onClick={() => executeStep('auto-generate', () => videoApi.autoGenerateVideo(id))}
                >
                  <span className="material-symbols-outlined" style={{fontSize:18}}>bolt</span>
                  {loading && processStep === 'auto-generate' ? 'Generating...' : 'Auto-generate all'}
                </button>
              </div>
            </div>

            {error && (
              <div className="vd-error">
                <span className="material-symbols-outlined" style={{fontSize:18}}>error</span>
                {error}
              </div>
            )}

            {/* Grid */}
            <div className="vd-grid">
              {/* Main column */}
              <div className="vd-col-main">

                {/* Pipeline steps visual */}
                <div className="vd-glass vd-steps-card">
                  <div className="vd-steps-row">
                    {STEPS.map((step, i) => {
                      const state = processStep === step.key ? 'active' : getStepState(step.key, video);
                      return (
                        <React.Fragment key={step.key}>
                          <div className="vd-step">
                            <div
                              className={`vd-step-circle ${state}`}
                              style={{ width: state === 'active' ? 72 : 60, height: state === 'active' ? 72 : 60 }}
                            >
                              <span className="material-symbols-outlined" style={{fontSize: state === 'active' ? 32 : 26}}>{step.icon}</span>
                              {state === 'done' && (
                                <div className="vd-step-badge">
                                  <span className="material-symbols-outlined">check</span>
                                </div>
                              )}
                              {state === 'active' && (
                                <div className="vd-step-processing-badge">Processing</div>
                              )}
                            </div>
                            <div className="vd-step-label">
                              <div className="vd-step-num" style={{color: state === 'done' ? '#ffb4a6' : state === 'active' ? '#FF5C00' : '#e6beb2'}}>
                                Step {step.num}
                              </div>
                              <div className="vd-step-name">{step.label}</div>
                            </div>
                          </div>
                          {i < STEPS.length - 1 && (
                            <div className={`vd-step-connector ${getStepState(step.key, video) === 'done' ? 'done' : 'pending'}`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <div className="vd-progress-bar" style={{width: getProgressWidth(video)}} />
                </div>

                {/* Status + Preview */}
                <div className="vd-detail-grid">
                  <div className="vd-glass vd-status-card">
                    <div className="vd-status-top">
                      <div className="vd-status-indicator">
                        <div className="vd-pulse-dot" />
                        <span className="vd-status-title">
                          {loading ? `Processing: ${processStep}` : activeStep ? `Pending: ${activeStep}` : 'All steps complete'}
                        </span>
                      </div>
                      <p className="vd-status-desc">
                        {loading
                          ? `Running the ${processStep} step. Please wait...`
                          : activeStep
                          ? `Next step in the pipeline is ready to execute.`
                          : `Your video has been fully generated and uploaded.`}
                      </p>
                    </div>
                    <div>
                      <div className="vd-progress-label">
                        <span>Pipeline Progress</span>
                        <span>{Math.round((parseInt(getProgressWidth(video)) / 100) * 100)}%</span>
                      </div>
                      <div className="vd-progress-track">
                        <div className="vd-progress-fill" style={{width: getProgressWidth(video)}} />
                      </div>
                    </div>
                  </div>

                  <div className="vd-glass vd-preview-card">
                    <div className="vd-preview-placeholder">
                      <span className="material-symbols-outlined">smart_display</span>
                    </div>
                    <div className="vd-preview-overlay">
                      <button className="vd-play-btn">
                        <span className="material-symbols-outlined">play_arrow</span>
                      </button>
                      <span className="vd-preview-label">
                        {video.renderedVideoPath ? 'Preview Available' : 'Preview not yet generated'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Console */}
                <div className="vd-glass vd-console-card">
                  <div className="vd-console-title">System Console</div>
                  <div className="vd-console" ref={consoleRef}>
                    {logs.map((log, i) => (
                      <div key={i} className="vd-log">
                        <span className={`vd-log-ts ${log.type}`}>[{log.ts}]</span>
                        <span className={i === logs.length - 1 && loading ? 'vd-log-processing' : ''}>{log.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step action cards */}
                <div className="vd-pipeline-steps">
                  {stepActionData.map(s => {
                    const isCurrentlyActive = processStep === s.key;
                    const stateClass = s.done ? 'done' : isCurrentlyActive ? 'active' : 'pending';
                    return (
                      <div key={s.key} className={`vd-step-action is-${stateClass}`}>
                        <div className="vd-step-action-header">
                          <div className="vd-step-action-title-row">
                            <div className={`vd-step-action-icon ${stateClass}`}>
                              <span className="material-symbols-outlined">{s.icon}</span>
                            </div>
                            <span className="vd-step-action-name">{s.label}</span>
                          </div>
                          <span className={`vd-step-action-status ${stateClass}`}>
                            {s.done ? 'Done' : isCurrentlyActive ? 'Processing' : 'Pending'}
                          </span>
                        </div>
                        {s.content}
                        <button
                          className={`vd-step-btn ${s.disabled ? 'disabled-look' : isCurrentlyActive ? 'loading-look' : 'primary'}`}
                          disabled={s.disabled}
                          onClick={s.fn}
                        >
                          {isCurrentlyActive ? 'Processing...' : s.btnLabel}
                        </button>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Sidebar */}
              <div className="vd-col-side">
                {/* Meta */}
                <div className="vd-glass vd-meta-card">
                  <div className="vd-meta-title">Video Meta</div>
                  <div className="vd-meta-fields">
                    <div className="vd-meta-field">
                      <div className="vd-meta-label">Topic</div>
                      <div className="vd-meta-value">{video.topic}</div>
                    </div>
                    {video.title && (
                      <div className="vd-meta-field">
                        <div className="vd-meta-label">Title</div>
                        <div className="vd-meta-value">{video.title}</div>
                      </div>
                    )}
                    <div className="vd-meta-row">
                      <div className="vd-meta-field">
                        <div className="vd-meta-label">Language</div>
                        <span className="vd-meta-tag">{video.language}</span>
                      </div>
                      <div className="vd-meta-field">
                        <div className="vd-meta-label">Created</div>
                        <span className="vd-meta-tag">{new Date(video.createdAt).toLocaleDateString('en-US', {month:'short',day:'numeric'})}</span>
                      </div>
                    </div>
                    {video.seoTitle && (
                      <>
                        <div className="vd-meta-divider" />
                        <div className="vd-meta-field">
                          <div className="vd-meta-label">SEO Keywords</div>
                          <div className="vd-seo-tags">
                            {video.seoTitle.split(' ').filter(w => w.length > 3).slice(0, 4).map((w, i) => (
                              <span key={i} className="vd-seo-tag">#{w}</span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="vd-glass vd-actions-card">
                  <div className="vd-actions-title">Quick Actions</div>
                  {video.youtubeUrl && (
                    <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="vd-action-row">
                      <span className="vd-action-left">
                        <span className="material-symbols-outlined">open_in_new</span>
                        YouTube Studio
                      </span>
                      <span className="material-symbols-outlined vd-action-chevron">chevron_right</span>
                    </a>
                  )}
                  <button className="vd-action-row">
                    <span className="vd-action-left">
                      <span className="material-symbols-outlined">description</span>
                      Edit Script
                    </span>
                    <span className="material-symbols-outlined vd-action-chevron">chevron_right</span>
                  </button>
                  <button className="vd-action-row" onClick={() => navigate('/videos')}>
                    <span className="vd-action-left">
                      <span className="material-symbols-outlined">arrow_back</span>
                      Back to Videos
                    </span>
                    <span className="material-symbols-outlined vd-action-chevron">chevron_right</span>
                  </button>
                  <button className="vd-action-row">
                    <span className="vd-action-left danger">
                      <span className="material-symbols-outlined">delete_outline</span>
                      Purge Project
                    </span>
                  </button>
                </div>

                {/* Performance */}
                <div className="vd-glass vd-perf-card">
                  <div className="vd-perf-label">Estimated Performance</div>
                  <div className="vd-perf-value">8.2k</div>
                  <div className="vd-perf-sub">Proj. 24h Views</div>
                  <div className="vd-perf-trend">
                    <span className="material-symbols-outlined">trending_up</span>
                    +12%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Nav */}
        <nav className="vd-mobile-nav">
          <Link to="/dashboard"><span className="material-symbols-outlined">dashboard</span>Home</Link>
          <Link to="/videos" className="active"><span className="material-symbols-outlined">video_library</span>Videos</Link>
          <Link to="/create-video" className="vd-mobile-fab"><span className="material-symbols-outlined">add</span></Link>
          <Link to="/channels"><span className="material-symbols-outlined">layers</span>Channels</Link>
          <Link to="/dashboard"><span className="material-symbols-outlined">person</span>Account</Link>
        </nav>
      </div>
    </>
  );
}
