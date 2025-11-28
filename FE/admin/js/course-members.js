(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){return document.getElementById(id);}

function loadMembers(){
  const params = new URLSearchParams(location.search);
  const courseId = params.get('courseId');
  if (!courseId) { location.href='course-list.html'; return; }

  const enrollments = read(DB_KEYS.enrollments).filter(en => en.courseId===courseId);
  const users = read(DB_KEYS.users);

  const courses = read(DB_KEYS.courses);
  const course = courses.find(c=>c.id===courseId);
  el('cm_title').innerText = `Người tham gia: ${course ? course.title : courseId}`;

  el('cm_tbody').innerHTML = enrollments.map(en => {
    const u = users.find(x=>x.id===en.userId) || {};
    return `<tr>
      <td>${en.userId}</td>
      <td>${u.username || ''}</td>
      <td>${u.fullname || ''}</td>
      <td>${en.joinedAt || ''}</td>
    </tr>`;
  }).join('');
}

window.addEventListener('load', loadMembers);
