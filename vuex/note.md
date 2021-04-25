### Vuex
```
1. 在实例创建之前，给每一个Vue实例或组件挂载一个$store属性

2. 提供一个Store类，可以通过new Vuex.Store(options);创建实例
    state：统一的状态管理
    getter:state对象读取方法,所有模块的getters都会被定义到这里
    
    _mutations:可以更改状态
    _actions:异步提交更改
    commit:状态改变提交操作方法，是唯一能执行mutations的方法
    dispatch:操作行为触发方法，是唯一能执行actions的方法
    
    _modules:模块
    plugin:插件
    _subscribers：订阅数组
    subscribe:可以往订阅数组中添加函数



3. 可以通过this.$store.state.age获取状态属性

4. 可以通过this.$store.commit(mutationName,payload);提交mutation中的一个mutationName方法，让这个方法执行，并且传递参数
    原理：发布订阅模式

5. 可以通过this.$store.dispatch(actionName,payload);提交actions中的一个方法(这个方法中包含了异步操作，比如1秒后commit)
    原理：和commit一样，但是他是专门为了提交异步的代码，用于和commit区分

6. vuex会格式化所有的模块，保存在this.$store._modules中：
    结构：
    root:{
        context: {dispatch: ƒ, commit: ƒ}
        runtime: false
        state: {__ob__: Observer}  //整个数据的状态
        _children: {a: Module, b: Module}  //所有的孩子
                a: Module {runtime: false, _children: {…}, _rawModule: {…}, state: {…}, context: {…}}
                b: Module {runtime: false, _children: {…}, _rawModule: {…}, state: {…}, context: {…}}
        _rawModule: {state: {…}, getters: {…}, mutations: {…}, actions: {…}, modules: {…}}  //原模块
        namespaced: (...)
        __proto__: Object
    }

```

**vuex的工作流程**

```
1. 在组件中通过dispatch方法提交异步操作，
	this.$router.dispatch();
	
2. 在actions中异步获取数据，并且将状态同步给mutation
  actions: { //发请求的
    async setContent({commit}){
      let content = await fetchContent();
      commit('setContent',content);//将状态提交给mutations
    }
  },
  
3. 在mutations中接收状态，并更新状态（一般方法名和actions中方法相同）
  mutations: { //同步状态的
    setContent(state,payload){
      state.content = payload; //更新状态
    }
  }
```

