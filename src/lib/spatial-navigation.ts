export interface SpatialPoint {x:number;y:number}
export type Arrow='ArrowLeft'|'ArrowRight'|'ArrowUp'|'ArrowDown';
/** Prefer the next aligned neighbor, then the nearest item in that direction. */
export function spatialNeighbor<T extends SpatialPoint>(items:readonly T[],current:T,key:Arrow):T|undefined {
 const horizontal=key==='ArrowLeft'||key==='ArrowRight',sign=key==='ArrowLeft'||key==='ArrowUp'?-1:1;
 return items.filter(item=>item!==current).map(item=>{
  const forward=((horizontal?item.x:item.y)-(horizontal?current.x:current.y))*sign;
  const cross=Math.abs((horizontal?item.y:item.x)-(horizontal?current.y:current.x));
  return {item,forward,cross};
 }).filter(item=>item.forward>.01).sort((a,b)=>
  Number(a.cross>.1)-Number(b.cross>.1)||(a.forward+3*a.cross)-(b.forward+3*b.cross))[0]?.item;
}
