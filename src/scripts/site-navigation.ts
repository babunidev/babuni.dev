import {demoProjects} from '../lib/demo-projects.ts';
export function matchingProjects(query:string){
  const words=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return demoProjects.filter(project=>words.every(word=>(project.name+' '+project.shortSummary).toLocaleLowerCase().includes(word)))
    .sort((a,b)=>a.name.localeCompare(b.name));
}
/** One header is moved into the modal top layer while reading, then restored. */
export function attachReaderHeader(view:HTMLElement):()=>void {
  const header=document.querySelector<HTMLElement>('.site-header');
  if(!header)return ()=>{};
  const parent=header.parentNode!,next=header.nextSibling;
  view.append(header);
  return ()=>{parent.insertBefore(header,next);};
}
export function installSiteNavigation(select:(id:string)=>void,about:(trigger:HTMLButtonElement)=>void){
  const toggle=document.querySelector<HTMLButtonElement>('#projects-toggle')!;
  const menu=document.querySelector<HTMLElement>('#projects-menu')!;
  const search=document.querySelector<HTMLInputElement>('#project-search')!;
  const list=document.querySelector<HTMLElement>('#project-results')!;
  const count=document.querySelector<HTMLElement>('#project-result-count')!;
  function close(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');}
  function render(){
    list.replaceChildren();const projects=matchingProjects(search.value);
    for(const project of projects){
      const button=document.createElement('button');button.type='button';button.textContent=project.name;
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
