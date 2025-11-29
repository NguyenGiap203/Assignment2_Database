# Statistics API - Functions, Stored Procedures & Triggers

Tài liệu này mô tả các API endpoint trong `StatisticsController` để gọi **Functions**, **Stored Procedures** và kiểm tra **Triggers** từ database.

---

## 📋 Mục Lục

1. [Functions](#1-functions)
   - [GET Student Average Score](#11-get-student-average-score)
   - [GET Courses By Teacher](#12-get-courses-by-teacher)
2. [Stored Procedures](#2-stored-procedures)
   - [GET Top Students](#21-get-top-students)
   - [POST Enroll Course](#22-post-enroll-course)
3. [Triggers](#3-triggers)
   - [Update Number of Students](#31-trigger-update-number-of-students)
   - [Check Rating Condition](#32-trigger-check-rating-condition)

---

## 1. Functions

### 1.1 GET Student Average Score

**Endpoint:** `GET /api/Statistics/StudentAvgScore/{userId}`

**Mô tả:** Gọi function `fn_CalculateStudentAvgScore` để tính điểm trung bình của học viên từ tất cả các bài test đã làm.

**SQL Function:**
```sql
CREATE FUNCTION fn_CalculateStudentAvgScore (@UserID CHAR(10))
RETURNS DECIMAL(5, 2)
AS
BEGIN
    DECLARE @AvgScore DECIMAL(5, 2);
    
    SELECT @AvgScore = AVG(Score)
    FROM TEST_ATTEMPT_RECORDS
    WHERE UserID = @UserID;
    
    RETURN ISNULL(@AvgScore, 0);
END;
```

**Request Example:**
```http
GET http://localhost:5185/api/Statistics/StudentAvgScore/US00000001
```

**Response Success (200):**
```json
{
  "userId": "US00000001",
  "averageScore": 8.75
}
```

**Response Not Found (404):**
```json
{
  "message": "No data found"
}
```

**Response Error (500):**
```json
{
  "message": "Error calculating average score",
  "error": "error details..."
}
```

---

### 1.2 GET Courses By Teacher

**Endpoint:** `GET /api/Statistics/CoursesByTeacher/{teacherId}`

**Mô tả:** Gọi function `fn_GetCoursesByTeacher` để lấy danh sách các khóa học do giáo viên đó phụ trách.

**SQL Function:**
```sql
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
```

**Request Example:**
```http
GET http://localhost:5185/api/Statistics/CoursesByTeacher/T000000001
```

**Response Success (200):**
```json
[
  {
    "courseID": "COU0000001",
    "courseName": "Lập trình C# cơ bản",
    "averageRating": 4.50,
    "numStudents": 25
  },
  {
    "courseID": "COU0000002",
    "courseName": "ASP.NET Core Web API",
    "averageRating": 4.80,
    "numStudents": 18
  }
]
```

**Response Error (500):**
```json
{
  "message": "Error getting courses by teacher",
  "error": "error details..."
}
```

---

## 2. Stored Procedures

### 2.1 GET Top Students

**Endpoint:** `GET /api/Statistics/TopStudents?minScore={score}`

**Mô tả:** Gọi stored procedure `sp_GetTopStudents` để lấy danh sách học viên có điểm trung bình >= điểm tối thiểu (mặc định 5.0).

**SQL Stored Procedure:**
```sql
CREATE PROCEDURE sp_GetTopStudents
    @MinScore DECIMAL(5, 2)
AS
BEGIN
    SELECT 
        U.UserID,
        U.FullName,
        U.Email,
        COUNT(TA.TestID) AS TotalTestsTaken,
        AVG(TA.Score) AS AverageScore
    FROM USERTABLE U
    JOIN TEST_ATTEMPT_RECORDS TA ON U.UserID = TA.UserID
    GROUP BY U.UserID, U.FullName, U.Email
    HAVING AVG(TA.Score) >= @MinScore
    ORDER BY AverageScore DESC;
END;
```

**Request Examples:**
```http
# Lấy học viên có điểm >= 7.5
GET http://localhost:5185/api/Statistics/TopStudents?minScore=7.5

# Lấy tất cả học viên (điểm >= 5.0 - mặc định)
GET http://localhost:5185/api/Statistics/TopStudents
```

**Response Success (200):**
```json
[
  {
    "userID": "US00000001",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "totalTestsTaken": 8,
    "averageScore": 9.25
  },
  {
    "userID": "US00000003",
    "fullName": "Trần Thị C",
    "email": "tranthic@example.com",
    "totalTestsTaken": 5,
    "averageScore": 8.60
  }
]
```

**Response Error (500):**
```json
{
  "message": "Error getting top students",
  "error": "error details..."
}
```

---

### 2.2 POST Enroll Course

**Endpoint:** `POST /api/Statistics/EnrollCourse`

**Mô tả:** Gọi stored procedure `sp_EnrollCourse` để đăng ký học viên vào khóa học (có validation logic).

**SQL Stored Procedure:**
```sql
CREATE PROCEDURE sp_EnrollCourse
    @UserID CHAR(10),
    @CourseID CHAR(10)
AS
BEGIN
    -- Validation 1: Kiểm tra User tồn tại
    IF NOT EXISTS (SELECT 1 FROM USERTABLE WHERE UserID = @UserID)
    BEGIN
        PRINT N'Lỗi: Người dùng không tồn tại.';
        RETURN;
    END

    -- Validation 2: Kiểm tra Khóa học tồn tại và đang mở
    IF NOT EXISTS (SELECT 1 FROM COURSE WHERE CourseID = @CourseID AND CourseState = N'Đang mở')
    BEGIN
        PRINT N'Lỗi: Khóa học không tồn tại hoặc chưa mở đăng ký.';
        RETURN;
    END

    -- Validation 3: Kiểm tra đã đăng ký chưa
    IF EXISTS (SELECT 1 FROM COURSE_ENROLLMENT WHERE UserID = @UserID AND CourseID = @CourseID)
    BEGIN
        PRINT N'Lỗi: Học viên đã đăng ký khóa học này rồi.';
        RETURN;
    END

    -- Insert enrollment record
    INSERT INTO COURSE_ENROLLMENT (UserID, CourseID, EnrollmentDate)
    VALUES (@UserID, @CourseID, GETDATE());

    PRINT N'Đăng ký thành công!';
END;
```

**Request Example:**
```http
POST http://localhost:5185/api/Statistics/EnrollCourse
Content-Type: application/json

{
  "userID": "US00000001",
  "courseID": "COU0000001"
}
```

**Request Body Schema:**
```json
{
  "userID": "string (CHAR 10)",
  "courseID": "string (CHAR 10)"
}
```

**Response Success (200):**
```json
{
  "message": "Enrollment successful",
  "userId": "US00000001",
  "courseId": "COU0000001"
}
```

**Response Error (400):**
```json
{
  "message": "Enrollment failed",
  "error": "Lỗi: Học viên đã đăng ký khóa học này rồi."
}
```

**Validation Rules:**
- User phải tồn tại trong bảng `USERTABLE`
- Course phải tồn tại và có `CourseState = 'Đang mở'`
- User chưa đăng ký khóa học này trước đó
- Nếu pass validation → Insert vào `COURSE_ENROLLMENT` → **Trigger tự động tăng `NumStudents`**

---

## 3. Triggers

### 3.1 Trigger: Update Number of Students

**Trigger Name:** `trg_UpdateNumStudents`

**Mô tả:** Tự động cập nhật cột `NumStudents` trong bảng `COURSE` khi có INSERT hoặc DELETE vào bảng `COURSE_ENROLLMENT`.

**SQL Trigger:**
```sql
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
```

**Cách Test:**

**1. Kiểm tra NumStudents ban đầu:**
```sql
SELECT CourseID, NumStudents FROM COURSE WHERE CourseID = 'COU0000001';
```

**2. Gọi API Enroll (sẽ kích hoạt trigger):**
```http
POST http://localhost:5185/api/Statistics/EnrollCourse
Content-Type: application/json

{
  "userID": "US00000002",
  "courseID": "COU0000001"
}
```

**3. Kiểm tra NumStudents sau khi enroll:**
```sql
SELECT CourseID, NumStudents FROM COURSE WHERE CourseID = 'COU0000001';
-- NumStudents sẽ tăng lên 1 đơn vị
```

**4. Xóa enrollment để test DELETE:**
```sql
DELETE FROM COURSE_ENROLLMENT 
WHERE UserID = 'US00000002' AND CourseID = 'COU0000001';

SELECT CourseID, NumStudents FROM COURSE WHERE CourseID = 'COU0000001';
-- NumStudents sẽ giảm xuống 1 đơn vị
```

**Hoặc test qua API Enrollment Controller:**
```http
# Nếu có DELETE endpoint trong EnrollmentController
DELETE http://localhost:5185/api/Enrollment/{enrollmentId}
```

---

### 3.2 Trigger: Check Rating Condition

**Trigger Name:** `trg_CheckRatingCondition`

**Mô tả:** Kiểm tra học viên phải đã đăng ký khóa học trước khi được phép đánh giá (rating). Nếu chưa đăng ký → Rollback transaction.

**SQL Trigger:**
```sql
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
```

**Cách Test:**

**Scenario 1: User CHƯA đăng ký khóa học → Trigger chặn**

```http
POST http://localhost:5185/api/Rating
Content-Type: application/json

{
  "userID": "US00000005",
  "courseID": "COU0000001",
  "ratingScore": 5,
  "comment": "Khóa học rất hay!"
}
```

**Expected Response (400 hoặc 500):**
```json
{
  "message": "Error creating rating",
  "error": "Lỗi: Bạn phải đăng ký khóa học trước khi đánh giá."
}
```

**Scenario 2: User ĐÃ đăng ký khóa học → Trigger cho phép**

**Step 1: Enroll trước**
```http
POST http://localhost:5185/api/Statistics/EnrollCourse
Content-Type: application/json

{
  "userID": "US00000005",
  "courseID": "COU0000001"
}
```

**Step 2: Tạo rating (sẽ thành công)**
```http
POST http://localhost:5185/api/Rating
Content-Type: application/json

{
  "userID": "US00000005",
  "courseID": "COU0000001",
  "ratingScore": 5,
  "comment": "Khóa học rất hay!"
}
```

**Expected Response (200):**
```json
{
  "ratingID": "RAT0000001",
  "userID": "US00000005",
  "courseID": "COU0000001",
  "ratingScore": 5,
  "comment": "Khóa học rất hay!",
  "ratingDate": "2025-11-29T10:30:00"
}
```

**Test qua SQL trực tiếp:**
```sql
-- Test 1: Insert rating MÀ CHƯA enroll (sẽ bị chặn)
INSERT INTO COURSE_RATING (UserID, CourseID, RatingScore, Comment, RatingDate)
VALUES ('US00000099', 'COU0000001', 5, N'Test trigger', GETDATE());
-- Kết quả: Error message "Lỗi: Bạn phải đăng ký khóa học trước khi đánh giá."

-- Test 2: Enroll trước rồi mới insert rating (thành công)
INSERT INTO COURSE_ENROLLMENT (UserID, CourseID, EnrollmentDate)
VALUES ('US00000099', 'COU0000001', GETDATE());

INSERT INTO COURSE_RATING (UserID, CourseID, RatingScore, Comment, RatingDate)
VALUES ('US00000099', 'COU0000001', 5, N'Test trigger', GETDATE());
-- Kết quả: Success
```

---

## 📊 Test Workflow Tổng Hợp

### Luồng Test Đầy Đủ (Full Workflow)

```http
### 1. Kiểm tra điểm trung bình của học viên
GET http://localhost:5185/api/Statistics/StudentAvgScore/US00000001

### 2. Lấy danh sách khóa học của giáo viên
GET http://localhost:5185/api/Statistics/CoursesByTeacher/T000000001

### 3. Lấy danh sách top học viên (điểm >= 7.5)
GET http://localhost:5185/api/Statistics/TopStudents?minScore=7.5

### 4. Đăng ký khóa học (trigger sẽ tăng NumStudents)
POST http://localhost:5185/api/Statistics/EnrollCourse
Content-Type: application/json

{
  "userID": "US00000002",
  "courseID": "COU0000001"
}

### 5. Kiểm tra NumStudents đã tăng chưa
GET http://localhost:5185/api/Course/COU0000001

### 6. Tạo rating (trigger kiểm tra enrollment)
POST http://localhost:5185/api/Rating
Content-Type: application/json

{
  "userID": "US00000002",
  "courseID": "COU0000001",
  "ratingScore": 5,
  "comment": "Khóa học tuyệt vời!"
}

### 7. Test trigger chặn rating khi chưa enroll
POST http://localhost:5185/api/Rating
Content-Type: application/json

{
  "userID": "US00000099",
  "courseID": "COU0000001",
  "ratingScore": 5,
  "comment": "Test trigger"
}
```

---

## 🎯 Điểm Đạt Được (Assignment Part 2 & Part 3.II.2c)

### PART 2: Programmability Objects (3 điểm)
- ✅ **2 Functions** (`fn_CalculateStudentAvgScore`, `fn_GetCoursesByTeacher`)
- ✅ **2 Stored Procedures** (`sp_GetTopStudents`, `sp_EnrollCourse`)
- ✅ **2 Triggers** (`trg_UpdateNumStudents`, `trg_CheckRatingCondition`)

**Yêu cầu đã đáp ứng:**
- ✅ WHERE, ORDER BY, GROUP BY, HAVING
- ✅ Aggregate Functions (AVG, COUNT)
- ✅ IF statement (validation trong SP)
- ✅ Input parameters
- ✅ Insert/Delete triggers cho derived columns
- ✅ Business rule validation (rating phải enroll trước)

### PART 3.II.2c: Call Stored Procedure/Function (0.5 điểm)
- ✅ **4 API endpoints** trong `StatisticsController`
- ✅ Gọi Functions qua `SqlQueryRaw`
- ✅ Gọi Stored Procedures qua `ExecuteSqlRawAsync`
- ✅ Xử lý errors và validation

---

## 🔗 Related Endpoints

- **Course Management:** `/api/Course`
- **Enrollment Management:** `/api/Enrollment`
- **Rating Management:** `/api/Rating`
- **User Management:** `/api/UserTable`
- **Authentication:** `/api/Auth/login`

---

## 📝 Notes

1. **ID Format:**
   - UserID: `CHAR(10)` - Example: `US00000001`
   - CourseID: `CHAR(10)` - Example: `COU0000001`
   - TeacherID: `CHAR(10)` - Example: `T000000001`

2. **Swagger URL:** `http://localhost:5185/swagger`

3. **Database:** `ElearningDB` on SQL Server (Windows Authentication)

4. **Test User:** `sManager` / `sManager123!`

5. **Trigger Testing:** 
   - Triggers hoạt động tự động khi INSERT/DELETE vào bảng liên quan
   - Không cần gọi API riêng, chỉ cần thực hiện thao tác bình thường
   - Kiểm tra kết quả thông qua query hoặc GET API

---

**Last Updated:** November 29, 2025
