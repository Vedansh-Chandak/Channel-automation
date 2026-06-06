# AutoTube

AutoTube is an AI-powered platform that automatically generates, renders, and uploads YouTube Shorts using Google Gemini, Edge TTS, Pexels videos, FFmpeg, and the YouTube Data API.

## Features

* AI Script Generation using Gemini
* English and Hindi Script Support
* AI Voice Generation (Edge TTS)
* Automatic Video Download from Pexels
* Auto Subtitle Generation (SRT)
* Vertical Shorts Rendering (720x1280)
* SEO Optimization
* Hashtag and Keyword Generation
* Automatic YouTube Upload
* JWT Authentication
* MongoDB Database Integration

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### AI & Content

* Google Gemini API
* Edge TTS

### Video Processing

* FFmpeg
* Fluent-FFmpeg
* Pexels Video API

### Authentication

* JWT
* Google OAuth 2.0

---

## Project Structure

```bash
backend/
│
├── controllers/
├── routes/
├── middleware/
├── models/
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

## Environment Variables

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

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/autotube.git
cd autotube
```

### Install Dependencies

```bash
npm install
```

### Install FFmpeg

#### macOS

```bash
brew install ffmpeg
```

#### Ubuntu

```bash
sudo apt update
sudo apt install ffmpeg
```

#### Windows

Download FFmpeg and add it to your system PATH.

---

## Run Project

```bash
npm run dev
```

Server:

```bash
http://localhost:8000
```

---

## Workflow

### 1. Create Video

```http
POST /api/videos
```

Request Body:

```json
{
  "topic": "Space Facts",
  "language": "english",
  "channelId": "CHANNEL_ID"
}
```

### 2. Auto Generate Entire Short

```http
POST /api/videos/auto/:videoId
```

This automatically:

1. Generates Script
2. Creates Voiceover
3. Downloads Background Video
4. Generates Captions
5. Renders Short Video
6. Uploads to YouTube

---

## Generated Short Format

* Resolution: 720x1280
* Aspect Ratio: 9:16
* FPS: 30
* Optimized for YouTube Shorts

---

## SEO Features

Automatically generates:

* SEO Title
* SEO Description
* Keywords
* Tags
* Hashtags
* SEO Score

---

## Language Support

### English

* Script Generation
* Voiceover
* Captions

### Hindi

* Script Generation
* Voiceover
* Captions
* Shorts Rendering

---

## Authentication

Protected routes require JWT authentication.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## YouTube Upload

The platform uploads generated videos directly to YouTube using the YouTube Data API v3.

Supported features:

* Public and Private Uploads
* Shorts Optimization
* SEO Metadata Integration
* Automated Publishing Workflow

---

## Future Improvements

* Multi-channel Management
* Scheduled Uploads
* Analytics Dashboard
* Trending Topic Discovery
* AI Thumbnail Generation
* Additional Language Support
* Instagram Reels Export
* TikTok Export

---

## Author

Vedansh Chandak

AutoTube is built using Node.js, Google Gemini, FFmpeg, Edge TTS, MongoDB, and the YouTube Data API.
