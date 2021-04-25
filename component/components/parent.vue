<template>
    <div>
        <div style="border:1px solid red">
            父亲有{{mny}}
            <!-- 给父组件中的Son1标签绑定了一个事件，事件的名字叫change，儿子通过this.$emit('change',200)方法触发事件，并传递一个参数200 -->
            <Son1 :mny="mny" @change="change"></Son1>
        </div>
        <div style="border:1px solid blue">
            <!-- 给儿子绑定update:count事件 -->
            <!-- <Son2 :count="count" @update:count="newValue=>count=newValue"></Son2> -->
            <!-- 语法糖（简写方式） -->
            <!-- <Son2 :count.sync="count"></Son2> -->

            <!-- 第二种方式value、input -->
            <!-- 给儿子绑定input事件（但是只能对应value变量） -->
            <!-- <Son2 :value="count" @input="newValue=>count=newValue"></Son2> -->
            <!-- 语法糖（简写方式） -->
            <Son2 v-model="count"></Son2>
        </div>
        <div style="border:1px solid green">
            <!-- 给Son3绑定2个事件：click mouseup事件（自定义的事件，只是名字和原生事件相同） -->
            <!-- 想要用原生的事件也可以，用.native -->
            <Son3 :mny="mny" :count="count" @click="show" @mouseup="show"></Son3>
        </div>
    </div>
</template>

<script>
import Son1 from './son1';
import Son2 from './son2';
import Son3 from './son3';

export default {
    components:{
        Son1,
        Son2,
        Son3
    },
    data() {
        return {
            mny:100,
            count:1
        }
    },
    methods:{
        change(newValue){
            this.mny = newValue;
        },
        show(){
            console.log("show");
        }
    }
}
</script>
