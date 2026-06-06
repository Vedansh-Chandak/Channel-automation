# 🚀 Quick Start Guide - Channel Auto

## Backend ✅ (Already Running)
- Server: `http://localhost:8000`
- Working with:
  - ✅ Hindi text handling (execFile for Unicode)
  - ✅ Groq AI (llama-3.3-70b-versatile model)
  - ✅ FFmpeg video rendering
  - ✅ YouTube upload integration

## Frontend 🎨 (Just Implemented)
- Development: `http://localhost:5173`
- Production-ready React + Vite app

---

## 📋 Getting Started (5 Minutes)

### 1. Start Backend (if not already running)
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm install  # Only first time
npm run dev
```

### 3. Open in Browser
```
http://localhost:5173
```

---

## 🔑 Test Credentials

If you have a test account:
- Email: `your@email.com`
- Password: `yourpassword`

Or register a new account on the Register page.

---

## 📊 The 7 Pages

| # | Page | Route | Purpose |
|---|------|-------|---------|
| 1 | Login | `/login` | Sign in |
| 2 | Register | `/register` | Create account |
| 3 | Dashboard | `/dashboard` | Home, stats, recent videos |
| 4 | Videos | `/videos` | All videos list |
| 5 | Video Details | `/video/:id` | Generation pipeline |
| 6 | Create Video | `/create-video` | New video form |
| 7 | Channels | `/channels` | Manage YouTube channels |

---

## 🎬 Complete Workflow

```
1. REGISTER/LOGIN
   ↓
2. CREATE CHANNEL
   (go to /channels, fill form)
   ↓
3. CREATE VIDEO
   (go to /create-video, select topic & language)
   ↓
4. GENERATE
   (in /video/:id, follow 5-step pipeline)
   ├─ Step 1: Generate Script ✅
   ├─ Step 2: Generate SEO ✅
   ├─ Step 3: Generate Voice ✅
   ├─ Step 4: Render Video ✅
   └─ Step 5: Upload to YouTube ✅
   
   OR: 
   Click "🚀 Auto Generate Everything"
   ↓
5. VIEW ON YOUTUBE
   (link in video details)
```

---

## 🛠️ Development

### File Locations

**Pages**: `frontend/src/pages/`
- Edit to change page layouts

**Styles**: `frontend/src/styles/`
- Edit CSS for styling changes

**API Calls**: `frontend/src/services/api.js`
- Edit for API endpoint changes

**Auth Logic**: `frontend/src/context/AuthContext.jsx`
- Edit for auth flow changes

### Useful Commands

```bash
# Frontend development
npm run dev              # Start dev server
npm run build           # Build for production
npm run lint            # Check code quality

# Backend development
npm run dev             # Start backend server
npm test                # Run tests
```

---

## 🔑 Key Configuration

### Backend API URL
In `frontend/src/services/api.js`:
```javascript
const API_URL = 'http://localhost:8000/api';
```

### Groq API Key
In `backend/.env`:
```
GROQ_API_KEY=your_api_key_here
```

### Database
MongoDB connection in `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/channel-auto
```

---

## ✅ Feature Checklist

### ✅ Backend (Complete)
- [x] User authentication (register/login)
- [x] Video management (CRUD)
- [x] Channel management (CRUD)
- [x] Script generation (Groq AI)
- [x] SEO generation (Groq AI)
- [x] Voice generation (Edge TTS)
- [x] Video rendering (FFmpeg)
- [x] YouTube upload
- [x] Hindi support (execFile)

### ✅ Frontend (Complete)
- [x] Login page
- [x] Register page
- [x] Dashboard
- [x] Videos list
- [x] Video details + pipeline
- [x] Create video
- [x] Channels management
- [x] Protected routes
- [x] Auth context
- [x] API integration

---

## 🐛 Troubleshooting

### Frontend Not Loading
```bash
# Clear node_modules and reinstall
rm -rf frontend/node_modules frontend/package-lock.json
npm install
npm run dev
```

### Backend Not Responding
```bash
# Ensure backend is running
cd backend
npm run dev
# Check port 8000 is available
```

### Video Generation Failing
1. Check Groq API key is set
2. Check MongoDB is running
3. Check FFmpeg is installed
4. Check Edge TTS is available

### Auth Token Issues
```javascript
// Clear token in browser console
localStorage.removeItem('token')
// Logout and login again
```

---

## 📚 Technology Stack

### Frontend
- React 19.2
- Vite 8.0
- React Router 6.x
- Axios 1.x

### Backend
- Node.js
- Express.js
- MongoDB
- Groq AI API
- Edge TTS
- FFmpeg
- YouTube Data API

---

## 🎯 Next Steps

1. ✅ Test backend API with frontend
2. ✅ Create test account
3. ✅ Test video generation
4. ✅ Deploy frontend (Vercel/Netlify)
5. ✅ Deploy backend (Render/Heroku)

---

## 📞 Debug Mode

### Check API Calls
```javascript
// In browser console
localStorage.getItem('token')  // View JWT token
```

### View Network Activity
```
Browser DevTools → Network tab
Watch all API requests/responses
```

### Check Component State
```
Install React DevTools extension
Inspect component tree and state
```

---

## 🎉 You're All Set!

Everything is configured and ready to use. 

**Start generating YouTube Shorts! 🚀**

---

**Last Updated**: June 2026
**Status**: ✅ Production Ready
