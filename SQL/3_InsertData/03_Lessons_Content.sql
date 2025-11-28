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