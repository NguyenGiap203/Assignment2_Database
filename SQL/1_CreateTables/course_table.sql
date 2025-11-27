CREATE TABLE COURSE (
    CourseID            CHAR(10)        PRIMARY KEY,            -- Đã sửa từ 5 lên 10
    CourseName          NVARCHAR(255)   NOT NULL,               -- Đã sửa thành NVARCHAR
    CourseState         NVARCHAR(50)    DEFAULT N'Sắp ra mắt',  -- Đã sửa thành NVARCHAR (ví dụ: 'Đang mở', 'Đã đóng')
    TeacherID           CHAR(10)        NOT NULL,               -- Foreign Key references to TeacherID in Teacher table
    
    TotalDuration       DECIMAL(10, 2)  DEFAULT 0   CHECK (TotalDuration >= 0), 
    NumTests            INT             DEFAULT 0   CHECK (NumTests >= 0), 
    NumTheoryLessons    INT             DEFAULT 0   CHECK (NumTheoryLessons >= 0), 
    NumExercises        INT             DEFAULT 0   CHECK (NumExercises >= 0),
    NumVideos           INT             DEFAULT 0   CHECK (NumVideos >= 0),
    AverageRating       DECIMAL(2, 1)   DEFAULT 0   CHECK (AverageRating >= 0.0 AND AverageRating <= 5.0),
    NumRatings          INT             DEFAULT 0   CHECK (NumRatings >= 0),
    NumStudents         INT             DEFAULT 0   CHECK (NumStudents >= 0), 

    -- Ràng buộc Unique cho tên khóa học
    CONSTRAINT UQ_CourseName UNIQUE(CourseName)
);

-- DROP TABLE COURSE;

