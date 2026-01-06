import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');

            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message);
        }

        return Promise.reject(error);
    }
);

// API helper functions
export const api = {
    // Auth
    auth: {
        login: (email: string, password: string) =>
            apiClient.post('/auth/login', { email, password }),
        register: (email: string, password: string, fullName?: string) =>
            apiClient.post('/auth/register', { email, password, fullName }),
        logout: () => apiClient.post('/auth/logout'),
        me: () => apiClient.get('/auth/me'),
    },

    // Posts
    posts: {
        list: (status?: string) => apiClient.get('/posts', { params: { status } }),
        getBySlug: (slug: string) => apiClient.get(`/posts/${slug}`),
        create: (data: any) => apiClient.post('/posts', data),
        update: (id: string, data: any) => apiClient.put(`/posts/${id}`, data),
        delete: (id: string) => apiClient.delete(`/posts/${id}`),
    },

    // Projects
    projects: {
        list: (status?: string) => apiClient.get('/projects', { params: { status } }),
        create: (data: any) => apiClient.post('/projects', data),
        update: (id: string, data: any) => apiClient.put(`/projects/${id}`, data),
        delete: (id: string) => apiClient.delete(`/projects/${id}`),
    },

    // Leads
    leads: {
        create: (data: any) => apiClient.post('/leads', data),
        list: (status?: string) => apiClient.get('/leads', { params: { status } }),
        update: (id: string, data: any) => apiClient.put(`/leads/${id}`, data),
        delete: (id: string) => apiClient.delete(`/leads/${id}`),
    },

    // Comments
    comments: {
        getByPost: (postId: string) => apiClient.get(`/comments/post/${postId}`),
        create: (data: any) => apiClient.post('/comments', data),
        update: (id: string, data: any) => apiClient.put(`/comments/${id}`, data),
        moderate: (id: string, data: any) => apiClient.put(`/comments/${id}/moderate`, data),
        delete: (id: string) => apiClient.delete(`/comments/${id}`),
        toggleLike: (id: string) => apiClient.post(`/comments/${id}/like`),
    },

    // Uploads
    uploads: {
        blog: (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            return apiClient.post('/uploads/blog', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        projects: (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            return apiClient.post('/uploads/projects', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        site: (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            return apiClient.post('/uploads/site', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        delete: (category: string, filename: string) =>
            apiClient.delete(`/uploads/${category}/${filename}`),
    },

    // Notifications
    notifications: {
        list: () => apiClient.get('/notifications'),
        markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
        markAllAsRead: () => apiClient.put('/notifications/read-all'),
        delete: (id: string) => apiClient.delete(`/notifications/${id}`),
    },

    // Audit Logs
    auditLogs: {
        list: (params?: { limit?: number; offset?: number; action?: string; userId?: string }) =>
            apiClient.get('/audit-logs', { params }),
    },

    // Analytics
    analytics: {
        getStats: () => apiClient.get('/analytics/stats'),
        logPageVisit: (data: { page: string; referrer?: string; userAgent?: string }) =>
            apiClient.post('/analytics/page-visit', data),
        getPageVisits: (params?: { limit?: number; page?: string }) =>
            apiClient.get('/analytics/page-visits', { params }),
    },
};
