<template>
    <div>
        <!-- <Leval type="1">哈哈</Leval> -->
        <!-- <Leval type="2">嘿嘿</Leval> -->

        <List :arr="arr">
            <!-- 通过解构的方式，获取变量 -->
            <template v-slot:title="{a,b}">
                <li>#{{a}}{{b}}</li>
                <li>扩展{{a}}</li>
            </template>
        </List>
    </div>
</template>
<script>
//slot-scopt 作用域插槽，可以将组件的内容 共享出来 可以复用
// 现在一般都使用v-slot指令
//通过v-slot属性及具名插槽，对组件进行扩展

// import Leval from './components/LevalFunction';
import List from './components/List'
export default {
    components: {
        // Leval,
        List
    },
    data () {
        return {
            arr:[1,2,3]
        }
    }
}
</script>