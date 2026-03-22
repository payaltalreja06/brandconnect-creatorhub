import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Don't redirect if we're already on login or signup to allow showing error messages
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ─── Auth ───
export const authApi = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ─── Influencers ───
export const influencerApi = {
  getAll: (params?: Record<string, string>) => api.get('/influencers', { params }),
  getMe: () => api.get('/influencers/me'),
  getById: (id: string) => api.get(`/influencers/${id}`),
  updateMe: (data: Record<string, unknown>) => api.put('/influencers/me', data),
  updateFaqs: (faqs: { question: string; answer: string }[]) =>
    api.put('/influencers/me/faqs', { faqs }),
};

// ─── Brands ───
export const brandApi = {
  getAll: () => api.get('/brands'),
  getMe: () => api.get('/brands/me'),
  getById: (id: string) => api.get(`/brands/${id}`),
  updateMe: (data: Record<string, unknown>) => api.put('/brands/me', data),
};

// ─── Collaboration Requests ───
export const requestApi = {
  send: (data: { toUserId: string; campaignName: string; message?: string; budget?: string }) =>
    api.post('/requests', data),
  getAll: (type?: 'sent' | 'received') => api.get('/requests', { params: { type } }),
  accept: (id: string) => api.put(`/requests/${id}/accept`),
  decline: (id: string) => api.put(`/requests/${id}/decline`),
};

// ─── Messages ───
export const messageApi = {
  getThreads: () => api.get('/messages/threads'),
  getMessages: (threadId: string) => api.get(`/messages/threads/${threadId}/messages`),
  sendMessage: (threadId: string, data: { text?: string; type?: string; metadata?: unknown }) =>
    api.post(`/messages/threads/${threadId}/messages`, data),
  markSeen: (messageId: string) => api.put(`/messages/${messageId}/seen`),
  markAllSeen: (threadId: string) => api.put(`/messages/threads/${threadId}/seen-all`),
};

// ─── Notifications ───
export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

// ─── Campaigns ───
export const campaignApi = {
  getAll: () => api.get('/campaigns'),
  create: (data: Record<string, unknown>) => api.post('/campaigns', data),
  updateStatus: (id: string, status: string) => api.put(`/campaigns/${id}/status`, { status }),
};

// ─── Analytics ───
export const analyticsApi = {
  getMe: () => api.get('/analytics/me'),
  getByUserId: (userId: string) => api.get(`/analytics/${userId}`),
};

export default api;
