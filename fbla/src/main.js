// src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import SuccessfulScreen from './SuccessfulScreen.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: App },
    { path: '/successful', name: 'successful', component: SuccessfulScreen },
  ],
});

const app = createApp(App);
app.use(router);
app.mount('#app');
