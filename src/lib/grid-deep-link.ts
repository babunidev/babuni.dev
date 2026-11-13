/** Homepage hash that opens one project in the living grid, e.g.
 * `#project=morkahja-rpg&bloom=big&read=changes`. A hash keeps the site
 * static: no extra pages, and the server never sees the fragment.
 * `read` names a module id (the same id as /projects/<project>/<module>/)
 * and implies a big bloom, because the reader opens from a big-bloom card.
 */
export interface GridDeepLink {project:string;bloom:'small'|'big';read:string|null}
const SLUG=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function parseGridDeepLink(hash:string):GridDeepLink|null {
  const params=new URLSearchParams(hash.replace(/^#/,''));
  const project=params.get('project');
  if(!project||!SLUG.test(project))return null;
  const requested=params.get('read');
  const read=requested&&SLUG.test(requested)?requested:null;
  const bloom=read||params.get('bloom')==='big'?'big':'small';
  return {project,bloom,read};
}
export function gridDeepLinkHash(link:{project:string;bloom?:'small'|'big';read?:string|null}):string {
  const params=new URLSearchParams({project:link.project});
  if(link.bloom==='big'||link.read)params.set('bloom','big');
  if(link.read)params.set('read',link.read);
  return '#'+params.toString();
}
