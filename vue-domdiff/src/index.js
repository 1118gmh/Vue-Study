/**
 *
 * 模板通过编译生成一个渲染函数h(也就是createElement)
 * 渲染函数执行生成一个虚拟DOM
 * 通过render方法将虚拟DOM渲染为真实DOM，插入到app盒子中（就是根据虚拟dom递归创建真实的元素节点或者文本节点）
 * 当要添加新的节点是，通过对新的虚拟DOM和老的虚拟DOM进行比对patch，比对后再添加
 * （新老节点类型不同，直接替换；
 * 类型相同但是是文本，直接替换；
 * 类型相同但是是元素，复用老节点，更新属性和儿子节点）
 * 
 * 
 * 
 * 
  实现步骤：
 * 当使用h函数渲染的时候，默认将其渲染为虚拟dom节点：
 *虚拟dom就是一个对象，来描述dom节点 jsx
{
  type:'div',
  props:{id:'wrapper',a:1},
  children:[
    {type:'span',props:{style:{color:'red'}},children:[text:'hello']},
    {type:'',props:'',children:[],text:'gmh'}
  ]
}
 * 有了虚拟dom节点之后，根据render方法将虚拟dom节点渲染为真实dom元素，插入到app盒子中
<div id="wrapper" a=1>
  <span style:"color:red;">hello</span>
  gmh
</div>
 * 当要添加新的节点的时候，通过对老的虚拟节点和新的虚拟节点进行前后比对patch，比对后再添加
 */

import {h,render,patch} from './domdiff';
// let vnode = h('div',{id:'wrapper',a:1,key:'xx'},h('span',{style:{color:'red'}},'hello'),'gmh');

// render(vnode,app);

//patch比对
// 类型不同
// let newVnode = h('h1',{id:'b'},'haha');
// patch(vnode,newVnode);

//类型相同 并且都是标签
// let newVnode = h('div',{style:{color:'blue'}},'haha');
// patch(vnode,newVnode);

//老的有儿子 新的没儿子
// let newVnode = h('div',{style:{color:'blue'}});
// setTimeout(()=>{
//   patch(vnode,newVnode);
// },1000);

//老的没儿子 新的有儿子
// let oldVnode = h('div',{id:'wrapper',a:1,key:'xx'},h('span',{style:{color:'red'}},'hello'));
// let newVnode = h('div',{style:{color:'blue'}},'haha');
// setTimeout(()=>{
//   patch(oldVnode,newVnode);
// },1000);

let oldVnode = h('div',{},
  h('li',{style:{background:'blue'},key:'A'},'A'),
  h('li',{style:{background:'yello'},key:'B'},'B'),
  h('li',{style:{background:'green'},key:'C'},'C'),
  h('li',{style:{background:'orange'},key:'D'},'D'),
  h('li',{style:{background:'white'},key:'I'},'I'),

);
render(oldVnode,app);
let newVnode = h('div',{},
  h('li',{style:{background:'black'},key:'E'},'E1'),
  h('li',{style:{background:'orange'},key:'C'},'C1'),
  h('li',{style:{background:'blue'},key:'D'},'D1'),
  h('li',{style:{background:'black'},key:'F'},'F1'),
  h('li',{style:{background:'yello'},key:'A'},'A1'),
  h('li',{style:{background:'green'},key:'B'},'B1'),
  h('li',{style:{background:'black'},key:'G'},'G1'),
);
setTimeout(()=>{
  patch(oldVnode,newVnode);
},2000);