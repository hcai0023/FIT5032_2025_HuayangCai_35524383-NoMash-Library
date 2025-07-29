import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'


const app = createApp(App)
const pinia = createPinia()
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)
app.use(pinia)

app.mount('#app')

