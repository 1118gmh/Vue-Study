import Vue from "vue";
import Vuex from "vuex";

import home from "./modules/home";
import * as types from "./actions-type";
import { Toast } from 'cube-ui';
import { login, validate,upload } from '@/api/login';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {},
        // hasPermission:false,
        menuPermission:false,
        isLogin: false, //是否登录
        ajaxToken: [] //准备一个容器 放所有请求的
    },
    mutations: {
        //发布订阅
        [types.PUSH_TOKEN](state, cancel) {
            state.ajaxToken = [...state.ajaxToken, cancel];
        },
        [types.CLEAR_TOKEN](state) {
            state.ajaxToken.forEach(cancel => cancel());
            state.ajaxToken = []; //清空数组
        },
        [types.SET_USER](state, payload) {
            state.user = payload;
            // state.hasPermission = true;
        },
        [types.SET_PERMISSION](state, payload) {
            state.isLogin = payload
        },
        [types.SET_MENUPERMISSION](state){
            state.menuPermission = true;
        },
        [types.SET_UPLOAD](state,url){
            //新增属性（或者使用vue的set方法），直接设置不会更新
            state.user = {...state.user,url}
        }
    },
    actions: {
        async [types.LOGIN]({ commit }, user) {
            try {
                let result = await login(user);
                commit(types.SET_USER, result);
                /// 将token存储到localStorage中
                localStorage.setItem("token", result.token); // 存储token
            } catch (e) {
                Toast.$create({
                    txt: "用户无法登录",
                    time: 2000
                }).show(); // 显示错误提示
                return Promise.reject(e);
            }
        },
        async [types.VALIDATE]({ commit }) {
            try {
                let user = await validate();
                let result = (typeof user.token === 'undefined') ? false : true;
                commit(types.SET_USER, user);
                commit(types.SET_PERMISSION, result);
                
                return result;
            } catch (e) {
                return Promise.reject(e);
            }
        },
        async [types.SET_UPLOAD]({commit},fd){
            let {url} = await upload(fd);
            commit(types.SET_UPLOAD,url);
        }
    },
    modules: {
        home
    }
});