<template>
  <div>
    <div class="banner" v-if="!$store.state.isLogin">
      <img src="@/assets/images/bird.png" alt="head" class="head">
      <img src="@/assets/images/background.jpg" alt="" />
      <cube-button class="login" primary @click="toLogin">登录</cube-button>
    </div>

    <div class="banner" v-else>
      <img src="@/assets/images/bird.png" alt="head" class="head" @click="upFile" v-if="!user.url">
      <img src="@/assets/images/bird.png" alt="head" class="head" @click="upFile" v-else>
      <Upload ref="upload" @change="change"></Upload>
      <img src="@/assets/images/background.jpg" alt="" />
      <!-- <cube-button class="login" primary @click="toLogin">登录</cube-button> -->
      {{user.username}}
    </div>
<!-- 底下的这个组件应该和路由表中的路由分开
    因为这是根据后端的权限动态的加载当前需要哪些路由 -->
    <ul class="list">
      <router-link tag="li" v-for="menu in user.menuList" :to="menu.path" :key="menu.path">
        {{menu.name}}
      </router-link>
    </ul>
  </div>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import Upload from '@/components/Upload';
import * as types from '@/store/actions-type';
export default {
  components: {
    Upload
  },

  computed: {
    ...mapState(["user","isLogin"])
  },
  methods: {
    ...mapActions([types.SET_UPLOAD]),
    change(fd){
      this[types.SET_UPLOAD](fd);
    },
    upFile(){
      //调用子组件中的show方法，调用文件，这样就可以直接点击头像调用文件了
      this.$refs.upload.show();
    },
    toLogin() {
      this.$router.push("/login");
    }
  }
};
</script>
<style lang="stylus">
.banner
  width 100%
  height 100px
  img
    width 100%
    height 200%
  .head
    display block
    width 100px
    height 100px
    border-radius 50% 
    background #ccc
</style>
