// post-detail.js
(function ensureAuth(){ 
  if(!localStorage.getItem('token')) location.href='../index.html';
})();

function el(id){ return document.getElementById(id); }

function loadPostDetail(){
  const params = new URLSearchParams(location.search);
  const postId = params.get('id');
  if(!postId) return history.back();

  const posts = read(DB_KEYS.posts);
  const users = read(DB_KEYS.users);
  const comments = read(DB_KEYS.comments);

  const post = posts.find(p=>p.id===postId);
  if(!post) return history.back();

  // Fill fields
  el('pd_id').value = post.id;
  el('pd_title').value = post.title;
  el('pd_content').value = post.content;
  el('pd_date').value = post.createdAt;
  el('pd_status').value = post.status;

  const author = users.find(u=>u.id===post.authorId);
  el('pd_author').innerText = author ? author.username : post.authorId;
  el('pd_author').href = `user-detail.html?id=${author?.id || post.authorId}`;

  // Comments of this post
  const cmtList = comments.filter(c=>c.targetType==='post' && c.targetId===postId);
  el('cmt_header').innerText = `Bình luận (${cmtList.length})`;

  el('pd_cmt_body').innerHTML = cmtList.map(c => {

  const u = users.find(x => x.id === c.userId);

  // Target ID (khóa học, bài chia sẻ,...)
  const targetId = c.targetId || "-";

  // Ghi chú: trả lời comment nào?
  let note = "";
  if (c.parentCommentId) {
    note = `Trả lời bình luận ${c.parentCommentId}`;
  }

  return `
    <tr>
      <td>${c.id}</td>
      <td>${c.content}</td>
      <td><a href="user-detail.html?id=${u?.id}">${u?.username || c.userId}</a></td>

      <!-- Thuộc -->
      <td>${targetId}</td>

      <!-- Ghi chú -->
      <td>${note}</td>

      <td>${c.createdAt}</td>
    </tr>
  `;
}).join('');
}

window.addEventListener('load', loadPostDetail);
