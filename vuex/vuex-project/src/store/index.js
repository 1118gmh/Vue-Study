import Vue from 'vue'
// import Vuex from 'vuex'   //原生的
import Vuex from 'vuex' //自己封装的

Vue.use(Vuex) // 1. 使用这个插件的install方法

//如：使用persits插件，在数据更新的时候，可以同步更新localStorage
const persits = (store) => {
    store.subscribe((mutation, state) => {
        localStorage.setItem('vux-state', JSON.stringify(state));
    });
}

export default new Vuex.Store({ //导出的是一个store的实例
    plugins: [ //插件：当数据更改的时候，执行方法
        persits 
    ],
    state: { //统一的状态管理
        age: 10
    },
    getters: {
        //计算属性
        myAge(state) { //Object.defineProperty
            return state.age + 18;
        }
    },
    mutations: { // 可以更改状态
        syncAdd(state, payload) {
            state.age += payload;
        },
        syncMinus(state, payload) {
            state.age -= payload;
        }
    },
    actions: { // 异步提交更改
        asyncMinus({ commit }, payload) {
            setTimeout(() => {
                commit("syncMinus", payload);
            }, 1000);
        }
    },
    modules: { //模块
        a: {
            state: { a: 1 },
            modules: {
                c: {
                    getters: { //所有的getter都会定义到根上
                        computedC(state) {
                            return state.c + 100;
                        }
                    },
                    state: {
                        c: 1
                    },
                    mutations: {
                        syncAdd(state, payload) {
                            console.log('add');
                        }
                    }
                }
            }
        },
        b: {
            state: { b: 2 }
        }
    }
})