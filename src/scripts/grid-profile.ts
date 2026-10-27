/** Opt-in development measurement only. No telemetry or background networking. */
export function installGridProfile(enabled:boolean,phase:()=>string,state?:()=>{rate:number;fraction:number;paused:boolean}){
  if(!enabled)return;
  const output=document.createElement('output');output.id='grid-performance';output.hidden=true;output.setAttribute('aria-hidden','true');document.body.append(output);
  const motion=new Map<string,{minRate:number;maxRate:number;pausedFrames:number;firstFraction:number;lastFraction:number}>();
  const samples=new Map<string,number[]>();let previous:number|null=null,lastReport=0;
  const frame=(now:number)=>{
    if(!document.hidden&&previous!==null){const key=phase();const values=samples.get(key)??[];values.push(now-previous);if(values.length>1200)values.shift();samples.set(key,values);}
    const current=state?.();if(current&&!document.hidden){
      const key=phase(),entry=motion.get(key)??{minRate:current.rate,maxRate:current.rate,pausedFrames:0,firstFraction:current.fraction,lastFraction:current.fraction};
      entry.minRate=Math.min(entry.minRate,current.rate);entry.maxRate=Math.max(entry.maxRate,current.rate);entry.pausedFrames+=Number(current.paused);entry.lastFraction=current.fraction;motion.set(key,entry);
    }
    previous=document.hidden?null:now;
    if(now-lastReport>500){
      const report=Object.fromEntries([...samples].map(([key,values])=>{const ordered=[...values].sort((a,b)=>a-b);return [key,{samples:values.length,medianMs:ordered[Math.floor(ordered.length*.5)],p95Ms:ordered[Math.floor(ordered.length*.95)],maxMs:ordered.at(-1),over25ms:values.filter(v=>v>25).length,over50ms:values.filter(v=>v>50).length,motion:motion.get(key)}];}));
      output.textContent=JSON.stringify(report);lastReport=now;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
