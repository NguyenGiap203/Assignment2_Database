(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){return document.getElementById(id);}

function loadUserComments(){
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId');
  if(!userId){ location.href='user-list.html'; return; }

  const comments = read(DB_KEYS.comments).filter(c=>c.userId===userId);
  const posts = read(DB_KEYS.posts);
  const courses = read(DB_KEYS.courses);
  const users = read(DB_KEYS.users);

  el('ucm_title').innerText = `Bình luận của ${userId} — ${comments.length}`;

  el('ucm_tbody').innerHTML = comments.map(c=>{
    let place = '';
    if(c.targetType === 'post'){ const p = posts.find(x=>x.id===c.targetId); place = `Post: ${p ? p.title : c.targetId}`; }
    else if(c.targetType === 'course'){ const co = courses.find(x=>x.id===c.targetId); place = `Course: ${co ? co.title : c.targetId}`; }
    let note = '';
    if(c.parentCommentId){
      const parent = read(DB_KEYS.comments).find(x=>x.id===c.parentCommentId);
      const parentUser = parent ? users.find(u=>u.id===parent.userId) : null;
      if(parentUser) note = `Đã trả lời bình luận của ${parentUser.username}`;
    }
    return `<tr>
      <td>${c.id}</td>
      <td>${c.content}</td>
      <td>${place}</td>
      <td>${note}</td>
      <td>${c.createdAt || ''}</td>
    </tr>`;
  }).join('');
}

window.addEventListener('load', loadUserComments);
