import axios from 'axios';
import { useAuthStore } from '../features/auth/auth.store';
import { useAlertStore } from '../app/alert.store';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Fallback URL
});

const ALERT_WHITELIST = [
    '/admin/roles',
    '/admin/courts',
    '/admin/coach',
    '/admin/product',
    '/admin/equipment',
    '/admin/users',
    '/admin/players'
];

const shouldShowAlert = (url?: string) => {
    if (!url) return false;
    // Check if the URL matches any of the whitelisted paths (excluding query params)
    const pureUrl = url.split('?')[0];
    return ALERT_WHITELIST.some(path => pureUrl.includes(path));
};

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        const { method, url } = response.config;

        // Show success alert only for non-GET methods and whitelisted endpoints
        // or as specified by backend message availability
        if (method !== 'get' && shouldShowAlert(url)) {
            const title = 'Berhasil';
            const message = response?.data?.message || 'Aksi berhasil dilakukan!';
            useAlertStore.getState().showSuccess(title, message);
        }

        return response;
    },
    (error) => {
        const config = error.config;

        // Always show error if it's in whitelist, or handle globally
        if (shouldShowAlert(config?.url)) {
            const title = 'Gagal';
            const message = error.response?.data?.message || error.message || 'Terjadi kesalahan pada sistem!';
            useAlertStore.getState().showError(title, message);
        }

        return Promise.reject(error);
    }
);


export default api;
