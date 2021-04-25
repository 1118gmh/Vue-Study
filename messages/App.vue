<template>
    <button @click="show"></button>
</template>

<script>
import {Message} from 'element-ui';
export default {
    methods: {
        show(){
            Message.success({
                message:"hello",
                duration:3000
            });
        }
    }
}
</script>