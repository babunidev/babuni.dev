import {demoProjects} from '../lib/demo-projects.ts';
import {PROJECT_GROUPS} from '../lib/project-groups.ts';
export function matchingProjects(query:string){
  const words=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return demoProjects.filter(project=>words.every(word=>(project.name+' '+project.shortSummary).toLocaleLowerCase().includes(word)))
    .sort((a,b)=>a.name.localeCompare(b.name));
}
export function groupedProjects(query:string){
  const matches=matchingProjects(query);
  return PROJECT_GROUPS.map(group=>({title:group.title,projects:matches.filter(project=>(group.ids as readonly string[]).includes(project.id))})).filter(group=>group.projects.length);
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
    for(const group of groupedProjects(search.value)){
      const section=document.createElement('section');section.className='project-menu-group';
      const heading=document.createElement('h3');heading.textContent=group.title;section.append(heading);
      section.setAttribute('aria-label',group.title);
      for(const project of group.projects){
        const button=document.createElement('button');button.type='button';button.textContent=project.name;
        button.addEventListener('click',()=>{close();select(project.id);});section.append(button);
      }
      list.append(section);
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
