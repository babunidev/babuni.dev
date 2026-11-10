/** Search and AI-search helpers. Pure functions: no file access, no catalog assumptions. */

const plain=(text:string)=>text
  .replace(/<[^>]+>/g,' ')
  .replace(/!\[[^\]]*\]\([^)]*\)/g,' ')
  .replace(/\[([^\]]*)\]\([^)]*\)/g,'$1')
  .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm,'')
  .replace(/[*_`#>|]/g,'')
  .replace(/\s+/g,' ')
  .trim();

const shorten=(text:string,max:number)=>{
  if(text.length<=max)return text;
  const cut=text.slice(0,max-1);
  return cut.slice(0,cut.lastIndexOf(' ')>max/2?cut.lastIndexOf(' '):cut.length).replace(/[\s,;:.—-]+$/,'')+'…';
};

/**
 * A page description from a document: the first prose paragraph, skipping headings,
 * bylines and short fragments. Falls back when the document offers no usable sentence.
 */
export function pageDescription(text:string,fallback:string,max=160):string{
  for(const paragraph of String(text??'').split(/\n\s*\n/)){
    const raw=paragraph.trim();
    if(!raw||/^#/.test(raw))continue;
    const clean=plain(raw);
    if(/^by:?\s/i.test(clean))continue;
    if(clean.length>=60)return shorten(clean,max);
  }
  return shorten(plain(fallback),max);
}

/** Latest known commit date (YYYY-MM-DD) for a project's connected repository, if any. */
export function projectLastModified(
  projectId:string,
  connections:Record<string,{status?:string;repository?:string}>,
  activity:Record<string,{committedAt?:string}>,
):string|undefined{
  const connection=connections[projectId];
  if(connection?.status!=='connected'||!connection.repository)return undefined;
  const date=Date.parse(activity[connection.repository]?.committedAt??'');
  return Number.isFinite(date)?new Date(date).toISOString().slice(0,10):undefined;
}
