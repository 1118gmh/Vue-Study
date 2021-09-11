### 安装工具
- npm install @vue-cli -g
- npm install @vue/cli-service-global -g

### 组件通信
- 父传递给子数据 props emit
- $parent $children
- $attrs $listeners
- provide inject 和context（可以在父组件中声明一个公共数据），在子组件中可以注入原理（比较混乱，名称问题，他不会再业务代码中使用）组件库 多级通信为了方便你可以使用provide
- ref 获取真实dom元素，如果放到组件上，代表的是当前组件的实例，父组件中可以直接获取子组件的方法和数据
- eventbus($parent,$children) 绑定$on 只能通过绑定$on的哪个组件来触发(混乱)
- vuex
