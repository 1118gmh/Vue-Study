//跟路由相关的hook 钩子 全局钩子
import store from '@/store';
import * as types from '@/store/actions-type';
import axios from '@/utils/ajaxRequest';
import auth from './auth';
export default {
    cancelToken: (to, from, next) => {
        //清除token
        store.commit(types.CLEAR_TOKEN); //发布，清除所有请求 
        next(); //继续往下走
    },
    cancelLoading: (to, from, next) => {
        //在清除token后，让loading模块隐藏
        axios.toast.hide();
        next(); //继续往下走
    },
    isLogin: async(to, from, next) => {
        //是否登录
        //1. 判断用户是否登录
        let isLogin = await store.dispatch(types.VALIDATE);
        //2. 判断页面是否需要登录(如果父亲需要等路，儿子则也要，因此要判断匹配到的所有路由)
        let needLogin = to.matched.some(item => item.meta.needLogin);
        if (needLogin && !isLogin) {
            next('/login'); //如果当前页面需要登录并且没登录，则跳转登录页面
        } else {
            next(); //继续往下走
        }
    },
    profileAuth:function (to,from,next){
        if(to.name === 'profile'){
            if(store.state.isLogin && store.state.user.menuList){
                //我们不能每次跳转到个人file页面就拉取一次，因此需要在拉取一次过后，设置菜单权限
                if(!store.state.menuPermission){
                    let list = store.state.user.menuList.map(item => item.name);
                    let newRoutes = auth.filter(item=> list.includes(item.name));
                    // newRoutes就是我们要新增加的路由
                    this.addRoutes(newRoutes);  //把需要的路由新增进去，是在下一轮才会生效
                    store.commit(types.SET_MENUPERMISSION);
                    next({...to,replace:true}); 
                }
            }
        }
        next();
    }
};