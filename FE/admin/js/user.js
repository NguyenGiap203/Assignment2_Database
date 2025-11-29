// user.js - chỉ cho sửa role & status

(function ensureAuth() {
    if (!localStorage.getItem('token'))
        window.location.href = '../index.html';
})();

const UKEY = DB_KEYS.users;

// Helper
function el(id) { return document.getElementById(id); }

// =======================
// Render danh sách user
// =======================
function renderUsers() {
    if (!el('u_tbody')) return;

    const list = read(UKEY);

    const q = (el('u_search')?.value || '').toLowerCase();
    const status = el('u_status')?.value || '';
    const role = el('u_role')?.value || '';

    const filtered = list.filter(u => {
        if (status && u.status !== status) return false;
        if (role && u.role !== role) return false;

        if (!q) return true;
        return (
            u.id.toLowerCase().includes(q) ||
            u.username.toLowerCase().includes(q) ||
            (u.fullname || '').toLowerCase().includes(q) ||
            (u.email || '').toLowerCase().includes(q)
        );
    });

    el('u_tbody').innerHTML = filtered.map(u => `
        <tr>
            <td>${u.id}</td>
            <td><a href="user-detail.html?id=${u.id}">${u.username}</a></td>
            <td>${u.fullname || ''}</td>
            <td>${u.email || ''}</td>
            <td>${u.phone || ''}</td>
            <td>${u.role || 'User'}</td>
            <td>${u.status}</td>
            <td>${u.joinedDate || ''}</td>
            <td class="actions">
                <button onclick="editUser('${u.id}')">Sửa</button>
                <button onclick="deleteUser('${u.id}')">Xóa</button>
            </td>
        </tr>
    `).join('');
}

// =======================
// Mở form sửa
// =======================
function editUser(id) {
    location.href = `user-form.html?id=${id}`;
}

// =======================
// Xóa user
// =======================
function deleteUser(id) {
    if (!confirm("Xác nhận xóa người dùng " + id + "?")) return;

    let arr = read(UKEY);
    arr = arr.filter(u => u.id !== id);
    write(UKEY, arr);

    renderUsers();
}

// =======================
// Populate form
// =======================
function populateUserForm() {
    if (!el('u_id')) return; // not on form page

    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    if (!id) {
        location.href = "user-list.html";
        return;
    }

    const arr = read(UKEY);
    const u = arr.find(x => x.id === id);
    if (!u) return;

    el('u_id').value = u.id;
    el('u_username').value = u.username;
    el('u_fullname').value = u.fullname || '';
    el('u_email').value = u.email || '';
    el('u_phone').value = u.phone || '';

    el('u_role').value = u.role || 'User';
    el('u_status').value = u.status;
}

// =======================
// Save changes (ONLY role + status)
// =======================
function saveUser() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    if (!id) {
        location.href = "user-list.html";
        return;
    }

    const arr = read(UKEY);
    const u = arr.find(x => x.id === id);

    // Only update allowed fields
    u.role = el('u_role').value;
    u.status = el('u_status').value;

    write(UKEY, arr);

    location.href = "user-list.html";
}

// =======================
// Auto init
// =======================
window.addEventListener("load", () => {
    renderUsers();
    populateUserForm();
});
