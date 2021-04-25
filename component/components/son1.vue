<template>
    <div>
        son1也有{{mny}}
        <!-- 儿子点击事件要修改mny值不能直接修改，要通过事件触发父亲的change方法修改父亲mny，然后儿子mny与父亲同步则达到修改的目的 -->
        <button @click="changeMoney()">点击</button>
        <!-- 给组件中的GrandSon1标签（孙子）绑定一个change事件（自定义的事件），当change事件触发时，则执行change方法，触发父亲的change事件（自定义的），达到修改mny的操作 -->
        <GrandSon1 :mny="mny" @change="change" @eat="eat"></GrandSon1>
    </div>
    
</template>

<script>
import GrandSon1 from './grandson1';
export default {
    components:{
        GrandSon1
    },
    props:{
        mny:{
            type:Number
        }
    },
    methods:{
        change(newValue){
            //触发父亲给自己挂载的change事件
            this.$emit('change',newValue);
        },
        changeMoney(){
            this.$emit('change',200);
        },
        eat(){
            console.log('eat');
        }
    }
}
</script>
<style>

</style>