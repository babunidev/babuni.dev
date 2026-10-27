// Isolated coordinate benchmark, not display FPS or a full browser trace.
import {performance} from 'node:perf_hooks';
import {sourceCell,seededRandom} from '../src/lib/grid-shifts.ts';
import {createSourceLookup} from '../src/lib/grid-render-cache.ts';
const random=seededRandom(42),events=Array.from({length:1500},()=>({axis:random()<.5?'row':'column',line:Math.floor(random()*10)-5,direction:random()<.5?-1:1}));
for(const mode of ['previous-cache','retained-cache']){
 const history=[];let revision=-1,cache=new Map();const lookup=mode==='retained-cache'?createSourceLookup(history):(x,y)=>{if(revision!==history.length){cache.clear();revision=history.length;}const k=x+','+y;if(!cache.has(k))cache.set(k,sourceCell(x,y,history));return cache.get(k);};
 const start=performance.now();let checksum=0;
 for(const event of events){history.push(event);for(let y=-5;y<5;y++)for(let x=-6;x<6;x++){const c=lookup(x,y);checksum+=c.column+c.row;}}
 console.log(JSON.stringify({mode,shifts:history.length,cells:120,ms:+(performance.now()-start).toFixed(2),checksum}));
}
