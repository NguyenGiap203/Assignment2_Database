// practice.js (loại bỏ chapter)
(function ensureAuth(){ if(!localStorage.getItem('token')) location.href='../index.html'; })();

const PKEY = DB_KEYS.practices;
function el(id){ return document.getElementById(id); }

function renderPractices(){
  if(!el('p_tbody')) return;

  const list = read(PKEY);
  const users = read(DB_KEYS.users);

  const q = (el('p_search')?.value || '').toLowerCase();
  const status = el('p_status')?.value || '';

  const filtered = list.filter(p=>{
    if(status && p.status !== status) return false;
    if(!q) return true;
    return p.id.toLowerCase().includes(q) ||
           (p.title||'').toLowerCase().includes(q);
  });

  el('p_tbody').innerHTML = filtered.map(p=>{
    const author = users.find(u=>u.id===p.createdBy) || {};

    return `
      <tr>
        <td>${p.id}</td>
        <td><a href="practice-detail.html?id=${p.id}">${p.title}</a></td>
        <td>${p.difficulty || ''}</td>
        <td><a href="user-detail.html?id=${author.id}">${author.username || p.createdBy}</a></td>
        <td>${p.status || ''}</td>
        <td class="actions">
          <button onclick="editPractice('${p.id}')">Sửa</button>
          <button onclick="deletePractice('${p.id}')">Xóa</button>
        </td>
      </tr>
    `;
  }).join('');
}

function editPractice(id){
  location.href = `practice-form.html?id=${id}`;
}

function deletePractice(id){
  if(!confirm('Xác nhận xóa practice ' + id + '?')) return;
  let arr = read(PKEY);
  arr = arr.filter(x=>x.id!==id);
  write(PKEY, arr);
  renderPractices();
}

window.addEventListener('load', renderPractices);
