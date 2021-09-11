//vue2.0响应式原理

//4. 实现对数组数据的更新
let oldProto = Array.prototype;
let proto = Object.create(oldProto);
["push","shift","unshift"].forEach(item =>{
//函数劫持：把Array原型上的函数劫持过来，
//（push、shift、unshift方法虽然执行的是Array.prototype上的方法，但是他们指向proto了而不会指向Array.prototype），
//这样不会影响Array上的函数
  proto[item] = function(){  
    console.log('更新视图');
    oldProto[item].call(this,...arguments);
  }
});

//1.实现对象的第一层响应
function observer(obj) {
    if(typeof obj !== 'object' || obj === null){
      return obj;
    }
    if(Array.isArray(obj)){
      obj.__proto__ = proto;
    }
    for(let key in obj){
      response(obj,key,obj[key]);
    }

  }
function response(obj,key,value){
  observer(value); //2.递归实现数据的循环绑定get、set
  Object.defineProperty(obj,key,{
    get(){
      return value;
    },
    set(newValue){
      observer(newValue); //3. 观察更新的数据
      value = newValue;
      console.log('视图更新');
    }
  });
}

//test
let obj = {name:'gmh',age:[1,2,3]};
observer(obj);
// obj.name = 'xh';
// obj.age.a = 1;
// obj.age = 12;


obj.age.push(4);
console.log(obj.age);
