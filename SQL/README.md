# HK251_DatabaseSystem_Assignment2
Create database and build an application for online learning course web. 

# Hướng dẫn Cài đặt Cơ sở dữ liệu (Database Setup)

Để khởi tạo CSDL thành công, vui lòng thực hiện theo các bước sau:

## Tạo Database Từ Đầu

### Bước 1: Tạo Database rỗng
Mở SQL Server Management Studio và chạy lệnh:
```sql
CREATE DATABASE ElearningDB;
GO
USE ElearningDB;
GO
```

### Bước 2: Chạy Script Tạo Bảng
Tìm và thực thi file: `01_Run_Tables.sql`
- **Mục đích:** Tạo cấu trúc toàn bộ 19 bảng trong database.
- **Nội dung:** Tạo tables với Primary Key, Auto-increment, CHECK constraints, DEFAULT values.

### Bước 3: Chạy Script Tạo Khóa Ngoại
Tìm và thực thi file: `02_Run_FK.sql`
- **Mục đích:** Thiết lập các mối quan hệ (Foreign Key) giữa các bảng.
- **Nội dung:** 127 dòng ALTER TABLE ADD CONSTRAINT với CASCADE options.

### Bước 4: Chạy Script Chèn Dữ Liệu Mẫu
Tìm và thực thi file: `03_Run_InsertData.sql`
- **Mục đích:** Thêm dữ liệu mẫu vào các bảng để test chức năng.
- **Nội dung:** 6 users, 5 courses, 5 chapters, 2 teachers, test attempts, enrollments, ratings.
- **Lưu ý:** Script này phải chạy SAU khi đã tạo Bảng và Khóa ngoại thành công.

### Bước 5: Chạy Script Tạo Functions, Stored Procedures, Triggers
Tìm và thực thi file: `04_Run_Programmability.sql`
- **Mục đích:** Tạo các đối tượng programmability cho PART 2 của assignment.
- **Nội dung:** 
  - 2 Functions: `fn_CalculateStudentAvgScore`, `fn_GetCoursesByTeacher`
  - 2 Stored Procedures: `sp_GetTopStudents`, `sp_EnrollCourse`
  - 2 Triggers: `trg_UpdateNumStudents`, `trg_CheckRatingCondition`

### Bước 6: Chạy Script Tạo User cho Application
Tìm và thực thi file: `05_CreateUser.sql`
- **Mục đích:** Tạo user `sManager` với quyền quản trị database (PART 3 requirement).
- **Thông tin đăng nhập:** 
  - Username: `sManager`
  - Password: `sManager123!`
  - Role: `db_owner`

---

## Xóa và Rebuild Database

Nếu bạn muốn xóa database hiện tại và tạo lại từ đầu:

### Bước 1: Xóa Database
```sql
-- Ngắt kết nối tất cả users đang kết nối
-- Xóa database
DROP DATABASE ElearningDB;
GO
```

### Bước 2: Sau đó chạy lại từ Bước 1 đến Bước 6 ở trên.

---

