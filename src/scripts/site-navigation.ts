import {demoProjects} from '../lib/demo-projects.ts';
import {projectsByActivity,validActivity} from '../lib/project-activity.ts';
import connections from '../content/project-repositories.json' with {type:'json'};
import activity from '../generated/project-activity.json' with {type:'json'};
/** Most recently updated first (newest branch-head commit, refreshed on every build). */
const byActivity=projectsByActivity(demoProjects,connections,activity);
export function matchingProjects(query:string){
  const words=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return byActivity.filter(project=>words.every(word=>(project.name+' '+project.shortSummary).toLocaleLowerCase().includes(word)));
}
/** Last public commit date for a project, or null when it has no connected repository. */
export function projectUpdatedAt(id:string):Date|null {
  const c=(connections as Record<string,{status:string;repository?:string;branch?:string}>)[id];
  if(c?.status!=='connected'||!c.repository||!c.branch)return null;
  const value=(activity as Record<string,unknown>)[c.repository];
  return validActivity(value,c.branch)?new Date(value.committedAt):null;
}
export function updatedLabel(date:Date,now=Date.now()):string {
  const days=Math.max(0,Math.floor((now-date.getTime())/86400000));
  if(days===0)return 'today';if(days===1)return 'yesterday';if(days<30)return `${days} days ago`;
  const months=Math.floor(days/30);if(months<12)return months===1?'1 month ago':`${months} months ago`;
  const years=Math.floor(days/365);return years<=1?'1 year ago':`${years} years ago`;
}
/** Keep the existing header and decorative footer above the modal backdrop. */
export function attachReaderHeader(view:HTMLElement):()=>void {
  const chrome=[...new Set(['.site-header','.site-footer'].map(selector=>document.querySelector<HTMLElement>(selector)).filter((node):node is HTMLElement=>!!node))];
  const homes=chrome.map(node=>({node,parent:node.parentNode!,next:node.nextSibling}));
  for(const node of chrome)view.append(node);
  return ()=>{for(const {node,parent,next} of homes.reverse())parent.insertBefore(node,next);};
}
export function installSiteNavigation(select:(id:string)=>void,about:(trigger:HTMLButtonElement)=>void){
  const help=document.querySelector<HTMLElement>('.site-help')!;
  const helpToggle=document.querySelector<HTMLButtonElement>('#help-toggle')!;
  const closeHelp=()=>{help.classList.remove('is-open');helpToggle.setAttribute('aria-expanded','false');};
  helpToggle.addEventListener('click',()=>{
    const open=help.classList.toggle('is-open');helpToggle.setAttribute('aria-expanded',String(open));
    if(!open)helpToggle.blur();
  });
  document.addEventListener('pointerdown',event=>{if(event.target instanceof Node&&!help.contains(event.target))closeHelp();});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&help.classList.contains('is-open')){
      event.preventDefault();event.stopImmediatePropagation();closeHelp();helpToggle.blur();
    }
  },true);
  const toggle=document.querySelector<HTMLButtonElement>('#projects-toggle')!;
  const menu=document.querySelector<HTMLElement>('#projects-menu')!;
  const search=document.querySelector<HTMLInputElement>('#project-search')!;
  const list=document.querySelector<HTMLElement>('#project-results')!;
  const count=document.querySelector<HTMLElement>('#project-result-count')!;
  function close(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');}
  function render(){
    list.replaceChildren();const projects=matchingProjects(search.value);
    for(const project of projects){
      const button=document.createElement('button');button.type='button';
      const name=document.createElement('span');name.className='project-menu-name';name.textContent=project.name;button.append(name);
      const updated=projectUpdatedAt(project.id);
      if(updated){
        const when=document.createElement('time');when.className='project-menu-updated';when.dateTime=updated.toISOString();
        when.textContent=updatedLabel(updated);when.title='Last updated '+updated.toLocaleDateString();button.append(when);
      }
      button.addEventListener('click',()=>{close();select(project.id);});list.append(button);
    }
    count.textContent=projects.length?`${projects.length} ${projects.length===1?'project':'projects'}`:'No projects found.';
  }
  toggle.addEventListener('click',()=>{
    if(!menu.hidden){close();return;}
    menu.hidden=false;toggle.setAttribute('aria-expanded','true');render();search.focus();
  });
  search.addEventListener('input',render);
  search.addEventListener('keydown',event=>{
    if(event.key==='ArrowDown'){event.preventDefault();list.querySelector<HTMLButtonElement>('button')?.focus();}
    if(event.key==='Enter'&&matchingProjects(search.value).length===1){event.preventDefault();list.querySelector<HTMLButtonElement>('button')?.click();}
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!menu.hidden){event.preventDefault();event.stopImmediatePropagation();close();toggle.focus();}
  },true);
  document.addEventListener('pointerdown',event=>{if(event.target instanceof Node&&!menu.contains(event.target)&&!toggle.contains(event.target))close();});
  document.querySelector<HTMLButtonElement>('#about-toggle')!.addEventListener('click',event=>{close();about(event.currentTarget as HTMLButtonElement);});
}
