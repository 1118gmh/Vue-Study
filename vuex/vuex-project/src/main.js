import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
    store, //将store new Vue.$store
    render: h => h(App)
}).$mount('#app')