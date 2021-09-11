/**第一步：代理对象
 * 1. 设置通过Proxy给target对象设置代理器 
 * 2. 通过WeakMap防止重复代理
 * 3. 对数组进行处理（默认情况下数组会更新两次，一次是新增，一次是修改length，需要区分开来;如果是修改属性的话，如果改的值和原来值一样，则无意义）
 * **/

/**第二步：依赖收集 (发布订阅)
 * 1. 创建响应式函数，并且默认执行一次响应式函数（响应式函数完成的事：执行传进来的参数fn，并且将fn添加到栈中）
 * 2. 在get中通过track收集依赖
 * 3. 在set中通过trigger触发依赖
 * 
*/

//代理对象
let toProxy = new WeakMap();
let toRaw = new WeakMap();
function isObject(target){
  return (typeof target === 'object' && target !== null);
}
function reactive(target){
  let proxy = createReactiveObject(target);
  return proxy;
}
function createReactiveObject(target){
  if(!isObject(target)){
    return target;
  }
  let proxy = toProxy.get(target);
  if(proxy){
    return target;
  }
  if(toRaw.has(target)){
    return target;
  }
  let handleObj = {
    get(target,key,receiver){
      let res = Reflect.get(target,key,receiver);
      // console.log('获取');
      track(target,key);
      return isObject(res)?reactive(res):res;
    },
    set(target,key,value,receiver){
      let hadKey = target.hasOwnProperty(key);
      let oldValue = target[key];
      let res = Reflect.set(target,key,value,receiver);
      if(!hadKey){
        // console.log('新增属性');
        trigger(target,'add',key);
      }else if(oldValue !== value){
        // console.log('修改属性');
        trigger(target,'set',key);
      }
      return res;
    },
    deleteProperty(target,key){
      let res = Reflect.deleteProperty(target,key);
      console.log('删除');
      return res;
    }
  }
  let observed = new Proxy(target,handleObj);
  toProxy.set(target,observed);
  toRaw.set(observed,target);
  return observed;
}

//2.收集依赖
let activeEffectStacks = [];
let targetMap = new WeakMap();
//targetMap结构
// {
//   target:{
//     key:[fn,fn]
//   }
// }
function track(target,key){
  let effect = activeEffectStacks[activeEffectStacks.length-1];
  if(effect){
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
      deps.forEach(effect=>{
        effect();
      });
    }
  }
}


function effect(fn){
  let effect = createReactiveEffect(fn);
  effect();
}
function createReactiveEffect(fn) {
  let effect = function(){
    return run(effect,fn);
  }
  return effect;
}
function run(effect,fn) {
  activeEffectStacks.push(effect);
  fn();
}


let obj = {name:'gmh',age:21}
let proxy = reactive(obj);

effect(()=>{
  console.log(proxy.name);
});

proxy.name = 1;
// console.log(proxy.age);

