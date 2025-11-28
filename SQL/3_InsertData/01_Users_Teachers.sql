-- 1. Chèn dữ liệu bảng USERTABLE (6 dòng)
INSERT INTO USERTABLE (UserID, AccountName, AccountPassword, FullName, Email, PhoneNumber, Nation, Province, Ward, EnrollmentDate, AccountState) VALUES 
('US001', 'teacher_minh', 'hash123', N'Nguyễn Nhật Minh', 'minh.nguyen@edu.vn', '0909111222', N'Việt Nam', N'TP.HCM', N'Quận 1', '2023-01-01', 1),
('US002', 'teacher_hang', 'hash123', N'Phạm Thu Hằng', 'hang.pham@edu.vn', '0909333444', N'Việt Nam', N'Hà Nội', N'Đống Đa', '2023-02-15', 1),
('US003', 'student_nam', 'hash456', N'Trần Văn Nam', 'nam.tran@gmail.com', '0912000001', N'Việt Nam', N'Đà Nẵng', N'Hải Châu', '2023-06-01', 1),
('US004', 'student_lan', 'hash456', N'Lê Thị Lan', 'lan.le@gmail.com', '0912000002', N'Việt Nam', N'Cần Thơ', N'Ninh Kiều', '2023-06-05', 1),
('US005', 'student_hung', 'hash456', N'Võ Quốc Hưng', 'hung.vo@gmail.com', '0912000003', N'Việt Nam', N'Bình Dương', N'Dĩ An', '2023-07-10', 1),
('US006', 'student_mai', 'hash456', N'Hoàng Ngọc Mai', 'mai.hoang@gmail.com', '0912000004', N'Việt Nam', N'TP.HCM', N'Thủ Đức', '2023-08-20', 1);

-- 2. Chèn dữ liệu bảng TEACHER (2 dòng - Tham chiếu US001, US002)
-- Lưu ý: Bảng này chỉ có TeacherID là khóa chính
INSERT INTO TEACHER (TeacherID) VALUES 
('US001'),
('US002');

-- 3. Chèn dữ liệu bảng TEACHER_EDUCATION (4 dòng - Đủ yêu cầu)
-- US001 có 2 bằng, US002 có 2 bằng
INSERT INTO TEACHER_EDUCATION (TeacherID, Degree, Major, School, StartTime, EndTime) VALUES 
('US001', N'Cử nhân', N'Khoa học Máy tính', N'Đại học Bách Khoa TP.HCM', '2010-09-01', '2014-06-30'),
('US001', N'Thạc sĩ', N'Trí tuệ Nhân tạo', N'Đại học Quốc gia Singapore', '2015-09-01', '2017-05-30'),
('US002', N'Cử nhân', N'Sư phạm Anh', N'Đại học Sư phạm Hà Nội', '2012-09-01', '2016-06-30'),
('US002', N'Thạc sĩ', N'Ngôn ngữ học', N'Đại học Hà Nội', '2017-09-01', '2019-12-30');

-- SELECT * FROM USERTABLE; 
-- SELECT * FROM TEACHER;
-- SELECT * FROM TEACHER_EDUCATION;