/**
 * MVVM原理
 */

/**
 * 3. 当数据更新时，视图更新
 * 原理：给数据绑定观察者，订阅观察者，发布观察者数据更新
 * 实现步骤：
 *    1. 通过给视图中的数据绑定watcher观察者；（观察者实现功能：提供数据获取和数据更新的方法，在获取数据时订阅watcher，在设置数据时发布watcher的updater）
 *    2. 写一个用于发布订阅watcher的方法
 *    3. 在观察者中获取值时，触发数据劫持获取，给数据订阅watcher
 *    4. 在数据改变时，触发数据劫持设置，给数据发布，执行所有的watcher中的updater方法
 * 
 * 当视图更新时，数据更新
 *    v-model
 *    通过绑定事件获取新值，设置vm.$data值
 */

//发布订阅功能
class Dep{
  constructor(){
    //订阅池
    this.subs = [];
  }
  //订阅功能
  //添加watcher观察者
  addSub(watcher){
    this.subs.push(watcher);
  }
  //发布
  commit(){
    this.subs.forEach(watcher=>{
      watcher.updater();
    });
  }
}


class Watcher{
  constructor(vm,expr,cb){
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    //获取老值 用于和新值比较
    this.oldValue = this.get();
  }
  get(){
    Dep.target = this;
    let value = CompileUtil.getVal(this.vm,this.expr) //在 添加观察者的属性 获取值时，订阅watcher 
    Dep.target = null;
    return value;
  }
  updater(){ //
    let newValue = CompileUtil.getVal(this.vm,this.expr);
    if(newValue !== this.oldValue){
      this.cb(newValue);
    }
  }
}
// vm.$watch(vm,'school.name',(newValue)=>{

// });

/**
 * 1. 数据劫持
 */
class Observer{
  constructor(data){
    //4. 实现对数组数据的更新
    let oldProto = Array.prototype;
    this.proto = Object.create(oldProto);
    ["push","shift","unshift"].forEach(item =>{
    //函数劫持：把Array原型上的函数劫持过来，
    //（push、shift、unshift方法虽然执行的是Array.prototype上的方法，但是他们指向proto了而不会指向Array.prototype），
    //这样不会影响Array上的函数
      this.proto[item] = function(){  
        console.log('更新视图');
        oldProto[item].call(this,...arguments);
      }
    });
    this.observer(data);
  }
  observer(obj){
    if(typeof obj !== 'object' || obj === null){
      return obj;
    }
    if(Array.isArray(obj)){
      obj.__proto__ = this.proto;
    }
    for(let key in obj){
      this.response(obj,key,obj[key]);
    }
  }
  response(obj,key,value){
    let _this = this;
    let dep = new Dep(); //给每个属性都加一个dep用于属性发布订阅watcher，这样可以使得某个属性变，则只发布那个属性对应的updater
    _this.observer(value); //2.递归实现数据的循环绑定get、set
    Object.defineProperty(obj,key,{
      get(){
        if(Dep.target){
          dep.addSub(Dep.target);
        }
        return value;
      },
      set(newValue){
        if(newValue !== obj[key]){
          _this.observer(newValue); //3. 观察更新的数据
          value = newValue;
          dep.commit(); //发布
          console.log('视图更新');
        }
      }
    });
  }
}
/**
 * 2. 编译模板
 * 将数据编译到模板上
 */
class Compiler{
  constructor(el,vm){
    // 获取dom元素
    this.el = this.isElementNode(el)?el:document.querySelector(el);
    this.vm = vm;
    //将所有dom节点放到内存中 
    let fragment = this.node2fragment(this.el);

    //编译内存中的dom节点
    this.compile(fragment);

    //将内存中所有元素，全部塞到页面中
    this.el.appendChild(fragment);
  }
  compile(node){
    let childNodes = node.childNodes;
    [...childNodes].forEach(child=>{
      if(this.isElementNode(child)){
        //编译元素节点
        this.compileElement(child);
        //如果是元素节点 则需递归编译子节点
        this.compile(child);
      }else{
        // 编译文本节点
        this.compileText(child);
      }
    });
  }
  isDirective(str){
      return str.startsWith('v-');
  }
  compileElement(node){
    let attributes = node.attributes;
    [...attributes].forEach(attr=>{
      let {name,value} = attr;
      //判断是否是指令属性
      if(this.isDirective(name)){
        //是指令属性  指令：v-on:click
        let [,directive] = name.split('-'); //on:click
        let [directiveName,eventName] = directive.split(':'); // on click
        CompileUtil[directiveName](node,value,this.vm,eventName); 
      }
    });

  }
  compileText(node){  
    let content = node.textContent;
    if(/\{\{(.+?)\}\}/.test(content)){
      //文本节点
      CompileUtil['text'](node,content,this.vm);//{{a}} {{b}}
    }
  }
  node2fragment(node){
    let fragment = document.createDocumentFragment();
    let firstChild;
    // 每次放第一个孩子进内存，页面就会少一个节点，直到全部放入内存
    while(firstChild = node.firstChild){
      fragment.appendChild(firstChild);
    }
    return fragment
  }
  isElementNode(node){
    return node.nodeType === 1;
  }
}
let CompileUtil = {

  getVal(vm,expr){ //expr:'school.name'  'message'
    //根据表达式获取value值
    return expr.split('.').reduce((data,current)=>{
      return data[current];
    },vm.$data);
  },
  // getText(vm,expr){ //expr:{{a}} {{b}} 量词后面加?取消正则的懒惰性,g取消正则的贪婪性
  //   let content = expr.replace(/\{\{(.+?)\}\}/g,(...arg)=>{
  //     let [big,small] = arg;
  //     let value = this.getVal(vm,small);
  //     return value;
  //   });
  //   return content;
  // },
  setValue(vm,expr,value){//vm.$data school.name 'hh'
    return expr.split('.').reduce((data,current,index,arr)=>{
      if(index === arr.length-1){
        return data[current] = value;
      }
      return data[current];
    },vm.$data);
  },
  // 解析v-model指令
  model(node,expr,vm){ //给输入框赋值
    let fn = this.updater["modelUpdater"];
    new Watcher(vm,expr,(newValue)=>{//对数据进行观察，如果值发生改变，则执行更新方法
      fn(node,newValue);
    });
    //视图变=>数据变
    node.addEventListener('input',(e)=>{
      let value = e.target.value;
      this.setValue(vm,expr,value);
    });
    //获取数据
    let value = this.getVal(vm,expr);
    fn(node,value);
  },
  html(node,expr,vm){
    let fn = this.updater["htmlUpdater"];
    new Watcher(vm,expr,(newValue)=>{
      fn(node,newValue);
    });
    //获取数据
    let value = this.getVal(vm,expr);
    fn(node,value);
  },
  getContentValue(vm,expr){
    return expr.replace(/\{\{(.+?)\}\}/g,(...arg)=>{
      return this.getVal(vm,arg[1]);
    });
  },
  text(node,expr,vm){ //expr:{{a}} {{b}} 量词后面加?取消正则的懒惰性,g取消正则的贪婪性
    let fn = this.updater['textUpdater'];
    // let value = this.getText(vm,expr);
    let content = expr.replace(/\{\{(.+?)\}\}/g,(...arg)=>{
      let [big,small] = arg;
      new Watcher(vm,small,()=>{
        fn(node,this.getContentValue(vm,expr));//重新取值并更新
      });
      let value = this.getVal(vm,small);
      return value;
    });
    fn(node,content);

  },
  on(node,expr,vm,eventName){ //expr:'change'
    node.addEventListener(eventName,()=>{
      vm[expr].call(vm);
    });
  },
  updater:{
    htmlUpdater(node,value){
      node.innerHTML = value
    },
    modelUpdater(node,value){
      node.value = value;
    },
    textUpdater(node,value){
      node.textContent = value;
    }
  }
  
};

/**
 * 基类Vue
 */
class Vue{
  constructor(options){
    this.$el = options.el;
    this.$data = typeof options.data === 'function' ? options.data():options.data;
    let computed = options.computed;
    let methods = options.methods;

    if(this.$el){
      //数据劫持
      new Observer(this.$data);
      //将computed计算属性代理到vm.$data上
      for(let key in computed){
        Object.defineProperty(this.$data,key,{
          get(){
            return computed[key].call(this);
          }
        });
      }
      //将methods方法代理到vm.$data上
      for(let key in methods){
        Object.defineProperty(this,key,{
          get(){
            return methods[key];
          }
        });
      }
      //将data属性都代理到vm上
      //对vue的实例进行一层数据劫持，也就是说，如果vm.school这样获取数据，则默认获取this.$data.school上数据
      this.proxyVm(this.$data);
      //编译模板
      new Compiler(this.$el,this);
    }
  }
  proxyVm(data){
    for(let key in data){
      Object.defineProperty(this,key,{
        get(){
          return data[key];
        },
        set(newValue){
          data[key] = newValue;
        }
      });
    }
  }
}