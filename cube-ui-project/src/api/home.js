import axios from '@/utils/ajaxRequest';
import store from '@/store'
//获取分类数据
export const fetchContent = () => {
    return axios.request({
        url: '/category'
    });
};

//获取轮播图数据
export const fetchSlides = () => {
    return axios.request({
        url: '/slides'
            // url:'slides'
    });
};

//获取列表对应的数据
export const fetchLessonList = (size, offset) => {
    return axios.request({
        url: `/lessonList/${store.state.home.currentLesson}?size=${size}&offset=${offset}`
    });
};