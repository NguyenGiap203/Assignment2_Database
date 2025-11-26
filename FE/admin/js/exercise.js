// exercise.js
(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
const EKEY = DB_KEYS.exercises;
function el(id){ return document.getElementById(id); }

function renderExercises(){
  if(!el('ex_tbody')) return;
  const list = read(EKEY);
  const chapters = read(DB_KEYS.chapters);
  const users = read(DB_KEYS.users);

  const q = (el('ex_search')?.value || '').toLowerCase();
  const status = el('ex_status')?.value || '';

  const filtered = list.filter(e=>{
    if(status && e.status !== status) return false;
    if(!q) return true;
    return e.id.toLowerCase().includes(q) ||
           (e.title||'').toLowerCase().includes(q) ||
           (chapters.find(ch=>ch.id===e.chapterId)?.title||'').toLowerCase().includes(q);
  });

  el('ex_tbody').innerHTML = filtered.map(e=>{
    const ch = chapters.find(c=>c.id===e.chapterId) || {};
    const author = users.find(u=>u.id===e.createdBy) || {};
    return `<tr>
      <td>${e.id}</td>
      <td><a href="exercise-detail.html?id=${e.id}">${e.title}</a></td>
      <td>${e.difficulty || ''}</td>
      <td>${ch.title || e.chapterId}</td>
      <td><a href="user-detail.html?id=${author.id}">${author.username || e.createdBy}</a></td>
      <td>${e.status || ''}</td>
      <td class="actions">
        <button onclick="editExercise('${e.id}')">Sửa</button>
        <button onclick="deleteExercise('${e.id}')">Xóa</button>
      </td>
    </tr>`;    
  }).join('');
}

function editExercise(id){
  location.href = `exercise-form.html?id=${id}`;
}

function deleteExercise(id){
  if(!confirm('Xác nhận xóa exercise ' + id + '?')) return;
  let arr = read(EKEY);
  arr = arr.filter(x=>x.id!==id);
  write(EKEY, arr);
  renderExercises();
}

window.addEventListener('load', renderExercises);
