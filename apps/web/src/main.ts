import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import '@/plugins'
import './assets/global.css'
import './assets/tailwind.css'
import './styles/global.scss'
import './styles/theme.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './utils/globalClickEffect'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(pinia)

app.mount('#app')
