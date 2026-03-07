import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor
client.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized globally
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }

        // Standardize error message
        const message = error.response?.data?.error?.message || error.message || "Une erreur est survenue";
        console.error(`[API Error] ${error.config?.url || 'Unknown URL'}:`, message);
        
        return Promise.reject({ ...error, message });
    }
);

export default client;
