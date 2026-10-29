import test from 'node:test';
import {ProjectPlacement} from '../src/lib/project-placement.ts';
import {sourceCell,planShiftRound,seededRandom} from '../src/lib/grid-shifts.ts';
import {settledResidents} from '../src/lib/shift-settlement.ts';
test('startup entrants retain residents across intermediate viewport syncs with 42 projects and three fillers',()=>{
for(let seed=0;seed<100;seed++){
 const mgr=new ProjectPlacement(42,3),hist=[],rng=seededRandom(seed),pool=[];
 for(let row=-5;row<=5;row++)for(let column=-7;column<=7;column++)pool.push({column,row});
 const visible=pool.filter(p=>p.column>=-4&&p.column<=4&&p.row>=-2&&p.row<=2),src=p=>sourceCell(p.column,p.row,hist);
 mgr.sync(visible.map(src),pool.map(src));
 for(let n=0;n<4;n++){
  const {moves}=planShiftRound([-2,-1,0,1,2],[-4,-3,-2,-1,0,1,2,3,4],rng);
  mgr.stageEntrances(moves.map(m=>({incoming:src(m.axis==='row'?{column:m.direction===1?-5:5,row:m.line}:{column:m.line,row:m.direction===1?-3:3}),departing:src(m.axis==='row'?{column:m.direction===1?4:-4,row:m.line}:{column:m.line,row:m.direction===1?2:-2})})));
  const ids=new Map(pool.map(p=>[p,mgr.get(src(p))]));const expected=new Map(visible.map(p=>[p,ids.get(p)]));
  for(const {destination,source} of settledResidents(pool,moves))if(expected.has(destination))expected.set(destination,ids.get(source));
  for(const m of moves){const inc=src(m.axis==='row'?{column:m.direction===1?-5:5,row:m.line}:{column:m.line,row:m.direction===1?-3:3});mgr.sync([...visible.map(src),inc],pool.map(src));mgr.sync(visible.map(src),pool.map(src));}
  hist.push(...moves);mgr.sync(visible.map(src),pool.map(src));
  for(const p of visible)if(mgr.get(src(p))!==expected.get(p))throw Error(JSON.stringify({seed,n,p,expected:expected.get(p),actual:mgr.get(src(p))}));
 }
}
});
