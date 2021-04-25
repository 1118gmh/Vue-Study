import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home/index.vue";
import loading from "../utils/loadable";
import hooks from "./hook";

Vue.use(VueRouter); // mixin声明了两个全局组件router-link router-view

const routes = [{
        path: "/",
        name: "Home",
        component: Home,
        meta: {
            idx: 0,
            keepAlive: true
        }
    },
    {
        path: "/course",
        //匹配到路径后才会加载这个组件
        name: "course",
        component: loading(() =>
            import ("@/views/Course/index.vue")),
        meta: {
            idx: 1,
            keepAlive: true,
            needLogin: true
        },
        children: [{
            path: "a",
            name: "a",
            component: {
                render: h => h(Home)
            }
        }]
    },
    {
        path: "/profile",
        //匹配到路径后才会加载这个组件
        name: "profile",
        component: loading(() =>
            import ("@/views/Profile/index.vue")),
        meta: {
            idx: 2,
            keepAlive: false
        }
    },
    {
        path: "/login",
        name: "login",
        component: loading(() =>
            import ("@/views/Login/index.vue")),
        meta: {
            idx: 3,
            keepAlive: false
        }
    }
    // {
    //   path: '/about',
    //   name: 'About',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    // },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});
Object.values(hooks).forEach(hook => {
    router.beforeEach(hook.bind(router));
});

export default router;