import vnode from './vnode';
export default function createElement(type,props={},...children) {
  let key;
  if(props.key){
    key = props.key;
    delete props.key;
  }
  children = children.map(child=>{
    if(typeof child === 'string'){
      return vnode(undefined,undefined,undefined,undefined,child);
    }else{
      return child
    }
  });
  return vnode(type,key,props,children);
}