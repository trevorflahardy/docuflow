import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', name: "Home", component: () => import('./App.vue') },
];

export const router = createRouter({
    // TODO: right name
    history: createWebHistory('<todo>'),
    routes
});