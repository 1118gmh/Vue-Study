<template>
  <div class="home">
    <!-- 父亲要干的事：
            导入儿子模块，发请求 
          儿子要干的事：
            接收父亲传递的数据，进行数据绑定
    -->
    <!-- :content父传子，儿子通过props接收数据，儿子接收到数据，进行数据绑定 -->
    <!-- @change子传父，儿子通过$emit()向父亲传递数据，父亲在收到数据后，可以发送请求 -->
    <HomeHeader :content="content" @change="change"></HomeHeader>

    <!-- 轮播图 -->
    <div class="home-slide">
      <cube-slide :data="slides" />
    </div>

    <!-- 当前滚动区域的包裹 -->
    <div class="home-wrapper">
      <cube-recycle-list class="list" :size="size" :on-fetch="onFetch" :offset="offset" ref="list">
        <template slot="item" slot-scope="{ data }">
          <div :id="data.id" class="item">
            <h2>{{ data.title }}</h2>
            <img :src="data.pic" alt="" />
            <p>{{ data.price | addCurrency("￥") }}</p>
            <!-- <div
              class="avatar"
              :style="{ backgroundImage: 'url(' + (data.avatar || '') + ')' }"
            ></div> -->
            <!-- <div class="bubble">
              <p>{{ data.msg }}</p>
              <div class="meta">
                <time class="posted-date">{{ data.time }}</time>
              </div>
            </div> -->
          </div>
        </template>
      </cube-recycle-list>
    </div>
  </div>
</template>
<script>
// import {fetchContent} from '@/api/home';
import { fetchLessonList } from "@/api/home";
import HomeHeader from "./HomeHeader";
import * as types from "@/store/actions-type";
// import {mapActions} from 'vuex'; //1
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState, mapMutations } = createNamespacedHelpers("home");
// const {mapActions:mapAA,mapState:mapAA} = createNamespacedHelpers("home/aa"); //重命名
export default {
  components: {
    HomeHeader
  },
  data() {
    return {
      size: 5,
      offset: 10
    };
  },
  computed: {
    ...mapState(["content", "slides"])
  },
  created() {
    //在页面一创建的时候，可以定义一些公共数据，这些属性不需要动态的监控
    this.offsetIndex = 0;
    this.hasMore = true;
  },
  methods: {
    //抓取列表数据
    async onFetch() {
      if (this.hasMore) {
        try {
          //如果有更多数据就去获取数据
          let { result, hasMore } = await fetchLessonList(this.size, this.offsetIndex);
          this.hasMore = hasMore;
          this.offsetIndex = this.offsetIndex + result.length; //找到对应的便宜量
          return result; //每次返回的数据
        } catch (e) {
          return Promise.reject(e);
        }
      } else {
        return false; //停止滚动
      }
    },
    //去切换课程
    change(value) {
      this[types.SET_CURRENT_LESSON](value[0]); //将我们选中的结果通过mutation传入vuex中
      //重置获取数据
      this.hasMore = true;
      this.offsetIndex = 0;
      //通过ref可以调用引入的组件的实例上的方法
      this.$refs.list.reset();
    },
    ...mapMutations([types.SET_CURRENT_LESSON]),
    // ...mapActions("home",["setContent"]) //2
    // ...mapActions(["setContent"])
    ...mapActions([types.SET_CONTENT, types.SET_SLIDES])
  },
  activated(){ //页面激活（就是当前页面又显示的时候）
    let scrollTop = sessionStorage.getItem("scrollTop");
    this.$refs.list.$el.scrollTop = scrollTop;
  },
  deactivated () { //页面失活（就是当前页面不显示的时候）
    
  },
  mounted() {
    // fetchContent().then(data=>{
    //   console.log(data);
    // });
    //执行vuex中某个模块的方法
    //第一种写法：通过dispatch方法执行actions中方法
    // this.$store.dispatch('home/setContent')

    //第二种写法：通过mapActions，映射到当前methods中，直接调用
    // this.setContent(); //3

    //第三种写法：使用createNamespacedHelpers辅助命名空间
    // this.setContent();

    //默认加载分类和轮播图
    this[types.SET_CONTENT]();
    this[types.SET_SLIDES]();

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
};
</script>

<style lang="stylus">
img
  width 100%
  height 100%
.home-slide
  width 100%
  height 180px
  background rgba(0,0,0,.1)
  img
    width 100%
    height 100%
.home-wrapper
  margin-top 20px
  margin-left 37.5px
  height 230px

  .item
    display flex
    flex-direction column
    justifuy-content center
    box-sizing border-box
    padding 5px
    margin-bottom 5px
    width 300px
    height 260px
    border 1px solid #ccc
    overflow hidden
    text-align center
</style>
