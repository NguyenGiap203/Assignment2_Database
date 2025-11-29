// test-form.js (edit status only)
(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){ return document.getElementById(id); }

function populateTestForm(){
  if(!el('tf_id')) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) { location.href='test-list.html'; return; }

  const arr = read(DB_KEYS.tests);
  const t = arr.find(x=>x.id===id);
  if(!t) { location.href='test-list.html'; return; }

  el('tf_id').value = t.id;
  el('tf_title_input').value = t.title || '';
  el('tf_desc').value = t.description || '';
  el('tf_status').value = t.status || 'active';
}

function saveTest(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) { location.href='test-list.html'; return; }

  const arr = read(DB_KEYS.tests);
  const t = arr.find(x=>x.id===id);
  t.status = el('tf_status').value;
  write(DB_KEYS.tests, arr);
  location.href='test-list.html';
}

window.addEventListener('load', populateTestForm);
