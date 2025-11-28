(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){return document.getElementById(id);}

function loadUserReviews(){
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId');
  if(!userId) { location.href='user-list.html'; return; }

  const revs = read(DB_KEYS.reviews).filter(r=>r.userId===userId);
  const courses = read(DB_KEYS.courses);
  el('ur_title').innerText = `Đánh giá của ${userId} — ${revs.length}`;

  el('ur_tbody').innerHTML = revs.map(r=>{
    const c = courses.find(x=>x.id===r.courseId) || {};
    return `<tr>
      <td>${r.id}</td>
      <td><a href="course-detail.html?id=${c.id}">${c.title || r.courseId}</a></td>
      <td>${r.rating}</td>
      <td>${r.comment || ''}</td>
      <td>${r.createdAt || ''}</td>
    </tr>`;
  }).join('');
}

window.addEventListener('load', loadUserReviews);
