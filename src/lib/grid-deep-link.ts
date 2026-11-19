/** Homepage hash that opens one project in the living grid, e.g.
 * `#project=morkahja-rpg&bloom=big&read=changes`. A hash keeps the site
 * static: no extra pages, and the server never sees the fragment.
 * `read` names a module id (the same id as /projects/<project>/<module>/)
 * and implies a big bloom, because the reader opens from a big-bloom card.
 * `doc` names one document inside a folder reader by its repository path,
 * e.g. `&read=folder-lore&doc=lore/HEARTH.md`; it needs `read`.
 */
export interface GridDeepLink {project:string;bloom:'small'|'big';read:string|null;doc:string|null}
const SLUG=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DOC=/^(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+\.md$/;
export function parseGridDeepLink(hash:string):GridDeepLink|null {
  const params=new URLSearchParams(hash.replace(/^#/,''));
  const project=params.get('project');
  if(!project||!SLUG.test(project))return null;
  const requested=params.get('read');
  const read=requested&&SLUG.test(requested)?requested:null;
  const bloom=read||params.get('bloom')==='big'?'big':'small';
  const requestedDoc=params.get('doc');
  const doc=read&&requestedDoc&&DOC.test(requestedDoc)?requestedDoc:null;
  return {project,bloom,read,doc};
}
export function gridDeepLinkHash(link:{project:string;bloom?:'small'|'big';read?:string|null;doc?:string|null}):string {
  const params=new URLSearchParams({project:link.project});
  if(link.bloom==='big'||link.read)params.set('bloom','big');
  if(link.read)params.set('read',link.read);
  if(link.read&&link.doc)params.set('doc',link.doc);
  // Slashes in a document path stay readable; they are safe inside a fragment.
  return '#'+params.toString().replace(/%2F/g,'/');
}
