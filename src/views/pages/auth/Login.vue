<script setup>
import axiosExpert from '@/service/axios';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'primevue/usetoast';
import { reactive, ref } from 'vue';

const auth = useAuthStore();
const toast = useToast();
const loading = ref(false);

const user = reactive({
    email: '',
    password: ''
});

const errors = reactive({
    email: '',
    password: ''
});

const validateForm = () => {
    let valid = true;
    errors.email = '';
    errors.password = '';

    if (!user.email.trim()) {
        errors.email = 'O e-mail é obrigatório.';
        valid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
        errors.email = 'Insira um e-mail válido.';
        valid = false;
    }

    if (!user.password.trim()) {
        errors.password = 'A senha é obrigatória.';
        valid = false;
    } else if (user.password.length < 6) {
        errors.password = 'A senha deve ter pelo menos 6 caracteres.';
        valid = false;
    }

    return valid;
};

const LoginAdm = async () => {
    if (!validateForm()) return;

    loading.value = true;

    try {
        const { data } = await axiosExpert.post('/login', user);
        auth.setToken(data.token);
        auth.setUser(data.name);
        window.location.href = '/';

        toast.add({ severity: 'success', summary: 'Login realizado', detail: 'Bem-vindo!', life: 3000 });
    } catch (error) {
        let errorMessage = 'Erro inesperado.';
        if (error.response) {
            if (error.response.status === 400) {
                errorMessage = error.response.data?.message || 'Dados inválidos.';
            } else {
                errorMessage = error.response.data?.message || errorMessage;
            }
        }

        toast.add({ severity: 'error', summary: 'Erro no login', detail: errorMessage, life: 3000 });
    } finally {
        loading.value = false;
    }
};
</script>
<template>
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="/image/LogoExpert.png" class="logoExpert" alt="Logo Expert sistemas" loading="lazy" />
                    </div>
                    <div>
                        <label for="email1"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <div class="flex flex-wrap mb-4 gap-2">
                            <InputText id="email1" type="text" placeholder="Endereço de E-mail"
                                class="w-full md:w-[30rem] input" v-model="user.email" style="width: 100%"
                                :class="{ 'p-invalid': errors.email }" />
                            <Message v-if="errors.email" severity="error">{{ errors.email }}</Message>
                        </div>

                        <label for="password1"
                            class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Senha</label>
                        <div class="flex flex-wrap mb-4 gap-2">
                            <Password id="password" v-model="user.password" placeholder="Senha" :toggleMask="true"
                                class="input" fluid :feedback="false" :class="{ 'p-invalid': errors.password }">
                            </Password>
                            <Message v-if="errors.password" severity="error">{{ errors.password }}</Message>
                        </div>

                        <Button label="Login" class="login-button w-full" @click="LoginAdm" :loading="loading"
                            severity="danger"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

.login-box {
    border-radius: 56px;
    padding: 0.3rem;
    background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);
}

.login-container {
    width: 100%;
    background: var(--surface-0);
    padding: 20px;
    border-radius: 53px;
}

.label {
    display: block;
    color: var(--surface-900);
    font-size: 1.2rem;
    font-weight: medium;
    margin-bottom: 5px;
}

.input {
    width: 100%;
    margin-bottom: 10px;
}

.error-message {
    color: red;
    font-size: 0.9rem;
}

.login-button {
    width: 100%;
}

.logoExpert {
    align-self: center;
    margin: auto;
    width: 60%;
}
</style>
