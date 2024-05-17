import { createApp } from 'vue';
import Antd from 'ant-design-vue/lib';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue';
import store from './store';

const app = createApp(App);
app.use(store).use(Antd).mount('#app');
