(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){return document.getElementById(id);}

function loadExercises(){
  const params = new URLSearchParams(location.search);
  const courseId = params.get('courseId');
  const chapterId = params.get('chapterId'); // optional

  const exercises = read(DB_KEYS.exercises);
  const chapters = read(DB_KEYS.chapters);

  // title
  if (chapterId) {
    const ch = chapters.find(x=>x.id===chapterId);
    el('ce_title').innerText = `Bài tập của chương: ${ch ? ch.title : chapterId}`;
  } else if (courseId) {
    el('ce_title').innerText = `Bài tập của khóa ${courseId}`;
  }

  // filter: if chapterId given, only that chapter; else all exercises in course
  let list = exercises;
  if (chapterId) list = list.filter(e=>e.chapterId===chapterId);
  else if (courseId) {
    const chs = chapters.filter(ch=>ch.courseId===courseId).map(ch=>ch.id);
    list = list.filter(e=> chs.includes(e.chapterId));
  }

  el('ce_tbody').innerHTML = list.map(e => {
    const ch = chapters.find(x=>x.id===e.chapterId);
    return `<tr>
      <td>${e.id}</td>
      <td>${e.title}</td>
      <td>${ch ? `<a href="course-chapters.html?courseId=${ch.courseId}">${ch.title}</a>` : e.chapterId}</td>
      <td>${e.difficulty}</td>
    </tr>`;
  }).join('');
}

window.addEventListener('load', loadExercises);
