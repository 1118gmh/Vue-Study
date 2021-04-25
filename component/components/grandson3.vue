<template>
    <div>
        mny的值：{{mny}},$attrs.count的值{{$attrs.count}}
        <button @click="$listeners.click" @mouseup="$listeners.mouseup">点击打印show</button>
    </div>
</template>
<script>
export default {
    props: ["mny"]
}
</script>