import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'


// 创建 Pinia 实例
const pinia = createPinia()
axios.defaults.baseURL = "http://localhost:8080"

createApp(App)
.use(pinia)
.use(ElementPlus)
.use(router)
.mount('#app')
