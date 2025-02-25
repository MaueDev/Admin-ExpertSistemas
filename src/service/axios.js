import axios from 'axios';

// Cria uma instância do Axios com configurações padrão
const axiosExpert = axios.create({
    baseURL: import.meta.env.VITE_API_HOST || 'https://default-api.com',
    timeout: 940000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

export default axiosExpert;
