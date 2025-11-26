// exercise-detail.js
(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){ return document.getElementById(id); }

function loadExerciseDetail(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) return location.href='exercise-list.html';

  const exercises = read(DB_KEYS.exercises);
  const users = read(DB_KEYS.users);
  const chapters = read(DB_KEYS.chapters);
  const history = read(DB_KEYS.exercisesCompleted).filter(h=>h.exerciseId===id);

  const e = exercises.find(x=>x.id===id);
  if(!e) return location.href='exercise-list.html';

  el('ed_id').value = e.id;
  el('ed_title').value = e.title;
  el('ed_desc').value = e.description || '';
  el('ed_diff').value = e.difficulty || '';
  el('ed_status').value = e.status || '';

  const ch = chapters.find(c=>c.id===e.chapterId) || {};
  el('ed_chapter').value = ch.title ? `${ch.title} (${ch.id})` : e.chapterId;

  const author = users.find(u=>u.id===e.createdBy) || {};
  el('ed_author').innerText = author.username || e.createdBy;
  el('ed_author').href = `user-detail.html?id=${author.id}`;

  el('ed_history').innerHTML = history.map(h=>{
    const u = users.find(x=>x.id===h.userId) || {};
    return `<tr>
      <td><a href="user-detail.html?id=${u.id}">${u.username || h.userId}</a></td>
      <td>${h.startAt || ''}</td>
      <td>${h.completedAt || ''}</td>
      <td>${h.score ?? '-'}</td>
    </tr>`;
  }).join('');
}

window.addEventListener('load', loadExerciseDetail);
