(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){return document.getElementById(id);}

function loadChapters(){
  const params = new URLSearchParams(location.search);
  const courseId = params.get('courseId');
  if (!courseId) { location.href='course-list.html'; return; }

  const courses = read(DB_KEYS.courses);
  const course = courses.find(c=>c.id===courseId);
  if (!course) { location.href='course-list.html'; return; }
  el('cc_title').innerText = `Chương của: ${course.title}`;

  const chapters = read(DB_KEYS.chapters).filter(ch=>ch.courseId===courseId);
  const exercises = read(DB_KEYS.exercises);
  const videos = read(DB_KEYS.videos);

  el('cc_tbody').innerHTML = chapters.map(ch => {
    const chEx = exercises.filter(e=>e.chapterId===ch.id).length;
    const chVid = videos.filter(v=>v.chapterId===ch.id).length;
    return `<tr>
      <td>${ch.id}</td>
      <td>${ch.title}</td>
      <td><a href="course-chapter-videos.html?courseId=${courseId}&chapterId=${ch.id}">${chVid}</a></td>
      <td><a href="course-chapter-exercises.html?courseId=${courseId}&chapterId=${ch.id}">${chEx}</a></td>
    </tr>`;
  }).join('');
}

window.addEventListener('load', loadChapters);
