import Vue from 'vue';
import './cube-ui';
import App from './App.vue';
import router from './router';
import store from './store';
import 'amfe-flexible';

import filters from '@/utils/filters';
//定义全局过滤器 (就是提供一些公共的过滤器方法，能够在任何地方直接使用，实现过滤器方法的复用)
for (let key in filters) {
    Vue.filter(key, filters[key]);
}

Vue.config.productionTip = false;

new Vue({
    router, // 让每个人都增加两个属性this.$route属性 / this.$router方法
    store,
    render: (h) => h(App),
    mounted() {
        console.log(this);
    }
}).$mount('#app');