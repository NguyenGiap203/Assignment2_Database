(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){return document.getElementById(id);}

function loadVideos(){
  const params = new URLSearchParams(location.search);
  const courseId = params.get('courseId');
  const chapterId = params.get('chapterId');

  const videos = read(DB_KEYS.videos);
  const chapters = read(DB_KEYS.chapters);

  if (chapterId) {
    const ch = chapters.find(x=>x.id===chapterId);
    el('cv_title').innerText = `Videos chương: ${ch ? ch.title : chapterId}`;
  } else if (courseId) {
    el('cv_title').innerText = `Videos khóa: ${courseId}`;
  }

  let list = videos;
  if (chapterId) list = list.filter(v=>v.chapterId===chapterId);
  else if (courseId) {
    const chs = chapters.filter(ch=>ch.courseId===courseId).map(ch=>ch.id);
    list = list.filter(v=> chs.includes(v.chapterId));
  }

  el('cv_tbody').innerHTML = list.map(v => {
    const ch = chapters.find(x=>x.id===v.chapterId);
    return `<tr>
      <td>${v.id}</td>
      <td>${v.title}</td>
      <td>${ch ? `<a href="course-chapters.html?courseId=${ch.courseId}">${ch.title}</a>` : v.chapterId}</td>
      <td>${v.duration}</td>
    </tr>`;
  }).join('');
}

window.addEventListener('load', loadVideos);
