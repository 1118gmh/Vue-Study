### vue3.0新特性
1. 在main.js中通过引入createApp方法来创建vue实例
```
【vue2】
import Vue from 'vue'
import App from './App.vue'

new Vue({
    render: h => h(App),
}).$mount('#app')

【vue3】
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

2. composition API （组合API）
```
当组件变得越来越大时，逻辑关注点的列表也会增长。这可能会导致组件难以阅读和理解，且碎片化使得理解和维护复杂组件变得困难。选项的分离掩盖了潜在的逻辑问题。此外，在处理单个逻辑关注点时，我们必须不断地“跳转”相关代码的选项块。

如果能够将与同一个逻辑关注点相关的代码配置在一起会更好，于是 Composition API 应运而生。

使用Composition api的位置被称为setup


个人理解：简单来说，就是将同一个逻辑的所有API写在一起

```

3. setup组件选项
>  组件选项在创建组件之前执行，一旦 props 被解析，并充当合成 API 的入口点
```
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted } from 'vue'

export default {
    setup (props) { //props传递过来的属性（此时setup中没有this，除了props，无法访问组件中的任何其他东西）
      const repositories = ref([]) // 定义一个变量
      const getUserRepositories = async () => { // 定义一个方法
        repositories.value = await fetchUserRepositories(props.user)
      }

      onMounted(getUserRepositories) // 生命周期钩子 当实例mounted后调用getUserRepositories方法

      return {
        repositories, // 返回一个data
        getUserRepositories // 返回一个method
      }
    }
}
```
> setup语法糖(<script setup>)
> 当组件可以使用组合API后，setup往往成为了唯一会用到的组件属性，因此利用语法糖简化setup的写法
```
<template>
  <button @click="inc">{{ count }}</button>
</template>

// Composition API
<script>
export default {
  setup() {
    const count = ref(0)
    const inc = () => count.value++

    return {
      count,
      inc,
    }
  },
}
</script>

// 使用了 Composition API 语法糖：
<script setup>
  import { ref } from 'vue'

  export const count = ref(0)
  export const inc = () => count.value++
</script>
```

4. 单文件组件状态驱动css变量（就是可以在css中引入组件的状态）(<style vars>)
```
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style vars="{ color }">
.text {
  color: var(--color);
}
</style>
```
5. 单文件组件 <style scoped> 现在可以包含全局规则或只针对插槽内容的规则：
> 也就是说如果style标签加了scoped，可以通过 深度选择器、插槽选择器、全局选择器 作用其他范围的样式
```
<style scoped>
/* deep selectors */
::v-deep(.foo) {}
/* shorthand */
:deep(.foo) {}

/* targeting slot content */
::v-slotted(.foo) {}
/* shorthand */
:slotted(.foo) {}

/* one-off global rule */
::v-global(.foo) {}
/* shorthand */
:global(.foo) {}
</style>
```
6. 全局和内部API已重构为可 tree-shakable
> 也就是下面这些API原本只能Vue.xxx来使用的，现在可以解构出来直接使用，从而获得最佳的文件大小；
> Vue.nextTick
> Vue.observable (用Vue.reactive替换)
> Vue.version
> Vue.compile
> Vue.set
> Vue.delete
```
【vue2】
// 全局 API Vue.nextTick() 不能tree-shaking
import Vue from 'vue'

Vue.nextTick(() => {
  // 一些和DOM有关的东西
})
【vue3】
import { nextTick } from 'vue'

nextTick(() => {
  // 一些和DOM有关的东西
})
```
7.  v-model
```
- 自定义v-model时，prop和事件默认名称已更改：
  prop: value -> modelValue
  event: input -> update:modelValue
- .sync和组件的model选项已移除，可用v-model作为替代
- 现在可以在同一个组件上使用多个 v-model 进行双向绑定；
- 现在可以自定义 v-model 修饰符
  比如自定义v-model.capitalize,绑定为字符串第一个字母的大写
```
8. <template v-for>上的key用法
```
【关于key】
-  vue3中v-if/v-else/v-else-if不建议使用key

- vue3中key应该被设置在template上

【关于v-if和v-for优先级】
- v-if  >  v-for 

【关于v-bind={object}的排序】
- 声明的顺序决定了它们如何合并
// 2.x中 id最终为red  3.x中 id为blue
<div id="red" v-bind="{ id: 'blue' }"></div>
```

9. 关于ref
```
【vue2】
从$refs中获取的相应属性会是一个ref数组
【vue3】
将ref绑定到一个更灵活的函数上 (ele) => { ...//保存ele的操作 }：
template:
<div v-for="item in list" :ref="setItemRef"></div>

script:
import { ref, onBeforeUpdate, onUpdated } from 'vue'
export default {
  setup() {
    let itemRefs = []
    const setItemRef = el => {
      itemRefs.push(el)
    }
    onBeforeUpdate(() => {
      itemRefs = []
    })
    onUpdated(() => {
      console.log(itemRefs)
    })
    return {
      itemRefs,
      setItemRef
    }
  }
}

```