// user-detail.js (updated links for practice naming)
(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();
function el(id){ return document.getElementById(id); }

function loadUserDetail(){
  const params = new URLSearchParams(location.search);
  const userId = params.get('id');
  if(!userId){ location.href='user-list.html'; return; }

  const users = read(DB_KEYS.users);
  const user = users.find(u=>u.id===userId);
  if(!user){ location.href='user-list.html'; return; }

  el('ud_id').value = user.id;
  el('ud_username').value = user.username;
  el('ud_fullname').value = user.fullname || '';
  el('ud_email').value = user.email || '';
  el('ud_phone').value = user.phone || '';
  el('ud_role').value = (user.role || 'normal');
  el('ud_status').value = user.status || '';
  el('ud_joined').value = user.joinedDate || '';

  // counts and links
  const enrolls = read(DB_KEYS.enrollments).filter(e=>e.userId===userId);
  el('ud_en_count').innerText = enrolls.length;
  el('ud_en_count').href = `user-courses.html?userId=${userId}`;

  const reviews = read(DB_KEYS.reviews).filter(r=>r.userId===userId);
  el('ud_rev_count').innerText = reviews.length;
  el('ud_rev_count').href = `user-reviews.html?userId=${userId}`;

  const pcs = read(DB_KEYS.practicesCompleted).filter(ec=>ec.userId===userId);
  el('ud_ex_done_count').innerText = pcs.length;
  el('ud_ex_done_count').href = `user-practices.html?userId=${userId}`;

  const testsDone = read(DB_KEYS.testsCompleted).filter(t=>t.userId===userId);
  el('ud_tests_count').innerText = testsDone.length;
  el('ud_tests_count').href = `user-tests.html?userId=${userId}`;

  const posts = read(DB_KEYS.posts).filter(p=>p.authorId===userId);
  el('ud_posts_count').innerText = posts.length;
  el('ud_posts_count').href = `user-posts.html?userId=${userId}`;

  const comments = read(DB_KEYS.comments).filter(c=>c.userId===userId);
  el('ud_comments_count').innerText = comments.length;
  el('ud_comments_count').href = `user-comments.html?userId=${userId}`;

  // teacher-only
  if((user.role||'normal') === 'teacher'){
    document.getElementById('ud_teacher_block').style.display = 'block';
    document.getElementById('ud_teacher_block2').style.display = 'block';

    const createdPr = read(DB_KEYS.practices).filter(e=>e.createdBy===userId);
    el('ud_created_ex_count').innerText = createdPr.length;
    el('ud_created_ex_count').href = `user-created.html?userId=${userId}&type=practices`;

    const createdCourses = read(DB_KEYS.courses).filter(c=>c.createdBy===userId);
    el('ud_created_courses_count').innerText = createdCourses.length;
    el('ud_created_courses_count').href = `user-created.html?userId=${userId}&type=courses`;
  } else {
    document.getElementById('ud_teacher_block').style.display = 'none';
    document.getElementById('ud_teacher_block2').style.display = 'none';
  }
}

window.addEventListener('load', loadUserDetail);
