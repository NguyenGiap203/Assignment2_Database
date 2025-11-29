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


CREATE TRIGGER trg_CheckRatingCondition
ON COURSE_RATING
FOR INSERT -- Chạy khi có lệnh Insert vào bảng Rating
AS
BEGIN
    DECLARE @UserID CHAR(10);
    DECLARE @CourseID CHAR(10);

    -- Lấy thông tin từ dòng dữ liệu đang định chèn vào
    SELECT @UserID = UserID, @CourseID = CourseID FROM inserted;

    -- Kiểm tra xem User này có trong bảng Enrollment của khóa đó chưa
    IF NOT EXISTS (SELECT 1 FROM COURSE_ENROLLMENT WHERE UserID = @UserID AND CourseID = @CourseID)
    BEGIN
        -- Nếu chưa đăng ký -> Báo lỗi và Hủy thao tác
        RAISERROR (N'Lỗi: Bạn phải đăng ký khóa học trước khi đánh giá.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO