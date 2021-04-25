import { fetchContent, fetchSlides } from "../../api/home";
import * as types from '../actions-type';
export default {
    namespaced: true, //通过命名空间来区分是哪个模块的，但是在提交的时候要加上home
    state: {
        content: [],
        currentLesson: -1, //当前用户选中的课程
        slides: []
    },
    actions: { //发请求的
        async [types.SET_CONTENT]({ commit }) {
            try {
                let content = await fetchContent();
                commit(types.SET_CONTENT, content); //将状态提交给mutation
            } catch (e) {
                return Promise.reject(e);
            }

        },
        async [types.SET_SLIDES]({ commit }) {
            try {
                let slides = await fetchSlides();
                commit(types.SET_SLIDES, slides);
            } catch (e) {
                return Promise.reject(e);
            }
        }
    },
    mutations: { //同步状态的
        [types.SET_CONTENT](state, content) {
            state.content = content; //更新状态
        },
        [types.SET_CURRENT_LESSON](state, currentLesson) {
            state.currentLesson = currentLesson;
        },
        [types.SET_SLIDES](state, slides) {
            state.slides = slides;
        }
    }
}