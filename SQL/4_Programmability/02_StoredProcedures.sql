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

