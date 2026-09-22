import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './locales/index'
import { router } from './router/index'
import { watchRootBreakpoints } from './rootBreakpoints'
import { applyTheme, initialTheme } from './store/settings'
import './style.css'

registerSW({ immediate: true })
applyTheme(initialTheme())
watchRootBreakpoints()

const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.use(router)
app.mount('#app')
