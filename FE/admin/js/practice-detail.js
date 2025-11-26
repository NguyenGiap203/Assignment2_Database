// practice-detail.js (loại bỏ chapter)
(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();

function el(id){ return document.getElementById(id); }

function loadPracticeDetail(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) return location.href='practice-list.html';

  const practices = read(DB_KEYS.practices);
  const users = read(DB_KEYS.users);
  const history = read(DB_KEYS.practicesCompleted).filter(h=>h.practiceId===id);

  const p = practices.find(x=>x.id===id);
  if(!p) return location.href='practice-list.html';

  el('pd_id').value = p.id;
  el('pd_title').value = p.title;
  el('pd_desc').value = p.description || '';
  el('pd_diff').value = p.difficulty || '';
  el('pd_status').value = p.status || '';

  const author = users.find(u=>u.id===p.createdBy) || {};
  el('pd_author').innerText = author.username || p.createdBy;
  el('pd_author').href = `user-detail.html?id=${author.id}`;

  el('pd_history').innerHTML = history.map(h=>{
    const u = users.find(x=>x.id===h.userId) || {};
    return `
      <tr>
        <td><a href="user-detail.html?id=${u.id}">${u.username || h.userId}</a></td>
        <td>${h.startAt || ''}</td>
        <td>${h.completedAt || ''}</td>
        <td>${h.score ?? '-'}</td>
      </tr>
    `;
  }).join('');
}

window.addEventListener('load', loadPracticeDetail);
