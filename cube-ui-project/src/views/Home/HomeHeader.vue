<template>
  <div>
    <div class="header">
      <img src="@/assets/images/bird.png" alt=""/>
      <img @click="showDrawer" src="@/assets/images/menu.png" >
    </div>
    <cube-drawer ref="drawer" title="请选择" :data="data" @select="selectHandler"></cube-drawer>
  </div>
</template>

<script>
export default {
  props:{
    content:{
      type:Array,
      default:()=>[]
    }
  },
  computed: {
    data() {
      //默认值
      let defaultActive = [{ text: "全部课程", value: "-1" }];
      return this.content.length > 0? [[...defaultActive,...this.content]] :[defaultActive]
    }
  },
  methods: {
    showDrawer() {
      this.$refs.drawer.show();
    },
    selectHandler(value) {
      this.$emit('change',value);
    }
  }
}
</script>

<style lang="stylus">
.header
  height 56px
  display flex
  justify-content space-between
  background #2a2a2a
  img 
    display block
    margin 8px
    width 40px
    height 40px

</style>
