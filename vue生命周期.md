## Vue生命周期

### new Vue()

实例化vue对象

### Init

初始化事件和生命周期

### beforeCreate（可以加载动画）

组件实例刚被创建，还没有实例化之前，执行一些初始化的操作

```
未初始化
this.$el       undefined
this.$data     undefined
```

### created（可以结束加载动画，发起异步网络请求）

组件实例创建完成，属性已经绑定，但是DOM还没有生成，$el属性不存在，页面未被展示

```
完成了data的初始化
this.$el       undefined
this.$data     初始化完成
```

之后判断是否存在$el。存在，则继续编译；不存在，则停止编译

如果继续编译，则判断是否有template。有，则将其编译成render函数；没有，则编译外部html

如果template中组件，则render方法渲染组件

### beforeMount

完成了虚拟DOM配置：模板已被编译，把data里面的数据和模板生成html（render方法渲染虚拟DOM为真实的DOM元素，但是还没有比对替换到页面上）

但是此时还没有挂载html到页面上

```
完成了初始化
this.$el       初始化完成
this.$data     初始化完成
```

之后给vue添加$el成员，并且替换掉挂载的DOM元素

### mounted（可以发起网络请求AJAX交互）

用上面编译好的html内容替换el属性指向的DOM对象。将编译好的html内容替换了$el属性指向的DOM对象，DOM结构完成，页面显示。（真实DOM元素替换了$el指向的DOM对象）

```
完成挂载（模板和数据编译的html挂载到了页面上）
```

### beforeUpdate

当数据更新之前调用。

```
虚拟dom中根据data变化去更新html
```

### updated

在数据更新之后调用

```
将虚拟DOM更新完成的HTML更新到页面上
```

### activated

keep-alive组件激活时调用

### deactivated

keep-alive组件停用时调用

### beforeDestroy

实例销毁之前调用。实例任然可用

### destroyed

实例销毁之后调用。之后如果再执行更新数据操作，页面则不会同步更新。