(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){return document.getElementById(id);}

function loadUserPosts(){
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId');
  if(!userId) { location.href='user-list.html'; return; }

  const posts = read(DB_KEYS.posts).filter(p=>p.authorId===userId);
  el('up_title').innerText = `Bài chia sẻ của ${userId} — ${posts.length}`;

  el('up_tbody').innerHTML = posts.map(p=>{
    return `<tr>
      <td>${p.id}</td>
      <td><a href="post-detail.html?id=${p.id}">${p.title}</a></td>
      <td>${p.createdAt || ''}</td>
    </tr>`;
  }).join('');
}

window.addEventListener('load', loadUserPosts);
