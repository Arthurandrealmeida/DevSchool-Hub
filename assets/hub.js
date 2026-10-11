(() => {
  'use strict';
  const icons = {
    'graduation':'<path d="m2 9 10-5 10 5-10 5L2 9Z" fill="currentColor" stroke="none"/><path d="M6 12v5c4 3 8 3 12 0v-5M2 10v7"/>',
    'home':'<path d="m3 10 9-8 9 8v11h-7v-7h-4v7H3Z" fill="currentColor" stroke="none"/>',
    'book':'<path d="M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Zm0 0v15"/>',
    'file':'<path d="M14 2H5v20h14V7Zm0 0v6h5M8 12h8M8 16h6"/>',
    'gamepad':'<path d="M7 6h10c3 0 5 11 4 13-1 2-4-1-6-3H9c-2 2-5 5-6 3C2 17 4 6 7 6Z"/><path d="M7 9v5m-2-2h4M16 10h.01M19 13h.01"/>',
    'check-square':'<path d="M21 11v9H3V3h13M8 10l4 4L22 3"/>',
    'trophy':'<path d="M7 3h10v5c0 7-10 7-10 0V3Zm5 11v6m-4 1h8M7 5H3v3c0 3 2 4 5 4m9-7h4v3c0 3-2 4-5 4"/>',
    'sparkles':'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM4 2v4M2 4h4m14 14v4m-2-2h4"/>',
    'search':'<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
    'bell':'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>',
    'chevron-down':'<path d="m6 9 6 6 6-6"/>','arrow-right':'<path d="M5 12h14m-5-5 5 5-5 5"/>','chevron-right':'<path d="m9 5 7 7-7 7"/>',
    'clock':'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>','code':'<path d="m8 5-6 7 6 7m8-14 6 7-6 7M14 3l-4 18"/>',
    'grid':'<rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" stroke="none"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" stroke="none"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" stroke="none"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" stroke="none"/>',
    'target':'<circle cx="11" cy="13" r="8"/><circle cx="11" cy="13" r="4"/><path d="m11 13 9-10m-1 0h3v3"/>',
    'quote':'<path d="M4 13h5v7H2v-8c0-5 2-8 7-9v4c-3 1-5 3-5 6Zm13 0h5v7h-7v-8c0-5 2-8 7-9v4c-3 1-5 3-5 6Z" fill="currentColor" stroke="none"/>',
    'menu':'<path d="M4 6h16M4 12h16M4 18h16"/>','x':'<path d="m6 6 12 12M6 18 18 6"/>','plus':'<path d="M12 5v14M5 12h14"/>',
    'play':'<path d="m8 4 12 8-12 8Z" fill="currentColor" stroke="none"/>','crown':'<path d="m3 6 4 5 5-8 5 8 4-5-2 13H5L3 6Zm3 16h12"/>',
    'list':'<path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1"/>','check':'<path d="m5 12 4 4L19 6"/>',
    'calendar':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>','send':'<path d="m3 3 19 9-19 9 4-9-4-9Zm4 9h15"/>',
    'lightbulb':'<path d="M9 18c0-4-4-4-4-9a7 7 0 1 1 14 0c0 5-4 5-4 9Zm0 3h6"/>'
  };
  document.querySelectorAll('[data-icon]').forEach(element => {
    const drawing=icons[element.dataset.icon];
    if(drawing){
      element.innerHTML=`<svg class="hub-icon" viewBox="0 0 24 24" aria-hidden="true">${drawing}</svg>`;
      if(!element.className){
        element.firstElementChild.dataset.icon=element.dataset.icon;
        element.replaceWith(element.firstElementChild);
      }
    }
  });
  const toggle=document.querySelector('.hub-menu-toggle');
  const sidebar=document.querySelector('.sidebar');
  const mainArea=document.querySelector('.main-area');
  const setMenu=open=>{
    document.body.classList.toggle('hub-menu-open',open);
    toggle?.setAttribute('aria-expanded',String(open));
    if(mainArea) mainArea.inert=open;
    if(open) sidebar?.querySelector('a')?.focus();
  };
  toggle?.addEventListener('click',()=>setMenu(!document.body.classList.contains('hub-menu-open')));
  document.querySelectorAll('.hub-scrim,.hub-mobile-close').forEach(element=>element.addEventListener('click',()=>{setMenu(false);toggle?.focus();}));
  document.addEventListener('keydown',event=>{
    if(event.key==='Tab'&&document.body.classList.contains('hub-menu-open')){
      const controls=[...sidebar.querySelectorAll('a[href],button:not([disabled])')];
      const first=controls[0],last=controls[controls.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
    if(event.key==='Escape'){
      if(document.body.classList.contains('hub-menu-open')){setMenu(false);toggle?.focus();}
      document.querySelectorAll('.hub-popover[open]').forEach(element=>element.removeAttribute('open'));
      document.querySelector('.hub-search-results')?.setAttribute('hidden','');
    }
  });
  matchMedia('(min-width: 761px)').addEventListener('change',event=>{if(event.matches)setMenu(false);});
  const search=document.querySelector('.hub-search input');
  const results=document.querySelector('.hub-search-results');
  const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const links=[...document.querySelectorAll('.hub-nav a')];
  const showResults=()=>{
    const query=normalize(search.value.trim());
    results.replaceChildren();results.hidden=!query;
    if(!query)return;
    links.filter(link=>normalize(link.textContent).includes(query)).forEach(link=>{const result=link.cloneNode(true);result.removeAttribute('aria-current');results.append(result);});
    if(!results.children.length){const empty=document.createElement('p');empty.textContent='Nenhuma ferramenta encontrada.';results.append(empty);}
  };
  search?.addEventListener('input',showResults);search?.addEventListener('focus',showResults);
  search?.addEventListener('keydown',event=>{
    // Keep typing in the shared search from triggering a game's shortcuts.
    if(event.key!=='Escape'&&event.key!=='Tab') event.stopPropagation();
  });
  document.querySelector('.hub-search')?.addEventListener('submit',event=>{event.preventDefault();results?.querySelector('a')?.click();});
  document.addEventListener('click',event=>{
    if(!event.target.closest('.hub-search')&&results)results.hidden=true;
    document.querySelectorAll('.hub-popover[open]').forEach(element=>{if(!element.contains(event.target))element.removeAttribute('open');});
  });
  const date=document.querySelector('[data-today]');
  if(date){const text=new Intl.DateTimeFormat('pt-BR',{dateStyle:'full',timeZone:'America/Sao_Paulo'}).format(new Date());date.textContent=text[0].toUpperCase()+text.slice(1);}
  const notesSearch=document.querySelector('.notes-search input');
  notesSearch?.addEventListener('input',()=>{const query=normalize(notesSearch.value);document.querySelectorAll('#notes-area>.card').forEach(card=>{card.hidden=!normalize(card.textContent).includes(query);});});
  const downloads=document.querySelector('button.card-grande2');
  const downloadsPanel=document.querySelector('.cards-container');
  if(downloads&&downloadsPanel){
    downloads.addEventListener('click',()=>downloadsPanel.classList.toggle('hidden'));
    const update=()=>downloads.setAttribute('aria-expanded',String(!downloadsPanel.classList.contains('hidden')));
    new MutationObserver(update).observe(downloadsPanel,{attributes:true,attributeFilter:['class']});update();
  }
})();
