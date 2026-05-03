import axios from 'axios';

// axios instance
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// request intercepter
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// response intercepter
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const wasToken = localStorage.getItem('auth_token');
            if (wasToken) {
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
