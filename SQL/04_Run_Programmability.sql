-- File: 04_Run_Programmability.sql
-- Tạo Functions, Stored Procedures và Triggers

USE ElearningDB;
GO

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function 1: Tính điểm trung bình của học viên
CREATE FUNCTION fn_CalculateStudentAvgScore (@UserID CHAR(10))
RETURNS DECIMAL(5, 2)
AS
BEGIN
    DECLARE @AvgScore DECIMAL(5, 2);

    -- Tính trung bình cộng cột Score từ bảng TEST_ATTEMPT
    SELECT @AvgScore = AVG(Score)
    FROM TEST_ATTEMPT_RECORDS
    WHERE UserID = @UserID;

    -- Nếu chưa làm bài nào thì trả về 0
    RETURN ISNULL(@AvgScore, 0);
END;
GO

-- Function 2: Lấy danh sách khóa học của giảng viên
CREATE FUNCTION fn_GetCoursesByTeacher (@TeacherID CHAR(10))
RETURNS TABLE
AS
RETURN
(
    SELECT 
        C.CourseID, 
        C.CourseName, 
        C.AverageRating, 
        C.NumStudents
    FROM COURSE C
    WHERE C.TeacherID = @TeacherID
);
GO

PRINT N'✅ Đã tạo 2 Functions';
GO

-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Procedure 1: Lấy danh sách top học viên
CREATE PROCEDURE sp_GetTopStudents
    @MinScore DECIMAL(5, 2) -- Tham số đầu vào (Input parameter)
AS
BEGIN
    -- Query kết hợp bảng USERTABLE và TEST_ATTEMPT
    SELECT 
        U.UserID,
        U.FullName,
        U.Email,
        COUNT(TA.TestID) AS TotalTestsTaken, -- Aggregate Function
        AVG(TA.Score) AS AverageScore        -- Aggregate Function
    FROM USERTABLE U
    JOIN TEST_ATTEMPT_RECORDS TA ON U.UserID = TA.UserID
    GROUP BY U.UserID, U.FullName, U.Email -- GROUP BY
    HAVING AVG(TA.Score) >= @MinScore      -- HAVING với Input parameter
    ORDER BY AverageScore DESC;            -- ORDER BY
END;
GO

-- Procedure 2: Đăng ký khóa học
CREATE PROCEDURE sp_EnrollCourse
    @UserID CHAR(10),
    @CourseID CHAR(10)
AS
BEGIN
    -- 1. Validation: Kiểm tra User có tồn tại không
    IF NOT EXISTS (SELECT 1 FROM USERTABLE WHERE UserID = @UserID)
    BEGIN
        PRINT N'Lỗi: Người dùng không tồn tại.';
        RETURN;
    END

    -- 2. Validation: Kiểm tra Khóa học có tồn tại và ĐANG MỞ không
    IF NOT EXISTS (SELECT 1 FROM COURSE WHERE CourseID = @CourseID AND CourseState = N'Đang mở')
    BEGIN
        PRINT N'Lỗi: Khóa học không tồn tại hoặc chưa mở đăng ký.';
        RETURN;
    END

    -- 3. Validation: Kiểm tra đã đăng ký chưa
    IF EXISTS (SELECT 1 FROM COURSE_ENROLLMENT WHERE UserID = @UserID AND CourseID = @CourseID)
    BEGIN
        PRINT N'Lỗi: Học viên đã đăng ký khóa học này rồi.';
        RETURN;
    END

    -- 4. Thực hiện Insert (Nếu vượt qua mọi kiểm tra)
    INSERT INTO COURSE_ENROLLMENT (UserID, CourseID, EnrollmentDate)
    VALUES (@UserID, @CourseID, GETDATE());

    PRINT N'Đăng ký thành công!';
END;
GO

PRINT N'✅ Đã tạo 2 Stored Procedures';
GO

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger 1: Tự động cập nhật NumStudents khi có enrollment
CREATE TRIGGER trg_UpdateNumStudents
ON COURSE_ENROLLMENT
AFTER INSERT, DELETE
AS
BEGIN
    -- Trường hợp 1: Có người mới đăng ký (INSERT)
    IF EXISTS (SELECT * FROM inserted)
    BEGIN
        UPDATE COURSE
        SET NumStudents = NumStudents + 1
        FROM COURSE C
        JOIN inserted I ON C.CourseID = I.CourseID;
    END

    -- Trường hợp 2: Có người hủy đăng ký (DELETE)
    IF EXISTS (SELECT * FROM deleted)
    BEGIN
        UPDATE COURSE
        SET NumStudents = NumStudents - 1
        FROM COURSE C
        JOIN deleted D ON C.CourseID = D.CourseID;
    END
END;
GO

-- Trigger 2: Kiểm tra điều kiện đánh giá (phải enroll trước)
CREATE TRIGGER trg_CheckRatingCondition
ON COURSE_RATING
FOR INSERT
AS
BEGIN
    DECLARE @UserID CHAR(10);
    DECLARE @CourseID CHAR(10);

    -- Lấy thông tin từ dòng dữ liệu đang định chèn vào
    SELECT @UserID = UserID, @CourseID = CourseID FROM inserted;

    -- Kiểm tra xem User này có trong bảng Enrollment chưa
    IF NOT EXISTS (SELECT 1 FROM COURSE_ENROLLMENT WHERE UserID = @UserID AND CourseID = @CourseID)
    BEGIN
        RAISERROR (N'Lỗi: Bạn phải đăng ký khóa học trước khi đánh giá.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

PRINT N'✅ Đã tạo 2 Triggers';
GO

-- Kiểm tra kết quả
SELECT 
    'Functions' AS ObjectType, 
    COUNT(*) AS Count 
FROM sys.objects 
WHERE type IN ('FN','IF')
UNION ALL
SELECT 'Procedures', COUNT(*) FROM sys.procedures
UNION ALL
SELECT 'Triggers', COUNT(*) FROM sys.triggers;
