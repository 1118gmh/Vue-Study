import Vue from 'vue';
import App from './App';

import { Message } from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

// Vue.use(ElementUI);
Vue.use(Message);
new Vue({
    el: '#app',
    render: h => h(App)
});