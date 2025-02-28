import { ref } from 'vue';
import { defineStore } from 'pinia';
import axiosExpert from '@/service/axios';
export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token'));
    const user = ref(localStorage.getItem('user'));

    function setToken(tokenValue) {
        localStorage.setItem('token', tokenValue);
        token.value = tokenValue;
    }
    function setUser(userValue) {
        localStorage.setItem('user', userValue);
        user.value = userValue;
    }

    async function checkToken() {
        try {
            const tokenAuth = 'Bearer ' + token.value;
            const { data } = await axiosExpert.get('/auth/verify', {
                headers: {
                    Authorization: tokenAuth
                }
            });
            return data;
        } catch (error) {
            if (error.response && error.response.status === 500) {
                console.log('Erro 500: Problema no servidor');
                return false;
            } else {
                console.log(error.response ? error.response.data : error.message);
                return false;
            }
        }
    }

    return {
        setToken,
        setUser,
        token,
        user,
        checkToken
    };
});
