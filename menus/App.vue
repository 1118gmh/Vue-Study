<template>
  <div>
    <!-- 引入element-ui组件 -->
    <el-button type="text">文字按钮</el-button>
    <el-button type="text" disabled>文字按钮</el-button>
    <Select></Select>

    <!-- 引入自己封装的menu菜单栏组件 -->

    <Menu :data="list"></Menu>

    <!-- <gmh-menu>
            <gmh-submenu>
                <template slot="title">导航一</template>
                <gmh-menu-item>
                    <gmh-submenu>
                        <template slot="title">选项1-1</template>
                        <gmh-menu-item>选项1-1-1</gmh-menu-item>
                        <gmh-menu-item>选项1-1-2</gmh-menu-item>
                    </gmh-submenu>
                </gmh-menu-item>
                <gmh-menu-item>选项1-2</gmh-menu-item>
                <gmh-menu-item>选项1-3</gmh-menu-item>
            </gmh-submenu>
            <gmh-menu-item>导航二</gmh-menu-item>
            <gmh-menu-item>导航三</gmh-menu-item>
        </gmh-menu> -->
  </div>
</template>
<script>
import Select from "./components/select";
// import gmhMenu from './components/gmh-menu';
// import gmhMenuItem from './components/gmh-menu-item';
// import gmhSubmenu from './components/gmh-submenu';
import Menu from "./components/menu";

export default {
  components: {
    Select,
    // gmhMenu,
    // gmhMenuItem,
    // gmhSubmenu,
    Menu
  },
  data() {
    return {
      list: [
        {
          name: "水果",
          id: 1,
          children: [
            {
              name: "香蕉",
              id: 1.1,
              children: [
                { name: "红香蕉", id: "1.1.1" },
                { name: "绿香蕉", id: "1.1.2" },
              ],
            },
            { name: "苹果", id: 1.2 },
            { name: "李子", id: 1.3 },
            { name: "橘子", id: 1.4 },
          ],
        },
        {
          name: "蔬菜",
          id: 2,
          children: [
            { name: "茄子", id: 2.1 },
            { name: "土豆", id: 2.2 },
          ],
        },
        { name: "餐具", id: 3, children: [{ name: "刀", id: 3.1 }] },
      ],
    };
  }
};
</script>