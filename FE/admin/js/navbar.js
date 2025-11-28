document.getElementById("navbar").innerHTML = `
    <div class="navbar">
        <div class="nav-left">
            <img src="../assets/logo.png" class="logo-img" alt="logo">
            <span class="navbar-title">Admin Panel</span>
        </div>

        <div class="navbar-menu">

            <div class="dropdown">
                <span class="dropbtn">Danh sách ▾</span>
                <div class="dropdown-content">
                    <a href="../pages/user-list.html">Người dùng</a>
                    <a href="../pages/course-list.html">Khóa học</a>
                    <a href="../pages/practice-list.html">Bài luyện tập</a>
                    <a href="../pages/post-list.html">Bài chia sẻ</a>
                </div>
            </div>

            <a class="navbar-logout" onclick="logout()">Đăng xuất</a>
        </div>
    </div>
`;

function logout() {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
}
