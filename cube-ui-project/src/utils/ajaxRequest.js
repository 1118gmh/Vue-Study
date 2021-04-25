import axios from "axios";
import { Toast } from 'cube-ui';
import store from '@/store';
import * as types from '@/store/actions-type';

//axios可以配置拦截器，我可以给这个实例增加多个拦截器
//axios实例的唯一性，我可以给每个请求独立增加拦截器

//开发环境： localhost:3000/xxx
//生产环境： www.xxx...

class AjaxRequest {
    constructor() {
        // this.baseURL = process.env.NODE_ENV != "production" ? "http://localhost:8686" : "/"; //基础路径
        this.baseURL = "http://localhost:3000/api";
        this.timeout = 3000; //超时时间
        this.validateStatus = function(status) {
            //自定义成功失败规则：resolve 、 reject(默认以2开头算成功)
            //自定义以2/3开头算成功
            return /^(2|3)\d{2}$/.test(status);
        };

        //增加请求的loading
        this.toast = Toast.$create({
            txt: 'loading',
            time: 0
        });
        // 请求前增加请求队列，用于控制loading的显隐
        this.queue = {};
    }
    setInterceptor(instance, url) {
        instance.interceptors.request.use((config) => {
            //每次请求前，将token放到请求中
            config.headers.token = localStorage.getItem('token');

            //每次请求的时候，都拿到一个取消请求的方法
            let Cancel = axios.CancelToken; //产生一个请求令牌
            config.cancelToken = new Cancel(function(c) {
                store.commit(types.PUSH_TOKEN, c); //给每一个请求都添加取消请求的方法，存储到vuex的ajaxToken中
            });
            //只要页面变化，就要去依次调用cancel方法，清除所有请求 路由钩子 beforeEach

            //请求前显示loading
            if (Object.keys(this.queue).length === 0) {
                this.toast.show();
            }
            //请求前增加请求队列
            this.queue[url] = url;
            return config;
        }, err => {
            return Promise.reject(err);
        });

        instance.interceptors.response.use((res) => {
            // 响应后关闭loading
            //请求完成后删除对应loading
            delete this.queue[url];
            if (Object.keys(this.queue).length === 0) {
                this.toast.hide(); //当队列清空隐藏loading
            }
            this.toast.hide();
            return res.data.data;
        }, err => {
            return Promise.reject(err);
        });
    }
    request(options) {
        let instance = axios.create();
        let config = {
            ...options,
            baseURL: this.baseURL,
            timeout: this.timeout,
            validateStatus: this.validateStatus
        };
        this.setInterceptor(instance); //给这个实例增加拦截功能
        return instance(config);
    }
}

export default new AjaxRequest