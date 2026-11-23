(() => {
 'use strict';
 const products=window.ATELIER_PRODUCTS;
 const el=id=>document.getElementById(id);
 const catalog=document.createElement('section');
 catalog.id='catalog-page';catalog.className='catalog-page section';catalog.hidden=true;
 catalog.innerHTML='<a class="back-link" href="#">→ חזרה לדף הבית</a><h1>המוצרים שלנו</h1><p class="catalog-intro">כל הזרים, הסידורים והמתנות שלנו — בחרו את הפרחים והצבע שמתאימים לכם.</p>'+document.querySelector('.filter-row').outerHTML+'<div id="catalog-products" class="catalog-products"></div>';
 document.querySelector('main').append(catalog);
 const angles=['מבט מלפנים','מבט מהצד','מבט מלמעלה','מבט בזווית'];
 const positions=['0% 0%','100% 0%','0% 100%','100% 100%'];
 const state={product:null,color:0,angle:0,filter:'all',cardColors:new Map(),routeProduct:null};
 const imageCache=new Map();
 function imageURL(p,index){return p.variants[index].image;}
 function atlasMarkup(p,index=0,angle=0,cls=''){return '<span class="atlas '+cls+'" role="img" aria-label="'+p.name+', '+p.variants[index].name+', '+angles[angle]+'" style="background-image:url('+imageURL(p,index)+');background-position:'+positions[angle]+'"></span>';}
 function loadImage(url){if(!imageCache.has(url)){imageCache.set(url,new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>{imageCache.delete(url);reject(new Error('image'));};image.src=url;}));}return imageCache.get(url);}
 function productHash(p,color=0,angle=0){return '#/product/'+p.id+'?color='+p.variants[color].id+'&view='+angle;}
 function renderCards(){
  const shown=products.filter(p=>state.filter==='all'||p.category===state.filter);
  const cards=shown.map(p=>{
   const index=state.cardColors.get(p.id)||0;
   return '<article class="product-card" data-id="'+p.id+'"><a class="product-art" href="'+productHash(p,index)+'" aria-label="לפרטים: '+p.name+'">'+atlasMarkup(p,index)+'</a><h3 class="product-title"><a href="'+productHash(p,index)+'">'+p.name+'</a></h3><p class="product-subtitle">'+p.subtitle+'</p><div class="card-colors" role="group" aria-label="צבעים של '+p.name+'">'+p.variants.map((v,i)=>'<button class="swatch" data-card-color="'+i+'" style="--swatch:'+v.swatch+'" aria-label="'+v.name+'" title="'+v.name+'" aria-pressed="'+(i===index)+'"></button>').join('')+'</div><a class="card-details" href="'+productHash(p,index)+'">לפרטים <span aria-hidden="true">←</span></a></article>';
  }).join('');
  el('products').innerHTML=cards;el('catalog-products').innerHTML=cards;
 }
 function updateOrder(){
  if(!state.product)return;
  const p=state.product;
  const note=el('gift-note').value.trim();
  const message='שלום חי עציץ ופרח, אשמח לברר מחיר וזמינות עבור '+p.name+' בצבע '+p.variants[state.color].name+'.'+(note?'\nבקשה מיוחדת: '+note:'');
  el('order-link').href='https://wa.me/972543060049?text='+encodeURIComponent(message);
 }
 async function updatePhoto(){
  const p=state.product,index=state.color,angle=state.angle;
  const url=imageURL(p,index);
  const targets=[el('main-photo'),el('zoom-photo')];
  const alt=p.name+', '+p.variants[index].name+', '+angles[angle];
  for(const target of targets){target.setAttribute('aria-busy','true');target.setAttribute('aria-label',alt);}
  el('view-caption').textContent=angles[angle]+' · '+(angle+1)+' / 4';
  el('zoom-caption').textContent=angles[angle]+' · '+p.variants[index].name;
  el('angle-thumbs').innerHTML=angles.map((name,i)=>'<button class="angle-button" data-angle="'+i+'" aria-pressed="'+(i===angle)+'" aria-label="'+name+'">'+atlasMarkup(p,index,i)+'<span>'+name+'</span></button>').join('');
  try{await loadImage(url);if(state.product!==p||state.color!==index||state.angle!==angle)return;for(const target of targets){target.style.backgroundImage='url("'+url+'")';target.style.backgroundPosition=positions[angle];target.removeAttribute('aria-busy');}}
  catch{if(state.product===p&&state.color===index){el('view-caption').textContent='לא ניתן לטעון את התמונה כרגע. בחרו שוב צבע או זווית.';for(const target of targets)target.removeAttribute('aria-busy');}}
 }
 function updateColor(){
  const p=state.product;
  el('variant-options').innerHTML=p.variants.map((v,i)=>'<button type="button" class="variant-choice" data-variant="'+i+'" aria-label="'+v.name+'" aria-pressed="'+(i===state.color)+'">'+atlasMarkup(p,i,2,'variant-preview')+'<span class="variant-name">'+v.name+'</span><span class="variant-check" aria-hidden="true">✓</span></button>').join('');
  el('color-name').textContent=p.variants[state.color].name;
  updatePhoto();updateOrder();
 }
 function syncProductURL(){history.replaceState(null,'',productHash(state.product,state.color,state.angle));}
 function route(){
  const match=location.hash.match(/^#\/product\/([a-z]+)(?:\?(.*))?$/);
  const p=match&&products.find(p=>p.id===match[1]);
  const nav=el('navigation');nav.classList.remove('open');document.querySelector('.menu-button').setAttribute('aria-expanded','false');
  const isCatalog=location.hash==='#/products';
  const isStudio=location.hash==='#/studio';
  el('studio-page').hidden=!isStudio;
  catalog.hidden=!isCatalog;
  document.querySelector('a[href="#/products"]')?.toggleAttribute('aria-current',isCatalog);
  if(isStudio){el('home').hidden=true;el('product-page').hidden=true;state.product=null;state.routeProduct=null;document.title='The Studio | חי עציץ ופרח';if(el('zoom-dialog').open)el('zoom-dialog').close();window.scrollTo({top:0,behavior:'instant'});return;}
  if(isCatalog){el('home').hidden=true;el('product-page').hidden=true;state.product=null;state.routeProduct=null;document.title='המוצרים שלנו | חי עציץ ופרח';if(el('zoom-dialog').open)el('zoom-dialog').close();renderCards();window.scrollTo({top:0,behavior:'instant'});return;}
  if(!p){el('home').hidden=false;el('product-page').hidden=true;state.routeProduct=null;state.product=null;document.title='חי עציץ ופרח | פרחים לאנשים שאוהבים';if(el('zoom-dialog').open)el('zoom-dialog').close();if(location.hash&&!location.hash.startsWith('#/')){requestAnimationFrame(()=>document.querySelector(location.hash)?.scrollIntoView());}else window.scrollTo({top:0});return;}
  const params=new URLSearchParams(match[2]||'');
  const selected=p.variants.findIndex(v=>v.id===params.get('color'));
  state.product=p;state.color=selected<0?0:selected;state.angle=Math.max(0,Math.min(3,Number(params.get('view'))||0));
  el('home').hidden=true;el('product-page').hidden=false;
  el('product-title').textContent=p.name;el('product-description').textContent=p.description;el('product-category').textContent=p.categoryName+' · חי עציץ ופרח';
  document.title=p.name+' | חי עציץ ופרח';
  if(state.routeProduct!==p.id){el('gift-note').value='';el('product-page').querySelectorAll('details').forEach(d=>d.open=false);window.scrollTo({top:0,behavior:'instant'});}
  state.routeProduct=p.id;updateColor();
 }
 document.querySelector('.menu-button').addEventListener('click',event=>{const button=event.currentTarget;const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));el('navigation').classList.toggle('open',open);});
 document.querySelectorAll('.filter-row').forEach(row=>row.addEventListener('click',event=>{const button=event.target.closest('[data-filter]');if(!button)return;state.filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===state.filter)));renderCards();}));
 [el('products'),el('catalog-products')].forEach(rail=>rail.addEventListener('click',async event=>{const button=event.target.closest('[data-card-color]');if(!button)return;const card=button.closest('.product-card');const p=products.find(p=>p.id===card.dataset.id);const index=Number(button.dataset.cardColor);state.cardColors.set(p.id,index);card.querySelectorAll('[data-card-color]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));card.querySelectorAll('a').forEach(a=>a.href=productHash(p,index));const photo=card.querySelector('.atlas');photo.setAttribute('aria-busy','true');try{await loadImage(imageURL(p,index));if(state.cardColors.get(p.id)!==index)return;photo.style.backgroundImage='url("'+imageURL(p,index)+'")';photo.setAttribute('aria-label',p.name+', '+p.variants[index].name);photo.removeAttribute('aria-busy');}catch{photo.removeAttribute('aria-busy');}}));
 el('variant-options').addEventListener('click',event=>{const button=event.target.closest('[data-variant]');if(!button)return;state.color=Number(button.dataset.variant);syncProductURL();updateColor();});
 el('angle-thumbs').addEventListener('click',event=>{const button=event.target.closest('[data-angle]');if(!button)return;state.angle=Number(button.dataset.angle);syncProductURL();updatePhoto();});
 el('gift-note').addEventListener('input',updateOrder);
 document.querySelectorAll('[data-service]').forEach(a=>{a.href='https://wa.me/972543060049?text='+encodeURIComponent('שלום, אשמח לקבל פרטים על '+a.dataset.service);a.target='_blank';a.rel='noopener';});
 const zoom=el('zoom-dialog');
 el('zoom-open').addEventListener('click',()=>{zoom.showModal();updatePhoto();});
 document.querySelector('.close-zoom').addEventListener('click',()=>zoom.close());
 zoom.addEventListener('click',event=>{if(event.target===zoom){const r=zoom.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)zoom.close();}});
 function moveAngle(delta){state.angle=(state.angle+delta+4)%4;syncProductURL();updatePhoto();}
 el('previous-view').addEventListener('click',()=>moveAngle(-1));el('next-view').addEventListener('click',()=>moveAngle(1));
 zoom.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();moveAngle(1);}if(event.key==='ArrowRight'){event.preventDefault();moveAngle(-1);}});
 window.addEventListener('hashchange',route);
 renderCards();route();
})();

// Accessible horizontal collection navigation; touch scrolling stays native.
(() => {
 const rail=document.getElementById('products');
 const controls=document.createElement('div');
 controls.className='carousel-controls';
 controls.innerHTML='<button type="button" aria-label="מוצרים קודמים">→</button><span>גלו את הקולקציה</span><button type="button" aria-label="מוצרים הבאים">←</button>';
 rail.after(controls);
 const buttons=controls.querySelectorAll('button');
 // RTL scrolling runs from zero (first) to a negative maximum (last).
 const tolerance=3;
 function limits(){const max=Math.max(0,rail.scrollWidth-rail.clientWidth);return {max,position:Math.min(max,Math.max(0,-rail.scrollLeft))};}
 function move(direction){
  const card=rail.querySelector('.product-card');if(!card)return;
  const {max,position}=limits();if(max<=tolerance)return;
  const gap=parseFloat(getComputedStyle(rail).columnGap)||0;
  const wrap=direction<0?position>=max-tolerance:position<=tolerance;
  const target=wrap?(direction<0?0:max):Math.min(max,Math.max(0,position-direction*(card.getBoundingClientRect().width+gap)));
  rail.scrollTo({left:-target,behavior:wrap||matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 buttons[0].addEventListener('click',()=>move(1));
 buttons[1].addEventListener('click',()=>move(-1));
 // Preserve native swiping. Only wrap an outward swipe that STARTED at an edge.
 let touch=null;
 rail.addEventListener('touchstart',event=>{
  if(event.touches.length!==1){touch=null;return;}
  const point=event.touches[0];const {max,position}=limits();
  touch={x:point.clientX,y:point.clientY,first:position<=tolerance,last:position>=max-tolerance,max};
 },{passive:true});
 rail.addEventListener('touchend',event=>{
  if(!touch)return;const start=touch;touch=null;const point=event.changedTouches[0];if(!point||start.max<=tolerance)return;
  const dx=point.clientX-start.x,dy=point.clientY-start.y;
  if(Math.abs(dx)<45||Math.abs(dx)<Math.abs(dy)*1.5)return;
  if(start.last&&dx>0)rail.scrollTo({left:0,behavior:'instant'});
  else if(start.first&&dx<0)rail.scrollTo({left:-start.max,behavior:'instant'});
 },{passive:true});
 rail.addEventListener('touchcancel',()=>{touch=null;},{passive:true});
 document.querySelector('.filter-row').addEventListener('click',()=>{touch=null;rail.scrollTo({left:0,behavior:'instant'});});

})();

// Dismiss mobile navigation without shifting the document.
(() => {
 const header=document.querySelector('.site-header');const nav=document.getElementById('navigation');const toggle=document.querySelector('.menu-button');
 function close(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
 document.addEventListener('pointerdown',e=>{if(!header.contains(e.target))close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){close();toggle.focus({preventScroll:true});}});
 nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});
 matchMedia('(max-width:720px)').addEventListener('change',close);
})();
