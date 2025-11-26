(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){return document.getElementById(id);}

function loadReviews(){
  const params = new URLSearchParams(location.search);
  const courseId = params.get('courseId');
  if (!courseId) { location.href='course-list.html'; return; }

  const reviews = read(DB_KEYS.reviews).filter(r=>r.courseId===courseId);
  const users = read(DB_KEYS.users);
  const courses = read(DB_KEYS.courses);
  const course = courses.find(c=>c.id===courseId);

  el('cr_title').innerText = `Đánh giá: ${course ? course.title : courseId}`;
  if (reviews.length === 0) el('cr_summary').innerText = 'Chưa có đánh giá.';
  else {
    const avg = (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(2);
    el('cr_summary').innerText = `Điểm trung bình: ${avg} — Số đánh giá: ${reviews.length}`;
  }

  el('cr_tbody').innerHTML = reviews.map(r=>{
    const u = users.find(x=>x.id===r.userId)||{};
    return `<tr>
      <td>${r.id}</td>
      <td>${u.username || r.userId}</td>
      <td>${r.rating}</td>
      <td>${r.comment || ''}</td>
      <td>${r.createdAt || ''}</td>
    </tr>`;
  }).join('');
}

window.addEventListener('load', loadReviews);
