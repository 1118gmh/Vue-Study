<template>
    <div class="swiper">
        <div class="viewport">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value:{
            type:String,
            default:''
        }
    },
    mounted(){
        let currentSelected = this.value || this.$children[0].name;
        //让对应的儿子显示，其他人隐藏
        this.$children.forEach(vm=>{
            vm.selected = currentSelected;
        });
    }
}
</script>