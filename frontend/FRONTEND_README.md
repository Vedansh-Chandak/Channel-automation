# Channel Auto - Frontend

A modern React + Vite frontend for automated YouTube Shorts generation.

## Features

- **User Authentication**: Register and login with JWT tokens
- **Video Management**: Create, view, and manage videos
- **Multi-language Support**: Generate content in English and Hindi
- **Channel Management**: Create and manage multiple YouTube channels
- **Automated Generation**: One-click video generation with AI-powered script and SEO
- **Generation Pipeline**: Step-by-step video generation (Script → SEO → Voice → Render → Upload)
- **Responsive Design**: Clean, modern UI that works on all devices

## Project Structure

```
src/
├── pages/               # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── CreateVideo.jsx
│   ├── VideoDetails.jsx
│   ├── Videos.jsx
│   └── Channels.jsx
├── components/          # Reusable components
│   └── ProtectedRoute.jsx
├── context/            # React Context
│   └── AuthContext.jsx
├── hooks/              # Custom hooks
│   └── useAuth.js
├── services/           # API services
│   └── api.js
├── styles/             # CSS files
│   ├── global.css
│   ├── auth.css
│   ├── dashboard.css
│   ├── forms.css
│   ├── video-details.css
│   ├── videos-list.css
│   └── channels.css
└── App.jsx            # Main app component
```

## Pages Overview

### Authentication Pages
- **Login** (`/login`): User login with email and password
- **Register** (`/register`): New user registration

### Dashboard Pages
- **Dashboard** (`/dashboard`): Overview with stats and recent videos
- **Videos** (`/videos`): List of all videos with filtering
- **Video Details** (`/video/:id`): Detailed view with generation pipeline
- **Create Video** (`/create-video`): Create new video form
- **Channels** (`/channels`): Manage YouTube channels

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

## Building for Production

```bash
npm run build
npm run preview
```

## API Integration

All API calls are handled through `services/api.js` with:
- Automatic JWT token injection in request headers
- Interceptors for error handling
- Organized endpoints by resource

### API Endpoints Used

```
Authentication:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

Videos:
- POST /api/videos/create
- GET /api/videos
- POST /api/videos/generate-script/:id
- POST /api/videos/generate-seo/:id
- POST /api/videos/generate-voice/:id
- POST /api/videos/render/:id
- POST /api/videos/upload/:id
- POST /api/videos/auto/:id

Channels:
- POST /api/channels/create
- GET /api/channels
- GET /api/channels/:id
- DELETE /api/channels/:id
```

## Key Features

### 1. Authentication Flow
- JWT token stored in localStorage
- Automatic token refresh on page load
- Protected routes with AuthProvider

### 2. Video Generation Pipeline
Each video goes through 5 stages:
1. **Script Generation**: AI-powered Hindi/English scripts
2. **SEO Generation**: Optimized titles, descriptions, tags
3. **Voice Generation**: Text-to-speech with language support
4. **Video Rendering**: Combine video + audio with FFmpeg
5. **YouTube Upload**: Automatic upload with metadata

### 3. Multi-language Support
- English: Standard Latin characters
- Hindi: Devanagari script support
- Language selection during video creation

## Styling

The frontend uses a consistent design system:
- Primary gradient: `#667eea` to `#764ba2`
- Responsive grid layouts
- Modern card-based UI
- Smooth transitions and hover effects

## State Management

### AuthContext
Manages global authentication state:
- `user`: Current authenticated user
- `loading`: Loading state
- `error`: Error messages
- `register()`: User registration
- `login()`: User login
- `logout()`: User logout

### Local Component State
Individual pages manage their own state for:
- Form data
- Loading states
- Error messages
- API responses

## Error Handling

- API errors displayed in user-friendly messages
- Form validation feedback
- Loading states for all async operations
- Graceful fallbacks for missing data

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:8000/api
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Video preview player
- [ ] Advanced analytics dashboard
- [ ] Batch video generation
- [ ] Custom templates
- [ ] Social media scheduling
- [ ] A/B testing for thumbnails
- [ ] Comments moderation
- [ ] Revenue analytics
