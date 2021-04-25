<template>
  <div>
    <template v-for="menu in data">
      <gmh-submenu v-if="menu.children" :key="menu.id">
        <template slot="title">{{ menu.name }}</template>
        <Resub :data="menu.children"></Resub>
      </gmh-submenu>
      <gmh-menu-item v-else :key="menu.id">{{ menu.name }}</gmh-menu-item>
    </template>
  </div>
</template>

<script>
import gmhMenuItem from "./gmh-menu-item";
import gmhSubmenu from "./gmh-submenu";

export default {
    //递归组件
    name:"Resub",
  components: {
    gmhMenuItem,
    gmhSubmenu,
  },
  props: {
    data: {
      type: Array, //类型检测
      default: () => [], //默认值为空数组
    },
  },
};
</script>