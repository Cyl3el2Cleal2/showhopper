import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8081';

createApp(App).provide('$axios', axios).mount('#app')
