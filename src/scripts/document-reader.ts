import {Lexer,type Token} from 'marked';

function decodeText(value:string):string {
  const named:Record<string,string>={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:'\u00a0'};
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,(entity,key:string)=>{
    if(key[0]!=='#')return named[key.toLowerCase()]??entity;
    const code=key[1].toLowerCase()==='x'?parseInt(key.slice(2),16):parseInt(key.slice(1),10);
    return code>0&&code<=0x10ffff&&!(code>=0xd800&&code<=0xdfff)?String.fromCodePoint(code):'\ufffd';
  });
}
/** Only explicit HTTP(S) navigation; relative links use the source document. */
export function safeDocumentUrl(value:string,sourceUrl?:string):string|null {
  try{
    const decoded=decodeText(value).trim();
    const url=sourceUrl?new URL(decoded,sourceUrl):new URL(decoded);
    if(!['http:','https:'].includes(url.protocol)||url.username||url.password)return null;
    return url.href;
  }catch{return null;}
}
/** Parse Markdown tokens, then construct safe DOM nodes. Never insert raw HTML. */
export function renderDocument(source:string,sourceUrl?:string,interactive=true):HTMLElement {
  const article=document.createElement('div');article.className='module-document';
  const headings=new Map<string,HTMLElement>(),counts=new Map<string,number>();
  const links:{element:HTMLAnchorElement;href:string}[]=[];
  const text=(parent:HTMLElement,value:string)=>parent.append(document.createTextNode(decodeText(value)));
  function link(parent:HTMLElement,token:Token,image=false){
    const element=document.createElement(interactive?'a':'span');
    if(image)text(element,token.text||'Image');else render(element,token.tokens??[]);
    if(token.title)element.title=decodeText(token.title);
    if(interactive)links.push({element:element as HTMLAnchorElement,href:token.href});parent.append(element);
  }
  function render(parent:HTMLElement,tokens:readonly Token[]):void {
    for(const token of tokens){
      switch(token.type){
        case 'space':case 'def':case 'checkbox':break;
        case 'text':if(token.tokens)render(parent,token.tokens);else text(parent,token.text);break;
        case 'escape':text(parent,token.text);break;
        case 'html':text(parent,token.raw);break;
        case 'paragraph':{
          const p=document.createElement('p');render(p,token.tokens);parent.append(p);break;
        }
        case 'heading':{
          const h=document.createElement('h'+Math.min(6,token.depth+1));render(h,token.tokens);
          const slug=(h.textContent??'').toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu,'').replace(/\s/g,'-')||'section';
          const count=counts.get(slug)??0;counts.set(slug,count+1);
          const key=slug+(count?'-'+count:'');if(interactive){h.id='document-'+key;headings.set(key,h);}parent.append(h);break;
        }
        case 'strong':case 'em':case 'del':{
          const node=document.createElement(token.type);render(node,token.tokens);parent.append(node);break;
        }
        case 'codespan':{
          const code=document.createElement('code');code.textContent=token.text;parent.append(code);break;
        }
        case 'code':{
          const pre=document.createElement('pre'),code=document.createElement('code');
          code.textContent=token.text;pre.append(code);parent.append(pre);break;
        }
        case 'blockquote':{
          const quote=document.createElement('blockquote');render(quote,token.tokens);parent.append(quote);break;
        }
        case 'list':{
          const list=document.createElement(token.ordered?'ol':'ul');
          if(token.ordered&&token.start!==1)list.setAttribute('start',String(token.start));
          for(const item of token.items){
            const li=document.createElement('li');
            if(item.task){
              li.className='module-task-item';
              const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.disabled=true;checkbox.checked=!!item.checked;
              checkbox.setAttribute('aria-label',item.checked?'Completed':'Incomplete');li.append(checkbox);
            }
            render(li,item.tokens);list.append(li);
          }
          parent.append(list);break;
        }
        case 'table':{
          const wrapper=document.createElement('div');wrapper.className='module-document-table';
          const table=document.createElement('table'),head=document.createElement('thead'),body=document.createElement('tbody');
          const row=(cells:{tokens:Token[];align:string|null}[],header=false)=>{
            const tr=document.createElement('tr');
            for(const cell of cells){
              const td=document.createElement(header?'th':'td');
              if(header)td.setAttribute('scope','col');
              if(['left','right','center'].includes(cell.align??''))td.style.textAlign=cell.align!;
              render(td,cell.tokens);tr.append(td);
            }
            return tr;
          };
          head.append(row(token.header,true));for(const cells of token.rows)body.append(row(cells));
          table.append(head,body);wrapper.append(table);parent.append(wrapper);break;
        }
        case 'link':link(parent,token);break;
        // Preserve the explicit-media policy: image references are links, not automatic downloads.
        case 'image':link(parent,token,true);break;
        case 'hr':parent.append(document.createElement('hr'));break;
        case 'br':parent.append(document.createElement('br'));break;
        default:if(token.raw)text(parent,token.raw);
      }
    }
  }
  render(article,Lexer.lex(source,{gfm:true}));
  for(const {element,href} of links){
    if(href.startsWith('#')){
      let fragment=href.slice(1);try{fragment=decodeURIComponent(fragment);}catch{}
      const target=headings.get(fragment);
      if(target){
        element.href='#'+target.id;
        element.addEventListener('click',event=>{event.preventDefault();target.scrollIntoView({block:'start'});});
        continue;
      }
    }
    const safe=safeDocumentUrl(href,sourceUrl);
    if(safe){element.href=safe;element.target='_blank';element.rel='noopener noreferrer';}
  }
  return article;
}
