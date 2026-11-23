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
