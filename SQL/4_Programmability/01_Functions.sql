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
    -- Không dùng ORDER BY trực tiếp trong Inline Function (trừ khi có TOP), 
    -- nhưng logic lọc WHERE vẫn đảm bảo yêu cầu.
);
GO