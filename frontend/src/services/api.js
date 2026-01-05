import axios from 'axios';

const API_URL = 'https://xerox-saas.onrender.com/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    // Basic error handling/logging
    if (error.response) {
        console.error('API Error:', error.response.data);
    }
    return Promise.reject(error);
});

export const authService = {
    register: (data) => api.post('/auth/register/', data),
    login: (data) => api.post('/auth/login/', data),
};

export const shopService = {
    getAllShops: () => api.get('/shops/'),
    getShop: (id) => api.get(`/shops/${id}/`),
    createShop: (data) => api.post('/shops/', data), // For owners
};

export const documentService = {
    upload: (fileData) => {
        const formData = new FormData();
        formData.append('file', fileData.file);
        formData.append('file_name', fileData.file_name);
        return api.post('/documents/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },
    list: () => api.get('/documents/'),
};

export const orderService = {
    create: (data) => api.post('/orders/', data),
    list: () => api.get('/orders/'),
    updateStatus: (id, status) => api.patch(`/orders/${id}/`, { status }),
};

export const pricingService = {
    list: () => api.get('/pricing/'),
    create: (data) => api.post('/pricing/', data),
    delete: (id) => api.delete(`/pricing/${id}/`),
};

export default api;
