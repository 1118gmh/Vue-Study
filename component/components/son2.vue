<template>
    <div>
        <!-- count的值{{count}} -->
        count的值{{value}}
        <button @click="change">点击改值</button>
    </div>
    
</template>

<script>
export default {
    props: {
        count:{
            type:Number
        },
        value:{
            type:Number
        }
    },
    methods: {
        change(){
            // this.$emit('update:count',100);
            this.$emit('input',100);
        }
    }
}
</script>