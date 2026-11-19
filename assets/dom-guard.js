/* Sanitize every legacy HTML sink. Inline handlers are limited to patterns extracted
   from the immutable original source; untrusted substitutions cannot add syntax. */
(()=>{
 const allowed=(window.ManabiHandlerPatterns||[]).map(p=>new RegExp(p));
 const events=['onclick','onchange','oninput','onsubmit','onkeydown','ontoggle','onclose','onscroll'];
 const config={ADD_ATTR:events,FORBID_TAGS:['script','iframe','object','embed','base','link','meta'],FORBID_ATTR:['srcdoc'],ALLOW_DATA_ATTR:true};
 DOMPurify.addHook('uponSanitizeAttribute',(_node,event)=>{
  if(event.attrName.startsWith('on'))event.keepAttr=events.includes(event.attrName)&&allowed.some(re=>re.test(event.attrValue));
  if(['href','src','action','formaction','xlink:href'].includes(event.attrName)&&/^(?:https?:)?\/\//i.test(event.attrValue))event.keepAttr=false;
 });
 const clean=value=>DOMPurify.sanitize(String(value??''),config);
 for(const name of ['innerHTML','outerHTML']){
  const descriptor=Object.getOwnPropertyDescriptor(Element.prototype,name);
  Object.defineProperty(Element.prototype,name,{...descriptor,set(value){descriptor.set.call(this,clean(value));}});
 }
 const insert=Element.prototype.insertAdjacentHTML;
 Element.prototype.insertAdjacentHTML=function(position,value){return insert.call(this,position,clean(value));};
 window.ManabiCleanHTML=clean;
})();
