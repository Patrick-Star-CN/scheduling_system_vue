import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import * as Icons from '@ant-design/icons-vue'
import axios from "axios";
const app = createApp(App)
app.use(Antd).use(store).use(router)
// 全局使用图标，遍历引入
const icons = Icons
for (const i in icons) {
    app.component(i, icons[i])
}
axios.defaults.baseURL="/"
app.mount('#app')
