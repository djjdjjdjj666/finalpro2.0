import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

axios.defaults.baseURL = "http://localhost:8080"

createApp(App)
.use(ElementPlus)
.use(router)
.mount('#app')
