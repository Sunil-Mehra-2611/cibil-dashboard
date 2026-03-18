import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
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

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (session timeout)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Example service methods
export const customerService = {
  getCustomers: (params: any) => api.get('/customers', { params }),
  getCustomerById: (id: string) => api.get(`/customers/${id}`),
  uploadFiles: (formData: FormData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const authService = {
  register: (data: any) => api.post('/auth/register', data),
  login: (credentials: any) => api.post('/auth/login', credentials),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
};

export const userService = {
  getDashboardStats: () => api.get('/user/dashboard'),
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getLoginActivity: (params: { limit?: number; offset?: number } = {}) => 
    api.get('/admin/login-activity', { params }),
  getUsers: () => api.get('/admin/users'),
  createUser: (data: any) => api.post('/admin/users', data),
  updateUser: (userId: number, data: any) => api.patch(`/admin/users/${userId}`, data),
  deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),
  uploadFiles: (formData: FormData) => api.post('/upload/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
