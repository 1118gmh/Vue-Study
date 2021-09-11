//vue3.0响应式原理
//vue3.0实现响应式是通过ES6的代理器语法来实现

//vue2.0响应式缺陷：
//1. 默认会递归
//2. 数组改变length无效
//3. 对象不存在的属性不能别拦截

function hasOwn(target,key){
  return target.hasOwnProperty(key);
}
function isObject(target){
  return !(typeof target !== 'object' || target === null);
}
//2. 通过WeakMap防止重复代理
let toProxy = new WeakMap();
let toRaw = new WeakMap();

//1. 设置通过Proxy给target对象设置代理器
function reactive(target){
  //创建响应式对象
  return createReactiveObject(target);
}
function createReactiveObject(target){
  if(!isObject(target)){
    return target;
  }
  let proxy = toProxy.get(target); //如果已经代理过了，就将代理过的结果直接返回（就是一个对象代理过了，不能对其第二次代理）
  if(proxy){
    return proxy;
  }
  if(toRaw.has(target)){ //防止代理过的对象再次被代理，则直接返回（就是如果一个对象代理过了，不能对代理过的对象再次代理）
    return target;
  }
  let baseHandler = {
    get(target,name,receiver){
      let res = Reflect.get(target,name,receiver);
      // console.log('获取');
      //收集依赖：就是帮当前的key和effect对应起来
      track(target,name)

      return isObject(res)?reactive(res):res; //递归代理
    },
    set(target,name,value,receiver){
      //3. 对数组进行处理（默认情况下数组会更新两次，一次是新增，一次是修改length，需要区分开来;如果是修改属性的话，如果改的值和原来值一样，则无意义）
      let hadKey = hasOwn(target,name);
      let oldValue = target[name];
      let res = Reflect.set(target,name,value,receiver);
      if(!hadKey){
        // console.log('新增属性');
        trigger(target,'add',name);
      }else if(oldValue !== value){
        // console.log('设置属性');
        trigger(target,'set',name);
      }
      return res;
    },
    deleteProperty(target,name){
      let res = Reflect.deleteProperty(target,name);
      console.log('删除');
      return res;
    }
  }
  let observed = new Proxy(target,baseHandler);
  toProxy.set(target,observed);
  toRaw.set(observed,target);
  return observed;
}
  

let activeEffectStacks = [];
let targetMap = new WeakMap();
//targetMap的数据结构
// {                         
//   target:{                
//     key:[fn,fn]
//   }
// }
function track(target,key) {
  let effect = activeEffectStacks[activeEffectStacks.length-1];
  // console.log(`${effect}`);
  if(effect){ //有effect，才创建关联
    let depsMap = targetMap.get(target);
    if(!depsMap){
      targetMap.set(target,depsMap = new Map());
    } 
    let deps = depsMap.get(key);
    if(!deps){
      depsMap.set(key,deps = new Set());
    }
    if(!deps.has(effect)){
      deps.add(effect);
    }
  }

}
function trigger(target,type,key){
  let depsMap = targetMap.get(target);
  if(depsMap){
    let deps = depsMap.get(key);
    if(deps){
      deps.forEach(effect => {
        effect();
      });
    }
  }
}

//effect 响应式 副作用
function effect(fn){
  let effect = createReactiveEffect(fn);
  effect();
}

function createReactiveEffect(fn){
  let effect = function() { //这个就是创建的响应式函数effect
    return run(effect,fn);
  }
  return effect;
}
function run(effect,fn){ //运行fn，并且将effect存起来
  try {
    activeEffectStacks.push(effect);
    fn();    
  } finally{
    activeEffectStacks.pop();
  }
}


/**第二步：依赖收集 (发布订阅)
 * 1. 创建响应式函数，并且默认执行一次响应式函数（响应式函数完成的事：执行传进来的参数fn，并且将fn添加到栈中）
 * 2. 在get中通过track收集依赖
 * 3. 在set中通过trigger触发依赖
 * 
*/
let proxy  = reactive({name:'gmh',age:{a:21}});
effect(()=>{ //effect：1. 默认先执行一次响应式函数；2. 当依赖的属性发生变化的时候，执行一次响应式函数
  console.log(proxy.name);
}); 
effect(()=>{
  console.log(proxy.age);
});
proxy.name = 'xh'; //当数据改变时，执行响应式函数
proxy.name = 'xh'; //无意义修改不触发

proxy.age = {a:1};


/**第一步：代理对象 数据劫持
 * 1. 设置通过Proxy给target对象设置代理器
 * 2. 通过WeakMap防止重复代理
 * 3. 对数组进行处理（默认情况下数组会更新两次，一次是新增，一次是修改length，需要区分开来;如果是修改属性的话，如果改的值和原来值一样，则无意义）
 * **/

// let arr = [1,2,3];
// let proxy2 = reactive(arr);
// proxy2.length = 5; //vue2中不可以修改length属性，现在可以啦


// let obj = {name:'gmh',age:21};
// let proxy = reactive(obj);
// proxy.test = 2; //新增属性  vue2不存在的属性不可以拦截，现在可以啦
// proxy.name = '123';
// console.log(proxy.name);
// delete proxy.name;
// console.log(proxy);

//不能对obj第二次代理
// reactive(obj); //直接返回第一次代理的proxy

//不能对代理的对象再次代理
// reactive(proxy); //直接返回传进来的参数proxy对象

