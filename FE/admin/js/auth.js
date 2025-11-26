// auth.js
function login() {
  const u = document.getElementById('user').value.trim();
  const p = document.getElementById('pass').value.trim();
  const msg = document.getElementById('msg');

  if (!u || !p) { msg.innerText = 'Nhập username và password'; return; }

  // Default admin account for demo per assignment
  if (u === 'sManager' && p === 'sManager') {
    localStorage.setItem('token', 'sManager-token');
    // redirect to course list
    window.location.href = './pages/course-list.html';
  } else {
    msg.innerText = 'Sai tài khoản hoặc mật khẩu';
  }
}
