(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){return document.getElementById(id);}

function loadUserExercises(){
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId');
  if(!userId) { location.href='user-list.html'; return; }

  const ecs = read(DB_KEYS.exercisesCompleted).filter(e=>e.userId===userId);
  const exercises = read(DB_KEYS.exercises);
  const chapters = read(DB_KEYS.chapters);
  const courses = read(DB_KEYS.courses);

  el('ue_title').innerText = `Bài luyện tập của ${userId} — ${ecs.length}`;

  el('ue_tbody').innerHTML = ecs.map(ec=>{
    const ex = exercises.find(x=>x.id===ec.exerciseId) || {};
    const ch = chapters.find(x=>x.id===ex.chapterId) || {};
    const course = courses.find(c=>c.id===ch.courseId) || {};
    return `<tr>
      <td>${ex.id || ec.exerciseId}</td>
      <td>${ex.title || ''}</td>
      <td>${ch.title || ex.chapterId}</td>
      <td><a href="course-detail.html?id=${course.id}">${course.title || ch.courseId}</a></td>
      <td>${ec.status || ''}</td>
    </tr>`;
  }).join('');
}

window.addEventListener('load', loadUserExercises);
