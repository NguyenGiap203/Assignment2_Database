// test.js — list tests; if ?course=CRSxxxx provided, show tests for that course
(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){ return document.getElementById(id); }

function getCourseFromParams(){
  const p = new URLSearchParams(location.search);
  return p.get('course');
}

function renderTests(){
  if(!el('test_tbody')) return;

  const chapterList = read(DB_KEYS.chapters);
  const tests = read(DB_KEYS.tests);
  const q = (el('t_search')?.value || '').toLowerCase();
  const status = el('t_status')?.value || '';
  const courseId = getCourseFromParams();

  // if courseId provided, filter tests to those whose chapter belongs to course
  let filtered = tests.filter(t=>{
    if(status && t.status !== status) return false;
    if(courseId){
      const ch = chapterList.find(c => c.id === t.chapterId);
      if(!ch || ch.courseId !== courseId) return false;
    }
    if(!q) return true;
    return t.id.toLowerCase().includes(q) || (t.title||'').toLowerCase().includes(q);
  });

  el('test_tbody').innerHTML = filtered.map(t=>{
    const ch = chapterList.find(c=>c.id===t.chapterId) || {};
    return `<tr>
      <td>${t.id}</td>
      <td><a href="test-detail.html?id=${t.id}">${t.title}</a></td>
      <td>${ch.title ? ch.title + ' ('+ch.id+')' : t.chapterId}</td>
      <td>${t.status || ''}</td>
      <td class="actions">
        <button onclick="deleteTest('${t.id}')">Xóa</button>
      </td>
    </tr>`;
  }).join('');
}

function deleteTest(id){
  if(!confirm('Xác nhận xóa test ' + id + '?')) return;
  const arr = read(DB_KEYS.tests).filter(x=>x.id!==id);
  write(DB_KEYS.tests, arr);
  renderTests();
}

window.addEventListener('load', renderTests);
