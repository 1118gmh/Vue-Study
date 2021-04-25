import less from 'less';
import Vue from 'vue';
import App from './App';

Vue.use(less);

new Vue({
    el: '#app',
    render: h => h(App)
});