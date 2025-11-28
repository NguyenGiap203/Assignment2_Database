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