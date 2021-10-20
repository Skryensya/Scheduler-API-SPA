import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const dotenv = require('dotenv');
dotenv.config();

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
