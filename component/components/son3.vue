<template>
    <div>
        <div>
            {{$attrs}}
        </div>
        <!-- 将属性全部传递给grandson3组件，将事件全部传递给grandson3组件 -->
        <GrandSon3 v-bind="$attrs" v-on="$listeners"></GrandSon3>
    </div>    

</template>
    
<script>
import GrandSon3 from './grandson3';
export default {
    //如果没有使用props，则默认将所有attrs挂载到$attrs上，并且将所有属性挂到html结构上
    //$attrs:{ "mny": 100, "count": 1 }
    
    //如果组件中使用了props，就会将attrs从当前$attrs移除掉，并且将所有属性挂到html结构上
    // props: ["mny"]
    //$attrs:{"count":1}，只会挂载count

    //如果设置了inheritAttrs:false,虽然$attrs上还有attrs，但是不会在html结构上挂载这两个属性
    inheritAttrs:false,

    // mounted () {
    //     //当前$listener就绑定了传递过来的事件：{click: ƒ, mouseup: ƒ}
    //     console.log(this.$listeners);
    // },

    components:{
        GrandSon3
    }
}
</script>
<style>

</style>