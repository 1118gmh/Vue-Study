<template>
    <div>
        <!-- 使用组件 -->
        <Parent @say="say"></Parent>

        <!-- 向下传递 -->
        <button @click="broadcast">点击触发所有的</button>

        
    </div>
    
</template>

<script>
//引入组件
import Parent from './components/parent';
export default {
    //注册组件
    components:{
        Parent
    },
    methods: {
        say(){
            console.log('say');
        },
        broadcast(){
            this.$broadcast('eat');
        }
    }
}
</script>

<style>

</style>