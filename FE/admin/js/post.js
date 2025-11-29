// post.js — list + edit status + delete
(function ensureAuth(){ 
  if(!localStorage.getItem('token')) location.href='../index.html';
})();
function el(id){ return document.getElementById(id); }

function renderPosts(){
  if(!el('post_tbody')) return;

  const posts = read(DB_KEYS.posts);
  const users = read(DB_KEYS.users);

  const q = (el('post_search')?.value || '').toLowerCase();
  const status = el('post_status')?.value || '';

  const filtered = posts.filter(p=>{
    if(status && p.status !== status) return false;
    if(!q) return true;
    const author = users.find(u=>u.id===p.authorId) || {};
    return p.id.toLowerCase().includes(q) ||
           (p.title||'').toLowerCase().includes(q) ||
           (author.username||'').toLowerCase().includes(q);
  });

  el('post_tbody').innerHTML = filtered.map(p=>{
    const author = users.find(u=>u.id===p.authorId) || {};
    return `
      <tr>
        <td>${p.id}</td>
        <td><a href="post-detail.html?id=${p.id}">${p.title}</a></td>
        <td><a href="user-detail.html?id=${author.id}">${author.username || p.authorId}</a></td>
        <td>${p.status || ''}</td>
        <td>${p.createdAt || ''}</td>
        <td class="actions">
          <button onclick="editPost('${p.id}')">Sửa</button>
          <button onclick="deletePost('${p.id}')">Xóa</button>
        </td>
      </tr>
    `;
  }).join('');
}

function editPost(id){
  location.href = `post-form.html?id=${id}`;
}

function deletePost(id){
  if(!confirm('Xác nhận xóa bài chia sẻ ' + id + '?')) return;
  let arr = read(DB_KEYS.posts);
  arr = arr.filter(p=>p.id !== id);
  write(DB_KEYS.posts, arr);
  renderPosts();
}

window.addEventListener('load', renderPosts);
