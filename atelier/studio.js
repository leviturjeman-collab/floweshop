(() => {
 const products=window.ATELIER_PRODUCTS;
 const form=document.getElementById('studio-form');
 const type=document.getElementById('studio-type');
 const colors=document.getElementById('studio-colors');
 const allButton=document.getElementById('studio-all-colors');
 let allSelected=false;
 let previewId=null;
 type.innerHTML=products.map(p=>`<option value="${p.id}">${p.name} — ${p.subtitle}</option>`).join('');
 function product(){return products.find(p=>p.id===type.value);}
 function renderColors(){const p=product();allSelected=false;previewId=p.variants[0].id;colors.innerHTML=p.variants.map((v,i)=>`<label class="studio-color"><input type="radio" name="color" value="${v.id}" ${i===0?'checked':''}><span class="atlas" style="background-image:url('${v.image}');background-position:0% 100%" aria-hidden="true"></span><span>${v.name}</span></label>`).join('');update();}
 function update(){const p=product();const selected=colors.querySelector('input:checked');const variants=allSelected?p.variants:[p.variants.find(v=>v.id===selected?.value)||p.variants[0]];const preview=p.variants.find(v=>v.id===previewId)||variants[0];
 allButton.setAttribute('aria-pressed',String(allSelected));colors.classList.toggle('all-selected',allSelected);
 const photo=document.getElementById('studio-photo');photo.style.backgroundImage=`url('${preview.image}')`;photo.setAttribute('aria-label',p.name+' — '+preview.name);document.getElementById('studio-reference').textContent=p.name+' · '+preview.name+(allSelected?' · תמונת גוון לדוגמה':'');
 const data=new FormData(form);const size=data.get('size');const colorNames=variants.map(v=>v.name).join(', ');const budget=data.get('budget');const notes=String(data.get('notes')||'').trim();
 document.getElementById('studio-summary').textContent=p.name+' · '+(allSelected?'כל הגוונים: ':'')+colorNames+' · '+size;
 const message=['שלום, אשמח לעצב זר אישי דרך The Studio:', 'סגנון: '+p.name,'גוונים: '+colorNames,'גודל: '+size,'אירוע: '+data.get('occasion'),budget?'תקציב משוער: '+budget+' ש״ח':'',notes?'בקשות נוספות: '+notes:'','אשמח לאישור מחיר וזמינות.'].filter(Boolean).join('\n');document.getElementById('studio-send').href='https://wa.me/972543060049?text='+encodeURIComponent(message);}
 allButton.addEventListener('click',()=>{allSelected=true;colors.querySelectorAll('input').forEach(input=>input.checked=false);update();});
 colors.addEventListener('input',event=>{if(event.target.matches('input[name=color]')){allSelected=false;previewId=event.target.value;}});
 type.addEventListener('change',renderColors);form.addEventListener('input',update);form.addEventListener('submit',e=>e.preventDefault());renderColors();
})();

// Searchable flower-style dropdown; the select remains the form's source of truth.
(() => {
 const select=document.getElementById('studio-type');
 const products=window.ATELIER_PRODUCTS;
 const wrapper=document.createElement('div');wrapper.className='style-picker';
 wrapper.innerHTML=`<button type="button" id="style-trigger" class="style-trigger" aria-expanded="false" aria-controls="style-panel"><span class="style-trigger-name"></span><svg viewBox="0 0 20 12" aria-hidden="true"><path d="m2 2 8 8 8-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div id="style-panel" class="style-panel" hidden><div class="style-search-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m15 15 6 6" stroke="currentColor" stroke-width="1.6"/></svg><input id="style-search" type="search" placeholder="חיפוש סגנון" aria-label="חיפוש סגנון" role="combobox" aria-autocomplete="list" aria-controls="style-list" aria-expanded="false" autocomplete="off"></div><div id="style-list" class="style-list" role="listbox" aria-label="סגנון הפרחים"></div><p class="style-empty" hidden role="status">לא נמצאו סגנונות מתאימים</p></div>`;
 select.after(wrapper);select.hidden=true;
 document.querySelector('label[for="studio-type"]').htmlFor='style-trigger';
 const trigger=wrapper.querySelector('.style-trigger');const panel=wrapper.querySelector('.style-panel');const search=wrapper.querySelector('input');const list=wrapper.querySelector('.style-list');let visible=[];let active=-1;
 function render(){const q=search.value.trim().toLocaleLowerCase();visible=products.filter(p=>(p.name+' '+p.subtitle+' '+p.categoryName).toLocaleLowerCase().includes(q));active=visible.findIndex(p=>p.id===select.value);
 list.innerHTML=visible.map(p=>`<div id="style-option-${p.id}" class="style-option" role="option" aria-selected="${p.id===select.value}" data-value="${p.id}"><span class="style-thumb"><span class="atlas" style="background-image:url('${p.variants[0].image}');background-position:0% 0%" aria-hidden="true"></span></span><span class="style-option-name">${p.name}</span><span class="style-check" aria-hidden="true">✓</span></div>`).join('');wrapper.querySelector('.style-empty').hidden=visible.length>0;highlight(false);}
 function highlight(scroll=true){list.querySelectorAll('.style-option').forEach((row,i)=>row.classList.toggle('keyboard-active',i===active));if(active>=0){search.setAttribute('aria-activedescendant','style-option-'+visible[active].id);if(scroll)document.getElementById('style-option-'+visible[active].id).scrollIntoView({block:'nearest'});}else search.removeAttribute('aria-activedescendant');}
 function sync(){const p=products.find(p=>p.id===select.value);trigger.querySelector('span').textContent=p.name;trigger.setAttribute('aria-label','סגנון הפרחים: '+p.name);}
 function close(focus=false){panel.hidden=true;trigger.setAttribute('aria-expanded','false');search.setAttribute('aria-expanded','false');if(focus)trigger.focus();}
 function open(){search.value='';render();panel.hidden=false;trigger.setAttribute('aria-expanded','true');search.setAttribute('aria-expanded','true');search.focus();}
 function choose(id){select.value=id;select.dispatchEvent(new Event('change',{bubbles:true}));sync();close(true);}
 trigger.addEventListener('click',()=>panel.hidden?open():close());
 trigger.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open();}});
 search.addEventListener('input',render);
 search.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(visible.length){active=(active+(e.key==='ArrowDown'?1:-1)+visible.length)%visible.length;highlight();}}else if(e.key==='Home'||e.key==='End'){e.preventDefault();active=e.key==='Home'?0:visible.length-1;highlight();}else if(e.key==='Enter'){e.preventDefault();if(visible[active])choose(visible[active].id);}});
 list.addEventListener('click',e=>{const row=e.target.closest('[data-value]');if(row)choose(row.dataset.value);});
 wrapper.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close(true);}});
 wrapper.addEventListener('focusout',()=>setTimeout(()=>{if(!wrapper.contains(document.activeElement))close();},0));
 document.addEventListener('pointerdown',e=>{if(!wrapper.contains(e.target))close();});window.addEventListener('hashchange',()=>close());select.addEventListener('change',sync);sync();
})();
