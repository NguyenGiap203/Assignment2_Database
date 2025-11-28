# HK251_DatabaseSystem_Assignment2
Create database and build an application for online learning course web. 

# Hướng dẫn Cài đặt Cơ sở dữ liệu (Database Setup)

Để khởi tạo CSDL thành công, vui lòng thực hiện theo các bước sau:

### Bước 1: Tạo Database rỗng
Mở SQL Server và chạy lệnh:
CREATE DATABASE ONLINE_LEARNING_DB;
GO
USE ONLINE_LEARNING_DB;
GO

### Bước 2: Chạy Script Tạo Bảng
Tìm và thực thi file: `SCRIPTS_TO_RUN/01_Init_Tables.sql`
- Mục đích: Tạo cấu trúc toàn bộ các bảng.

### Bước 3: Chạy Script Tạo Khóa Ngoại
Tìm và thực thi file: `SCRIPTS_TO_RUN/02_Init_Constraints.sql`
- Mục đích: Thiết lập các mối quan hệ (Foreign Key) giữa các bảng.

### Bước 4: Chạy Script Chèn Dữ Liệu Mẫu
Tìm và thực thi file: `03_Run_InsertData.sql`
- Mục đích: Thêm dữ liệu mẫu vào các bảng để test chức năng.
- Lưu ý: Script này phải chạy SAU khi đã tạo Bảng và Khóa ngoại thành công.

---
**Lưu ý:** Vui lòng tuân thủ đúng thứ tự (Bước 2 trước, Bước 3 sau) để tránh lỗi tham chiếu.
