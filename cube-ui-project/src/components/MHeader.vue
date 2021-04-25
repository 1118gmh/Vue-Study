<template>
  <div>
      <div class="m-header">
    <i class="return" @click="returnFrom">返回</i>
    <slot></slot>
  </div>
  <div class="empty"></div>
  </div>
</template>
<script>
export default {
  methods: {
    returnFrom(){
      this.$router.push('/profile');
    }
  }
}
</script>

<style lang="stylus">
.m-header
  position absolute
  z-index 100
  width 100%
  height 60px
  background #2a2a2a
  color #fff
  line-height 60px
  text-align center
  .return
    position absolute
    left 15px
.empty
  height 60px
</style>