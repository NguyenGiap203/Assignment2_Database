# ADMIN LEARNING MANAGEMENT SYSTEM (LMS)

## Giới Thiệu Dự Án

Chào mừng đến với **Trang Quản trị (Admin Portal)** của hệ thống LMS.
Đây là nơi quản trị viên quản lý khóa học, người dùng, bài tập và các
nội dung học tập khác.


Dự án được xây dựng dựa trên các công nghệ hiện đại để đảm bảo hiệu năng
và trải nghiệm người dùng tốt nhất:

-   **Framework:** React (Hooks & Functional 
------------------------------------------------------------------------

## Công Nghệ ChínhComponents)\
-   **Styling:** Tailwind CSS (Utility-first CSS framework)\
-   **Routing:** React Router v6\
-   **Icons:** Lucide React / FontAwesome

------------------------------------------------------------------------

## Cấu Trúc Mã Nguồn

Mã nguồn được tổ chức theo hướng moduel hóa để dễ dàng mở rộng:

    /src
    ├── /api                # 🌐 Kết nối và Xử lý Backend (Axios/Fetch)
    │   ├── courseApi.ts    # - Xử lý API liên quan đến Khóa học
    │   ├── userApi.ts      # - Xử lý API liên quan đến Người dùng
    │   └── axiosClient.ts  # - Cấu hình chung cho Axios (interceptors, base URL)
    |
    ├── /assets             # 🖼️ Hình ảnh, Fonts, Styles Global
    │   ├── /images         # - Logo, icon tĩnh
    │   └── /styles         # - Global CSS/SCSS (ví dụ: base reset, font-face)
    |
    ├── /components         # 🧱 Các Component Tái Sử Dụng
    │   ├── /layout         # - Các thành phần giao diện lớn, cố định
    │   │   ├── Header.tsx  # - Thanh điều hướng trên cùng
    │   │   ├── Sidebar.tsx # - Thanh điều hướng bên (Menu chính)
    │   │   └── MainLayout.tsx # - Component chứa Header/Sidebar/Content
    │   └── /ui             # - Các thành phần giao diện nhỏ, cơ bản
    │       ├── Button.tsx  # - Nút bấm
    │       ├── Table.tsx   # - Bảng dữ liệu
    │       ├── Modal.tsx   # - Hộp thoại bật lên
    │       ├── Input.tsx   # - Trường nhập liệu
    │       └── Pagination.tsx # - Phân trang cho dữ liệu
    |
    ├── /hooks              # 🎣 Custom React Hooks (Tái sử dụng Logic)
    │   ├── useAuth.ts      # - Quản lý trạng thái đăng nhập/Token
    │   ├── useFetch.ts     # - Hook gọi API chung
    │   └── usePagination.ts # - Logic phân trang
    |
    ├── /pages              # 🖥️ Các Trang Giao Diện Chính (Views)
    │   ├── /Course         # - Quản lý Khóa học
    │   │   ├── CourseList.tsx 
    │   │   └── CourseDetail.tsx
    │   ├── /User           # - Quản lý Người dùng
    │   │   └── UserList.tsx
    │   ├── /Post           # - Quản lý Bài chia sẻ/Diễn đàn
    │   │   └── PostList.tsx
    │   ├── /Exercise       # - Quản lý Bài tập bắt buộc
    │   │   └── ExerciseList.tsx
    │   └── Dashboard.tsx   # - Trang tổng quan
    |
    ├── /utils              # ⚙️ Các Hàm Tiện Ích & Helper Functions
    │   ├── format.ts       # - Format date, currency, number
    │   └── validation.ts   # - Hàm kiểm tra dữ liệu đầu vào (email, password)
    |
    └── App.tsx             # 🚀 Component gốc & Routing (React Router v6)

------------------------------------------------------------------------

## Phân Quyền & Chức Năng Admin

  -------------------------------------------------------------------------
  Chức năng      Mô tả Chi tiết        Quyền hạn Admin (Giới hạn)
  -------------- --------------------- ------------------------------------
  **Quản lý      Danh sách học viên,   Chỉ được sửa Role & Trạng thái
  Người dùng**   giảng viên            (Active/Ban)

  **Quản lý Khóa Nội dung khóa học,    Chỉ được đổi Trạng thái (Ẩn/Hiện)
  học**          chương, video         hoặc Xóa khóa học

  **Bài luyện    Bài tập tự luyện của  Xem lịch sử làm bài, sửa Trạng thái
  tập            học viên              hoặc Xóa
  (Practice)**                         

  **Bài tập      Bài tập bắt buộc theo Xem chi tiết & lịch sử, không được
  (Exercise)**   chương                sửa nội dung

  **Bài kiểm tra Bài kiểm tra kết thúc Xem câu hỏi/đáp án, chỉ được Xóa câu
  (Test)**       chương                hỏi sai

  **Bài chia sẻ  Diễn đàn thảo luận,   Duyệt bài, đổi Trạng thái hoặc Xóa
  (Post)**       hỏi đáp               bài vi phạm
  -------------------------------------------------------------------------

------------------------------------------------------------------------

## Hướng Dẫn Cài Đặt (Setup)

Làm theo các bước sau để chạy dự án trên máy cục bộ:

### **Yêu cầu tiên quyết**

-   Node.js (Phiên bản LTS trở lên)\
-   npm hoặc yarn

------------------------------------------------------------------------

## Cài đặt

### **Bước 1: Clone dự án**

    git clone https://github.com/username/admin-lms-frontend.git
    cd admin-lms-frontend

### **Bước 2: Cài đặt dependencies**

    pnpm install

### **Bước 3: Khởi chạy dự án**

    pnpm run dev

Truy cập tại:\
👉 **http://localhost:5173**

------------------------------------------------------------------------

## Đóng Góp (Contributing)

1.  Fork dự án\

2.  Tạo branch tính năng mới

        git checkout -b feature/NewFeature

3.  Commit thay đổi

        git commit -m "Add some NewFeature"

4.  Push branch

        git push origin feature/NewFeature

5.  Tạo Pull Request

------------------------------------------------------------------------

**Dự án được phát triển cho mục đích học tập.**
