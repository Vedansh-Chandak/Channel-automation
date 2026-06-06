# AutoTube

AI-powered YouTube Shorts Automation Platform that automatically generates scripts, voiceovers, subtitles, videos, SEO metadata, and uploads content directly to YouTube.

---

## Overview

AutoTube is a full-stack application that automates the entire YouTube Shorts creation workflow.

Given a topic, AutoTube can:

1. Generate a viral short-form script using AI
2. Generate SEO metadata
3. Convert the script into a voice-over
4. Download relevant stock footage
5. Generate subtitles automatically
6. Render a vertical YouTube Short
7. Upload the final video to YouTube

The platform supports both English and Hindi content generation.

---

## Features

### AI Content Generation

* AI Script Generation using Google Gemini
* Viral Hook Generation
* English Script Generation
* Hindi Script Generation
* Multi-language Support

### SEO Optimization

* SEO Titles
* SEO Descriptions
* Keywords
* Tags
* Hashtags
* SEO Scoring

### Voice Generation

* English AI Voice
* Hindi AI Voice
* Edge TTS Integration
* Automatic Voice Selection Based on Language

### Video Generation

* Pexels Video Integration
* Automatic Background Video Download
* Subtitle Generation (SRT)
* Caption Burn-in Support
* Vertical Shorts Rendering (9:16)
* FFmpeg Video Processing

### YouTube Automation

* Google OAuth Integration
* YouTube Upload Automation
* Channel Management
* Automatic Metadata Publishing

### User Management

* User Registration
* User Login
* JWT Authentication
* Protected Routes

### Dashboard

* Video Management
* Channel Management
* Upload Tracking
* Generation Pipeline Tracking

---

# Tech Stack

## Frontend

* React
* Vite
* React Router DOM
* Axios
* Context API
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## AI & Content

* Google Gemini API
* Edge TTS

## Video Processing

* FFmpeg
* Fluent-FFmpeg
* Pexels Video API

## Authentication

* JWT
* Google OAuth 2.0

---

# Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
Node.js Backend
 │
 ├── Gemini AI
 │      ├── Script Generation
 │      └── SEO Generation
 │
 ├── Edge TTS
 │      └── Voice Generation
 │
 ├── Pexels API
 │      └── Background Video
 │
 ├── FFmpeg
 │      ├── Render Video
 │      ├── Burn Captions
 │      └── Generate Shorts
 │
 └── YouTube API
        └── Upload Video
```

---

# Project Structure

```text
AutoTube/

├── frontend/
│
│   ├── src/
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CreateVideo.jsx
│   │   ├── VideoDetails.jsx
│   │   ├── Videos.jsx
│   │   └── Channels.jsx
│   │
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   └── useAuth.js
│   │
│   ├── services/
│   │   └── api.js
│   │
│   └── App.jsx
│
└── backend/
    │
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── uploads/
    │   ├── audio/
    │   ├── videos/
    │   ├── captions/
    │   └── rendered/
    │
    ├── config/
    ├── server.js
    └── .env
```

---

# Frontend Features

The frontend provides a complete dashboard experience for managing YouTube Shorts.

### Authentication

* Register
* Login
* Logout
* Protected Routes
* Persistent Sessions

### Dashboard

* User Statistics
* Recent Videos
* Quick Actions
* Upload Overview

### Videos

* Create Videos
* View Video Details
* Track Generation Status
* Filter By Status
* Open YouTube Videos

### Channels

* Create Channels
* View Channels
* Delete Channels

### Generation Pipeline

The UI provides controls for:

1. Generate Script
2. Generate SEO
3. Generate Voice
4. Render Video
5. Upload Video

Or execute everything automatically using:

```text
Auto Generate
```

---

# Backend Features

### Authentication APIs

* Register User
* Login User
* JWT Verification

### Channel APIs

* Create Channel
* Get Channels
* Delete Channel

### Video APIs

* Create Video
* Generate Script
* Generate SEO
* Generate Voice
* Render Video
* Upload To YouTube
* Auto Generate Entire Workflow

---

# Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=8000

MONGO_URI=

JWT_SECRET=

# Gemini
GEMINI_API_KEY=

# Pexels
PEXELS_API_KEY=

# YouTube OAuth
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REDIRECT_URI=
YOUTUBE_REFRESH_TOKEN=
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/autotube.git

cd autotube
```

---

## Backend Setup

```bash
cd backend

npm install
```

### Start Backend

```bash
npm run dev
```

Backend URL:

```text
http://localhost:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

### Start Frontend

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# FFmpeg Installation

## macOS

```bash
brew install ffmpeg
```

## Ubuntu

```bash
sudo apt update

sudo apt install ffmpeg
```

## Windows

Download FFmpeg and add it to your system PATH.

---

# API Workflow

## Create Video

```http
POST /api/videos
```

Request:

```json
{
  "topic": "Space Facts",
  "language": "english",
  "channelId": "CHANNEL_ID"
}
```

---

## Generate Script

```http
POST /api/videos/script/:id
```

---

## Generate SEO

```http
POST /api/videos/seo/:id
```

---

## Generate Voice

```http
POST /api/videos/generate-voice/:id
```

---

## Render Video

```http
POST /api/videos/render/:id
```

---

## Upload To YouTube

```http
POST /api/videos/upload/:id
```

---

## Auto Generate Everything

```http
POST /api/videos/auto/:id
```

Pipeline:

```text
Generate Script
      ↓
Generate SEO
      ↓
Generate Voice
      ↓
Download Video
      ↓
Generate Captions
      ↓
Render Video
      ↓
Upload To YouTube
```

---

# Generated Video Format

| Property     | Value          |
| ------------ | -------------- |
| Resolution   | 720 x 1280     |
| Aspect Ratio | 9:16           |
| FPS          | 30             |
| Format       | MP4            |
| Codec        | H.264          |
| Audio        | AAC            |
| Platform     | YouTube Shorts |

---

# Language Support

## English

* Script Generation
* Voice Generation
* Caption Generation
* Shorts Rendering

## Hindi

* Script Generation
* Voice Generation
* Caption Generation
* Shorts Rendering

---

# Security

* JWT Authentication
* Protected Routes
* Secure API Access
* OAuth-based YouTube Integration
* Environment Variable Protection

---

# Future Improvements

* AI Thumbnail Generation
* Auto Scheduling
* Multiple YouTube Channels
* Instagram Reels Export
* TikTok Export
* Analytics Dashboard
* Trending Topic Discovery
* Multi-language Expansion
* Voice Cloning
* Custom Branding

---

# Testing Checklist

* User Registration
* User Login
* Create Channel
* Create Video
* Generate Script
* Generate SEO
* Generate Voice
* Render Video
* Upload Video
* View Dashboard
* Filter Videos
* Logout/Login Flow

---

# Author

Vedansh Chandak

AutoTube is a full-stack AI-powered YouTube Shorts automation platform built using React, Node.js, MongoDB, Gemini AI, Edge TTS, FFmpeg, Pexels API, and YouTube Data API.
