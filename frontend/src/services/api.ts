import axios from 'axios';

// Replace with your actual backend URL (e.g., from .env)
// For Android Emulator, use 'http://10.0.2.2:3000'
// For Physical Device, use your LAN IP (e.g., 'http://192.168.1.x:3000')
const API_URL = 'http://10.0.2.2:3000';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const analyzeTransaction = async (rawText: string) => {
    try {
        const response = await api.post('/api/analyze', { rawText });
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export default api;
