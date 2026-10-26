/** Safe, small document renderer: text nodes only, never raw HTML. */
export function renderDocument(source:string):HTMLElement {
  const article=document.createElement('div');article.className='module-document';
  const lines=source.split(/\r?\n/);let paragraph:string[]=[],code:string[]|null=null,list:HTMLElement|null=null;
  function inline(node:HTMLElement,text:string){
    // Documentation links are explicit navigation, restricted to safe schemes.
    const pattern=/\[([^\]]+)\]\(([^\s)]+)\)/g;let start=0;
    for(const match of text.matchAll(pattern)){
      node.append(document.createTextNode(text.slice(start,match.index)));
      if(/^https?:\/\//i.test(match[2])){const link=document.createElement('a');link.textContent=match[1];link.href=match[2];link.target='_blank';link.rel='noopener noreferrer';node.append(link);}
      else node.append(document.createTextNode(match[1]+' ('+match[2]+')'));
      start=match.index!+match[0].length;
    }
    node.append(document.createTextNode(text.slice(start)));
  }
  function flush(){if(paragraph.length){const p=document.createElement('p');inline(p,paragraph.join(' '));article.append(p);paragraph=[];}list=null;}
  for(const line of lines){
    if(/^\s*```/.test(line)){
      flush();if(code!==null){const pre=document.createElement('pre'),text=document.createElement('code');text.textContent=code.join('\n');pre.append(text);article.append(pre);code=null;}else code=[];continue;
    }
    if(code!==null){code.push(line);continue;}
    if(!line.trim()){flush();continue;}
    const heading=/^(#{1,6})\s+(.+)$/.exec(line);
    if(heading){flush();const h=document.createElement('h'+Math.min(6,heading[1].length+1));inline(h,heading[2]);article.append(h);continue;}
    const item=/^\s*(?:[-*]|\d+\.)\s+(.+)$/.exec(line);
    if(item){
      if(paragraph.length)flush();
      if(!list){list=document.createElement('ul');article.append(list);}
      const li=document.createElement('li');inline(li,item[1]);list.append(li);continue;
    }
    if(/^\s*---+\s*$/.test(line)){flush();article.append(document.createElement('hr'));continue;}
    if(list)list=null;paragraph.push(line);
  }
  flush();if(code!==null){const pre=document.createElement('pre');pre.textContent=code.join('\n');article.append(pre);}
  return article;
}
