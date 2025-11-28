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