import Vue from 'vue';
import App from './App';

//加载全局样式 全局组件 全局指令


Vue.prototype.$dispath = function(eventName, value) {
    let parent = this.$parent; //先找第一层的$parent
    while (parent) {
        parent.$emit(eventName, value); //触发方法
        parent = parent.$parent; //接着向上找
    }
}

Vue.prototype.$broadcast = function(eventName, value) {
    let children = this.$children;

    function broad(children) {
        children.forEach(child => {
            child.$emit(eventName, value);
            if (child.$children) {
                broad(child.$children);
            }
        });
    }
    broad(children);
}


//1. 入口文件webpack会根据这个入口文件进行打包
//2. 默认渲染App.vue


//创建一个vue实例
new Vue({
    el: '#app',
    render: h => h(App) //用h（createEelment）
});

//vue serve