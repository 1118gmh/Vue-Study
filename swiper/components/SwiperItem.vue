<template>
    <div class="swiper-item" v-if="isShow">
        <slot></slot>
    </div>
</template>
<script>
export default {
    computed: {
        isShow(){ //根据用户的参数，来控制显示某一个
            return this.selected === this.name;
        }
    },
    data () {
        return {
            selected:'' //默认当前用户传递过来的数据
        }
    },
    props: {
        name:{
            type:String,
            required:true
        }
    }
}
</script>