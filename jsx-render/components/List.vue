<template>
    <ul>
        <template v-for="a in arr">
            <!-- 具名插槽 -->
            <slot name="title" :a="a" b="1">
                <!-- 插槽里面包裹内容，相当于赋默认值，如果调用时候没有使用到插槽，则生效 -->
                <li :key="a">{{a}}</li>
            </slot>
        </template>
    </ul>
    
</template>

<script>
export default {
    props:{

        arr:{
            type:Array
        }
    }
}
</script>