(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){return document.getElementById(id);}

function loadUserCourses(){
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId');
  if(!userId) { location.href='user-list.html'; return; }

  const enrolls = read(DB_KEYS.enrollments).filter(e=>e.userId===userId);
  const courses = read(DB_KEYS.courses);
  el('uc_title').innerText = `Khoá học của ${userId} — ${enrolls.length}`;

  el('uc_tbody').innerHTML = enrolls.map(en => {
    const c = courses.find(x=>x.id===en.courseId) || {};
    return `<tr>
      <td>${c.id || en.courseId}</td>
      <td><a href="course-detail.html?id=${c.id || en.courseId}">${c.title || '[unknown]'}</a></td>
      <td>${en.joinedAt || ''}</td>
      <td>${en.isCompleted ? 'Completed' : 'Not completed'}</td>
    </tr>`;
  }).join('');
}

window.addEventListener('load', loadUserCourses);
