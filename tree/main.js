import Vue from 'vue';
import App from './App';

import {Tree} from 'element-ui';
 
Vue.use(Tree);
new Vue({
  el:'#app',
  render:h=>h(App)
});