// post-form.js – admin only edits status
(function ensureAuth(){ 
  if(!localStorage.getItem('token')) location.href='../index.html';
})();

function el(id){ return document.getElementById(id); }

function populateForm(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) return location.href='post-list.html';

  const posts = read(DB_KEYS.posts);
  const p = posts.find(x=>x.id===id);
  if(!p) return location.href='post-list.html';

  el('pf_id').value = p.id;
  el('pf_title').value = p.title;
  el('pf_content').value = p.content;
  el('pf_status').value = p.status || 'active';
}

function savePost(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const arr = read(DB_KEYS.posts);
  const p = arr.find(x=>x.id===id);

  p.status = el('pf_status').value;
  write(DB_KEYS.posts, arr);

  location.href='post-list.html';
}

window.addEventListener('load', populateForm);
