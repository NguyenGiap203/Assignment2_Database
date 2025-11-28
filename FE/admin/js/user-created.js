(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){return document.getElementById(id);}

function loadUserCreated(){
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId');
  const type = params.get('type'); // 'exercises' or 'courses'
  if(!userId){ location.href='user-list.html'; return; }

  el('uc_title').innerText = `Nội dung tạo bởi ${userId}`;

  let rows = [];
  if(type === 'exercises'){
    const items = read(DB_KEYS.exercises).filter(e=>e.createdBy===userId);
    rows = items.map(i=>`<tr><td>${i.id}</td><td>${i.title}</td><td>Exercise</td><td>-</td></tr>`);
  } else {
    const items = read(DB_KEYS.courses).filter(c=>c.createdBy===userId);
    rows = items.map(i=>`<tr><td>${i.id}</td><td><a href="course-detail.html?id=${i.id}">${i.title}</a></td><td>Course</td><td>-</td></tr>`);
  }

  el('uc_tbody').innerHTML = rows.join('') || '<tr><td colspan="4">Không có</td></tr>';
}

window.addEventListener('load', loadUserCreated);
