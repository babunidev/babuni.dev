import {marked,Renderer} from 'marked';
import {safeDocumentUrl} from '../../scripts/document-reader.ts';
export const escapeHtml=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
/** Server-only HTML: raw source HTML is text, URLs use the reader's allowlist. */
export function markdownHtml(body:string,source?:string):string {
 const renderer=new Renderer();
 renderer.html=token=>escapeHtml(token.text);
 renderer.link=function(token){const text=this.parser.parseInline(token.tokens);const href=token.href.startsWith('#')?token.href:safeDocumentUrl(token.href,source);return href?`<a href="${escapeHtml(href)}" rel="noopener noreferrer">${text}</a>`:text;};
 renderer.image=token=>{const href=safeDocumentUrl(token.href,source);return href?`<a href="${escapeHtml(href)}">${escapeHtml(token.text||'Image')}</a>`:escapeHtml(token.text);};
 renderer.heading=function(token){const level=Math.min(6,token.depth+1);const id=token.text.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu,'').replace(/\s/g,'-');return `<h${level} id="${escapeHtml(id)}">${this.parser.parseInline(token.tokens)}</h${level}>\n`;};
 return marked.parse(body,{gfm:true,renderer,async:false}) as string;
}
