import Vue from 'vue';
import App from './App.vue';

import { Button, Select, Option } from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

// Vue.use(ElementUI);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);

new Vue({
    el: '#app',
    render: h => h(App)
});