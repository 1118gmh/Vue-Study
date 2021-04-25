<template>
  <div id="app">
    <!-- <router-link to="/">首页</router-link>
    <router-link to="/course">课程</router-link>
    <router-link to="/profile">个人中心</router-link> -->

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

    <cube-tab-bar v-model="selectedLabelDefault" :data="tabs" @change="changeHandler" class="footer"></cube-tab-bar>
  </div>
</template>
<script>
import Vue from 'vue';
export default {
  data() {
    return {
      move:'left',
      selectedLabelDefault: "/",
      tabs: [
        {
          label: "首页",
          value: "/", //选中的值
          icon: "cubeic-home"
        },
        {
          label: "我的课程",
          value: "/course",
          icon: "cubeic-like"
        },
        {
          label: "个人中心",
          value: "/profile",
          icon: "cubeic-person"
        }
      ]
    };
  },
  methods: {
    changeHandler(label) {
      //让路由随着tab标签的改变而变化（也就是tab标签亮，地址栏显示对应的路由，让其展示对应的组件）
      this.$router.push(label);
    }
  },

  watch: {
    $route: {
      //监控路由属性的变化，让$route随路由的变化而改变（也就是地址栏变，对应tab标签亮）
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
};
</script>
<style lang="stylus">
html, body, #app
  width: 100%
  height: 100%

#app 
  display flex 
  flex-direction column 
.container
  flex 1
.footer
  width 100%
  background #f2f2f2
  font-size: 18px

.left-enter,.right-leave-to
  transform translateX(100%)
.left-enter-active,.left-leave-active,.right-enter-active,.right-leave-active
  transition 1s

.left-leave-to,.right-enter
  transform translateX(-100%)

.left-enter-active,.right-enter.active
  position absolute
  top 0
  left 0
  width 100%
.wrapper
  position absolute
  left 0
  top 0
  z-index 10
  width 100%
  height 100%
  background #fff
   

</style>
