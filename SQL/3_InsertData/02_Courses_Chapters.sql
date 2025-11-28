-- 1. Chèn dữ liệu bảng COURSE (5 dòng)
INSERT INTO COURSE (CourseID, CourseName, CourseState, TeacherID, TotalDuration, AverageRating, NumStudents) VALUES 
('COU001', N'Lập trình SQL từ cơ bản đến nâng cao', N'Đang mở', 'US001', 1500, 4.8, 120),
('COU002', N'Cấu trúc dữ liệu và giải thuật', N'Đang mở', 'US001', 2000, 4.5, 90),
('COU003', N'Lập trình Web với ReactJS', N'Sắp ra mắt', 'US001', 0, 0, 0),
('COU004', N'Tiếng Anh giao tiếp công sở', N'Đang mở', 'US002', 1200, 4.9, 200),
('COU005', N'Luyện thi TOEIC 650+', N'Đang mở', 'US002', 1800, 4.7, 150);

-- 2. Chèn dữ liệu bảng CHAPTER (5 dòng)
-- Chương cho khóa COU001
INSERT INTO CHAPTER (ChapterID, CourseID, ChapterTitle, ChapterOrder, ChapterDescription) VALUES 
('CHAP01', 'COU001', N'Chương 1: Tổng quan về CSDL', 1, N'Giới thiệu khái niệm Database'),
('CHAP02', 'COU001', N'Chương 2: Truy vấn cơ bản SELECT', 2, N'Học cách lấy dữ liệu');

-- Chương cho khóa COU002
INSERT INTO CHAPTER (ChapterID, CourseID, ChapterTitle, ChapterOrder, ChapterDescription) VALUES 
('CHAP03', 'COU002', N'Chương 1: Độ phức tạp thuật toán', 1, N'Big O Notation');

-- Chương cho khóa COU004
INSERT INTO CHAPTER (ChapterID, CourseID, ChapterTitle, ChapterOrder, ChapterDescription) VALUES 
('CHAP04', 'COU004', N'Unit 1: Greeting & Introduction', 1, N'Cách chào hỏi chuyên nghiệp'),
('CHAP05', 'COU004', N'Unit 2: Writing Emails', 2, N'Kỹ năng viết email');

-- SELECT * FROM COURSE;
-- SELECT * FROM CHAPTER;