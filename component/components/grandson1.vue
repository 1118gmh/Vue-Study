<template>
    <div>
        grandson1同样有{{mny}}
        <button @click="change">点击</button>
        <button @click="say">say</button>
    </div>

</template>

<script>

export default ({
    props: {
        mny:{
            type:Number
        }
    },
    methods: {
        change(){
            //孙子通过change函数，触发在儿子中给GrandSon1（自己）绑定的change事件
            //this.$emit('change',300);
            
            //也可以直接触发在父亲中给Son1（儿子）绑定的chang事件；存在问题，当层级多时要执行很多次
            this.$parent.$emit('change',300);


        },
        say(){
            this.$dispath('say');
        }
    }
})
</script>
