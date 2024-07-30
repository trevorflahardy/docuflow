import App from './App.vue';
import { createApp } from 'vue';
import './index.css';
import { router } from './router';

createApp(App).use(router).mount('#app');
