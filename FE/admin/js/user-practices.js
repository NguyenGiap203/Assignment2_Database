// user-practices.js — practice is independent (no chapter/course)
(function ensureAuth(){ 
  if(!localStorage.getItem('token')) location.href='../index.html'; 
})();
function el(id){ return document.getElementById(id); }

function loadUserPractices(){
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId');
  if(!userId){ location.href='user-list.html'; return; }

  const subs = read(DB_KEYS.practicesCompleted).filter(x => x.userId === userId);
  const practices = read(DB_KEYS.practices);

  el('up_title').innerText = `Bài luyện tập của ${userId} — ${subs.length}`;

  el('up_tbody').innerHTML = subs.map(s => {
    const p = practices.find(x => x.id === s.practiceId) || {};

    return `
      <tr>
        <td>${p.id || s.practiceId}</td>
        <td><a href="practice-detail.html?id=${p.id}">${p.title || ''}</a></td>
        <td>${s.completedAt ? 'Completed' : 'Not Completed'}</td>
        <td>${s.score ?? '-'}</td>
      </tr>
    `;
  }).join('');
}

window.addEventListener('load', loadUserPractices);
