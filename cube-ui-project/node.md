### 项目流程总结
1. 通过vue-cli创建一个项目
```
npm install vue-cli -g 安装vue-cli

vue create cube-ui-project 创建项目

vue init webpack cube-ui-project 初始化

yarn serve 或 npm run serve 启服务

配置一些选项

这样就在文件中创建了一个cube-ui-project项目，在这个项目中：
- build # webpack配置文件
- config # vue项目配置文件
- node_modules # 项目依赖包
- public # 静态资源文件
- src # 源代码文件夹（我们写的代码大部分都在这里）
- test # 测试文件夹
- package.json # npm配置文件
- ... # 其他文件 

src目录下
- main.js # 入口文件
- App.vue # 根组件
- cube-ui.js # 引入的ui组件（通过vue add cube-ui自动导入【vue cli安装】）

- view # 各页面组件文件夹
- components # 公共组件文件夹
- utils # 公共js文件夹
- assets # 静态资源文件夹
- api  # AJAX请求方法文件夹

- router # 路由文件夹
- store # vuex状态管理文件夹

```
2. router路由管理流程
```
（当然也可以vue-cli的时候选中vue-router自动帮你安装导入引入）
1. 安装 npm 
2. 导入到router文件夹下的index.js中
	import VueRouter from 'vue-router';
	Vue.use(VueRouter);
3. 此时会在全局声明2个组件：
	router-link
	router-view
4. 根据需求在index.js中配置路由
	const routes = [{
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/course',
        //匹配到路径后才会加载这个组件
        name: 'course',
        component: loading(() =>
            import ('@/views/Course/index.vue'))
    },
    {
        path: '/profile',
        //匹配到路径后才会加载这个组件
        name: 'profile',
        component: loading(() =>
            import ('@/views/Profile/index.vue'))
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;

5. 使用
	<router-link to="/">首页</router-link>
    <router-link to="/course">课程</router-link>
    <router-link to="/profile">个人中心</router-link>
    <router-view></router-view>
    当点击首页/课程/个人中心的时候，会根据路由找到对应的组件，在router-view处渲染

6. 在main.js中挂载router
	import router from './router';
	new Vue({
      router, // 让每个人都增加两个属性this.$route属性 / this.$router方法
      store,
      render: (h) => h(App),
    }).$mount('#app');

```
3. vuex状态管理流程
```
【结构】
store
    module 用于存放各个子模块
    actions-type.js 用于存放actions的公共变量
    index.js 主入口（在里面可以引入各个子模块）
【作用】
1）使用vuex可以存到内存中，只要用户不刷新，我就可以去内存中取
2）如果多个页面有共同逻辑，调用共同的action，即可

【使用】
1. 在actions中异步获取数据，并且将状态同步给mutation
    actions: { //发请求的
        async [types.SET_CONTENT]({ commit }) {
            let content = await fetchContent();
            commit(types.SET_CONTENT, content); //将状态提交给mutation
        }
    },
2. 在mutations中接收状态，并更新状态（一般方法名和actions中方法相同）
    mutations: { //同步状态的
        [types.SET_CONTENT](state, payload) {
            state.content = payload; //更新状态
        }
    }
3. 在组件中发请求

//第一种写法：通过dispatch方法执行actions中方法
// this.$store.dispatch('home/setContent')

//第二种写法：通过mapActions，映射到当前methods中，直接调用
// this.setContent(); //3

//第三种写法：使用createNamespacedHelpers辅助命名空间
// this.setContent();

**一般都是使用第三种写法，更加清晰一点**

- 引入命名空间
    import {createNamespacedHelpers } from 'vuex';  
- 获取对应模块下的map
    const {mapActions,mapState} = createNamespacedHelpers("home");  
// const {mapActions:mapAA,mapState:mapAA} = createNamespacedHelpers("home/aa"); //重命名
- 声明
  computed: {
    ...mapState(["content"])
  },
  methods:{
    // ...mapActions("home",["setContent"]) //2
    // ...mapActions(["setContent"])
    ...mapActions([types.SET_CONTENT])
  },
- 调用
  mounted () {
    this[types.SET_CONTENT](); //发请求
    console.log(content); //对应的状态同步更新，就可以在页面中使用啦
  }

```
4. 父子通信
```
    <!-- 父亲要干的事：
            导入儿子模块，发请求 
          儿子要干的事：
            接收父亲传递的数据，进行数据绑定
    -->
    <!-- :content父传子，儿子通过props接收数据，儿子接收到数据，进行数据绑定 -->
    <!-- @change子传父，儿子通过$emit()向父亲传递数据，父亲在收到数据后，可以发送请求 -->
```

5. 直接在组件中抓取数据进行动态绑定

```
//如果要实现复用，则要用到vuex

    //抓取列表数据
    async onFetch() {
      if(this.hasMore){ 
        //如果有更多数据就去获取数据
        let {result,hasMore} = await fetchLessonList(this.size,this.offsetIndex);
        this.hasMore = hasMore; 
        this.offsetIndex = this.offsetIndex + result.length; //找到对应的便宜量
        console.log(result);
        return result; //每次返回的数据
      }else{
        return false; //停止滚动
      }
    },
```

6. 通过ref可以调用引入的组件的实例上的方法
```
      <cube-recycle-list class="list" :size="size" :on-fetch="onFetch" :offset="offset" ref="list">
      </cube-recycle-list>

      this.$refs.list.reset();
```

7. 可以通过给router-view套一层transition来实现路由切换时的特效
```
    <transition :name="move">
      <router-view class="container"></router-view>
    </transition>

    通过给路由设置idx来判断是向左切换左还是向右切换
        meta: {
            idx: 2
        }
      watch: {
    在路由切换的时候，改变move属性，以此来改变样式，实现向左或向右
    data：{
      move:'left'
    }
    $route: {
      handler(to, from) {
        if(to&&from){
          if(to.meta.idx > from.meta.idx){
            this.move = 'left';
          }else{
            this.move = 'right';
          }
        }
        this.selectedLabelDefault = to.path;
      },
      immediate: true
    }
  }

```

8. filters过滤器,用于文本格式化
```
1.定义
【全局过滤器】
  例：定义一个全局过滤器
  Vue.filter('capitalize', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  })
  当然一般在项目中，在utils中创建一个filters.js文件，用于定义所有的过滤器方法，默认导出一个对象，保存所有过滤器方法
  在main.js中导入filters，循环对象，定义过滤器
    export default {
        addCurrency(value, currency) {
            return currency + value;
        }
    }
    main.js
    import filters from '@/utils/filters';
    for (let key in filters) {
        Vue.filter(key, filters[key]);
    }
【本地过滤器】
  例：
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
2. 使用
    可以使用在双花括号插值末尾
      <p>{{data.price | addCurrency("￥")}}</p>
    可以使用在 v-bind 表达式末尾
      <div v-bind:id="rawId | formatId"></div>
```

9. 实现切换页面时中断请求
```
1. 提供发布订阅的方法（订阅所有的取消请求的方法，发布时获取取消请求的方法并且去全部执行）
  在store中，
    state: {
        ajaxToken:[] //准备一个容器 放所有请求的
    },
    mutations: {
        //发布订阅
        [types.PUSH_TOKEN](state, cancel) {
            state.ajaxToken = [...state.ajaxToken, cancel];
        },
        [types.CLEAR_TOKEN](state, cancel) {
            state.ajaxToken.forEach(cancel => cancel());
        }
    },
2. 在每一次请求的的时候（也就是在请求拦截器中），订阅取消请求的方法
    //每次请求的时候，都拿到一个取消请求的方法
    let Cancel = axios.CancelToken; //产生一个请求令牌
    config.cancelToken = new Cancel(function(c) {
        store.commit(types.PUSH_TOKEN, c); //给每一个请求都添加取消请求的方法，存储到vuex的ajaxToken中
    });
    //只要页面变化，就要去依次调用cancel方法，清除所有请求 路由钩子 beforeEach

3. 在每一次页面变化的时候，发布所有取消请求的方法
  - 在router文件夹中创建hook.js文件，用于定义所有的router钩子函数
  import store from '@/store';
  import * as types from '@/store/actions-type';
  export default {
      cancelToken: (to, from, next) => {
          //清除token
          store.commit(types.CLEAR_TOKEN); //发布，清除所有请求 
          next(); //继续往下走
      },
      permission: (to, from, next) => {
          //清除loading

          next(); //继续往下走
      }
  };

  - 在router的index.js中引入钩子函数，并注册
  import hooks from './hook';
  Object.values(hooks).forEach(hook => {
    router.beforeEach(hook);
  });
```

10. 登录模型
```
1. 当点击登录按钮，跳转登录界面，通过通过设置路由，然后路由跳转
    {
        path: '/login',
        name: 'login',
        component: loading(() =>
            import ('@/views/Login/index.vue')),
        meta: {
            idx: 3
        }
    }
    this.$router.push("/login");

2. 在登录页面中引入cubeui的表单组件,当点击submit按钮的时候，发送异步请求并且跳转路由
        this[types.LOGIN](this.model);
        this.$router.push("/");
  注意：
    这里的login方法定义在api的login中，通过vuex订阅，在组件中发布
      【login.js中定义axios请求】
      export const login = (user) => {
          return axios.request({
              url: '/login',
              method: 'POST',
              data: user
          })
      }
      【mutations中同步状态】
      [types.SET_USER](state, payload) {
          state.user = payload;
          state.hasPermission = true;
      }
      【actions中发异步请求】
      async [types.LOGIN]({ commit }, user) {
          try {
              let result = await login(user);
              commit(types.SET_USER, result);
              /// 将token存储到localStorage中
              localStorage.setItem("token", result.token); // 存储token
          } catch (e) {
              console.log(e);
              Toast.$create({
                  txt: "用户无法登录",
                  time: 2000
              }).show(); // 显示错误提示
              return Promise.reject(e);
          }
      }
      【login.vue中发布请求】
      this[types.LOGIN](this.model);
```

11. 页面缓存
```
通过vue提过的keep-alive组件来做页面缓存
    <transition :name="move">
      <!-- keep-alive 内部缓存虚拟节点，直接将缓存后的结果返回 -->
      <keep-alive>
        <router-view class="container" v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
<!-- 当然有些页面不需要缓存，则通过 设置$route.meta.keepAlive 来判断是否需要缓存，需要缓存则用上面，不需要缓存则用下面 -->
    <transition :name="move">
        <router-view class="container" v-if="!$route.meta.keepAlive"></router-view>
    </transition>
```

12. 页面中列表滚动后，记录滚动的位置，切换页面后，返回时，停在滚动的位置
```
1. 在sessionStorage中记录滚动的位置（获取DOM元素，绑定滚动事件，防抖，sessionStorage存储）
  mounted() {
    //记录列表滚动的位置(防抖)
    let timer;
    this.$refs.list.$el.addEventListener('scroll',(e)=>{
        if(timer){
          clearTimeout(timer);
        }
      timer = setTimeout(()=>{
        sessionStorage.setItem("scrollTop",e.target.scrollTop);
      },50);    
    });
  }
2. 在页面激活的时候，设置当前滚动的位置
  activated(){ //页面激活（就是当前页面又显示的时候）
    let scrollTop = sessionStorage.getItem("scrollTop") || 0;
    this.$refs.list.$el.scrollTop = scrollTop;
  },
```
13. 我的课程模块需要登录后显示，若没登录，则直接跳转登录页面
```
1. 给需要扥不过刘的页面设置needLogin=true;
        meta: {
            idx: 1,
            keepAlive: true,
            needLogin: true
        },
2. 在路由跳转之前，判断用户是否登录，判断页面是否需要登录；如果用户没登录并且页面需要登录，则跳转登录页
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
```
13. 路由的动态加载
```
前端把常用的路由和需要后端权限的路由分开，然后需要权限的路由又后端直接返回数据，前端处理成路由动态加载的数据。
    
1. 在组件中添加路由组件，但是路由应该是动态加载出来的
    <!-- 底下的这个组件应该和路由表中的路由分开
        因为这是根据后端的权限动态的加载当前需要哪些路由 -->
        <ul class="list">
          <router-link tag="li" v-for="menu in user.menuList" :to="menu.path" :key="menu.path">
            {{menu.name}}
          </router-link>
        </ul>
2. auth.js中存放需要后台权限的路由
    //这里存放需要后端权限的路由
      export default [
          {
              path: "/contact",
              name: "contact",
              component: {
                  render: h => <h1> 联系我 </h1>
              }
          },
          {
            path: "/service",
            name: "service",
            component: {
                render: h => <h1> 服务 </h1>
            }
        }
      ]

3. 在页面切换之前,动态加载新路由
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

```
14. 有些页面不需要页脚，可以通过样式直接搞定
```
1. 在全局中写个wrapper样式类，让其盖住页脚
.wrapper
  position absolute
  left 0
  top 0
  z-index 10
  width 100%
  height 100%
  background #fff

2. 哪个模块不需要页脚，加载哪个模块中添加wrapper类
    <div class="wrapper">
    </div>
```
15. 有些页面需要页头，页头的样式都差不多，可以写个公共组件
```
1. 写一个公共头组件MHeader.vue
<template>
  <div>
      <div class="m-header">
    <i class="return" @click="returnFrom">返回</i>
    <slot></slot>
  </div>
  <div class="empty"></div>
  </div>
</template>
<script>
export default {
  methods: {
    returnFrom(){
      this.$router.push('/profile');
    }
  }
}
</script>

<style lang="stylus">
.m-header
  position absolute
  z-index 100
  width 100%
  height 60px
  background #2a2a2a
  color #fff
  line-height 60px
  text-align center
  .return
    position absolute
    left 15px
.empty
  height 60px
</style>

2. 哪个页面需要头就加上去
    <MHeader>登录</MHeader> 
```
16. 上传图片功能
```
1. 写一个上传文件的组件
  <template>
  <!-- accept 只能上传image事件 -->
    <input type="file" accept="image/*" @change="change" ref="show">
  </template>
  <script>
  export default {
    methods: {
      change(e){
        let file = e.target.files[0];
        let fd = new FormData();
        fd.append('file',file);
        this.$emit('change',fd);
      },
      show(){ //提供一个show方法，用于调用文件
        this.$refs.show.click();
      }
    }
  }
  </script>
2. 在页面中引入
  <img src="@/assets/images/bird.png" alt="head" class="head" @click="upFile" v-if="!user.url">
  <img src="@/assets/images/bird.png" alt="head" class="head" @click="upFile" v-else>
  <Upload ref="upload" @change="change"></Upload>
3. 默认的Upload组件太丑了，我们应该把它隐藏，通过点击头像，触发input点击事件
    父
    upFile(){
      //调用子组件中的show方法，调用文件，这样就可以直接点击头像调用文件了
      this.$refs.upload.show();
    },
    子
    show(){ //提供一个show方法，用于调用文件
      this.$refs.show.click();
    }
4. 当input标签change的时候，获取它的文件，传递给父组件，由父组件发请求
    子
    change(e){
      let file = e.target.files[0];
      let fd = new FormData();
      fd.append('file',file);
      this.$emit('change',fd);
    },
    父
    change(fd){
      this[types.SET_UPLOAD](fd);
    },
    发请求
    //upload API
    export const upload = (fd) => {
        return axios.request({
            url: '/avatar',
            method: 'post',
            headers: {
                'content-type': 'multipart/form-data'
            },
            data: fd
        })
    }
    //发请求
    async [types.SET_UPLOAD]({commit},fd){
        let {url} = await upload(fd);
        commit(types.SET_UPLOAD,url);
    }
    //同步数据，要增加当前用户的属性url，需要从新解构出来，添加，否则不会更新
    [types.SET_UPLOAD](state,url){
        //新增属性（或者使用vue的set方法），直接设置不会更新
        state.user = {...state.user,url}
    }
```

