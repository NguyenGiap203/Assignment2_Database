FE ADMIN PANEL – HỆ THỐNG QUẢN TRỊ (HTML/CSS/JS)

1. CÁCH CHẠY DỰ ÁN
-----------------------------------
- Mở file: admin/index.html
- Đăng nhập bằng tài khoản:
    username: sManager
    password: sManager

2. CẤU TRÚC DỰ ÁN
-----------------------------------
/admin
  /pages      – các trang HTML
  /js         – xử lý logic bằng JavaScript
  /css        – giao diện
  db.js       – file chứa dữ liệu (localStorage)

3. HỆ THỐNG DỮ LIỆU (LOCALSTORAGE)
-----------------------------------
- Dữ liệu được sinh tự động từ file db.js (seed data).
- Nếu thay đổi db.js hoặc dữ liệu bị lỗi:
    → Mở Console (F12) → gõ: localStorage.clear()
    → Reload lại trang.

4. CÁC CHỨC NĂNG CHÍNH
-----------------------------------
• Quản lý Người dùng:
  - Xem danh sách, lọc, xem chi tiết.
  - Admin chỉ được sửa role + trạng thái, không sửa thông tin khác.

• Quản lý Khóa học:
  - Xem danh sách, xem chi tiết, xem chương, video, bài tập, bài kiểm tra.
  - Admin chỉ được đổi trạng thái hoặc xóa khóa.

• Bài luyện tập (Practice):
  - Xem chi tiết, lịch sử người làm bài.
  - Chỉ sửa trạng thái hoặc xóa.

• Bài tập (Exercise):
  - Thuộc từng chương.
  - Xem chi tiết và lịch sử làm bài.

• Bài kiểm tra (Test):
  - Mỗi chương có 1 bài kiểm tra.
  - Xem danh sách câu hỏi, đáp án.
  - Admin chỉ được xóa câu hỏi hoặc đáp án.

• Bài chia sẻ (Post):
  - Xem bài viết, bình luận, bình luận con.
  - Admin chỉ đổi trạng thái hoặc xóa.

5. LƯU Ý
-----------------------------------
- Không có backend thật. Mọi dữ liệu lưu trong localStorage.
- Nếu giao diện không hiện dữ liệu mới, hãy clear localStorage.

6. RESET DỮ LIỆU
-----------------------------------
Bước 1: F12 → Console  
Bước 2: chạy lệnh:
    localStorage.clear();
Bước 3: Reload trang

-----------------------------------
HẾT
