// test-detail.js — show test info + questions accordion; admin may DELETE Q/A but not edit
(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){ return document.getElementById(id); }

function loadTestDetail(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) return location.href='test-list.html';

  const tests = read(DB_KEYS.tests);
  const chapters = read(DB_KEYS.chapters);
  const questions = read(DB_KEYS.testQuestions);
  const answers = read(DB_KEYS.testAnswers);

  const t = tests.find(x=>x.id===id);
  if(!t) return location.href='test-list.html';

  el('td_id').value = t.id;
  el('td_title').value = t.title;
  el('td_desc').value = t.description || '';
  el('td_status').value = t.status || '';

  const ch = chapters.find(c=>c.id===t.chapterId) || {};
  el('td_chapter').value = ch.title ? `${ch.title} (${ch.id})` : t.chapterId;

  // Render questions as accordion
  const qs = questions.filter(q => q.testId === id);
  el('td_questions').innerHTML = qs.map(q => {
    // collect answers for this question
    const ans = answers.filter(a => a.questionId === q.id);
    const ansHtml = ans.map(a => {
      const cls = a.isCorrect ? 'ans correct' : 'ans wrong';
      // Admin can delete answer
      return `<div class="${cls}">
        <strong>${a.content}</strong>
        ${a.isCorrect ? '<span style="margin-left:8px;color:green">(Đúng)</span>' : ''}
        <button class="small-btn" onclick="deleteAnswer('${a.id}')">Xóa</button>
      </div>`;
    }).join('');

    // question block: delete question allowed
    return `
      <div class="q-item" id="q_${q.id}">
        <div class="q-head" onclick="toggleQ('${q.id}')">
          <h4>${q.id} — ${escapeHtml(q.content)}</h4>
          <div>
            <button class="small-btn" onclick="event.stopPropagation(); deleteQuestion('${q.id}')">Xóa câu hỏi</button>
            <button class="small-btn" onclick="event.stopPropagation(); toggleQ('${q.id}')">Xem/Ẩn</button>
          </div>
        </div>
        <div class="q-body" id="qb_${q.id}">
          <div style="margin:8px 0;">${ansHtml}</div>
        </div>
      </div>
    `;
  }).join('');
}

// toggle question body
function toggleQ(qid){
  const body = el('qb_' + qid);
  if(!body) return;
  body.style.display = (body.style.display === 'block') ? 'none' : 'block';
}

// delete question (admin only) — also cascade delete answers of that question
function deleteQuestion(qid){
  if(!confirm('Xóa câu hỏi ' + qid + ' ?')) return;
  // remove question
  let qs = read(DB_KEYS.testQuestions).filter(q=>q.id!==qid);
  write(DB_KEYS.testQuestions, qs);
  // remove answers
  let as = read(DB_KEYS.testAnswers).filter(a=>a.questionId!==qid);
  write(DB_KEYS.testAnswers, as);
  // re-render
  loadTestDetail();
}

// delete single answer
function deleteAnswer(aid){
  if(!confirm('Xóa đáp án ' + aid + ' ?')) return;
  let as = read(DB_KEYS.testAnswers).filter(a=>a.id!==aid);
  write(DB_KEYS.testAnswers, as);
  loadTestDetail();
}

function escapeHtml(text){
  if(!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

window.addEventListener('load', loadTestDetail);
