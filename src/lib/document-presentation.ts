import {Lexer} from 'marked';

/** Presentation only: retain original source snapshots and each block's Markdown. */
const metadataLabel=/^(?:(?:original |human |project |creative )*(?:author|creator|owner)(?:ship)?(?:\s*(?:and|\/|&)\s*(?:project |creative )*(?:author|creator|director|direction|decision authority))*|creative director|sources?(?: inspected)?|primary files|current (?:declared )?version|version|target(?: declared by manifest)?|game|interface|license|runtime status|verification(?: status)?|creator status|status|edition|retrospective prepared|reconstructed|recorded|source basis|canonical text|fictional artist|review date|last updated)$/i;
function metadataLine(line:string):boolean {
 const plain=line.trim().replace(/^[-*+]\s+/,'').replace(/\*\*/g,'');
 if(/^\*\*(?:Reconstructed|Prepared|Reviewed|Inspected)\b/i.test(line.trim()))return true;
 const colon=plain.indexOf(':');
 return colon>0&&(metadataLabel.test(plain.slice(0,colon).trim())||/^(?:(?:current|declared|original|human|project|creative|final|source|runtime|verification|creator|target|primary|documentation|audit|review|test|testing|manifest|release|platform|evidence|decision|retrospective|reconstruction|canonical|version|author|owner|status|historical source|working identity|game-client target|implementation target|client target|preparation date|examined source|code source|acknowledged assistant role)\b[^:]{0,65}|examined|method|scope|date|repository|branch|commit)$/i.test(plain.slice(0,colon).trim()));
}
function metadataBlock(raw:string):boolean {
 const lines=raw.trim().split('\n').filter(l=>l.trim());
 if(!lines.length)return false;
 if(lines.every(metadataLine))return true;
 if(lines.every(l=>/^\s*\|/.test(l))){
  const rows=lines.filter(l=>!/^\s*\|?\s*:?-{3,}/.test(l));
  return rows.length>1&&rows.slice(1).every(l=>metadataLabel.test(l.split('|').filter(Boolean)[0]?.replace(/\*\*/g,'').trim()??''));
 }
 return false;
}
interface Section {heading:string;depth:number;body:string;children:Section[]}
const months=['january','february','march','april','may','june','july','august','september','october','november','december'];
function entryDate(heading:string,year?:number):number|null {
 if(/\bunreleased\b/i.test(heading))return Infinity;
 const iso=heading.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
 if(iso)return Number(iso[1])*10000+Number(iso[2])*100+Number(iso[3]);
 const month=heading.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:[–-]\d{1,2})?(?:,?\s+(20\d{2}))?\b/i);
 const dayFirst=heading.match(/\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+(20\d{2}))?\b/i);
 if(!month&&!dayFirst)return null;
 const y=Number((month??dayFirst)![3])||year;if(!y)return null;
 return y*10000+(months.indexOf((month?month[1]:dayFirst![2]).toLowerCase())+1)*100+Number(month?month[2]:dayFirst![1]);
}
function sortLog(body:string):string {
 const root:Section={heading:'',depth:0,body:'',children:[]},stack=[root];
 for(const token of Lexer.lex(body,{gfm:true})){
  if(token.type==='heading'){
   while(stack.length>1&&stack.at(-1)!.depth>=token.depth)stack.pop();
   const node:Section={heading:token.raw,depth:token.depth,body:'',children:[]};stack.at(-1)!.children.push(node);stack.push(node);
  }else stack.at(-1)!.body+=token.raw;
 }
 function render(node:Section,inheritedYear?:number):string {
  const years=new Set(node.children.flatMap(c=>[...c.heading.matchAll(/\b(20\d{2})\b/g)].map(m=>Number(m[1]))));
  const year=years.size===1?[...years][0]:inheritedYear;
  const dated=node.children.filter(c=>entryDate(c.heading,year)!==null).sort((a,b)=>entryDate(b.heading,year)!-entryDate(a.heading,year)!);
  let i=0;return node.heading+node.body+node.children.map(c=>render(entryDate(c.heading,year)!==null?dated[i++]:c,year)).join('');
 }
 return render(root);
}
export function presentDocument(source:string,path=''):string {
 const kept:string[]=[],metadata:string[]=[];let leading=true;
 for(const token of Lexer.lex(source,{gfm:true})){
  if(leading&&(token.type==='space'||token.type==='heading'&&token.depth===1)){kept.push(token.raw);continue;}
  if(leading&&metadataBlock(token.raw)){metadata.push(token.raw);continue;}
  if(leading&&token.type==='paragraph'){
   const lines=token.raw.split(/(?<=\n)/);let count=0;
   while(count<lines.length&&metadataLine(lines[count]))count++;
   if(count){metadata.push(lines.slice(0,count).join(''));const rest=lines.slice(count).join('');
    if(!rest.trim())continue;kept.push(rest);leading=false;continue;}
  }
  leading=false;kept.push(token.raw);
 }
 let body=kept.join('');
 if(/(?:^|\/)(?:CHANGELOG|DEVLOG|JOURNAL|DEVELOPMENT_JOURNAL)\.md$/i.test(path))body=sortLog(body);
 if(metadata.length)body=body.trimEnd()+'\n\n## Document information\n\n'+metadata.map(s=>s.trim()).join('\n\n')+'\n';
 return body;
}
