### pinia安装
npm install pinia

### pinia引入
- vue3
import { createPinia } from 'pinia';
const store = createPinia()
app.use(store)

- vue2
import { createPinia ,PiniaPlugin} from 'pinia';
Vue.use(PiniaPlugin);
const pinia = createPinia();
new Vue({
  el:"#app",
  pinia
})

###  初始化仓库
```
//store_namespace.ts
export const enum Names {
  Test = "Test"
}
//Test.ts
import { defineStore } from "pinia";
import { Names } from "./store_namespace"

type Result = {
  current: number,
  age: number
}

const Set = (): Promise<Result> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        current: 10,
        age: 20
      })
    }, 2000)
  })
}
export const useTestStore = defineStore(Names.Test, {
  state: () => {
    return {
      current: 1,
      age: 10
    }
  },
  // getters类似于computed的作用，多对一
  getters: {
    // 箭头函数中无this，通过第一个参数state来调用
    newCurrent: (state) => {
      return state.current + state.age
    },
    // 普通函数可以直接使用this
    newValue(): number {
      return this.age + this.current
    }
  },
  actions: {
    setCurrent() {
      // 可以通过this直接修改值
      this.current++;
    },
    async setCurrentAync() {
      const res = await Set()
      this.current = res.current
      this.age = res.age
    }
  }
})
```
### 使用
```
【模板】
<template>
  <div>登录</div>
  <button @click="Add">增加</button>current:{{ Test.current }},{{
    current
  }}age:{{ age }}
</template>

【导入】
import { useTestStore } from "@/store/Test";
import { storeToRefs } from "pinia";
const Test = useTestStore();
// 解构使用storeToRefs，否则会失去响应式
const { current, age } = storeToRefs(Test);

【使用】
  // 修改值
  // 1. 直接修改
  Test.current++;
  // 2. 通过$patch
  Test.$patch({
    current: 200,
    age: 100,
  });
  Test.$patch((state) => {
    state.age++;
    state.current++;
  });
  //3. 通过$state
  Test.$state = {
    current: 10,
    age: 20,
  };
  // 4. 通过actions中方法
  Test.setCurrent();
  
  //发请求
    Test.setCurrentAync()
```
