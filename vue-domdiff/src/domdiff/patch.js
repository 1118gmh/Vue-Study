export function render(vnode,container) {
  let ele = createDomElementFromVnode(vnode);
  container.appendChild(ele);
}
function createDomElementFromVnode(vnode){
  let {type,key,props,children,text}  = vnode;
  if(type){//元素
    vnode.domElement = document.createElement(type);
    //根据当前的虚拟dom节点渲染真实dom元素
    updateProperties(vnode);
    //children中也放的虚拟节点vnode 将儿子vnode渲染到父亲上 递归
    children.forEach(childVnode=>render(childVnode,vnode.domElement));
  }else{//文本
    vnode.domElement = document.createTextNode(text);

  }
  return vnode.domElement;
}
//后续会根据老属性对比新属性重新更新节点
function updateProperties(newVnode,oldProps={}) {
  let domElement = newVnode.domElement;
  let newProps = newVnode.props;

  //如果老属性中没有 新属性中有  则需在真实dom中移除这些属性
  for(let oldPropName in oldProps){
    if(!newProps[oldPropName]){
      delete domElement[oldPropName];
    }
  }
  
  //比对styleObj 老的中有 新的中没有某个性 则需设置为‘’
  let newStyleObj = newProps.style || {};
  let oldStyleObj = domElement.style || {};
  for(let propName in oldStyleObj){
    if(!newStyleObj[propName]){
      domElement.style.setProperty(propName,'');
    }
  }
  //如果老属性中有 新属性中有 则需覆盖老属性
  for(let newPropName in newProps ){
    if(newPropName === 'style'){
      let styleObj = newProps.style;
      for(let s in styleObj){
        domElement.style[s] = styleObj[s];
      }
    }else{
      domElement[newPropName] = newProps[newPropName];
    }
  }
}




function isSameVnode(oldVnode,newVnode) {
  return oldVnode.key === newVnode.key && oldVnode.type === newVnode.type;
}

function createMapByIndex(oldChildren){
  let map = {};
  for(let i = 0;i<oldChildren.length;i++){
    let current = oldChildren[i];
    if(current.key){
      map[current.key] = i;
    }
  }
  return map;
}
// 节点替换比对
export function patch(oldVnode,newVnode){
  // 类型不同
  if(oldVnode.type !== newVnode.type){
    return oldVnode.domElement.parentNode.replaceChild(createDomElementFromVnode(newVnode),oldVnode.domElement);
  }
  //类型相同 并且是文本
  if(newVnode.text){
    return oldVnode.domElement.textContent = newVnode.text
  }
  //类型相同 并且是标签
  let domElement = newVnode.domElement = oldVnode.domElement;//复用老的domElement，然后更新属性，和儿子节点
  
  updateProperties(newVnode,oldVnode.props); //比属性

  //比儿子
  let oldChildren = oldVnode.children;
  let newChildren = newVnode.children;
  if(oldChildren.length > 0 && newChildren.length > 0){
    updateChildren(oldVnode.domElement,oldChildren,newChildren);
  }else if(oldChildren.length > 0){
    domElement.innerHTML = '';
  }else if(newChildren.length > 0){
    for(let i = 0;i < newChildren.length;i++){
      domElement.appendChild(createDomElementFromVnode(newChildren[i]));
    }
  }
}
function updateChildren(parent,oldChildren,newChildren) {
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];  
  let oldEndIndex = oldChildren.length-1;
  let oldEndVnode = oldChildren[oldEndIndex];
  let map = createMapByIndex(oldChildren);

  let newStartIndex = 0;
  let newStartVnode = newChildren[0];  
  let newEndIndex = newChildren.length-1;
  let newEndVnode = newChildren[newEndIndex];

  //判断老孩子和新孩子，谁结束就停止循环
  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex){
    if(!oldStartVnode){
      oldStartVnode = oldChildren[++oldStartIndex];
    }else if(!oldEndVnode){
      oldEndVnode = oldChildren[--oldEndIndex];
    }else
    if(isSameVnode(oldStartVnode,newStartVnode)){// 先比较头和头
      patch(oldStartVnode,newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    }else if(isSameVnode(oldEndVnode,newEndVnode)){// 比较尾和尾
      patch(oldEndVnode,newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    }else if(isSameVnode(oldStartVnode,newEndVnode)){//比较头和尾
      patch(oldStartVnode,newEndVnode); //复用老头

      parent.insertBefore(oldStartVnode.domElement,oldEndVnode.domElement.nextSibling); //移动老头 到 尾部
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    }else if(isSameVnode(oldEndVnode,newStartVnode)){//比较尾和头
      patch(oldEndVnode,newStartVnode); //复用老尾
      parent.insertBefore(oldEndVnode.domElement,oldStartVnode.domElement); //移动老尾 到 头部
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    }else{ //头尾都不一样 暴力对比
      let index = map[newStartVnode.key];
      if(index === undefined){
        parent.insertBefore(createDomElementFromVnode(newStartVnode),oldStartVnode.domElement);

      }else{
        let toMoveNode = oldChildren[index];
        patch(toMoveNode,newStartVnode);
        parent.insertBefore(toMoveNode.domElement,oldStartVnode.domElement);
        oldChildren[index] = undefined;
      }
      newStartVnode = newChildren[++newStartIndex];
    }
  }
  //到这里，如果还小于等于 则新的有剩余
  if(newStartIndex <= newEndIndex){
    for(let i = newStartIndex;i <= newEndIndex;i++){
      let beforeElement = newChildren[newEndIndex + 1] == null?null:newChildren[newEndIndex + 1].domElement;
      parent.insertBefore(createDomElementFromVnode(newChildren[i]),beforeElement);
    }
  }
  //如果老的还有剩余，则移除
  if(oldStartIndex <= oldEndIndex){
    for(let i = oldStartIndex ;i <= oldEndIndex;i++){
      if(oldChildren[i]){
        parent.removeChild(oldChildren[i].domElement);
      }
    }
  }

}