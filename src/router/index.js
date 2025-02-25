import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'Contato',
                    component: () => import('@/views/uikit/TableDoc.vue')
                }
            ],
            meta: {
                auth: true
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue'),
            meta: {
                auth: false
            }
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    if (to.meta?.auth) {
        const auth = useAuthStore();
        if (auth.token && auth.user) {
            const isAuthenticated = await auth.checkToken();
            if (isAuthenticated) {
                next();
            } else {
                next({ name: 'login' });
            }
        } else {
            next({ name: 'login' });
        }
    } else {
        next();
    }
});
export default router;
