<template>
    <Swiper v-model="selected" class="container">
        <SwiperItem name="box1">
            <div class="content">内容1</div>
        </SwiperItem>
        <SwiperItem name="box2">
            <div class="content">内容2</div>
        </SwiperItem>
        <SwiperItem name="box3">
            <div class="content">内容3</div>
        </SwiperItem>
    </Swiper>
</template>
<script>
import Swiper from './components/Swiper';
import SwiperItem from './components/SwiperItem';

export default {
    components: {
        Swiper,
        SwiperItem
    },
    data () {
        return {
            selected:'box2'
        }
    }    
}
</script>
<style lang="less">
*{
    padding: 0;
    margin: 0;
}
.container{
    
    box-sizing: border-box;
    margin: 20px auto;
    width: 300px;
    height: 150px;
    border: 1px solid #ccc;
      .content{
        width: 100%;
        height: 100%;
        background: #blue;
      }

}
  
</style>