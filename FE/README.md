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

    src/
    ├── api/                        # Cấu hình gọi API
    │   └── axiosClient.ts          # Cấu hình Axios instance, Interceptors (Token)
    ├── components/                 # Các thành phần giao diện tái sử dụng
    │   ├── forms/                  # Các form nhập liệu phức tạp
    │   │   ├── CourseForm.tsx
    │   │   └── UserForm.tsx
    │   ├── layout/                 # Bố cục trang web
    │   │   ├── DetailSection.tsx
    │   │   ├── Header.tsx
    │   │   ├── MainLayout.tsx
    │   │   └── Sidebar.tsx
    │   └── ui/                     # Các UI component cơ bản (Atomic)
    │       ├── Button.tsx
    │       ├── Input.tsx
    │       ├── Modal.tsx
    │       ├── Pagination.tsx
    │       ├── StatCardDetailed.tsx
    │       └── Table.tsx
    ├── context/                    # Quản lý Global State
    │   └── AuthContext.tsx         # Context quản lý đăng nhập/xác thực
    ├── data/                       # Dữ liệu mẫu (Mock data - nếu còn dùng)
    │   ├── course.json
    │   ├── exercise.json
    │   ├── exerciseAttemp.json
    │   └── user.json
    ├── hooks/                      # Custom Hooks
    │   ├── useAuth.ts
    │   ├── useDashboardData.ts     # Logic lấy số liệu tổng quan
    │   ├── useFetch.ts             # Hook gọi API chung
    │   └── usePagination.ts
    ├── pages/                      # Các trang màn hình chính
    │   ├── course/                 # Module Quản lý khóa học
    │   │   ├── components/         # Component riêng cho trang khóa học
    │   │   │   ├── modals/         # Các modal chi tiết (List, Rating, Stats...)
    │   │   │   ├── ChapterList.tsx
    │   │   │   ├── ContentOverview.tsx
    │   │   │   ├── GeneralInfo.tsx
    │   │   │   └── StatsOverview.tsx
    │   │   ├── courseDetail.tsx
    │   │   └── courseList.tsx
    │   ├── exercise/               # Module Bài tập
    │   │   ├── ExerciseDetail.tsx
    │   │   └── ExerciseList.tsx
    │   ├── post/                   # Module Bài viết/Thảo luận
    │   │   ├── PostDetail.tsx
    │   │   └── PostList.tsx
    │   ├── user/                   # Module Quản lý người dùng
    │   │   ├── UserDetail.tsx
    │   │   └── UserList.tsx
    │   ├── Dashboard.tsx           # Trang tổng quan (Trang chủ)
    │   ├── LoginPage.tsx           # Trang đăng nhập
    │   ├── RevenueReport.tsx       # Trang báo cáo doanh thu
    │   └── Statistics.tsx          # Trang thống kê hệ thống
    ├── types/                      # Định nghĩa kiểu dữ liệu (TypeScript Interfaces)
    │   └── course.ts
    ├── utils/                      # Các hàm tiện ích bổ trợ
    │   ├── format.ts               # Định dạng ngày tháng, tiền tệ
    │   └── validation.ts           # Kiểm tra dữ liệu (Email, Password...)
    ├── app.tsx                     # Routing & Cấu hình App chính
    ├── main.tsx                    # Entry point của ứng dụng
    └── index.css                   # Global styles (Tailwind directives)

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
