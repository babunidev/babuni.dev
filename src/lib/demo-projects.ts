/** Temporary demo identities for the spiral experiment, not published portfolio projects. */
export interface DemoProject { name:string; tint:string }
export const DEMO_PROJECT_COUNT=45;
const initialTints=["#568cdb","#d3a457","#6ac0a5","#c778b9","#db7859","#8c8be3","#7eb875","#c1b56d","#61afb9","#ab88d1","#d08e79","#70a3c2"];
export const demoProjects:readonly DemoProject[]=Array.from({length:DEMO_PROJECT_COUNT},(_,index)=>{
  if(index===0)return {name:'BABUNI.DEV',tint:'#b78af9'};
  const number=index+1;
  return {name:'PROJECT '+String(number).padStart(2,'0'),
    tint:index<=initialTints.length?initialTints[index-1]:
      'hsl('+Math.round((number*137.508)%360)+' 58% 62%)'};
});
