<template>
  <gmh-menu>
    <!-- 循环数据，根据有没有children来显示submenu 还是menu-item -->
    <Resub :data="data"></Resub>
  </gmh-menu>
</template>
<script>
import gmhMenu from "./gmh-menu";
// import gmhMenuItem from "./gmh-menu-item";
// import gmhSubmenu from "./gmh-submenu";
import Resub from "./Resub";

export default {
  props: {
    data: {
      type: Array, //类型检测
      default: () => [],//默认值为空数组
    },
  },
  components: {
    gmhMenu,
    Resub
    // gmhMenuItem,
    // gmhSubmenu,
  },
};
</script>