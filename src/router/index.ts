import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import HomeView from '../views/HomeView.vue'
import SavesView from '../views/SavesView.vue'
import SettingsView from '../views/SettingsView.vue'
import SetupView from '../views/SetupView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/setup', name: 'setup', component: SetupView },
    { path: '/game', name: 'game', component: GameView },
    { path: '/saves', name: 'saves', component: SavesView },
    { path: '/settings', name: 'settings', component: SettingsView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
