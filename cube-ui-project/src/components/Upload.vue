<template>
<!-- accept 只能上传image事件 -->
  <input type="file" accept="image/*" @change="change" ref="show">
</template>
<script>
export default {
  methods: {
    change(e){
      let file = e.target.files[0];
      let fd = new FormData();
      fd.append('file',file);
      this.$emit('change',fd);
    },
    show(){ //提供一个show方法，用于调用文件
      this.$refs.show.click();
    }
  }
}
</script>