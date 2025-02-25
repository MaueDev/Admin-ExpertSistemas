import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';

// Cria uma instância do Axios com configurações padrão
const axiosExpertAuth = axios.create({
    baseURL: import.meta.env.VITE_API_HOST || 'https://default-api.com',
    timeout: 940000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

// Intercepta todas as requisições para adicionar o token de autorização
axiosExpertAuth.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore(); // Obtém o estado do Pinia
        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepta todas as respostas para tratar erros 401
axiosExpertAuth.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const authStore = useAuthStore();
            authStore.setToken(null);
            authStore.setUser(null);
            router.push('/login'); // Redireciona para login
        }
        return Promise.reject(error);
    }
);

export default axiosExpertAuth;
