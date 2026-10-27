/** DOM surface used by the reader tests; no HTML parsing or browser emulation. */
class Node {
 constructor(tagName='',value=''){this.tagName=tagName.toLowerCase();this.children=[];this.value=value;this.style={};this.attributes={};this.listeners=new Map();}
 get textContent(){return this.value+this.children.map(n=>n.textContent).join('');}
 set textContent(value){this.value=String(value);this.children=[];}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this.value='';this.children=[...nodes];}
 setAttribute(key,value){this.attributes[key]=value;}
 addEventListener(name,callback){this.listeners.set(name,callback);}
 scrollIntoView(){this.scrolled=true;}
}
export function documentDOM(t){
 const previous=globalThis.document;
 globalThis.document={createElement:tag=>new Node(tag),createTextNode:text=>new Node('',text)};
 t.after(()=>{globalThis.document=previous;});
}
export function nodes(root,tag){return [root,...root.children.flatMap(child=>nodes(child,tag))].filter(n=>n.tagName===tag);}
