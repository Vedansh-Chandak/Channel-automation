import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

export const videoApi = {
  createVideo: (data) => api.post('/videos/create', data),
  getVideos: () => api.get('/videos'),
  generateScript: (id) => api.post(`/videos/generate-script/${id}`),
  generateSEO: (id) => api.post(`/videos/generate-seo/${id}`),
  generateVoice: (id) => api.post(`/videos/generate-voice/${id}`),
  renderVideo: (id) => api.post(`/videos/render/${id}`),
  uploadToYoutube: (id) => api.post(`/videos/upload/${id}`),
  autoGenerateVideo: (id) => api.post(`/videos/auto/${id}`),
  testPexels: (query) => api.get(`/videos/test-pexels?q=${query}`)
};

export const channelApi = {
  createChannel: (data) => api.post('/channels/create', data),
  getChannels: () => api.get('/channels'),
  getChannelById: (id) => api.get(`/channels/${id}`),
  deleteChannel: (id) => api.delete(`/channels/${id}`)
};

export default api;
