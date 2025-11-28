(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){return document.getElementById(id);}

function loadUserTests(){
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId');
  if(!userId){ location.href='user-list.html'; return; }

  const tcs = read(DB_KEYS.testsCompleted).filter(t=>t.userId===userId);
  const tests = read(DB_KEYS.tests);
  const chapters = read(DB_KEYS.chapters);
  const courses = read(DB_KEYS.courses);

  el('ut_title').innerText = `Bài kiểm tra của ${userId} — ${tcs.length}`;

  el('ut_tbody').innerHTML = tcs.map(tc=>{
    const test = tests.find(x=>x.id===tc.testId) || {};
    const ch = chapters.find(x=>x.id===test.chapterId) || {};
    const course = courses.find(c=>c.id===ch.courseId) || {};
    return `<tr>
      <td>${tc.id}</td>
      <td>${test.title || tc.testId}</td>
      <td>${ch.title || test.chapterId}</td>
      <td><a href="course-detail.html?id=${course.id}">${course.title || ch.courseId}</a></td>
      <td>${tc.score}</td>
      <td>${tc.completedAt || ''}</td>
    </tr>`;
  }).join('');
}

window.addEventListener('load', loadUserTests);
