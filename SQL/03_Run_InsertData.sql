USE ElearningDB;
GO
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
-- 1. THEORY_LESSON (4 dòng)
INSERT INTO THEORY_LESSON (TheoryLessonID, ChapterID, Title, Content, DurationMinutes) VALUES 
('TL001', 'CHAP01', N'Dữ liệu và Thông tin', N'Khái niệm cơ bản...', 10),
('TL002', 'CHAP01', N'Các loại CSDL phổ biến', N'SQL vs NoSQL...', 15),
('TL003', 'CHAP04', N'Formal vs Informal Greetings', N'When to use Hello vs Hi...', 10),
('TL004', 'CHAP05', N'Email Structure', N'Subject, Body, Signature...', 20);

-- 2. VIDEO_LESSON (4 dòng)
INSERT INTO VIDEO_LESSON (VideoID, ChapterID, Title, VideoURL, DurationMinutes) VALUES 
('VL001', 'CHAP01', N'Cài đặt SQL Server Management Studio', N'https://youtu.be/demo1', 25),
('VL002', 'CHAP02', N'Thực hành lệnh SELECT', N'https://youtu.be/demo2', 30),
('VL003', 'CHAP03', N'Phân tích thuật toán sắp xếp', N'https://youtu.be/demo3', 40),
('VL004', 'CHAP04', N'Mẫu câu giao tiếp thông dụng', N'https://youtu.be/demo4', 15);

-- 3. EXERCISE (4 dòng)
INSERT INTO EXERCISE (ExerciseID, ChapterID, Title, ExDescription, SampleAnswer, MinPassingScore) VALUES 
('EX001', 'CHAP01', N'Phân biệt Database', N'Hãy so sánh SQL và Excel...', N'SQL quản lý dữ liệu lớn tốt hơn...', 50),
('EX002', 'CHAP02', N'Viết câu lệnh SELECT', N'Lấy tên và email user...', N'SELECT FullName, Email FROM USERTABLE', 60),
('EX003', 'CHAP04', N'Roleplay Greeting', N'Ghi âm đoạn hội thoại...', N'File Audio', 50),
('EX004', 'CHAP05', N'Viết Email xin nghỉ phép', N'Viết email gửi sếp...', N'Dear Mr.A...', 70);

-- SELECT * FROM THEORY_LESSON;
-- SELECT * FROM VIDEO_LESSON;
-- SELECT * FROM EXERCISE;
-- 1. TEST (2 bài kiểm tra)
INSERT INTO TEST (TestID, TestName, TestDuration, ScoreToPass, TotalScore, ChapterID) VALUES 
('TST01', N'Kiểm tra Trắc nghiệm SQL', 30, 50, 100, 'CHAP01'),
('TST02', N'Kiểm tra Từ vựng Tiếng Anh', 15, 60, 100, 'CHAP04');

-- 2. QUESTION (4 dòng)
-- 2 câu cho bài SQL
INSERT INTO QUESTION (TestID, QuestionNo, QuestionContent, Score) VALUES 
('TST01', 1, N'SQL là viết tắt của từ gì?', 50),
('TST01', 2, N'Lệnh nào dùng để xóa bảng?', 50);

-- 2 câu cho bài Tiếng Anh
INSERT INTO QUESTION (TestID, QuestionNo, QuestionContent, Score) VALUES 
('TST02', 1, N'Từ nào có nghĩa là "Đồng nghiệp"?', 50),
('TST02', 2, N'Quá khứ của "Go" là gì?', 50);

-- 3. ANSWER (8 dòng - Mỗi câu 2 đáp án)
INSERT INTO ANSWER (TestID, QuestionNo, AnswerNo, AnswerContent, IsCorrect) VALUES 
('TST01', 1, 1, N'Structured Query Language', 1), -- Đúng
('TST01', 1, 2, N'Strong Question List', 0),
('TST01', 2, 1, N'DELETE', 0),
('TST01', 2, 2, N'DROP', 1), -- Đúng
('TST02', 1, 1, N'Colleague', 1), -- Đúng
('TST02', 1, 2, N'College', 0),
('TST02', 2, 1, N'Gone', 0),
('TST02', 2, 2, N'Went', 1); -- Đúng

-- SELECT * FROM TEST;
-- SELECT * FROM QUESTION;
-- SELECT * FROM ANSWER;
-- 1. POST (4 dòng)
INSERT INTO POSTS (PostID, Title, Content, UserID) VALUES 
('POS01', N'Lộ trình học SQL cho người mới', N'Chia sẻ kinh nghiệm...', 'US003'),
('POS02', N'Làm sao để học từ vựng nhanh?', N'Mẹo học Flashcard...', 'US004'),
('POS03', N'Review khóa học ReactJS', N'Khóa học rất hay...', 'US005'),
('POS04', N'Tìm bạn học nhóm TOEIC', N'Mình cần tìm bạn...', 'US006');

-- 2. COMMENT (4 dòng)
INSERT INTO COMMENTS (UserID, CreatedAt, Content, ReplyCount, PostID) VALUES 
('US004', '2023-11-20 08:00:00', N'Cảm ơn bài chia sẻ hữu ích!', 0, 'POS01'),
('US005', '2023-11-20 09:00:00', N'Mình cũng đang học theo lộ trình này.', 0, 'POS01'),
('US003', '2023-11-21 10:00:00', N'Inbox mình nhé!', 0, 'POS04'),
('US006', '2023-11-21 11:00:00', N'Bài viết rất chi tiết.', 0, 'POS02');

-- SELECT * FROM POSTS;
-- SELECT * FROM COMMENTS;
-- 1. COURSE_ENROLLMENT (5 dòng)
INSERT INTO COURSE_ENROLLMENT (UserID, CourseID, EnrollmentDate) VALUES 
('US003', 'COU001', '2023-06-02'),
('US004', 'COU001', '2023-06-06'),
('US005', 'COU001', '2023-07-11'),
('US003', 'COU004', '2023-06-10'),
('US006', 'COU005', '2023-08-21');

-- 2. COURSE_RATING (4 dòng)
INSERT INTO COURSE_RATING (UserID, CourseID, RatingValue) VALUES 
('US003', 'COU001', 5),
('US004', 'COU001', 4),
('US003', 'COU004', 5),
('US006', 'COU005', 5);

-- 3. TEST_ATTEMPT (Không insert ID)
-- US003 làm bài TST01
INSERT INTO TEST_ATTEMPT_RECORDS (UserID, TestID, StartTime, SubmitTime, Score) VALUES 
('US003', 'TST01', '2023-07-02 08:00:00', '2023-07-02 08:30:00', 100);

-- US004 làm bài TST01
INSERT INTO TEST_ATTEMPT_RECORDS (UserID, TestID, StartTime, SubmitTime, Score) VALUES 
('US004', 'TST01', '2023-07-06 09:00:00', '2023-07-06 09:30:00', 50);

-- 4. PRACTICE_ATTEMPT (Không insert ID)
-- Bạn cần tạo 1 bài Practice trước
INSERT INTO PRACTICES (PracticeID, Title, Difficulty, Content, TeacherID) VALUES ('PRA01', N'Viết Query Join', N'Trung bình', N'Đề bài...', 'US001');

INSERT INTO PRACTICE_ATTEMPT_INFO (UserID, PracticeID, StartTime, SubmitTime, Score) VALUES 
('US003', 'PRA01', '2023-07-03 14:00:00', '2023-07-03 15:00:00', 90);

-- Chèn dữ liệu làm bài tập (EXERCISE_ATTEMPT)
-- Giả sử đã có các bài tập EX001, EX002 (từ file 03) và User US003, US004

-- 1. Học viên US003 làm bài tập EX001
INSERT INTO EXERCISE_ATTEMPT (UserID, ExerciseID, StartTime, SubmitTime, Score) 
VALUES ('US003', 'EX001', '2023-07-15 14:00:00', '2023-07-15 14:45:00', 85.5);

-- 2. Học viên US004 làm bài tập EX001
INSERT INTO EXERCISE_ATTEMPT (UserID, ExerciseID, StartTime, SubmitTime, Score) 
VALUES ('US004', 'EX001', '2023-07-16 09:00:00', '2023-07-16 10:00:00', 90.0);

-- 3. Học viên US005 làm bài tập EX002
INSERT INTO EXERCISE_ATTEMPT (UserID, ExerciseID, StartTime, SubmitTime, Score) 
VALUES ('US005', 'EX002', '2023-07-20 20:00:00', '2023-07-20 20:30:00', 60.0);

-- 4. Học viên US003 làm tiếp bài tập EX002 (Làm nhiều bài khác nhau)
INSERT INTO EXERCISE_ATTEMPT (UserID, ExerciseID, StartTime, SubmitTime, Score) 
VALUES ('US003', 'EX002', '2023-07-21 08:00:00', '2023-07-21 08:15:00', 95.0);

-- SELECT * FROM COURSE_ENROLLMENT;
-- SELECT * FROM COURSE_RATING;
-- SELECT * FROM TEST_ATTEMPT_RECORDS;
-- SELECT * FROM PRACTICES;
-- SELECT * FROM PRACTICE_ATTEMPT_INFO;
-- SELECT * FROM EXERCISE_ATTEMPT;
