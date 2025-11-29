// practice-form.js (edit status only)
(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){ return document.getElementById(id); }

function populatePracticeForm(){
  if(!el('pf_id')) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) { location.href='practice-list.html'; return; }

  const arr = read(DB_KEYS.practices);
  const p = arr.find(x=>x.id===id);
  if(!p) { location.href='practice-list.html'; return; }

  el('pf_id').value = p.id;
  el('pf_title_input').value = p.title || '';
  el('pf_desc').value = p.description || '';
  el('pf_status').value = p.status || 'active';
}

function savePractice(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) { location.href='practice-list.html'; return; }

  const arr = read(DB_KEYS.practices);
  const p = arr.find(x=>x.id===id);
  p.status = el('pf_status').value;
  write(DB_KEYS.practices, arr);
  location.href='practice-list.html';
}

window.addEventListener('load', populatePracticeForm);
