// exercise-form.js (edit status only)
(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){ return document.getElementById(id); }

function populateExerciseForm(){
  if(!el('ef_id')) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) { location.href='exercise-list.html'; return; }

  const arr = read(DB_KEYS.exercises);
  const e = arr.find(x=>x.id===id);
  if(!e) { location.href='exercise-list.html'; return; }

  el('ef_id').value = e.id;
  el('ef_title_input').value = e.title || '';
  el('ef_desc').value = e.description || '';
  el('ef_status').value = e.status || 'active';
}

function saveExercise(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) { location.href='exercise-list.html'; return; }

  const arr = read(DB_KEYS.exercises);
  const e = arr.find(x=>x.id===id);
  e.status = el('ef_status').value;
  write(DB_KEYS.exercises, arr);
  location.href='exercise-list.html';
}

window.addEventListener('load', populateExerciseForm);
