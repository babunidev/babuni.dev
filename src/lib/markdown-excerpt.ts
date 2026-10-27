import {Lexer,type Token} from 'marked';
/** Keep complete Markdown blocks where possible; close inline wrappers at the cut.
 * Excerpts remain source text, never HTML, and never require loading full documents. */
export function markdownExcerpt(source:string,limit:number):string {
  const tokens=Lexer.lex(source,{gfm:true});
  if(tokens[0]?.type==='heading'&&tokens[0].depth===1)tokens.shift();
  function inline(items:readonly Token[],budget:number):string {
    let out='';
    for(const token of items){
      const remaining=budget-out.length;if(remaining<=0)break;
      if(token.raw.length<=remaining){out+=token.raw;continue;}
      const marker=token.type==='strong'?'**':token.type==='em'?'*':token.type==='del'?'~~':token.type==='codespan'?'`':'';
      if(marker&&remaining>marker.length*2){
        const inner=token.tokens?inline(token.tokens,remaining-marker.length*2):token.text.slice(0,remaining-marker.length*2);
        out+=marker+inner+marker;
      }else if(token.type==='link'||token.type==='image'){
        out+=inline(token.tokens??Lexer.lexInline(token.text),remaining);
      }else out+=token.raw.slice(0,remaining).replace(/\s+\S*$/,'');
      break;
    }
    return out;
  }
  let result='';
  for(const token of tokens){
    if(token.type==='def')continue;
    const raw=token.raw;
    if(result.length+raw.length<=limit){result+=raw;continue;}
    const budget=limit-result.length-1;
    if(token.type==='paragraph'&&budget>8)result+=inline(token.tokens,budget)+'…';
    else if(!result.trim()&&budget>8)result+=inline(Lexer.lexInline(token.text??raw),budget)+'…';
    else if(result.trim())result=result.trimEnd().slice(0,limit-1)+'…';
    break;
  }
  return result.trim();
}
